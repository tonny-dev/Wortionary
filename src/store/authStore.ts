import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types';
import { AuthService } from '@/services/authService';
import toast from 'react-hot-toast';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user } = await AuthService.login(credentials);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome back, ${user.firstName}!`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user } = await AuthService.register(credentials);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome to Wortionary, ${user.firstName}!`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await AuthService.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          toast.success('Logged out successfully');
        } catch (error) {
          // Even if logout fails on backend, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await AuthService.updateProfile(updates);
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          toast.success('Profile updated successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Update failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          toast.error(errorMessage);
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const user = AuthService.getCurrentUser();
        const isAuthenticated = AuthService.isAuthenticated();
        
        set({
          user,
          isAuthenticated,
          isLoading: false,
        });
      },

      refreshAuth: async () => {
        try {
          const token = await AuthService.refreshToken();
          const user = AuthService.getCurrentUser();
          
          set({
            user,
            isAuthenticated: !!token,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            error: 'Session expired',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
