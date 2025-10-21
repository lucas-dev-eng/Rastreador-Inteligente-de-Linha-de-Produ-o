import React from 'react';
import { Pallet } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PalletIcon } from './icons/PalletIcon';

interface PalletManagerProps {
  pallets: Pallet[];
  activePalletId: string | null;
  onSetActivePallet: (id: string) => void;
  onCreatePallet: () => void;
}

const PalletManager: React.FC<PalletManagerProps> = ({ pallets, activePalletId, onSetActivePallet, onCreatePallet }) => {
  const activePallet = pallets.find(p => p.id === activePalletId);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center"><PalletIcon className="h-6 w-6 mr-2" /> Controle de Pallets</h2>
      <div className="space-y-4">
        <button
          onClick={onCreatePallet}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Criar Novo Pallet
        </button>
        <div>
          <label htmlFor="pallet-select" className="block text-sm font-medium text-gray-400 mb-1">
            Definir Pallet Ativo
          </label>
          <select
            id="pallet-select"
            value={activePalletId || ''}
            onChange={(e) => onSetActivePallet(e.target.value)}
            disabled={pallets.length === 0}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          >
            <option value="" disabled>Selecione um pallet</option>
            {pallets.map(pallet => (
              <option key={pallet.id} value={pallet.id}>
                {pallet.id} ({pallet.productIds.length} itens)
              </option>
            ))}
          </select>
        </div>
        {activePallet && (
          <div className="bg-gray-700/50 p-3 rounded-lg border border-cyan-500/50">
            <h3 className="font-bold text-cyan-400">Ativo: {activePallet.id}</h3>
            <p className="text-sm text-gray-300">Produtos vinculados: {activePallet.productIds.length}</p>
            <p className="text-xs text-gray-500">Criado em: {new Date(activePallet.createdAt).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PalletManager;