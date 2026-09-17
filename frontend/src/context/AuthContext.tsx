import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { mockUser } from '../data/mockUser';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string, name?: string) => Promise<boolean> | boolean;
  signup: (name: string, email: string, pass: string) => Promise<boolean> | boolean;
  logout: () => Promise<void> | void;
  updateUserScore: (newScore: number) => void;
  isSupabaseActive: boolean;
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

  // Supabase Auth session listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        // Sync profile with backend
        apiClient.get<UserProfile>('/auth/me').then((profile) => {
          if (profile) {
            setUser((prev) => ({ ...prev, ...profile }));
          }
        }).catch(() => {
          setUser((prev) => ({
            ...prev,
            email: session.user.email,
            name: session.user.user_metadata?.name || prev.name,
          }));
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser((prev) => ({
          ...prev,
          email: session.user.email,
          name: session.user.user_metadata?.name || prev.name,
        }));
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const login = async (email: string, pass: string, name?: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;

        if (data.user) {
          setIsAuthenticated(true);
          setUser((prev) => ({
            ...prev,
            email,
            name: name && name.trim() ? name.trim() : (data.user.user_metadata?.name || prev.name),
          }));
          return true;
        }
      } catch (err) {
        console.warn('[Supabase Auth] Login error:', err);
        return false;
      }
    }

    // Local / Dev mode fallback
    if (email && pass) {
      setUser((prev) => ({
        ...prev,
        email,
        name: name && name.trim() ? name.trim() : prev.name,
      }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name: name.trim() },
          },
        });
        if (error) throw error;

        if (data.user) {
          setIsAuthenticated(true);
          setUser((prev) => ({
            ...prev,
            name: name.trim(),
            email: email.trim(),
          }));
          return true;
        }
      } catch (err) {
        console.warn('[Supabase Auth] Signup error:', err);
        return false;
      }
    }

    // Local / Dev mode fallback
    if (name && email && pass) {
      setUser((prev) => ({
        ...prev,
        name: name.trim(),
        email: email.trim(),
      }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Supabase Auth] Sign out error:', err);
      }
    }
    setIsAuthenticated(false);
  };

  const updateUserScore = (newScore: number) => {
    setUser((prev) => ({
      ...prev,
      overallScore: newScore,
      interviewsCompleted: prev.interviewsCompleted + 1,
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
        updateUserScore,
        isSupabaseActive: isSupabaseConfigured,
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
