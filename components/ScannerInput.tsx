import React, { useState } from 'react';
import { ScannerIcon } from './icons/ScannerIcon';

interface ScannerInputProps {
  onScan: (productId: string) => void;
}

const ScannerInput: React.FC<ScannerInputProps> = ({ onScan }) => {
  const [productId, setProductId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId.trim()) {
      onScan(productId.trim().toUpperCase());
      setProductId('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center"><ScannerIcon className="h-6 w-6 mr-2"/> Escanear Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-id" className="block text-sm font-medium text-gray-400 mb-1">
            ID do Produto (Cód. Barras/QR)
          </label>
          <input
            id="product-id"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="ex: PROD-12345678"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-green-800 disabled:cursor-not-allowed"
          disabled={!productId.trim()}
        >
          Processar Escaneamento
        </button>
      </form>
    </div>
  );
};

export default ScannerInput;