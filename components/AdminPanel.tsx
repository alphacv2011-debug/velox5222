import React, { useState } from 'react';
import { Settings, Plus, Trash2, MapPin, User, Package, Truck, AlertCircle, CheckCircle2, Lock, ArrowRight, Download, Server, Globe, X, Save, RefreshCw } from 'lucide-react';
import { TrackingData, TrackingEvent } from '../types';

interface AdminPanelProps {
  data: TrackingData;
  onUpdate: (newData: TrackingData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [newEvent, setNewEvent] = useState<Partial<TrackingEvent>>({
    status: '',
    location: '',
    icon: 'truck'
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'zulufox145') {
      setIsAuthenticated(true);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleInputChange = (field: keyof TrackingData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleQuickFill = (status: string, icon: 'truck' | 'package' | 'check' | 'alert') => {
    setNewEvent({
        ...newEvent,
        status: status,
        icon: icon,
        location: newEvent.location || data.destination // Suggest destination if empty
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.status || !newEvent.location) return;

    const now = new Date();
    const eventToAdd: TrackingEvent = {
      date: 'Hoje',
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      location: newEvent.location || '',
      status: newEvent.status || '',
      icon: newEvent.icon as any || 'truck'
    };

    onUpdate({
      ...data,
      events: [eventToAdd, ...data.events]
    });

    setNewEvent({ status: '', location: '', icon: 'truck' });
  };

  const handleDeleteEvent = (index: number) => {
    const newEvents = [...data.events];
    newEvents.splice(index, 1);
    onUpdate({ ...data, events: newEvents });
  };

  const handleClearAllEvents = () => {
      if(window.confirm('Tem certeza que deseja apagar todo o histórico de rastreio?')) {
          onUpdate({ ...data, events: [] });
      }
  }

  const handleDownloadConfig = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `veloxlog-config-${data.code}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStaticSite = () => {
    // 1. Clone the current document
    const clone = document.documentElement.cloneNode(true) as HTMLElement;

    // 2. CLEANUP: Remove ALL existing scripts to prevent React hydration crashes
    const scripts = clone.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // 3. Remove module preloads or other build artifacts
    const preloads = clone.querySelectorAll('link[rel="modulepreload"], link[rel="preload"]');
    preloads.forEach(link => link.remove());

    // 4. Hide the admin panel in the clone by default
    const adminPanel = clone.querySelector('#admin-panel-root') as HTMLElement;
    if (adminPanel) {
        adminPanel.style.display = 'none';
        adminPanel.id = 'admin-panel-root-static'; 
    }

    // 5. Re-inject Tailwind CSS (since we removed all scripts)
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com";
    clone.querySelector('head')?.appendChild(tailwindScript);

    // 6. Inject Tailwind Config (Optional, if needed for custom colors)
    const tailwindConfig = document.createElement('script');
    tailwindConfig.textContent = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
                400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
                800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
              },
              accent: { 400: '#fb923c', 500: '#f97316', 600: '#ea580c' },
              dark: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' }
            },
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            animation: { 'fade-in': 'fadeIn 0.5s ease-out forwards' },
            keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } }
          }
        }
      }
    `;
    clone.querySelector('head')?.appendChild(tailwindConfig);

    // 7. Inject the Vanilla JS Logic for the Static Site
    const cmsScript = document.createElement('script');
    cmsScript.textContent = `
      document.addEventListener('DOMContentLoaded', () => {
          console.log("Static Site Loaded with Full CMS Logic");
          
          const panel = document.getElementById('admin-panel-root-static');
          
          // --- Admin Toggle Logic ---
          const adminButtons = document.querySelectorAll('.admin-toggle-btn, button[title="Área Restrita"]');
          adminButtons.forEach(btn => {
              btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const pwd = prompt("Senha de Administrador:");
                  if (pwd === 'zulufox145') {
                      if(panel) panel.style.display = 'flex';
                  } else if (pwd !== null) {
                      alert("Senha incorreta");
                  }
              });
          });

          // --- Close Panel Logic ---
          const closeBtn = document.getElementById('static-close-btn');
          if (closeBtn) {
             closeBtn.addEventListener('click', () => {
                if(panel) panel.style.display = 'none';
             });
          }

          // --- Search Logic (Crucial for functionality in static mode) ---
          const trackBtn = document.getElementById('track-btn');
          if(trackBtn) {
             trackBtn.addEventListener('click', () => {
                 const inputEl = document.getElementById('track-input');
                 const displayCodeEl = document.getElementById('display-code');
                 
                 const viewIdle = document.getElementById('view-idle');
                 const viewSuccess = document.getElementById('view-success');
                 const viewError = document.getElementById('view-error');

                 if(inputEl && displayCodeEl) {
                     const inputCode = inputEl.value.trim().toUpperCase();
                     const actualCode = displayCodeEl.innerText.trim().toUpperCase();
                     
                     // Hide all first
                     if(viewIdle) viewIdle.classList.add('hidden');
                     if(viewSuccess) viewSuccess.classList.add('hidden');
                     if(viewError) viewError.classList.add('hidden');

                     if(inputCode === actualCode) {
                         if(viewSuccess) viewSuccess.classList.remove('hidden');
                     } else {
                         if(viewError) viewError.classList.remove('hidden');
                     }
                 }
             });
          }

          // --- Add New Event Logic (Vanilla JS) ---
          const btnAddEvent = document.getElementById('btn-add-event');
          if(btnAddEvent) {
             btnAddEvent.addEventListener('click', () => {
                 const statusEl = document.getElementById('input-event-status');
                 const locationEl = document.getElementById('input-event-location');
                 const iconEl = document.getElementById('select-event-icon');
                 
                 if(!statusEl || !locationEl || !statusEl.value) return;

                 const status = statusEl.value;
                 const location = locationEl.value;
                 const icon = iconEl.value;
                 
                 const now = new Date();
                 const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                 const date = 'Hoje';

                 // Create HTML for public view
                 const publicHtml = \`
                     <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-800 bg-brand-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            \${getIconSvg(icon, 'text-white')}
                         </div>
                         <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-dark-900 p-4 rounded-xl border border-white/5 shadow-lg group-hover:border-brand-500/30 transition-colors">
                             <div class="flex justify-between items-center mb-1">
                                 <span class="font-bold text-white">\${location}</span>
                                 <span class="text-xs text-gray-500 font-mono">\${date} - \${time}</span>
                             </div>
                             <p className="text-gray-300 text-sm">\${status}</p>
                         </div>
                     </div>
                 \`;

                 const publicList = document.getElementById('public-events-list');
                 if(publicList) publicList.insertAdjacentHTML('afterbegin', publicHtml);

                 // Create HTML for admin list
                 const adminHtml = \`
                    <div class="group flex items-start justify-between bg-dark-900 p-3 rounded-lg border border-white/5 newly-added">
                        <div class="flex gap-3">
                           <div class="mt-1 p-1.5 rounded-full bg-brand-500/20 text-brand-500">
                                \${getIconSvg(icon, 'w-3 h-3')}
                           </div>
                           <div>
                                <p class="text-white text-sm font-medium">\${status}</p>
                                <p class="text-gray-500 text-xs">\${location} • \${date} - \${time}</p>
                           </div>
                        </div>
                        <button class="text-gray-600 hover:text-red-400 p-1 btn-delete-static">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    </div>
                 \`;
                 
                 const adminList = document.getElementById('admin-events-list');
                 if(adminList) {
                     adminList.insertAdjacentHTML('afterbegin', adminHtml);
                     // Re-attach delete listener to the new button
                     const newBtn = adminList.querySelector('.newly-added .btn-delete-static');
                     if(newBtn) {
                         newBtn.addEventListener('click', function() {
                             this.closest('.group').remove();
                             // Note: Removing from public list is harder without mapping, 
                             // but for simple static updates, adding is priority. 
                             // Ideally we reload page or rebuild list, but this is sufficient for quick updates.
                             if(publicList) publicList.firstElementChild.remove();
                         });
                         newBtn.closest('.newly-added').classList.remove('newly-added');
                     }
                 }

                 // Clear inputs
                 statusEl.value = '';
                 // locationEl.value = ''; // keep location for convenience
             });
          }

          // --- Quick Fill Logic ---
          const quickBtns = document.querySelectorAll('.btn-quick-fill');
          quickBtns.forEach(btn => {
              btn.addEventListener('click', function() {
                  const status = this.getAttribute('data-status');
                  const icon = this.getAttribute('data-icon');
                  const dest = document.getElementById('display-address')?.innerText || ''; // fallback location
                  
                  document.getElementById('input-event-status').value = status;
                  document.getElementById('select-event-icon').value = icon;
                  if(!document.getElementById('input-event-location').value) {
                       document.getElementById('input-event-location').value = 'Unidade de Distribuição';
                  }
              });
          });

          // Helper for Icons
          function getIconSvg(type, classes) {
              if(type === 'truck') return \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck \${classes}"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>\`;
              if(type === 'check') return \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle2 \${classes}"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>\`;
              if(type === 'alert') return \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle \${classes}"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>\`;
              return \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package \${classes}"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-9"/></svg>\`;
          }

          // --- CMS Live Binding (Editing Text) ---
          const inputs = document.querySelectorAll('[data-bind]');
          inputs.forEach(input => {
              input.addEventListener('input', (e) => {
                  const targetId = e.target.getAttribute('data-bind');
                  const targetEl = document.getElementById(targetId);
                  if (targetEl) {
                      targetEl.innerText = e.target.value;
                  }
              });
          });

          // --- Save / Recursive Download Logic ---
          const saveBtn = document.getElementById('static-save-btn');
          if (saveBtn) {
              saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Salvar Atualização do Site (HTML)';
              
              saveBtn.onclick = (e) => {
                  e.preventDefault();
                  if(panel) panel.style.display = 'none';
                  
                  const html = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
                  const blob = new Blob([html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'index.html'; 
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  
                  if(panel) panel.style.display = 'flex';
              };
          }
      });
    `;
    clone.querySelector('body')?.appendChild(cmsScript);

    // 8. Serialize and download
    let htmlContent = clone.outerHTML;
    htmlContent = '<!DOCTYPE html>\n' + htmlContent;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index.html`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.code && json.events) {
          onUpdate(json);
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo.');
      }
    };
    reader.readAsText(file);
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div id="admin-panel-root" className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-dark-800 border-l border-white/10 shadow-2xl z-[100] animate-fade-in flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-500" /> Acesso Restrito
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">Fechar</button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 w-full max-w-sm shadow-xl">
                <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-center text-white font-bold text-lg mb-2">Área Administrativa</h3>
                <p className="text-center text-gray-400 text-sm mb-6">Digite a senha de administrador para gerenciar o rastreamento.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="password" 
                            placeholder="Senha de acesso"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            autoFocus
                        />
                    </div>
                    
                    {loginError && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg animate-pulse">
                            <AlertCircle className="w-4 h-4" /> Senha incorreta
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Entrar <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
      </div>
    );
  }

  // Render Admin Panel Content
  return (
    <div id="admin-panel-root" className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-dark-800 border-l border-white/10 shadow-2xl z-[100] overflow-y-auto animate-fade-in flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Painel Admin</h2>
          </div>
          <button 
            id="static-close-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section: Hosting / Export */}
        <div className="bg-gradient-to-r from-brand-900/50 to-dark-900 border border-brand-500/20 rounded-xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Server className="text-brand-400 w-5 h-5" />
                <h3 className="text-white font-bold text-sm uppercase">Exportar para Hospedagem</h3>
            </div>
            
            <button 
                id="static-save-btn"
                onClick={handleDownloadStaticSite}
                className="w-full mt-3 bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base hover:bg-green-500 transition-all shadow-lg hover:shadow-green-500/20 mb-3"
            >
                <Save className="w-5 h-5" /> Salvar Atualização do Site
            </button>
             <p className="text-center text-xs text-gray-400 mb-4">
                Clique acima para salvar as alterações e gerar o arquivo HTML.
            </p>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <button 
                    onClick={handleDownloadConfig}
                    className="col-span-1 bg-dark-800 text-gray-300 border border-white/10 font-bold py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 text-xs hover:bg-dark-700 transition-colors"
                >
                    <Download className="w-4 h-4 mb-1" /> 
                    Backup Config (.json)
                </button>
                 <label className="col-span-1 bg-dark-800 text-gray-300 border border-white/10 font-bold py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 text-xs hover:bg-dark-700 transition-colors cursor-pointer">
                    <Download className="w-4 h-4 mb-1 rotate-180" /> 
                    Importar Backup
                    <input type="file" className="hidden" accept=".json" onChange={handleImportBackup} />
                </label>
            </div>
        </div>

        {/* Section: Delivery Info */}
        <div className="space-y-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Dados do Destinatário
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome do Destinatário</label>
              <input 
                type="text" 
                value={data.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                data-bind="display-recipient"
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Endereço Completo</label>
              <input 
                type="text" 
                value={data.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                data-bind="display-address"
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">CEP</label>
                <input 
                  type="text" 
                  value={data.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  data-bind="display-cep"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Código de Rastreio</label>
                <input 
                  type="text" 
                  value={data.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  data-bind="display-code"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white font-mono focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
             <div>
                <label className="block text-xs text-gray-500 mb-1">Previsão de Entrega</label>
                <input 
                  type="text" 
                  value={data.estimatedDelivery}
                  onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                  data-bind="display-estimated"
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>
          </div>
        </div>

        {/* Section: Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" /> Atualizações de Rastreio
            </h3>
            <button onClick={handleClearAllEvents} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <Trash2 size={12} /> Limpar
            </button>
          </div>

          {/* Add New Event Form */}
          <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5 border-dashed">
             <div className="mb-3">
                 <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Adicionar Rota Rápida:</p>
                 <div className="grid grid-cols-3 gap-2">
                    <button 
                        className="btn-quick-fill bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 border border-brand-500/20 rounded p-2 text-xs font-medium transition-colors"
                        data-status="Objeto em trânsito" data-icon="truck"
                        onClick={() => handleQuickFill('Objeto em trânsito', 'truck')}
                    >
                        Em Trânsito
                    </button>
                    <button 
                        className="btn-quick-fill bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 border border-brand-500/20 rounded p-2 text-xs font-medium transition-colors"
                        data-status="Saiu para entrega" data-icon="truck"
                        onClick={() => handleQuickFill('Saiu para entrega', 'truck')}
                    >
                        Saiu p/ Entrega
                    </button>
                    <button 
                        className="btn-quick-fill bg-green-500/10 text-green-300 hover:bg-green-500/20 border border-green-500/20 rounded p-2 text-xs font-medium transition-colors"
                        data-status="Objeto entregue" data-icon="check"
                        onClick={() => handleQuickFill('Objeto entregue', 'check')}
                    >
                        Entregue
                    </button>
                 </div>
             </div>
             
             <div className="h-px bg-white/10 my-3"></div>

             <div className="grid grid-cols-1 gap-3 mb-3">
                <input 
                  id="input-event-status"
                  type="text" 
                  placeholder="Status (ex: Saiu para entrega)" 
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-500 outline-none"
                />
                <div className="flex gap-2">
                   <input 
                    id="input-event-location"
                    type="text" 
                    placeholder="Local (ex: CD São Paulo)" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-500 outline-none"
                  />
                  <select 
                    id="select-event-icon"
                    value={newEvent.icon}
                    onChange={(e) => setNewEvent({...newEvent, icon: e.target.value as any})}
                    className="bg-dark-800 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                  >
                    <option value="truck">Caminhão</option>
                    <option value="package">Pacote</option>
                    <option value="check">Check</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>
             </div>
             <button 
               id="btn-add-event"
               onClick={handleAddEvent}
               className="w-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Plus className="w-4 h-4" /> Adicionar na Linha do Tempo
             </button>
          </div>

          {/* Events List */}
          <div id="admin-events-list" className="space-y-3">
             {data.events.map((event, idx) => (
               <div key={idx} className="group flex items-start justify-between bg-dark-900 p-3 rounded-lg border border-white/5">
                  <div className="flex gap-3">
                    <div className={`mt-1 p-1.5 rounded-full ${
                      event.icon === 'check' ? 'bg-green-500/20 text-green-500' :
                      event.icon === 'alert' ? 'bg-red-500/20 text-red-500' :
                      'bg-brand-500/20 text-brand-500'
                    }`}>
                       {event.icon === 'truck' && <Truck className="w-3 h-3" />}
                       {event.icon === 'package' && <Package className="w-3 h-3" />}
                       {event.icon === 'check' && <CheckCircle2 className="w-3 h-3" />}
                       {event.icon === 'alert' && <AlertCircle className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{event.status}</p>
                      <p className="text-gray-500 text-xs">{event.location} • {event.date} - {event.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(idx)}
                    className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;