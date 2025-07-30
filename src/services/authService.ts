import { handleApiError } from './api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import Cookies from 'js-cookie';

export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  // Login user
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Mock implementation - replace with actual API call
      const mockResponse = await this.mockLogin(credentials);
      
      // Store tokens
      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      this.setUser(mockResponse.user);

      return { user: mockResponse.user, token: mockResponse.token };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Register new user
  static async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      // Mock implementation - replace with actual API call
      const mockResponse = await this.mockRegister(credentials);
      
      // Store tokens
      this.setTokens(mockResponse.token, mockResponse.refreshToken);
      this.setUser(mockResponse.user);

      return { user: mockResponse.user, token: mockResponse.token };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      // await backendApi.post('/auth/logout');
      
      // Clear local storage
      this.clearTokens();
      this.clearUser();
    } catch (error) {
      // Even if backend call fails, clear local data
      this.clearTokens();
      this.clearUser();
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Refresh authentication token
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Mock implementation - replace with actual API call
      const response = await this.mockRefreshToken(refreshToken);
      
      this.setTokens(response.token, response.refreshToken);
      return response.token;
    } catch (error) {
      this.clearTokens();
      this.clearUser();
      return handleApiError(error);
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      // Mock implementation - replace with actual API call
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Change password
  static async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // await backendApi.post('/auth/change-password', {
      //   currentPassword,
      //   newPassword
      // });
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Request password reset
  static async requestPasswordReset(_email: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // await backendApi.post('/auth/forgot-password', { email });
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Private helper methods
  private static setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    
    // Also set as httpOnly cookie for additional security
    Cookies.set(this.TOKEN_KEY, token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  private static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    Cookies.remove(this.TOKEN_KEY);
  }

  private static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private static clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Mock implementations (replace with actual API calls)
  private static async mockLogin(credentials: LoginCredentials): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          email: credentials.email,
          username: 'demo_user',
          firstName: 'Demo',
          lastName: 'User',
          avatar: '/avatar.jpg',
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
            searchHistory: true,
          },
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
    }

    throw new Error('Invalid credentials');
  }

  private static async mockRegister(credentials: RegisterCredentials): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (credentials.email && credentials.password && credentials.firstName && credentials.lastName) {
      return {
        user: {
          id: Date.now().toString(),
          email: credentials.email,
          username: credentials.username,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
            searchHistory: true,
          },
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
    }

    throw new Error('Registration failed');
  }

  private static async mockRefreshToken(_refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }
}
