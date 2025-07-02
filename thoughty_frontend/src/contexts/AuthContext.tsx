import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import type {
    User,
    AuthContextType,
    LoginCredentials,
    RegisterData
} from '../types/auth';

// Auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      
      try {
        // Check if user is already authenticated using existing service
        if (authService.isAuthenticated()) {
          const user = authService.getUser();
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user as User });
          } else {
            dispatch({ type: 'AUTH_FAILURE' });
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  // Login function - compatible with existing auth route
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const { user, tokens } = await authService.login({
        email: credentials.email,
        password: credentials.password
      });

      // Store the user data and tokens
      authService.setUser(user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user as User });
      toast.success(`Welcome back, ${user.username}!`);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Register function - compatible with existing auth route  
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const user = await authService.register({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        re_password: userData.password,
      });

      // Auto-login after successful registration
      await login({
        email: userData.email,
        password: userData.password,
      });
      
      toast.success(`Welcome to Thoughty, ${userData.username}!`);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Create guest user function
  const createGuestUser = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Use the actual auth service to create a real guest user
      const { user, tokens } = await authService.createGuestUser();
      
      // Store the user data
      authService.setUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user as User });
      toast.success('Welcome! You\'re browsing as a guest.');
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    authService.clearSession();
    dispatch({ type: 'LOGOUT' });
    toast.info('You have been logged out.');
  };

  // Refresh token function
  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await authService.refreshToken();
      return newToken;
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      return null;
    }
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    refreshToken,
    createGuestUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
