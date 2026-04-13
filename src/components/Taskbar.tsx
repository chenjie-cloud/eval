import { useEffect, useState } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import { Wifi, Battery, ChevronUp, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const Taskbar = () => {
  const { toggleStartMenu, isStartMenuOpen, openApps, activeAppId, focusApp } = useDesktopStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-xl border-t border-gray-700 flex items-center justify-between px-2 z-50 select-none">
      
      {/* Start Button & App Icons */}
      <div className="flex items-center h-full space-x-1">
        <button
          onClick={toggleStartMenu}
          className={`p-2 rounded-md transition-colors ${
            isStartMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-white grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-blue-500" />
              <div className="bg-blue-500" />
              <div className="bg-blue-500" />
              <div className="bg-blue-500" />
            </div>
          </div>
        </button>

        {/* Divider */}
        {openApps.length > 0 && <div className="w-px h-6 bg-gray-600 mx-1" />}

        {/* Open Apps */}
        {openApps.map((app) => {
          const isActive = activeAppId === app.id;
          return (
            <button
              key={app.id}
              onClick={() => focusApp(app.id)}
              className={`relative p-2 rounded-md transition-all flex items-center justify-center ${
                isActive ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <app.icon className="w-6 h-6 text-white" />
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-blue-400 rounded-t-sm"
                />
              )}
              {!isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-0.5 bg-gray-400 rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center h-full text-white/90 space-x-1 text-sm">
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
          <ChevronUp className="w-4 h-4" />
        </button>
        <button className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded-md transition-colors">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-end justify-center px-2 py-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer text-xs">
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{time.toLocaleDateString()}</span>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
