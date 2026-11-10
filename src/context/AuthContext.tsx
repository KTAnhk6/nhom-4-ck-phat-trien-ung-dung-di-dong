/**
 * Auth Context (Assigned to: Tuấn Anh)
 * Global authentication state, session persistence, and profile operations.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Role, User } from '../types';
import { GUEST_USER, storageService } from '../services/storageService';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, passwordPlain: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  register: (data: { username: string; email: string; fullName: string; phone: string; passwordPlain: string; role?: Role }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (emailOrPhone: string, newPasswordPlain: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
  logout: () => Promise<void>;
  switchDemoUser: (role: 'admin' | 'user' | 'guest') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      await storageService.initialize();
      const user = await storageService.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, passwordPlain: string) => {
    setIsLoading(true);
    const result = await authService.login(usernameOrEmail, passwordPlain);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    const result = await authService.loginAsGuest();
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    setIsLoading(false);
  };

  const register = async (data: {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    passwordPlain: string;
    role?: Role;
  }) => {
    setIsLoading(true);
    const result = await authService.register(data);
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  const resetPassword = async (emailOrPhone: string, newPasswordPlain: string) => {
    return await authService.resetPassword(emailOrPhone, newPasswordPlain);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return null;
    if (currentUser.role === 'guest') return currentUser;
    const updated = await authService.updateProfile(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
    return updated;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Shortcut for presentation / testing: quick switch between admin, user and guest
  const switchDemoUser = async (role: 'admin' | 'user' | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(GUEST_USER);
      await storageService.saveCurrentUser(GUEST_USER);
      return;
    }
    const users = await storageService.getUsers();
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      await storageService.saveCurrentUser(target);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isGuest = currentUser?.role === 'guest';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isGuest,
        isLoading,
        login,
        loginAsGuest,
        register,
        resetPassword,
        updateProfile,
        logout,
        switchDemoUser,
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
