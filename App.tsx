import React from 'react';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">Rastreador Inteligente de Linha de Produção</h1>
          <p className="text-sm text-gray-400">Integração com Dispositivos Zebra v1.0</p>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>
      <footer className="text-center p-4 text-gray-500 text-xs">
        © 2024 Soluções de Automação Industrial
      </footer>
    </div>
  );
};

export default App;