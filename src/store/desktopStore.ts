import { create } from 'zustand';
import React from 'react';

import type { LucideIcon } from 'lucide-react';

export interface AppConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  component?: React.ComponentType;
}

export interface DesktopState {
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  openApps: AppConfig[];
  activeAppId: string | null;
  openApp: (app: AppConfig) => void;
  closeApp: (appId: string) => void;
  focusApp: (appId: string) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  openApps: [],
  activeAppId: null,

  openApp: (app) =>
    set((state) => {
      const isAlreadyOpen = state.openApps.find((a) => a.id === app.id);
      if (isAlreadyOpen) {
        return { activeAppId: app.id, isStartMenuOpen: false };
      }
      return {
        openApps: [...state.openApps, app],
        activeAppId: app.id,
        isStartMenuOpen: false,
      };
    }),

  closeApp: (appId) =>
    set((state) => {
      const newOpenApps = state.openApps.filter((a) => a.id !== appId);
      return {
        openApps: newOpenApps,
        activeAppId: state.activeAppId === appId 
          ? (newOpenApps.length > 0 ? newOpenApps[newOpenApps.length - 1].id : null) 
          : state.activeAppId,
      };
    }),

  focusApp: (appId) => set({ activeAppId: appId, isStartMenuOpen: false }),
}));
