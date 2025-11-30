import React from 'react';
import { Check, Truck } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-dark-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Planos Empresariais</h2>
          <p className="mt-4 text-xl text-gray-400">Tem um e-commerce? Escolha o plano ideal para reduzir seus custos de frete.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-dark-900 border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-medium text-gray-300">E-commerce Start</h3>
            <p className="mt-4 text-4xl font-extrabold text-white">Grátis</p>
            <p className="text-gray-500 mt-1">sem mensalidade</p>
            <ul className="mt-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Até 50 envios/mês
              </li>
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Tabela balcão -10%
              </li>
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Coleta agendada
              </li>
            </ul>
            <button className="mt-8 w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">
              Cadastrar Agora
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-brand-900/50 to-dark-900 border border-brand-500/50 rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Mais Vendido
            </div>
            <h3 className="text-xl font-bold text-white">E-commerce Pro</h3>
            <p className="mt-4 text-4xl font-extrabold text-white">R$ 149</p>
            <p className="text-gray-400 mt-1">por mês</p>
            <ul className="mt-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-brand-400 mr-2" />
                Até 500 envios/mês
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-brand-400 mr-2" />
                Tabela Reduzida -30%
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-brand-400 mr-2" />
                Coleta diária grátis
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-brand-400 mr-2" />
                API de integração
              </li>
            </ul>
            <button className="mt-8 w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/25">
              Começar Teste Grátis
            </button>
          </div>

          {/* Corporate Plan */}
          <div className="bg-dark-900 border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-medium text-gray-300">Corporativo</h3>
            <p className="mt-4 text-4xl font-extrabold text-white">Sob Consulta</p>
            <p className="text-gray-500 mt-1">volume personalizado</p>
            <ul className="mt-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Envios Ilimitados
              </li>
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Tabela Atacado
              </li>
              <li className="flex items-center text-gray-400">
                <Check className="w-5 h-5 text-brand-500 mr-2" />
                Gerente de Contas
              </li>
            </ul>
            <button className="mt-8 w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">
              Falar com Consultor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;