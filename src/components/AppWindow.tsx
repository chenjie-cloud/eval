import { useEffect, useState } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import type { AppConfig } from '../store/desktopStore';
import { useWindowStore } from '../store/useWindowStore';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import { X, Minus, Square, Copy } from 'lucide-react';

const WindowComponent = ({ app, index }: { app: AppConfig; index: number }) => {
  const { windows, open, close, minimize, maximize, focus } = useWindowStore();
  const { activeAppId, focusApp, closeApp } = useDesktopStore();
  const windowState = windows[app.id];

  const dragControls = useDragControls();
  const x = useMotionValue(50 + index * 30);
  const y = useMotionValue(50 + index * 30);
  const [size, setSize] = useState({ width: 600, height: 400 });

  // Initialize window in store
  useEffect(() => {
    if (!windows[app.id]) {
      open(app.id, app.name);
    }
  }, [app.id, app.name, open, windows]);

  // Sync focus from desktopStore
  useEffect(() => {
    if (activeAppId === app.id && windowState?.isMinimized) {
      focus(app.id);
    }
  }, [activeAppId, app.id, focus, windowState?.isMinimized]);

  if (!windowState || windowState.isMinimized) {
    return null;
  }

  const isMaximized = windowState.isMaximized;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    close(app.id);
    closeApp(app.id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimize(app.id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    maximize(app.id);
  };

  const handleFocus = () => {
    focus(app.id);
    focusApp(app.id);
  };

  const startResize = (e: React.PointerEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = x.get();
    const startPosY = y.get();

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('e')) newWidth = Math.max(300, startWidth + dx);
      if (direction.includes('s')) newHeight = Math.max(200, startHeight + dy);
      if (direction.includes('w')) {
        newWidth = Math.max(300, startWidth - dx);
        if (newWidth > 300) newX = startPosX + dx;
      }
      if (direction.includes('n')) {
        newHeight = Math.max(200, startHeight - dy);
        if (newHeight > 200) newY = startPosY + dy;
      }

      setSize({ width: newWidth, height: newHeight });
      x.set(newX);
      y.set(newY);
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const resizeHandles = [
    { dir: 'n', className: 'absolute top-0 left-0 right-0 h-1 cursor-n-resize z-50' },
    { dir: 's', className: 'absolute bottom-0 left-0 right-0 h-1 cursor-s-resize z-50' },
    { dir: 'e', className: 'absolute top-0 bottom-0 right-0 w-1 cursor-e-resize z-50' },
    { dir: 'w', className: 'absolute top-0 bottom-0 left-0 w-1 cursor-w-resize z-50' },
    { dir: 'nw', className: 'absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-50' },
    { dir: 'ne', className: 'absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-50' },
    { dir: 'sw', className: 'absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-50' },
    { dir: 'se', className: 'absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onPointerDown={handleFocus}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x: isMaximized ? 0 : x,
        y: isMaximized ? 0 : y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        zIndex: windowState.zIndex,
      }}
      className={`absolute bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200 backdrop-blur-md bg-opacity-95 ${
        isMaximized ? 'inset-0 !w-full !h-full !rounded-none' : ''
      }`}
    >
      {/* Resize Handles */}
      {!isMaximized && resizeHandles.map((handle) => (
        <div
          key={handle.dir}
          className={handle.className}
          onPointerDown={(e) => startResize(e, handle.dir)}
        />
      ))}

      {/* Window Titlebar */}
      <div 
        className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200 select-none cursor-default"
        onPointerDown={(e) => {
          handleFocus();
          dragControls.start(e);
        }}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center space-x-2 pointer-events-none">
          <app.icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{windowState.title}</span>
        </div>
        <div className="flex items-center space-x-3 pointer-events-auto">
          <button 
            onClick={handleMinimize}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleMaximize}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 bg-white overflow-hidden relative flex flex-col">
        {app.component ? (
          <app.component />
        ) : (
          <div className="flex-1 p-6 flex items-center justify-center text-gray-400 overflow-auto">
            <div className="text-center space-y-4">
              <app.icon className="w-16 h-16 mx-auto text-gray-200" />
              <p>{app.name} content goes here...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const AppWindow = () => {
  const { openApps } = useDesktopStore();

  return (
    <>
      <AnimatePresence>
        {openApps.map((app, index) => (
          <WindowComponent key={app.id} app={app} index={index} />
        ))}
      </AnimatePresence>
    </>
  );
};
