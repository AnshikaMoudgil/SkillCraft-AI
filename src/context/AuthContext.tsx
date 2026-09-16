import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';
import { mockUser } from '../data/mockUser';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUserScore: (newScore: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const login = (email: string, pass: string): boolean => {
    if (email && pass) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    if (name && email && pass) {
      setUser((prev) => ({ ...prev, name, email }));
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
