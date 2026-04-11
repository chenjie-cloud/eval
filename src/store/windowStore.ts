import { create } from 'zustand';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: Position;
  size: Size;
  zIndex: number;
  props?: any;
}

interface WindowStoreState {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  highestZIndex: number;
  openWindow: (id: string, title: string, component: string, initialSize?: Size, props?: any) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;
}

export const useWindowStore = create<WindowStoreState>((set) => ({
  windows: {},
  activeWindowId: null,
  highestZIndex: 10,

  openWindow: (id, title, component, initialSize = { width: 600, height: 400 }, props) =>
    set((state) => {
      const newZIndex = state.highestZIndex + 1;
      
      if (state.windows[id]) {
        // If window exists, just focus and restore it
        return {
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isOpen: true,
              isMinimized: false,
              zIndex: newZIndex,
              props: props !== undefined ? props : state.windows[id].props,
            },
          },
          highestZIndex: newZIndex,
          activeWindowId: id,
        };
      }

      // Otherwise, create new window
      const newWindow: WindowState = {
        id,
        title,
        component,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + Object.keys(state.windows).length * 30, y: 100 + Object.keys(state.windows).length * 30 },
        size: initialSize,
        zIndex: newZIndex,
        props,
      };

      return {
        windows: {
          ...state.windows,
          [id]: newWindow,
        },
        highestZIndex: newZIndex,
        activeWindowId: id,
      };
    }),

  closeWindow: (id) =>
    set((state) => {
      const newWindows = { ...state.windows };
      delete newWindows[id];
      return {
        windows: newWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    }),

  focusWindow: (id) =>
    set((state) => {
      if (!state.windows[id] || state.activeWindowId === id) return state;

      const newZIndex = state.highestZIndex + 1;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            zIndex: newZIndex,
            isMinimized: false,
          },
        },
        highestZIndex: newZIndex,
        activeWindowId: id,
      };
    }),

  minimizeWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state;
      
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMinimized: true,
          },
        },
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    }),

  maximizeWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state;
      
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMaximized: !state.windows[id].isMaximized,
          },
        },
      };
    }),

  updatePosition: (id, position) =>
    set((state) => {
      if (!state.windows[id]) return state;
      
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            position,
          },
        },
      };
    }),

  updateSize: (id, size) =>
    set((state) => {
      if (!state.windows[id]) return state;
      
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            size,
          },
        },
      };
    }),
}));
