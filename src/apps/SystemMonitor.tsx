import { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, List } from 'lucide-react';

export const SystemMonitor = () => {
  const [activeTab, setActiveTab] = useState('processes');
  const [cpuUsage, setCpuUsage] = useState(15);
  const [ramUsage, setRamUsage] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const diff = (Math.random() - 0.5) * 10;
        return Math.min(100, Math.max(5, prev + diff));
      });
      setRamUsage((prev) => {
        const diff = (Math.random() - 0.5) * 2;
        return Math.min(100, Math.max(20, prev + diff));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'processes', name: 'Processes', icon: List },
    { id: 'performance', name: 'Performance', icon: Activity },
  ];

  const processes = [
    { id: 1, name: 'System Idle Process', cpu: '85.2%', ram: '24 MB' },
    { id: 2, name: 'Desktop Environment', cpu: '4.1%', ram: '156 MB' },
    { id: 3, name: 'Browser', cpu: '8.4%', ram: '840 MB' },
    { id: 4, name: 'System Monitor', cpu: '1.2%', ram: '45 MB' },
    { id: 5, name: 'Network Service', cpu: '0.1%', ram: '12 MB' },
  ];

  return (
    <div className="flex flex-col h-full bg-white font-sans text-gray-800">
      {/* Header Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 p-2 bg-gray-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
                isActive ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'processes' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium border-b border-gray-200">Name</th>
                <th className="px-4 py-2 font-medium border-b border-gray-200 w-24">CPU</th>
                <th className="px-4 py-2 font-medium border-b border-gray-200 w-24">Memory</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc) => (
                <tr key={proc.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">{proc.name}</td>
                  <td className="px-4 py-3 text-gray-600">{proc.cpu}</td>
                  <td className="px-4 py-3 text-gray-600">{proc.ram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* CPU Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center space-y-4 shadow-sm">
              <Cpu className="w-12 h-12 text-blue-500" />
              <h3 className="text-lg font-medium">CPU Usage</h3>
              <div className="text-4xl font-light text-blue-600">
                {cpuUsage.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
            </div>

            {/* RAM Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center space-y-4 shadow-sm">
              <HardDrive className="w-12 h-12 text-purple-500" />
              <h3 className="text-lg font-medium">Memory Usage</h3>
              <div className="text-4xl font-light text-purple-600">
                {ramUsage.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${ramUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemMonitor;
