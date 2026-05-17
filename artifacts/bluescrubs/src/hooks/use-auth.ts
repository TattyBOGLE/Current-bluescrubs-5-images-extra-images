import { useState, useEffect, createContext, useContext } from "react";
import { authApi } from "@/lib/auth";
import type { User, InsertUser } from "@shared/schema";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: InsertUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, create a default user
    const initializeAuth = async () => {
      try {
        // Check localStorage for saved user
        const savedUser = localStorage.getItem("plabmaster_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load saved user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await authApi.login(email, password);
      setUser(user);
      localStorage.setItem("plabmaster_user", JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: InsertUser) => {
    setIsLoading(true);
    try {
      const { user } = await authApi.register(userData);
      setUser(user);
      localStorage.setItem("plabmaster_user", JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("plabmaster_user");
    authApi.logout().catch(console.error);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
}
