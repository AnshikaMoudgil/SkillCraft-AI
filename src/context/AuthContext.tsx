import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { mockUser } from '../data/mockUser';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string, name?: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUserScore: (newScore: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'skillcraft_active_user';
const AUTH_STORAGE_KEY = 'skillcraft_is_authenticated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...mockUser, ...parsed };
      }
    } catch {
      // ignore
    }
    return mockUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // ignore
    }
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const login = (email: string, pass: string, name?: string): boolean => {
    if (email && pass) {
      setUser((prev) => ({
        ...prev,
        email,
        name: name && name.trim() ? name.trim() : prev.name
      }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    if (name && email && pass) {
      setUser((prev) => ({
        ...prev,
        name: name.trim(),
        email: email.trim()
      }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUserScore = (newScore: number) => {
    setUser((prev) => ({
      ...prev,
      overallScore: newScore,
      interviewsCompleted: prev.interviewsCompleted + 1
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUserScore
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
