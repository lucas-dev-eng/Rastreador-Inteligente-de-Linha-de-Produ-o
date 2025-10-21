export enum DeviceType {
  Scanner = 'Scanner',
  Printer = 'Impressora',
  Collector = 'Coletor de Dados',
}

export enum DeviceStatus {
  Online = 'Online',
  Offline = 'Offline',
  Error = 'Erro',
}

export interface ZebraDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
}

export enum ProductStatus {
  Pending = 'Pending',
  Linked = 'Linked',
}

export interface Product {
  id: string;
  scannedAt: Date;
  linkedAt?: Date;
  status: ProductStatus;
  palletId?: string;
  scannedWithDeviceId: string;
}

export interface Pallet {
  id: string;
  createdAt: Date;
  productIds: string[];
}

export enum LogLevel {
  Info = 'Info',
  Warning = 'Warning',
  Success = 'Success',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level: LogLevel;
}