import { create } from 'zustand';

type ThemeStore = {
  mode: 'light' | 'dark';
  leftDrawerOpen: boolean;
  leftDrawerWidth: number;
  rightWidth: number;
  topBarHeight: number;
  setLeftDrawerOpen: () => void;
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'light',
  leftDrawerOpen: false,
  // leftDrawerWidth: 250,
  leftDrawerWidth: 60,
  rightWidth: 10,
  topBarHeight: 70,
  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === 'light' ? 'dark' : 'light',
    })),
  setMode: (mode: 'light' | 'dark') =>
    set({
      mode,
    }),
  setLeftDrawerOpen: () => {
    const { leftDrawerOpen } = get();
    if (leftDrawerOpen) {
      set(() => ({
        leftDrawerOpen: false,
        leftDrawerWidth: 60,
      }));
    } else {
      set(() => ({
        leftDrawerOpen: true,
        leftDrawerWidth: 250,
      }));
    }
  },
}));
