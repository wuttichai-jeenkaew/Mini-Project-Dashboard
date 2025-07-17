"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;

// Define User type
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define Auth Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      await axios.post("/api/auth/login", { email, password, rememberMe });
      await checkAuth(); // ดึง user profile ที่มี name
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still clear user state
      setUser(null);
    }
  };

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-600/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-emerald-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 animate-spin animate-reverse"></div>
              <div className="absolute inset-4 w-12 h-12 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      // Redirect to login if not authenticated
      if (typeof window !== "undefined") {
        window.location.href = "/pages/login";
      }
      return null;
    }

    return <Component {...props} />;
  };
}
