import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  userId: string | null;
  setLoggedIn: (userId: string, username: string) => void;
  setLoggedOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        username: null,
        token: null,
        userId: null,
        setLoggedIn: (userId, username) => set({ isAuthenticated: true, userId, username }),
        setLoggedOut: () => set({ isAuthenticated: false }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          userId: state.userId,
          username: state.username,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);

export default useAuthStore;
