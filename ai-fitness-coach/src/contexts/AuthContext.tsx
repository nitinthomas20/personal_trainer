import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, AuthResponse } from '../services/api/backend';

interface AuthUser {
  id: string;
  email: string;
  onboarded: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setOnboarded: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data: any) => {
        setUser({ id: data._id, email: data.email, onboarded: data.onboarded });
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuthResponse = (res: AuthResponse) => {
    localStorage.setItem('token', res.token);
    setUser(res.user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    handleAuthResponse(res);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await authApi.register(email, password);
    handleAuthResponse(res);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const setOnboarded = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, onboarded: true } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setOnboarded }}>
      {children}
    </AuthContext.Provider>
  );
};
