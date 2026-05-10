import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
  return data;
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{
    error: Error | null;
    requiresEmailConfirmation: boolean;
  }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function sanitizeUsername(username: string) {
  const normalized = normalizeUsername(username).replace(/[^a-z0-9_]/g, '_');
  return normalized || 'user';
}

function getBaseUsernameFromUser(user: User) {
  const metadataUsername = typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : '';
  const emailUsername = user.email ? user.email.split('@')[0] : '';
  const fallback = `user_${user.id.slice(0, 6)}`;
  return sanitizeUsername(metadataUsername || emailUsername || fallback);
}

async function createProfileForUser(user: User): Promise<Profile | null> {
  const baseUsername = getBaseUsernameFromUser(user);
  const fallbackSuffix = user.id.replace(/-/g, '').slice(0, 6);
  const usernameCandidates = [baseUsername, `${baseUsername}_${fallbackSuffix}`];

  for (const username of usernameCandidates) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        email: user.email ?? null,
      })
      .select('*')
      .maybeSingle();

    if (!error) {
      return data;
    }

    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('duplicate key') && errorMessage.includes('username')) {
      continue;
    }

    console.error('Failed to create profile:', error);
    return null;
  }

  return null;
}

async function loadOrCreateProfile(user: User): Promise<Profile | null> {
  const existing = await getProfile(user.id);
  if (existing) {
    return existing;
  }
  return createProfileForUser(user);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await loadOrCreateProfile(user);
    setProfile(profileData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadOrCreateProfile(session.user).then(setProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadOrCreateProfile(session.user).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const normalizedUsername = normalizeUsername(username);
      const email = `${normalizedUsername}@miaoda.com`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const normalizedUsername = normalizeUsername(username);
      const email = `${normalizedUsername}@miaoda.com`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: normalizedUsername,
          },
        },
      });

      if (error) throw error;
      const requiresEmailConfirmation = Boolean(data.user && !data.session);
      return { error: null, requiresEmailConfirmation };
    } catch (error) {
      return { error: error as Error, requiresEmailConfirmation: false };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
