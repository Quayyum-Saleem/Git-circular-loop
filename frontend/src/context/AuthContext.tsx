import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; location?: string }) => Promise<void>;
  demoLogin: (role: 'student' | 'repairer' | 'coordinator') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('circularloop_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('circularloop_token')) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch {
      localStorage.removeItem('circularloop_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('circularloop_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      success(`Welcome back, ${res.user.full_name}!`);
    } catch (err: any) {
      error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data: { email: string; password: string; full_name: string; location?: string }) => {
    try {
      const res = await api.register(data);
      localStorage.setItem('circularloop_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      success(`Welcome to CircularLoop, ${res.user.full_name}! Earned 50 welcome points.`);
    } catch (err: any) {
      error(err.message || 'Registration failed');
      throw err;
    }
  };

  const demoLogin = async (role: 'student' | 'repairer' | 'coordinator') => {
    try {
      const res = await api.demoLogin(role);
      localStorage.setItem('circularloop_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      const roleLabel = role === 'student' ? 'Student Maya' : role === 'repairer' ? 'Repair Specialist Alex' : 'Coordinator Sam';
      success(`Logged in as demo ${roleLabel}`);
    } catch (err: any) {
      error(err.message || 'Demo login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('circularloop_token');
    setToken(null);
    setUser(null);
    success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
