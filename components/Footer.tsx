import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Truck, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
               </div>
               <span className="text-xl font-bold text-white">VeloxLog</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectando pessoas e negócios através de soluções logísticas inteligentes, rápidas e seguras.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Rastreamento</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Entrega Expressa</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Carga Fracionada</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Logística Reversa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="block text-gray-500 text-xs">Central de Atendimento</span>0800 123 4567</li>
              <li><span className="block text-gray-500 text-xs mt-2">Email</span>contato@veloxlog.com.br</li>
              <li><span className="block text-gray-500 text-xs mt-2">Endereço</span>Av. Paulista, 1000 - SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VeloxLog Transportes Ltda. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin'))}
                className="flex items-center gap-2 text-dark-800 hover:text-dark-700 transition-colors text-xs font-medium opacity-50 hover:opacity-100 admin-toggle-btn"
                title="Área Restrita"
            >
                <Lock className="w-3 h-3" />
                <span className="hidden md:inline">Restrito</span>
            </button>

            <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;