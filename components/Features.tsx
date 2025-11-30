import React from 'react';
import { Truck, Clock, ShieldCheck, Map, Smartphone, Box } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: "Frota Própria & Parceira",
    description: "Mais de 500 veículos prontos para atender sua demanda, desde motoboys até carretas.",
    icon: <Truck className="w-6 h-6 text-brand-400" />,
  },
  {
    title: "Entrega Expressa",
    description: "Modalidades Same Day Delivery para capitais e regiões metropolitanas.",
    icon: <Clock className="w-6 h-6 text-accent-400" />,
  },
  {
    title: "Carga Segurada",
    description: "Sua mercadoria viaja com seguro total contra roubo, furto e avarias desde a coleta.",
    icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
  },
  {
    title: "Rastreio em Tempo Real",
    description: "Tecnologia de ponta para você saber exatamente onde sua encomenda está, 24/7.",
    icon: <Map className="w-6 h-6 text-purple-400" />,
  },
  {
    title: "App Exclusivo",
    description: "Gerencie suas coletas, pagamentos e etiquetas diretamente pelo nosso aplicativo.",
    icon: <Smartphone className="w-6 h-6 text-pink-400" />,
  },
  {
    title: "Embalagem Inteligente",
    description: "Consultoria gratuita de embalagem para reduzir custos e evitar danos no transporte.",
    icon: <Box className="w-6 h-6 text-yellow-400" />,
  },
];

const Features: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-dark-800 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-brand-400 font-semibold tracking-wide uppercase">Por que escolher a VeloxLog?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Tecnologia que encurta distâncias
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Não somos apenas uma transportadora. Somos seu parceiro estratégico de logística.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative p-8 bg-dark-900 border border-white/5 rounded-2xl hover:border-brand-500/50 hover:bg-dark-900/80 transition-all duration-300 group shadow-lg hover:shadow-brand-900/20"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Truck size={64} />
              </div>
              
              <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-xl border border-white/10 mb-5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;