'use client';
import { create } from 'zustand';

interface MuseStore {
  night: boolean;
  drawerOpen: boolean;
  activePage: string | null;
  sanctuaryDraft: { body: string } | null;
  signInOpen: boolean;
  toggleNight: () => void;
  setDrawerOpen: (v: boolean) => void;
  openPage: (page: string) => void;
  openSanctuary: (draft?: { body: string }) => void;
  closePage: () => void;
  clearDraft: () => void;
  setSignInOpen: (v: boolean) => void;
}

export const useMuseStore = create<MuseStore>((set) => ({
  night: false,
  drawerOpen: false,
  activePage: null,
  sanctuaryDraft: null,
  signInOpen: false,
  toggleNight: () => set((s) => ({ night: !s.night })),
  setDrawerOpen: (v) => set({ drawerOpen: v }),
  openPage: (page) => set({ activePage: page, drawerOpen: false }),
  openSanctuary: (draft) => set({ activePage: 'sanctuary', drawerOpen: false, sanctuaryDraft: draft ?? null }),
  closePage: () => set({ activePage: null }),
  clearDraft: () => set({ sanctuaryDraft: null }),
  setSignInOpen: (v) => set({ signInOpen: v }),
}));
