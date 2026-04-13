import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  nextZIndex: number;
  open: (id: string, title: string) => void;
  close: (id: string) => void;
  minimize: (id: string) => void;
  maximize: (id: string) => void;
  focus: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  activeWindowId: null,
  nextZIndex: 1,

  open: (id: string, title: string) => set((state) => {
    const existingWindow = state.windows[id];
    const newZIndex = state.nextZIndex;

    if (existingWindow) {
      // If already open, focus it and ensure it's unminimized
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...existingWindow,
            isMinimized: false,
            zIndex: newZIndex,
          },
        },
        activeWindowId: id,
        nextZIndex: newZIndex + 1,
      };
    }

    // Open new window
    return {
      windows: {
        ...state.windows,
        [id]: {
          id,
          title,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZIndex,
        },
      },
      activeWindowId: id,
      nextZIndex: newZIndex + 1,
    };
  }),

  close: (id: string) => set((state) => {
    const newWindows = { ...state.windows };
    delete newWindows[id];

    return {
      windows: newWindows,
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    };
  }),

  minimize: (id: string) => set((state) => {
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

  maximize: (id: string) => set((state) => {
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

  focus: (id: string) => set((state) => {
    if (!state.windows[id]) return state;

    const newZIndex = state.nextZIndex;

    return {
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: false,
          zIndex: newZIndex,
        },
      },
      activeWindowId: id,
      nextZIndex: newZIndex + 1,
    };
  }),
}));
