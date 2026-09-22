import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { apiClient } from '../lib/apiClient';

const defaultUser: UserProfile = {
  name: 'Candidate',
  role: 'Candidate',
  email: '',
  interviewsCompleted: 0,
  overallScore: 0,
  scoreChange: 0,
  codingStreak: 0,
  skills: []
};

const sanitizeStoredUser = (saved: string | null): UserProfile => {
  if (!saved) return defaultUser;
  try {
    const parsed = JSON.parse(saved);
    // If the saved user has old mock data (78 score, 3 interviews, 5 streak, or "Student" role, or unsplash avatar)
    const isOldMock = (parsed.overallScore === 78 && parsed.interviewsCompleted === 3) || parsed.role === 'Student';
    return {
      name: parsed.name && parsed.name !== 'Devansh Sharma' ? parsed.name : defaultUser.name,
      role: parsed.role && parsed.role !== 'Student' ? parsed.role : 'Candidate',
      email: parsed.email && parsed.email !== 'devansh.sharma@example.com' ? parsed.email : defaultUser.email,
      interviewsCompleted: isOldMock ? 0 : (parsed.interviewsCompleted || 0),
      overallScore: isOldMock ? 0 : (parsed.overallScore || 0),
      scoreChange: isOldMock ? 0 : (parsed.scoreChange || 0),
      codingStreak: isOldMock ? 0 : (parsed.codingStreak || 0),
      skills: parsed.skills || [],
      avatarUrl: parsed.avatarUrl && !parsed.avatarUrl.includes('unsplash.com') ? parsed.avatarUrl : undefined
    };
  } catch {
    return defaultUser;
  }
};

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string, name?: string) => Promise<boolean> | boolean;
  signup: (name: string, email: string, pass: string) => Promise<boolean> | boolean;
  logout: () => Promise<void> | void;
  updateUserScore: (newScore: number) => void;
  syncUserStats: (stats: { overallScore?: number; interviewsCompleted?: number; scoreChange?: number; codingStreak?: number }) => void;
  isSupabaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'skillcraft_active_user';
const AUTH_STORAGE_KEY = 'skillcraft_is_authenticated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return sanitizeStoredUser(saved);
    } catch {
      return defaultUser;
    }
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
    return false;
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

  const deriveDisplayName = (emailStr: string, explicitName?: string): string => {
    if (explicitName && explicitName.trim()) {
      return explicitName.trim();
    }
    if (!emailStr) return 'Candidate';
    const prefix = emailStr.split('@')[0];
    const formatted = prefix
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return formatted || 'Candidate';
  };

  const login = async (email: string, pass: string, name?: string): Promise<boolean> => {
    const displayName = deriveDisplayName(email, name);
    if (isSupabaseConfigured && supabase) {
      if (email === 'demo@skillcraft.ai' && pass === 'demo123') {
        // Bypass Supabase for demo credentials, let it fall through to local dev fallback
      } else {
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
              name: data.user.user_metadata?.name || displayName,
            }));
            return true;
          }
        } catch (err: any) {
          console.warn('[Supabase Auth] Login error:', err);
          if (err.message === 'Email not confirmed') {
            throw new Error('Please check your inbox and confirm your email address to log in.');
          }
          throw err;
        }
      }
    }

    // Local / Dev mode fallback
    if (email && pass) {
      setUser((prev) => {
        const isOldMock = (prev.overallScore === 78 && prev.interviewsCompleted === 3) || prev.role === 'Student';
        return {
          ...defaultUser,
          email: email.trim(),
          name: displayName,
          role: 'Candidate',
          interviewsCompleted: isOldMock ? 0 : (prev.interviewsCompleted || 0),
          overallScore: isOldMock ? 0 : (prev.overallScore || 0),
          scoreChange: isOldMock ? 0 : (prev.scoreChange || 0),
          codingStreak: isOldMock ? 0 : (prev.codingStreak || 0),
        };
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    const displayName = deriveDisplayName(email, name);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name: displayName },
          },
        });
        if (error) throw error;

        if (data.user) {
          setIsAuthenticated(true);
          setUser({
            ...defaultUser,
            name: displayName,
            email: email.trim(),
            role: 'Candidate',
            interviewsCompleted: 0,
            overallScore: 0,
            scoreChange: 0,
            codingStreak: 0,
          });
          return true;
        }
      } catch (err: any) {
        console.warn('[Supabase Auth] Signup error:', err);
        const errMsg = err.message?.toLowerCase() || '';
        if (errMsg.includes('rate limit') || errMsg.includes('already registered') || errMsg.includes('already exists')) {
          console.log('[Supabase Auth] Attempting auto-login as fallback...');
          try {
            return await login(email, pass, name);
          } catch (loginErr) {
            throw loginErr;
          }
        }
        if (errMsg.includes('email signups are disabled')) {
          throw new Error('Email signups are currently disabled in your Supabase project. Please enable the Email provider in your Supabase Dashboard (Authentication -> Providers -> Email).');
        }
        throw err;
      }
    }

    // Local / Dev mode fallback
    if (name && email && pass) {
      setUser({
        ...defaultUser,
        name: displayName,
        email: email.trim(),
        role: 'Candidate',
        interviewsCompleted: 0,
        overallScore: 0,
        scoreChange: 0,
        codingStreak: 0,
      });
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
    setUser(defaultUser);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const updateUserScore = (newScore: number) => {
    setUser((prev) => ({
      ...prev,
      overallScore: newScore,
      interviewsCompleted: prev.interviewsCompleted + 1,
    }));
  };

  const syncUserStats = (stats: { overallScore?: number; interviewsCompleted?: number; scoreChange?: number; codingStreak?: number }) => {
    setUser((prev) => ({
      ...prev,
      ...stats
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
        syncUserStats,
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
