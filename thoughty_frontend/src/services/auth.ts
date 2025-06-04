import { API_BASE_URL } from "./api";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  re_password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
      first_name?: string;
      last_name?: string;
      avatar?: string;
      is_guest?: boolean;
      bio?: string;
      tokens?: number;
      badges?: any[];
      birth_date?: string;
      date_joined?: string;
    };
    access: string;
    refresh: string;
  };
  errors?: {
    [key: string]: string[];
  };
}

class AuthService {
  private async makeRequest(
    endpoint: string,
    options: RequestInit
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "An error occurred",
          errors: data.errors,
        };
      }

      return {
        success: true,
        message: data.message || "Success",
        data: data.data || data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest("/auth/users/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<AuthResponse> {
    const token = this.getToken();
    return this.makeRequest("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.makeRequest("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    return this.makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    return this.makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem("refresh_token", refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  removeTokens(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User data management
  setUser(user: unknown): void {
    localStorage.setItem("user_data", JSON.stringify(user));
  }

  getUser(): unknown | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  removeUser(): void {
    localStorage.removeItem("user_data");
  }

  // Complete logout
  clearSession(): void {
    this.removeTokens();
    this.removeUser();
  }
}

export const authService = new AuthService();
export default authService;
