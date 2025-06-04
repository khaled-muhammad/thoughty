import api, { tokenManager } from './api';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData
} from '../types/auth';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post('/auth/jwt/create/', credentials);
    const tokens: AuthTokens = response.data;
    
    // Store tokens
    tokenManager.setTokens(tokens.access, tokens.refresh);
    
    // Get user data
    const userResponse = await api.get('/auth/users/me/');
    const user: User = userResponse.data;
    
    return { user, tokens };
  },

  // Register user
  register: async (userData: RegisterData): Promise<User> => {
    const response = await api.post('/auth/users/', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/users/me/');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<string> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/jwt/refresh/', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    tokenManager.setTokens(newAccessToken, refreshToken);
    
    return newAccessToken;
  },

  // Create guest user
  createGuestUser: async (): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post('/auth/guest/');
    const { user, tokens } = response.data;
    
    // Store tokens
    tokenManager.setTokens(tokens.access, tokens.refresh);
    
    return { user, tokens };
  },

  // Logout (clear tokens)
  logout: (): void => {
    tokenManager.clearTokens();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },

  // Verify token and get user if valid
  verifyAndGetUser: async (): Promise<User | null> => {
    try {
      if (!authService.isAuthenticated()) {
        return null;
      }

      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      // Token is invalid, clear it
      tokenManager.clearTokens();
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.patch('/auth/users/me/', userData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/users/set_password/', {
      current_password: currentPassword,
      new_password: newPassword,
      re_new_password: newPassword,
    });
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/users/reset_password/', { email });
  },

  // Confirm password reset
  confirmPasswordReset: async (uid: string, token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/users/reset_password_confirm/', {
      uid,
      token,
      new_password: newPassword,
      re_new_password: newPassword,
    });
  },
}; 