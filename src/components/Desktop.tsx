import React from 'react';
import { useWindowStore } from '../store/windowStore';
import { useSettingsStore } from '../store/settingsStore';
import { Window } from './Window';
import { APPS } from '../config/apps';
import { AnimatePresence, motion } from 'framer-motion';

interface DesktopProps {
  children?: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ children }) => {
  const { windows, openWindow } = useWindowStore();
  const wallpaper = useSettingsStore((state) => state.wallpaper);

  return (
    <div 
      className="relative w-full flex-1 overflow-hidden bg-cover bg-center bg-no-repeat bg-[#008080]"
      style={{ 
        backgroundImage: wallpaper ? `url("${wallpaper}")` : 'none'
      }}
    >
      {/* Desktop Background Layer */}
      <div className="absolute inset-0 z-0 flex flex-col flex-wrap gap-6 p-6 content-start items-start">
        {APPS.map((app) => (
          <button
            key={app.id}
            onDoubleClick={() => openWindow(app.id, app.title, app.component)}
            className="group flex flex-col items-center justify-center w-24 gap-2 outline-none cursor-pointer"
          >
            <div className={`w-16 h-16 ${app.color} flex items-center justify-center brutalist-border brutalist-shadow transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none`}>
              {app.icon}
            </div>
            <span className="text-white bg-black px-1 font-bold tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((win) => (
            <motion.div 
              key={win.id} 
              className="pointer-events-auto absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            >
              <Window id={win.id} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
