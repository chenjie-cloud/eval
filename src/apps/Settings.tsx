import { useState } from 'react';
import { 
  Monitor, 
  Wifi, 
  Bluetooth, 
  Volume2, 
  Battery, 
  User, 
  Lock, 
  Settings as SettingsIcon 
} from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', name: 'System', icon: Monitor },
    { id: 'network', name: 'Network & Internet', icon: Wifi },
    { id: 'bluetooth', name: 'Bluetooth & Devices', icon: Bluetooth },
    { id: 'sound', name: 'Sound', icon: Volume2 },
    { id: 'power', name: 'Power & Battery', icon: Battery },
    { id: 'accounts', name: 'Accounts', icon: User },
    { id: 'privacy', name: 'Privacy & Security', icon: Lock },
    { id: 'about', name: 'About', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-full bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col p-4 space-y-2 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 px-2">Settings</h2>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        <h1 className="text-3xl font-light mb-8">
          {tabs.find((t) => t.id === activeTab)?.name}
        </h1>
        
        <div className="max-w-2xl space-y-6">
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-medium mb-2">Display</h3>
                <p className="text-sm text-gray-500 mb-4">Adjust your display resolution and scaling.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resolution</span>
                  <select className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option>1920 x 1080</option>
                    <option>2560 x 1440</option>
                    <option>3840 x 2160</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-medium mb-2">Color Profile</h3>
                <p className="text-sm text-gray-500 mb-4">Choose your preferred color theme.</p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Light</button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">Dark</button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'system' && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <SettingsIcon className="w-16 h-16 mb-4 opacity-20" />
              <p>Settings for {tabs.find((t) => t.id === activeTab)?.name.toLowerCase()} are not available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
