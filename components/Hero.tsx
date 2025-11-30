import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, ShieldCheck, Globe2 } from 'lucide-react';

const Hero: React.FC = () => {
  const [trackCode, setTrackCode] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackCode) {
      const element = document.getElementById('tracking-result');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Dispatch custom event or use context in a real app
        // For now, we'll assume the InteractiveDemo component listens or we handle it there
        // A simple hack is passing via URL hash or local storage for this demo, 
        // but for UI flow we will just scroll to the tracking section.
        window.dispatchEvent(new CustomEvent('track-package', { detail: trackCode }));
      }
    }
  };

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-dark-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-900 z-10"></div>
         {/* Abstract Map Pattern */}
         <div className="absolute inset-0 opacity-10" style={{ 
             backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
         }}></div>
         
         {/* Animated Blob */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-brand-800/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="text-left">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wide mb-6">
                  <span className="flex h-2 w-2 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  Líder em entregas expressas
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  Logística que move o <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                    seu mundo.
                  </span>
                </h1>
                
                <p className="mt-4 text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                  Entregas rápidas, seguras e rastreáveis para todo o Brasil. Conectamos sua empresa aos seus clientes com tecnologia de ponta.
                </p>
                
                {/* Stats */}
                <div className="flex gap-8 mb-10 border-t border-white/10 pt-8">
                    <div>
                        <p className="text-3xl font-bold text-white">24h</p>
                        <p className="text-sm text-gray-500 uppercase font-medium mt-1">Entregas Capitais</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">100%</p>
                        <p className="text-sm text-gray-500 uppercase font-medium mt-1">Rastreável</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">5k+</p>
                        <p className="text-sm text-gray-500 uppercase font-medium mt-1">Cidades Atendidas</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <div className="flex items-center gap-2 text-gray-400 text-sm">
                         <ShieldCheck className="w-5 h-5 text-brand-500" />
                         Seguro Incluso
                     </div>
                     <div className="flex items-center gap-2 text-gray-400 text-sm">
                         <Globe2 className="w-5 h-5 text-brand-500" />
                         Abrangência Nacional
                     </div>
                </div>
            </div>

            {/* Tracking Card */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-dark-800 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">Rastrear Encomenda</h3>
                    <p className="text-gray-400 mb-6">Digite seu código de rastreio para ver o status em tempo real.</p>
                    
                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-4 bg-dark-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                placeholder="Ex: BR123456789"
                                value={trackCode}
                                onChange={(e) => setTrackCode(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-600/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Rastrear Agora
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-dark-800"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-dark-800"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-dark-800 flex items-center justify-center text-xs font-bold text-white">+2k</div>
                         </div>
                         <p className="text-sm text-gray-500">Clientes satisfeitos hoje</p>
                    </div>
                </div>

                {/* Decorative Map Pin */}
                <div className="absolute -top-6 -right-6 bg-accent-500 p-3 rounded-xl shadow-lg transform rotate-12 animate-bounce hidden md:block">
                    <MapPin className="text-white w-6 h-6" />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;