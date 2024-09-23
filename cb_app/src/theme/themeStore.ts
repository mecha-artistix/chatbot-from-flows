import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IThemeStore } from '../types/mui';

export const themeStore: StateCreator<IThemeStore> = (set, get) => ({
  mode: 'light',
  leftDrawerOpen: true,
  leftDrawerWidth: 250,
  // leftDrawerWidth: 60,
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
});

const useThemeStore = create<IThemeStore>()(
  devtools(
    persist(themeStore, {
      name: 'ThemeStore',
      partialize: (state) => ({
        mode: state.mode,
        leftDrawerOpen: state.leftDrawerOpen,
        leftDrawerWidth: state.leftDrawerWidth,
        rightWidth: state.rightWidth,
        topBarHeight: state.topBarHeight,
      }),
    }),
  ),
);

export default useThemeStore;
