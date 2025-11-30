import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, Package } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-white">
              Velox<span className="text-brand-400">Log</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#tracking" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">Rastrear</a>
              <a href="#services" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">Serviços</a>
              <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">Planos</a>
              
              <div className="h-6 w-px bg-white/20 mx-2"></div>
              
              <a href="#login" className="text-white font-medium hover:text-brand-300 transition-colors">Entrar</a>
              <button className="bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Cotar Envio
              </button>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-white/10 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#tracking" className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Rastrear Encomenda</a>
            <a href="#services" className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Nossos Serviços</a>
            <a href="#pricing" className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>Preços e Prazos</a>
            <div className="border-t border-white/10 my-2 pt-2">
                <a href="#login" className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Área do Cliente</a>
                <button className="w-full text-center bg-brand-600 text-white mt-2 px-3 py-3 rounded-lg text-base font-bold shadow-lg">
                Fazer Cotação
                </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;