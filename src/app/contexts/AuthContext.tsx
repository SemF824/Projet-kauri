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
  balance: number; // Solde EUR (Rétrocompatibilité)
  balanceXof: number; // Solde XOF (Franc CFA)
  balanceUsdt: number; // Solde stablecoin USDT
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

// Construit un profil consolidé avec le profil DB et son wallet associé
function profileFromMeta(
  user: User,
  dbProfile: any = null,
  wallet: any = null,
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
    balance: wallet?.balance_eur !== undefined ? Number(wallet.balance_eur) : 2450.00,
    balanceXof: wallet?.balance_xof !== undefined ? Number(wallet.balance_xof) : 1600000.00,
    balanceUsdt: wallet?.balance_usdt !== undefined ? Number(wallet.balance_usdt) : 1250.00,
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

      // Récupération simultanée du profil et du portefeuille
      const [profileRes, walletRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("wallets")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
      ]);

      if (profileRes.error) throw profileRes.error;

      let walletData = walletRes.data;

      // Auto-initialisation robuste du portefeuille de démo s'il n'existe pas encore
      if (!walletData && profileRes.data) {
        const { data: newWallet } = await supabase
          .from("wallets")
          .insert({
            user_id: currentUser.id,
            balance_eur: 2450.00,
            balance_xof: 1600000.00,
            balance_usdt: 1250.00,
          })
          .select()
          .maybeSingle();
        if (newWallet) {
          walletData = newWallet;
        }
      }

      setProfile(profileFromMeta(currentUser, profileRes.data, walletData));
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}