export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  is_guest: boolean;
  bio?: string;
  tokens: number;
  badges: Badge[];
  birth_date?: string;
  date_joined: string;
  last_login?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  re_password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  createGuestUser: () => Promise<void>;
}

export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
} 