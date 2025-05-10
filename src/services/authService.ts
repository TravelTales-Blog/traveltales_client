import { User } from "../dtos/UserDto";

const API_BASE = "http://localhost:3000/api/auth";

export interface AuthResponse {
  token: string;
  user: User;
  csrfToken: string;
  jwtToken: string;
  error: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  },

  register: async (
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  },

  logout: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Logout failed");
    }
  }
};
