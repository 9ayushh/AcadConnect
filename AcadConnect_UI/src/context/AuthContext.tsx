import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import { LoginFormData, RegisterFormData } from '../utils/validators';
import { useQueryClient } from '@tanstack/react-query';
import { setMockSessionUser, getMockSessionUser } from '../mocks/mockAdapter';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<User>;
  register: (data: RegisterFormData) => Promise<User>;
  logout: () => Promise<void>;
  switchMockUser: (mockUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Load session on startup
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (import.meta.env.VITE_USE_MOCKS === 'true') {
          const mockUser = getMockSessionUser();
          if (mockUser && mounted) {
            setUser(mockUser);
            setIsLoading(false);
            return;
          }
        }

        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (data: LoginFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      setUser(res.user);
      if (import.meta.env.VITE_USE_MOCKS === 'true') {
        setMockSessionUser(res.user);
      }
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      if (import.meta.env.VITE_USE_MOCKS === 'true') {
        setMockSessionUser(res.user);
      }
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Ignore network failure on logout
    } finally {
      // Invalidate and clear all TanStack Query caches
      queryClient.clear();
      setUser(null);
      if (import.meta.env.VITE_USE_MOCKS === 'true') {
        setMockSessionUser(null);
      }
    }
  };

  const switchMockUser = (mockUser: User) => {
    setMockSessionUser(mockUser);
    setUser(mockUser);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchMockUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
