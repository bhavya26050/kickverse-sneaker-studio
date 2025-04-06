
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
    // Check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const authUser = data.session.user;
          const userData: User = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
          };
          setUser(userData);
          localStorage.setItem("kickverse-user", JSON.stringify(userData));
        } else {
          // Check localStorage for a mock user (for development)
          const storedUser = localStorage.getItem("kickverse-user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem("kickverse-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const authUser = session.user;
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        };
        setUser(userData);
        localStorage.setItem("kickverse-user", JSON.stringify(userData));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem("kickverse-user");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to mock authentication for demo
        if (email && password) {
          const mockUser = {
            id: "user-" + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
          };
          setUser(mockUser);
          localStorage.setItem("kickverse-user", JSON.stringify(mockUser));
          toast.success("Successfully logged in (mock)!");
        } else {
          throw error;
        }
      } else if (data.user) {
        toast.success("Successfully logged in!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        // Fallback to mock signup for demo
        if (email && password) {
          const mockUser = {
            id: "user-" + Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split("@")[0],
          };
          setUser(mockUser);
          localStorage.setItem("kickverse-user", JSON.stringify(mockUser));
          toast.success("Account created successfully (mock)!");
        } else {
          throw error;
        }
      } else if (data.user) {
        toast.success("Account created successfully! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("kickverse-user");
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove user from state if API call fails
      setUser(null);
      localStorage.removeItem("kickverse-user");
      toast.success("Successfully logged out!");
    }
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
