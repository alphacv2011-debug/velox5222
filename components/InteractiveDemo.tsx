import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Calculator, MapPin, Search, Box, Loader2, Sparkles, AlertCircle, User, Settings, XCircle, AlertTriangle } from 'lucide-react';
import { calculateShippingQuote } from '../services/gemini';
import { ShippingQuote, LoadingState, TrackingData } from '../types';

interface TrackingAndQuoteProps {
    data: TrackingData;
    onToggleAdmin: () => void;
}

const TrackingAndQuote: React.FC<TrackingAndQuoteProps> = ({ data, onToggleAdmin }) => {
  const [activeTab, setActiveTab] = useState<'track' | 'quote'>('track');
  
  // Tracking State
  const [trackCode, setTrackCode] = useState('');
  // States: 'idle' (initial), 'success' (found), 'error' (not found)
  const [searchStatus, setSearchStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Quote State
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteDest, setQuoteDest] = useState('');
  const [quoteLoading, setQuoteLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [quoteResult, setQuoteResult] = useState<ShippingQuote | null>(null);

  // Listen for event from Hero
  useEffect(() => {
    const handleTrackEvent = (e: CustomEvent) => {
        const code = e.detail;
        setTrackCode(code);
        setActiveTab('track');
        validateTrackingCode(code);
    };
    window.addEventListener('track-package' as any, handleTrackEvent);
    return () => window.removeEventListener('track-package' as any, handleTrackEvent);
  }, [data.code]); // Dependency on data.code so validation uses latest admin data

  const validateTrackingCode = (inputCode: string) => {
      if (!inputCode.trim()) {
          setSearchStatus('idle');
          return;
      }
      
      // Normalize for comparison (remove spaces, uppercase)
      const normalizedInput = inputCode.trim().toUpperCase();
      const normalizedDataCode = data.code.trim().toUpperCase();

      if (normalizedInput === normalizedDataCode) {
          setSearchStatus('success');
      } else {
          setSearchStatus('error');
      }
  };

  const handleSearch = () => {
    validateTrackingCode(trackCode);
  };

  const handleQuote = async () => {
      if (!quoteDesc || !quoteDest) return;
      setQuoteLoading(LoadingState.LOADING);
      try {
          const result = await calculateShippingQuote(quoteDesc, quoteDest);
          setQuoteResult(result);
          setQuoteLoading(LoadingState.SUCCESS);
      } catch (err) {
          setQuoteLoading(LoadingState.ERROR);
      }
  };

  return (
    <section id="tracking" className="py-24 bg-dark-900 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-brand-900/20 to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Tabs */}
            <div className="flex justify-center mb-12">
                <div className="bg-dark-800 p-1 rounded-xl border border-white/10 inline-flex relative">
                    <button 
                        onClick={() => setActiveTab('track')}
                        className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'track' 
                            ? 'bg-brand-600 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Search className="w-4 h-4" />
                        Rastreamento
                    </button>
                    <button 
                        onClick={() => setActiveTab('quote')}
                        className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'quote' 
                            ? 'bg-brand-600 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Calculator className="w-4 h-4" />
                        Cotação IA
                    </button>
                </div>
            </div>

            <div id="tracking-result" className="min-h-[500px] transition-all duration-500">
                {activeTab === 'track' ? (
                    /* TRACKING VIEW */
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                             {/* Admin toggle hidden hint */}
                             <div className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity admin-toggle-btn">
                                <button onClick={onToggleAdmin} className="text-xs text-gray-600 hover:text-brand-400 flex items-center gap-1">
                                    <Settings size={12} />
                                    <span className="sr-only">Admin</span>
                                </button>
                             </div>

                             <div className="flex gap-4 mb-8">
                                 <input 
                                     id="track-input"
                                     type="text" 
                                     value={trackCode}
                                     onChange={(e) => setTrackCode(e.target.value)}
                                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                     placeholder="Digite o código (ex: BR123456789)"
                                     className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                                 />
                                 <button 
                                     id="track-btn"
                                     onClick={handleSearch}
                                     className="bg-white text-dark-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                                 >
                                     Buscar
                                 </button>
                             </div>

                             {/* SUCCESS VIEW - Always render, toggle with CSS for Static Export compatibility */}
                             <div id="view-success" className={searchStatus === 'success' ? 'animate-fade-in' : 'hidden'}>
                                 <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                                     <div>
                                         <p className="text-gray-400 text-sm">Código</p>
                                         <h3 className="text-2xl font-mono text-white tracking-wider" id="display-code">{data.code}</h3>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-gray-400 text-sm">Previsão de Entrega</p>
                                         <h3 className="text-xl font-bold text-brand-400" id="display-estimated">{data.estimatedDelivery}</h3>
                                     </div>
                                 </div>

                                 {/* Recipient Details Block */}
                                 <div className="bg-dark-900/50 rounded-xl p-4 mb-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex items-start gap-3">
                                          <div className="bg-brand-500/20 p-2 rounded-lg">
                                            <User className="w-5 h-5 text-brand-400" />
                                          </div>
                                          <div>
                                              <p className="text-xs text-gray-500 font-bold uppercase">Destinatário</p>
                                              <p className="text-white font-medium" id="display-recipient">{data.recipient}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <div className="bg-brand-500/20 p-2 rounded-lg">
                                            <MapPin className="w-5 h-5 text-brand-400" />
                                          </div>
                                          <div>
                                              <p className="text-xs text-gray-500 font-bold uppercase">Endereço de Entrega</p>
                                              <p className="text-white font-medium" id="display-address">{data.address}</p>
                                              <p className="text-gray-400 text-sm">CEP: <span id="display-cep">{data.cep}</span></p>
                                          </div>
                                      </div>
                                 </div>

                                 <div id="public-events-list" className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-gray-700 before:to-gray-800">
                                     {data.events.map((event, idx) => (
                                         <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                             <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-800 bg-brand-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                 {event.icon === 'truck' ? <Truck className="w-4 h-4 text-white" /> : 
                                                  event.icon === 'check' ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                                                  event.icon === 'alert' ? <AlertCircle className="w-4 h-4 text-white" /> :
                                                  <Package className="w-4 h-4 text-white" />}
                                             </div>
                                             <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-dark-900 p-4 rounded-xl border border-white/5 shadow-lg group-hover:border-brand-500/30 transition-colors">
                                                 <div className="flex justify-between items-center mb-1">
                                                     <span className="font-bold text-white">{event.location}</span>
                                                     <span className="text-xs text-gray-500 font-mono">{event.date} - {event.time}</span>
                                                 </div>
                                                 <p className="text-gray-300 text-sm">{event.status}</p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* ERROR VIEW */}
                             <div id="view-error" className={searchStatus === 'error' ? 'animate-fade-in py-12 text-center' : 'hidden'}>
                                 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                     <XCircle className="w-10 h-10 text-red-500" />
                                 </div>
                                 <h3 className="text-xl font-bold text-white mb-2">Objeto não encontrado</h3>
                                 <p className="text-gray-400 max-w-sm mx-auto mb-6">
                                     O código <span className="font-mono text-white bg-white/10 px-1 rounded">{trackCode}</span> não consta em nossa base de dados.
                                 </p>
                                 <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-400 text-sm text-left max-w-md">
                                     <AlertTriangle className="w-5 h-5 shrink-0" />
                                     <span>Verifique se o código foi digitado corretamente ou tente novamente mais tarde.</span>
                                 </div>
                             </div>

                             {/* IDLE VIEW */}
                             <div id="view-idle" className={searchStatus === 'idle' ? 'text-center py-12' : 'hidden'}>
                                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <Search className="w-8 h-8 text-gray-600" />
                                 </div>
                                 <h3 className="text-white font-medium">Rastreie sua encomenda</h3>
                                 <p className="text-gray-500 text-sm mt-2">Digite o código acima para ver o status em tempo real.</p>
                             </div>
                        </div>
                    </div>
                ) : (
                    /* QUOTE VIEW */
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-dark-800 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="text-brand-400 w-5 h-5" />
                                <h3 className="text-xl font-bold text-white">Simulador de Frete com IA</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Descreva o que você quer enviar e nossa IA irá sugerir a melhor modalidade, custo estimado e dicas de embalagem.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">O que você vai enviar?</label>
                                    <input 
                                        type="text"
                                        placeholder="Ex: Violão acústico com case rígido"
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={quoteDesc}
                                        onChange={(e) => setQuoteDesc(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Destino (Cidade/Estado)</label>
                                    <input 
                                        type="text"
                                        placeholder="Ex: Fortaleza, CE"
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={quoteDest}
                                        onChange={(e) => setQuoteDest(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={handleQuote}
                                    disabled={quoteLoading === LoadingState.LOADING || !quoteDesc || !quoteDest}
                                    className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:to-brand-400 text-white font-bold py-4 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {quoteLoading === LoadingState.LOADING ? (
                                        <><Loader2 className="animate-spin w-5 h-5" /> Calculando...</>
                                    ) : (
                                        <><Calculator className="w-5 h-5" /> Calcular Estimativa</>
                                    )}
                                </button>
                                {quoteLoading === LoadingState.ERROR && (
                                    <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">Erro ao calcular. Tente novamente.</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            {quoteResult ? (
                                <div className="bg-white text-dark-900 rounded-2xl p-8 h-full shadow-2xl animate-fade-in border-t-8 border-brand-500">
                                    <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Melhor opção encontrada</h4>
                                    <h3 className="text-3xl font-extrabold text-brand-600 mb-6">{quoteResult.recommendedService}</h3>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-green-100 p-2 rounded-lg"><Box className="text-green-600 w-6 h-6" /></div>
                                            <div>
                                                <p className="font-bold text-lg">{quoteResult.estimatedCost}</p>
                                                <p className="text-sm text-gray-500">Custo Estimado</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-100 p-2 rounded-lg"><Truck className="text-blue-600 w-6 h-6" /></div>
                                            <div>
                                                <p className="font-bold text-lg">{quoteResult.estimatedTime}</p>
                                                <p className="text-sm text-gray-500">Prazo de Entrega</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2 text-orange-500 font-bold text-sm">
                                                <AlertCircle className="w-4 h-4" /> Dica de Embalagem
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {quoteResult.packagingAdvice}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full mt-8 border-2 border-brand-600 text-brand-600 font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors">
                                        Contratar Este Envio
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-500">
                                    <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                                        <Package className="w-10 h-10 opacity-20" />
                                    </div>
                                    <p>Os resultados da cotação aparecerão aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Admin Toggle (Visible only for demo ease) */}
            <div className="text-center mt-12 admin-toggle-btn">
               <button 
                onClick={onToggleAdmin}
                className="text-dark-700 hover:text-brand-500 text-sm font-medium transition-colors"
               >
                 Acessar Área Administrativa
               </button>
            </div>
        </div>
    </section>
  );
};

export default TrackingAndQuote;