import React from 'react';
import { Product } from '../types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface PendingAlertsProps {
  products: Product[];
}

const PendingAlerts: React.FC<PendingAlertsProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }
  
  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "agora mesmo";
    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;
    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;
    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)} h`;
    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)} min`;
    return `há ${Math.floor(seconds)} s`;
  };

  return (
    <div className="bg-yellow-900/30 border border-yellow-500 text-yellow-200 p-4 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-300 mb-2 flex items-center">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        Atribuições Pendentes ({products.length})
      </h2>
      <p className="text-sm mb-4 text-yellow-300">Estes produtos foram escaneados, mas não estão vinculados a um pallet ativo.</p>
      <div className="max-h-48 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {products.map(product => (
            <li key={product.id} className="bg-gray-800/50 p-2 rounded-md flex justify-between items-center text-sm">
              <span className="font-mono font-semibold">{product.id}</span>
              <span className="text-gray-400">{timeSince(product.scannedAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PendingAlerts;