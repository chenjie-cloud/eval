import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const PRESET_WALLPAPERS = [
  { name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop' },
  { name: 'Dark Space', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop' },
  { name: 'Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop' },
];

export const Settings: React.FC = () => {
  const { wallpaper, setWallpaper } = useSettingsStore();
  const [customUrl, setCustomUrl] = useState('');

  const handleApplyCustom = () => {
    if (customUrl.trim()) {
      setWallpaper(customUrl.trim());
      setCustomUrl('');
    }
  };

  return (
    <div className="p-6 bg-white h-full text-black overflow-auto font-mono">
      <h2 className="text-2xl font-bold mb-6 uppercase tracking-tighter border-b-4 border-black pb-2">Settings</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold mb-3 uppercase">Desktop Wallpaper</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {PRESET_WALLPAPERS.map((wp, i) => (
              <div 
                key={i} 
                className={`cursor-pointer brutalist-border transition-all overflow-hidden ${
                  wallpaper === wp.url ? 'bg-[#00ff00] translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-white brutalist-shadow-sm hover:bg-gray-200'
                }`}
                onClick={() => setWallpaper(wp.url)}
              >
                <img src={wp.url} alt={wp.name} className="w-full h-24 object-cover border-b-2 border-black" />
                <div className="p-2 text-sm text-center font-bold">{wp.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold text-black mb-1 uppercase">
              Custom Image URL
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 brutalist-border px-3 py-2 text-sm focus:outline-none bg-white brutalist-shadow-sm focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
              />
              <button 
                onClick={handleApplyCustom}
                disabled={!customUrl.trim()}
                className="px-4 py-2 brutalist-border bg-[#00ff00] hover:bg-[#00cc00] disabled:opacity-50 text-sm font-bold brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
              >
                Apply
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
