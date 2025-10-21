// services/api.ts
// Este arquivo simula um backend Node.js. Ele gerencia o estado da aplicação
// em memória e expõe funções assíncronas que imitam chamadas de API REST.

import { Pallet, Product, ZebraDevice, LogEntry, DeviceStatus, DeviceType, ProductStatus, LogLevel } from '../types';

// --- SIMULAÇÃO DO BANCO DE DADOS EM MEMÓRIA ---
let devices: ZebraDevice[] = [
  { id: 'SCN-001', name: 'Scanner Seção 1', type: DeviceType.Scanner, status: DeviceStatus.Online },
  { id: 'PRT-001', name: 'Impressora A', type: DeviceType.Printer, status: DeviceStatus.Online },
  { id: 'COL-001', name: 'Coletor Alpha', type: DeviceType.Collector, status: DeviceStatus.Offline },
  { id: 'SCN-002', name: 'Scanner Seção 2', type: DeviceType.Scanner, status: DeviceStatus.Error },
];
let pallets: Pallet[] = [];
let products: Product[] = [];
let logs: LogEntry[] = [];

// --- FUNÇÃO DE LOG INTERNA DA API ---
const addLog = (message: string, level: LogLevel): LogEntry => {
  const newLog: LogEntry = { id: crypto.randomUUID(), timestamp: new Date(), message, level };
  logs = [newLog, ...logs];
  return newLog;
};

// --- SIMULAÇÃO DE LATÊNCIA DE REDE ---
const networkDelay = (ms = 200) => new Promise(res => setTimeout(res, ms));


// --- "ENDPOINTS" DA API SIMULADA ---

export const fetchInitialData = async () => {
  await networkDelay(500);
  addLog("Sistema iniciado e dados iniciais carregados.", LogLevel.Info);
  return { devices, pallets, products, logs };
};

export const fetchDevices = async (): Promise<ZebraDevice[]> => {
  await networkDelay();
  // Simula mudanças de status
  devices = devices.map(d => {
    if (d.id === 'COL-001') return d;
    const rand = Math.random();
    if (d.status !== DeviceStatus.Error && rand < 0.05) return { ...d, status: DeviceStatus.Error };
    if (d.status !== DeviceStatus.Offline && rand >= 0.05 && rand < 0.15) return { ...d, status: DeviceStatus.Offline };
    return { ...d, status: DeviceStatus.Online };
  });
  return [...devices];
};


export const createPallet = async (): Promise<{ newPallet: Pallet, log: LogEntry }> => {
  await networkDelay(300);
  const newPallet: Pallet = {
    id: `PAL-${String(pallets.length + 1).padStart(4, '0')}`,
    createdAt: new Date(),
    productIds: [],
  };
  pallets = [...pallets, newPallet];
  const log = addLog(`Novo pallet criado: ${newPallet.id}`, LogLevel.Info);
  return { newPallet, log };
};

export const scanProduct = async (productId: string, activePalletId: string | null): Promise<{ product?: Product, updatedPallet?: Pallet, logs: LogEntry[] }> => {
  await networkDelay(400);
  
  const newLogs: LogEntry[] = [];

  if (products.some(p => p.id === productId)) {
    newLogs.push(addLog(`Produto já escaneado: ${productId}`, LogLevel.Warning));
    return { logs: newLogs };
  }

  const onlineScanners = devices.filter(d => d.type === DeviceType.Scanner && d.status === DeviceStatus.Online);
  if (onlineScanners.length === 0) {
    newLogs.push(addLog(`Falha no escaneamento: Nenhum scanner online disponível.`, LogLevel.Warning));
    return { logs: newLogs };
  }
  const scanner = onlineScanners[Math.floor(Math.random() * onlineScanners.length)];

  const newProduct: Product = {
    id: productId,
    scannedAt: new Date(),
    status: ProductStatus.Pending,
    scannedWithDeviceId: scanner.id,
  };
  
  newLogs.push(addLog(`Produto escaneado: ${productId} com ${scanner.name}`, LogLevel.Info));

  if (activePalletId) {
    const updatedProduct = { ...newProduct, status: ProductStatus.Linked, palletId: activePalletId, linkedAt: new Date() };
    products = [...products, updatedProduct];
    
    let updatedPallet: Pallet | undefined;
    pallets = pallets.map(p => {
      if (p.id === activePalletId) {
        updatedPallet = { ...p, productIds: [...p.productIds, productId] };
        return updatedPallet;
      }
      return p;
    });

    newLogs.push(addLog(`Produto ${productId} vinculado ao pallet ${activePalletId}`, LogLevel.Success));
    return { product: updatedProduct, updatedPallet, logs: newLogs };
  } else {
    products = [...products, newProduct];
    newLogs.push(addLog(`Produto ${productId} está pendente de associação a um pallet.`, LogLevel.Warning));
    return { product: newProduct, logs: newLogs };
  }
};
