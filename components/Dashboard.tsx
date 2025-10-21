import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Pallet, Product, ZebraDevice, LogEntry, ProductStatus } from '../types';
import * as api from '../services/api';
import PalletManager from './PalletManager';
import DeviceStatusComponent from './DeviceStatus';
import ScannerInput from './ScannerInput';
import ActivityLog from './ActivityLog';
import PendingAlerts from './PendingAlerts';
import ReportModal from './ReportModal';
import { analyzeProductionLog } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<ZebraDevice[]>([]);
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activePalletId, setActivePalletId] = useState<string | null>(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais da "API"
  useEffect(() => {
    const loadData = async () => {
      const data = await api.fetchInitialData();
      setDevices(data.devices);
      setPallets(data.pallets);
      setProducts(data.products);
      setLogs(data.logs);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Simular atualizações de status de dispositivos em tempo real
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedDevices = await api.fetchDevices();
      setDevices(updatedDevices);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePallet = useCallback(async () => {
    const { newPallet, log } = await api.createPallet();
    setPallets(prev => [...prev, newPallet]);
    setLogs(prev => [log, ...prev]);
    setActivePalletId(newPallet.id);
  }, []);

  const handleScanProduct = useCallback(async (productId: string) => {
    const { product, updatedPallet, logs: newLogs } = await api.scanProduct(productId, activePalletId);
    
    setLogs(prev => [...newLogs, ...prev]);

    if (product) {
       setProducts(prev => [...prev.filter(p => p.id !== product.id), product]);
    }
    if (updatedPallet) {
      setPallets(prev => [...prev.filter(p => p.id !== updatedPallet.id), updatedPallet]);
    }
  }, [activePalletId]);
  
  const pendingProducts = useMemo(() => products.filter(p => p.status === ProductStatus.Pending), [products]);

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    setIsReportModalOpen(true);
    setReportContent('');
    const analysis = await analyzeProductionLog(logs, products, pallets);
    setReportContent(analysis);
    setIsAnalyzing(false);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg">Carregando dados da linha de produção...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PalletManager 
            pallets={pallets}
            activePalletId={activePalletId}
            onSetActivePallet={setActivePalletId}
            onCreatePallet={handleCreatePallet}
          />
          <ScannerInput onScan={handleScanProduct} />
        </div>
        <DeviceStatusComponent devices={devices} />
        <PendingAlerts products={pendingProducts} />
      </div>
      
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-300">Operações</h2>
             <button
              onClick={handleGenerateReport}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-purple-900 disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando...
                </>
              ) : 'Análise com IA'}
            </button>
          </div>
          <ActivityLog logs={logs} />
        </div>
      </div>
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        content={reportContent}
        isLoading={isAnalyzing}
      />
    </div>
  );
};
