import React from 'react';
import { LogEntry, LogLevel } from '../types';
import { InfoCircleIcon } from './icons/InfoCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface ActivityLogProps {
  logs: LogEntry[];
}

const LogIcon: React.FC<{level: LogLevel}> = ({ level }) => {
    const baseClasses = "h-4 w-4 mr-2 flex-shrink-0";
    switch (level) {
        case LogLevel.Info:
            return <InfoCircleIcon className={`${baseClasses} text-blue-400`} />;
        case LogLevel.Warning:
            return <ExclamationTriangleIcon className={`${baseClasses} text-yellow-400`} />;
        case LogLevel.Success:
            return <CheckCircleIcon className={`${baseClasses} text-green-400`} />;
        default:
            return null;
    }
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg h-[600px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Registro de Atividades</h3>
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {logs.map(log => (
            <li key={log.id} className="text-xs flex items-start">
                <LogIcon level={log.level} />
                <div>
                    <span className="text-gray-500 mr-2">{log.timestamp.toLocaleTimeString()}</span>
                    <span className="text-gray-300">{log.message}</span>
                </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLog;