import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, pinToPassword } from '../../utils/supabase';

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

// Construit un profil de secours si la table de la base de données est en cours de synchronisation
function profileFromMeta(user: User, dbProfile: any = null): KauriUserProfile {
  const m = user.user_metadata ?? {};
  return {
    id: user.id,
    phone: dbProfile?.phone_number ?? m.phone ?? '',
    firstName: dbProfile?.full_name?.split(' ')[0] ?? m.firstName ?? m.full_name?.split(' ')[0] ?? 'Utilisateur',
    lastName: dbProfile?.full_name?.split(' ').slice(1).join(' ') ?? m.lastName ?? m.full_name?.split(' ').slice(1).join(' ') ?? '',
    accountType: dbProfile?.account_type ?? m.accountType ?? 'particulier',
    businessName: dbProfile?.business_name ?? m.businessName,
    trustScore: dbProfile?.trust_score ? Number(dbProfile.trust_score) : 100,
    balance: dbProfile?.balance ? Number(dbProfile.balance) : 0,
    currency: 'EUR',
    kycCompleted: dbProfile?.kyc_completed ?? false,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<KauriUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const supabase = getSupabase();
      
      // Requête directe PostgreSQL protégée par RLS
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(profileFromMeta(currentUser, data));
      } else {
        setProfile(profileFromMeta(currentUser));
      }
    } catch (e) {
      console.error('Failed to fetch profile from PostgreSQL:', e);
      setProfile(profileFromMeta(currentUser));
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
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

    // Inscription automatique si premier Onboarding
    if (error && error.message.toLowerCase().includes('invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: 'Nouvel Utilisateur',
            phone: normalized
          }
        }
      });
      if (signUpError) throw new Error(signUpError.message);
      
      const retry = await supabase.auth.signInWithPassword({ email, password });
      data = retry.data;
      error = retry.error;
    }

    if (error) throw new Error(error.message);
    
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user);
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('kauri_account_type');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
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
