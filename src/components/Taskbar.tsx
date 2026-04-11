import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import { LayoutGrid, Wifi, Volume2, Battery } from 'lucide-react';
import { APPS } from '../config/apps';
import { motion, AnimatePresence } from 'framer-motion';

export const Taskbar: React.FC = () => {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openWindow } = useWindowStore();
  const [time, setTime] = useState<Date>(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setStartOpen(false);
      }
    };
    if (startOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startOpen]);

  const handleWindowClick = (id: string) => {
    const win = windows[id];
    if (activeWindowId === id) {
      if (!win.isMinimized) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    } else {
      focusWindow(id);
    }
  };

  const handleAppClick = (app: typeof APPS[0]) => {
    openWindow(app.id, app.title, app.component);
    setStartOpen(false);
  };

  return (
    <>
      {/* Start Menu */}
      <AnimatePresence>
        {startOpen && (
          <motion.div 
            ref={startMenuRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 left-2 w-64 bg-white brutalist-border brutalist-shadow z-50 p-2"
          >
            <div className="flex flex-col gap-1">
              <div className="bg-black text-white px-2 py-1 font-bold mb-2">START MENU</div>
              {APPS.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 transition-colors text-left outline-none brutalist-border bg-white brutalist-shadow-sm brutalist-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none mb-2"
                >
                  <div className={`w-8 h-8 flex items-center justify-center ${app.color} border border-black`}>
                    {React.cloneElement(app.icon as React.ReactElement<any>, { size: 16 })}
                  </div>
                  <span className="font-bold tracking-tight">{app.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-12 w-full bg-white border-t-4 border-black flex items-center px-2 z-50 select-none">
        {/* Start Button */}
        <button 
          onClick={() => setStartOpen(!startOpen)}
          className={`h-8 px-3 flex items-center justify-center brutalist-border transition-colors mr-2 font-bold ${
            startOpen ? 'bg-black text-white' : 'bg-[#ff00ff] text-black hover:bg-black hover:text-[#ff00ff]'
          } brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
          title="Start"
        >
          <LayoutGrid className="w-5 h-5 mr-1" />
          START
        </button>

        {/* Open Windows List */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto px-2">
          {Object.values(windows).map((win) => (
            <button
              key={win.id}
              onClick={() => handleWindowClick(win.id)}
              className={`h-8 px-3 flex items-center gap-2 max-w-[160px] truncate brutalist-border font-bold transition-all ${
                activeWindowId === win.id && !win.isMinimized
                  ? 'bg-black text-white translate-x-[2px] translate-y-[2px] shadow-none'
                  : 'bg-white text-black brutalist-shadow-sm hover:bg-gray-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              }`}
            >
              <span className="text-sm truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full px-2 gap-2 text-black">
          <button className="h-8 w-8 brutalist-border bg-white flex items-center justify-center brutalist-shadow-sm hover:bg-gray-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <Wifi className="w-4 h-4" />
          </button>
          <button className="h-8 w-8 brutalist-border bg-white flex items-center justify-center brutalist-shadow-sm hover:bg-gray-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <Volume2 className="w-4 h-4" />
          </button>
          <button className="h-8 w-8 brutalist-border bg-white flex items-center justify-center brutalist-shadow-sm hover:bg-gray-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <Battery className="w-4 h-4" />
          </button>
          
          {/* Clock */}
          <div className="flex flex-col items-center justify-center h-8 px-2 brutalist-border bg-black text-white cursor-default min-w-[70px]">
            <span className="text-xs font-bold">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
