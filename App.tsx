import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import TrackingAndQuote from './components/InteractiveDemo';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { TrackingData } from './types';

const INITIAL_DATA: TrackingData = {
  code: 'BR123456789',
  estimatedDelivery: 'Em 3 dias',
  origin: 'São Paulo, SP',
  destination: 'Curitiba, PR',
  recipient: 'Maria Joaquina',
  address: 'Rua Federido 343',
  cep: '398472384',
  events: [
      { 
          date: 'Hoje', 
          time: '14:20', 
          location: 'São Paulo, SP', 
          status: 'Objeto em trânsito - Em rota para unidade de destino', 
          icon: 'truck' 
      },
      { 
          date: 'Hoje', 
          time: '09:30', 
          location: 'São Paulo, SP', 
          status: 'Objeto postado na agência', 
          icon: 'package' 
      }
  ]
};

const App: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingData>(INITIAL_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsAdminOpen(prev => !prev);
    // Listen for the custom event dispatched by Footer
    window.addEventListener('toggle-admin', handleToggle);
    return () => window.removeEventListener('toggle-admin', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-brand-500 selection:text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <TrackingAndQuote 
          data={trackingData} 
          onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        />
        <Pricing />
      </main>
      <Footer />
      
      {/* Admin Panel */}
      <AdminPanel 
        data={trackingData} 
        onUpdate={setTrackingData} 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
};

export default App;