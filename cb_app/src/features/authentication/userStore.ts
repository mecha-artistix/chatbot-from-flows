import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { logoutPost } from './services/AuthenticationCalls';

const URL: string = import.meta.env.VITE_NODE_BASE_API + '/users';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  userId: string | null;
  verify: () => Promise<void>;
  login: (credentials: LoginCreds) => Promise<void>;
  signup: (credentials: SignupCreds) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        username: null,
        token: null,
        userId: null,
        verify: async () => {
          try {
            const response = await fetch(URL + '/verify', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });
            if (!response.ok) {
              // Set authentication to false if the response is not ok
              set({
                isAuthenticated: false,
              });
              throw new Error('Response not ok');
            }
            const data = await response.json();
            if (response.status == 200) {
              const user = data.user;
              set({
                isAuthenticated: true,
                token: user.token,
                userId: user._id,
                username: user.username,
              });
            }
          } catch (error) {
            console.log(error);
          }
        },
        login: async (credentials) => {
          try {
            const response = await fetch(URL + '/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
              credentials: 'include',
            });
            if (!response.ok) throw new Error('Response not ok');
            if (response.status !== 200) {
              throw new Error('Invalid credentials or server error');
            }
            const data = await response.json();
            if (response.status === 200) {
              const user = data.data.user;
              set({
                isAuthenticated: true,
                token: user.token,
                userId: user._id,
                username: user.username,
              });
            }
          } catch (error) {
            console.error(error);
            // Handle the error as needed
          }
        },
        signup: async (credentials) => {
          try {
            const response = await fetch(URL + '/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
              credentials: 'include',
            });
            if (!response.ok) throw new Error('Response not ok');
            if (response.status !== 201) {
              throw new Error('Invalid credentials or server error');
            }
            const data = await response.json();
            const user = data.data.user;
            set({
              isAuthenticated: true,
              token: user.token,
              userId: user._id,
              username: user.username,
            });
          } catch (error) {
            console.error(error);
            // Handle the error as needed
          }
        },
        logout: async () => {
          try {
            const response = await fetch(URL + '/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
            if (!response.ok) throw new Error(response);

            const data = await response.json();

            set({
              isAuthenticated: false,
              token: '',
              userId: '',
              username: '',
            });
          } catch (error) {
            return error;
          }
        },
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
