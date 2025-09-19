// context/AuthContext.tsx - UPDATED
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { email: string; password: string; fullName: string; role: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAdmin(userData.role === 'doctor' || userData.role === 'hospital-admin');
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      // For demo purposes, check against localStorage users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email === credentials.username && u.password === credentials.password
      );

      if (user) {
        setUser(user);
        setIsAdmin(user.role === 'doctor' || user.role === 'hospital-admin');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData: { email: string; password: string; fullName: string; role: string }) => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === userData.email);
      
      if (userExists) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        password: userData.password // In real app, this should be hashed
      };

      // Save user
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Auto-login after registration
      const loginResult = await login({
        username: userData.email,
        password: userData.password
      });
      
      return loginResult;
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}