import { apiRequest } from "./queryClient";
import type { User, InsertUser } from "@shared/schema";

export interface AuthResponse {
  user: User;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/login", {
      email,
      password,
    });
    return response.json();
  },

  async register(userData: InsertUser): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return response.json();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiRequest("GET", "/api/auth/me");
      return response.json();
    } catch (error: any) {
      if (error.message.includes("401")) {
        return null;
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      // Logout can fail gracefully
      console.warn("Logout request failed:", error);
    }
  },
};
