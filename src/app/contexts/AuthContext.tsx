import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "../../utils/supabase";

export interface KauriUserProfile {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  accountType: "particulier" | "professionnel";
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
  signIn: (email: string, pass: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(
  null,
);

// Construit un profil de secours si la table de la base de données est en cours de synchronisation
function profileFromMeta(
  user: User,
  dbProfile: any = null,
): KauriUserProfile {
  const m = user.user_metadata ?? {};
  return {
    id: user.id,
    phone: dbProfile?.phone_number ?? m.phone ?? m.phone_number ?? "",
    firstName:
      dbProfile?.first_name ??
      dbProfile?.full_name?.split(" ")[0] ??
      m.first_name ??
      m.firstName ??
      m.full_name?.split(" ")[0] ??
      "Utilisateur",
    lastName:
      dbProfile?.last_name ??
      dbProfile?.full_name?.split(" ").slice(1).join(" ") ??
      m.last_name ??
      m.lastName ??
      m.full_name?.split(" ").slice(1).join(" ") ??
      "",
    accountType:
      dbProfile?.account_type ?? m.accountType ?? m.account_type ?? "particulier",
    businessName: dbProfile?.business_name ?? m.businessName ?? m.business_name,
    trustScore: dbProfile?.trust_score
      ? Number(dbProfile.trust_score)
      : 100,
    balance: dbProfile?.balance ? Number(dbProfile.balance) : 0,
    currency: "EUR",
    kycCompleted: dbProfile?.kyc_completed ?? false,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] =
    useState<KauriUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const supabase = getSupabase();

      // Requête directe PostgreSQL protégée par RLS
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(profileFromMeta(currentUser, data));
      } else {
        setProfile(profileFromMeta(currentUser));
      }
    } catch (e) {
      console.error(
        "Failed to fetch profile from PostgreSQL:",
        e,
      );
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
        fetchProfile(currentUser).finally(() =>
          setLoading(false),
        );
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  const signIn = async (email: string, pass: string) => {
    const supabase = getSupabase();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      // Supabase returns "Invalid login credentials" for unconfirmed emails too
      if (
        error.message.toLowerCase().includes("invalid login credentials") ||
        error.message.toLowerCase().includes("email not confirmed")
      ) {
        const enriched: any = new Error("EMAIL_NOT_CONFIRMED_OR_WRONG_CREDS");
        enriched.isAuthError = true;
        enriched.originalMessage = error.message;
        throw enriched;
      }
      throw error;
    }
  };

  const resendConfirmation = async (email: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem("kauri_account_type");
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        resendConfirmation,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}