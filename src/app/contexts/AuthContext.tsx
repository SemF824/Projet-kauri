import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, SERVER_URL, authHeaders, pinToPassword } from '../../utils/supabase';

export interface KauriUserProfile {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  accountType: 'particulier' | 'professionnel';
  trustScore: number;
  balance: number;
  currency: string;
  businessName?: string;
  kycCompleted: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: KauriUserProfile | null;
  loading: boolean;
  signIn: (phone: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Build a minimal profile from Supabase user_metadata so the UI never shows "Vous"
function profileFromMeta(user: User): KauriUserProfile {
  const m = user.user_metadata ?? {};
  return {
    id: user.id,
    phone: m.phone ?? '',
    firstName: m.firstName ?? m.full_name?.split(' ')[0] ?? 'Utilisateur',
    lastName: m.lastName ?? m.full_name?.split(' ').slice(1).join(' ') ?? '',
    accountType: m.accountType ?? 'particulier',
    businessName: m.businessName,
    trustScore: 3.5,
    balance: 0,
    currency: 'EUR',
    kycCompleted: false,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<KauriUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (accessToken: string, fallbackUser?: User) => {
    try {
      const res = await fetch(`${SERVER_URL}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        // Merge: prefer KV data but fill blanks from metadata
        if (fallbackUser && (!data.firstName || data.firstName === 'Utilisateur')) {
          const meta = profileFromMeta(fallbackUser);
          setProfile({ ...meta, ...data, firstName: data.firstName || meta.firstName, lastName: data.lastName || meta.lastName });
        } else {
          setProfile(data);
        }
      } else if (fallbackUser) {
        // KV fetch failed — use metadata profile so name is always shown
        setProfile(profileFromMeta(fallbackUser));
      }
    } catch (e) {
      console.error('Failed to fetch profile:', e);
      if (fallbackUser) setProfile(profileFromMeta(fallbackUser));
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Show metadata-based profile immediately, then enrich from KV
        setProfile(profileFromMeta(session.user));
        fetchProfile(session.access_token, session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile(profileFromMeta(session.user)); // immediate
        fetchProfile(session.access_token, session.user);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (phone: string, pin: string) => {
    const supabase = getSupabase();
    const clean = phone.replace(/[\s\-\(\)]/g, '');
    const normalized = clean.startsWith('+') ? clean : `+33${clean.replace(/^0/, '')}`;
    const email = `${normalized}@kauri.app`;
    const password = pinToPassword(pin);

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Account doesn't exist yet — create it then sign in
    if (error && error.message.toLowerCase().includes('invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw new Error(signUpError.message);
      const retry = await supabase.auth.signInWithPassword({ email, password });
      data = retry.data;
      error = retry.error;
    }

    if (error) throw new Error(error.message);
    if (data.user) setProfile(profileFromMeta(data.user));
    if (data.session?.access_token) {
      await fetchProfile(data.session.access_token, data.user ?? undefined);
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setProfile(null);
    localStorage.removeItem('kauri_account_type');
  };

  const refreshProfile = async () => {
    const headers = await authHeaders();
    const res = await fetch(`${SERVER_URL}/user/profile`, { headers });
    if (res.ok) {
      const data = await res.json();
      setProfile(prev => {
        // Keep the metadata-derived firstName if KV returns a blank
        if (prev && (!data.firstName || data.firstName === 'Utilisateur') && prev.firstName) {
          return { ...data, firstName: prev.firstName, lastName: prev.lastName };
        }
        return data;
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
