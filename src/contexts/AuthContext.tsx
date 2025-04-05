
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("kickverse-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This would connect to Supabase in a real implementation
      // For now, we'll simulate a login
      if (email && password) {
        const mockUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0],
        };
        setUser(mockUser);
        localStorage.setItem("kickverse-user", JSON.stringify(mockUser));
        toast.success("Successfully logged in!");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // This would connect to Supabase in a real implementation
      // For now, we'll simulate a signup
      if (email && password) {
        const mockUser = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name: name || email.split("@")[0],
        };
        setUser(mockUser);
        localStorage.setItem("kickverse-user", JSON.stringify(mockUser));
        toast.success("Account created successfully!");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kickverse-user");
    toast.success("Successfully logged out!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
