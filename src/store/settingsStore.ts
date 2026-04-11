import { create } from 'zustand';

interface SettingsState {
  wallpaper: string;
  setWallpaper: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  wallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
  setWallpaper: (url) => set({ wallpaper: url }),
}));
