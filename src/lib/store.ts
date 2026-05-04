'use client';
import { create } from 'zustand';

interface MuseStore {
  night: boolean;
  drawerOpen: boolean;
  activePage: string | null;
  toggleNight: () => void;
  setDrawerOpen: (v: boolean) => void;
  openPage: (page: string) => void;
  closePage: () => void;
}

export const useMuseStore = create<MuseStore>((set) => ({
  night: false,
  drawerOpen: false,
  activePage: null,
  toggleNight: () => set((s) => ({ night: !s.night })),
  setDrawerOpen: (v) => set({ drawerOpen: v }),
  openPage: (page) => set({ activePage: page, drawerOpen: false }),
  closePage: () => set({ activePage: null }),
}));
