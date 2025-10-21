import React from 'react';
import { ZebraDevice, DeviceStatus, DeviceType } from '../types';
import { ScannerIcon } from './icons/ScannerIcon';
import { PrinterIcon } from './icons/PrinterIcon';
import { InfoCircleIcon } from './icons/InfoCircleIcon';

const DeviceIcon: React.FC<{type: DeviceType}> = ({ type }) => {
    switch (type) {
        case DeviceType.Scanner:
            return <ScannerIcon className="h-8 w-8 text-gray-400" />;
        case DeviceType.Printer:
            return <PrinterIcon className="h-8 w-8 text-gray-400" />;
        case DeviceType.Collector:
            return <InfoCircleIcon className="h-8 w-8 text-gray-400" />;
        default:
            return null;
    }
}

const StatusIndicator: React.FC<{status: DeviceStatus}> = ({ status }) => {
    const baseClasses = "h-3 w-3 rounded-full";
    switch (status) {
        case DeviceStatus.Online:
            return <div className={`${baseClasses} bg-green-500`} title="Online"></div>;
        case DeviceStatus.Offline:
            return <div className={`${baseClasses} bg-gray-500`} title="Offline"></div>;
        case DeviceStatus.Error:
            return <div className={`${baseClasses} bg-red-500 animate-pulse`} title="Erro"></div>;
        default:
            return null;
    }
}

interface DeviceStatusProps {
  devices: ZebraDevice[];
}

const DeviceStatusComponent: React.FC<DeviceStatusProps> = ({ devices }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4">Status dos Dispositivos Zebra</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {devices.map(device => (
          <div key={device.id} className="bg-gray-700/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <DeviceIcon type={device.type} />
            <p className="font-semibold mt-2 text-sm text-gray-200">{device.name}</p>
            <p className="text-xs text-gray-400">{device.type}</p>
            <div className="flex items-center mt-2">
              <StatusIndicator status={device.status} />
              <span className="ml-2 text-xs">{device.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStatusComponent;