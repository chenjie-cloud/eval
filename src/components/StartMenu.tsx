import { useDesktopStore } from '../store/desktopStore';
import { AVAILABLE_APPS } from '../config/apps';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Power, Settings as SettingsIcon } from 'lucide-react';

export const StartMenu = () => {
  const { isStartMenuOpen, openApp } = useDesktopStore();

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-14 left-2 w-[400px] h-[600px] bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden z-50 select-none text-white"
        >
          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Type here to search"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
          </div>

          {/* App Grid */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-200">Pinned</h2>
              <button className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                All apps
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {AVAILABLE_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openApp(app)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-lg border border-gray-700">
                    <app.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-300 truncate w-full text-center">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="h-16 bg-gray-900/50 border-t border-gray-700/50 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-md">
                US
              </div>
              <span className="text-sm font-medium">User Name</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <SettingsIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-gray-400 hover:text-red-400">
                <Power className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
