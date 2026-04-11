import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { RndResizeCallback, RndDragCallback } from 'react-rnd';
import { Minus, Square, X } from 'lucide-react';
import { useWindowStore } from '../store/windowStore';
import { motion, AnimatePresence } from 'framer-motion';

// Import apps
import { Terminal } from '../apps/Terminal';
import { Explorer } from '../apps/Explorer';
import { TextEditor } from '../apps/TextEditor';
import { Settings } from '../apps/Settings';

interface WindowProps {
  id: string;
}

export const Window: React.FC<WindowProps> = ({ id }) => {
  const windowState = useWindowStore((state) => state.windows[id]);
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateSize,
    activeWindowId
  } = useWindowStore();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (windowState && !windowState.isMinimized) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [windowState?.isMinimized]);

  if (!windowState) {
    return null;
  }

  const isActive = activeWindowId === id;

  const handleDragStop: RndDragCallback = (_e, d) => {
    updatePosition(id, { x: d.x, y: d.y });
  };

  const handleResizeStop: RndResizeCallback = (_e, _direction, ref, _delta, position) => {
    updateSize(id, {
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    });
    updatePosition(id, position);
  };

  // Render app by component (appId)
  const renderApp = (appId: string) => {
    switch (appId) {
      case 'Terminal':
        return <Terminal {...(windowState.props || {})} />;
      case 'Explorer':
        return <Explorer {...(windowState.props || {})} />;
      case 'TextEditor':
        return <TextEditor {...(windowState.props || {})} />;
      case 'Settings':
        return <Settings {...(windowState.props || {})} />;
      case 'Welcome':
        return (
          <div className="flex flex-col items-center justify-center h-full text-black bg-white">
            <h2 className="text-2xl font-bold mb-2 uppercase">Welcome!</h2>
            <p className="font-bold">Your new brutalist desktop is ready.</p>
          </div>
        );
      default:
        return <div className="p-4 font-bold">Placeholder for: {appId}</div>;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Rnd
          size={
            windowState.isMaximized
              ? { width: '100%', height: '100%' }
              : { width: windowState.size.width, height: windowState.size.height }
          }
          position={
            windowState.isMaximized
              ? { x: 0, y: 0 }
              : { x: windowState.position.x, y: windowState.position.y }
          }
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          disableDragging={windowState.isMaximized}
          enableResizing={!windowState.isMaximized}
          minWidth={200}
          minHeight={150}
          bounds="parent"
          dragHandleClassName="window-titlebar"
          onMouseDown={() => focusWindow(id)}
          style={{ zIndex: windowState.zIndex, display: isVisible ? 'block' : 'none' }}
          className={`flex flex-col ${isActive ? '' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={`w-full h-full flex flex-col bg-white brutalist-border overflow-hidden transition-shadow ${
              isActive ? 'brutalist-shadow' : 'brutalist-shadow-sm'
            }`}
          >
            {/* Title Bar */}
            <div 
              className={`window-titlebar flex items-center justify-between px-3 py-1 select-none border-b-4 border-black cursor-grab active:cursor-grabbing ${
                isActive ? 'bg-[#ff00ff] text-black' : 'bg-gray-300 text-gray-700'
              }`}
              onDoubleClick={() => maximizeWindow(id)}
            >
              <div className="flex-1 font-bold text-sm truncate uppercase tracking-tighter">
                {windowState.title}
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  className="hover:bg-white p-1 brutalist-border bg-gray-200 transition-colors flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px]"
                  title="Minimize"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                  className="hover:bg-white p-1 brutalist-border bg-gray-200 transition-colors flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px]"
                  title={windowState.isMaximized ? "Restore" : "Maximize"}
                >
                  <Square size={10} strokeWidth={3} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                  className="hover:bg-red-500 hover:text-white p-1 brutalist-border bg-red-400 transition-colors flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px]"
                  title="Close"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-white relative">
              {renderApp(windowState.component)}
              
              {/* Overlay to catch clicks when window is not active, helpful if content has iframes */}
              {!isActive && (
                <div className="absolute inset-0 z-10 bg-transparent" />
              )}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
};
