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
  balanceXof: number;
  balanceUsdt: number;
  currency: string;
  businessName?: string;
  siret?: string;
  formeJuridique?: string;
  dirigeant?: string;
  kybStatus?: "pending" | "verified" | "rejected" | "unverified";
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

const AuthContext = createContext<AuthContextValue | null>(null);

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
    siret: dbProfile?.siret ?? m.siret ?? "",
    formeJuridique: dbProfile?.forme_juridique ?? m.formeJuridique ?? "",
    dirigeant: dbProfile?.dirigeant ?? m.dirigeant ?? "",
    kybStatus: dbProfile?.kyb_status ?? "verified",
    // ── Trust Score réel sur 100 ─────────────────────────────────────────────
    // Règle de calcul automatique :
    //   40 pts base KYC (vérification d'identité + vivacité + biométrie)
    //    0 pts par défaut si aucune donnée en BDD (compte tout neuf)
    // Les points supplémentaires (transactions, cycles, assiduité…) sont
    // enregistrés dans profiles.trust_score et pris directement depuis la BDD.
    trustScore: dbProfile?.trust_score
      ? Math.min(100, Math.max(0, Number(dbProfile.trust_score)))
      : dbProfile?.kyc_completed
      ? 40   // KYC complet mais pas encore de score enregistré → 40 pts de départ
      : 0,   // Nouveau compte non vérifié
    balance: wallet?.balance_eur !== undefined && wallet?.balance_eur !== null ? Number(wallet.balance_eur) : 0,
    balanceXof: wallet?.balance_xof !== undefined && wallet?.balance_xof !== null ? Number(wallet.balance_xof) : 0,
    balanceUsdt: wallet?.balance_usdt !== undefined && wallet?.balance_usdt !== null ? Number(wallet.balance_usdt) : 0,
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
  const [profile, setProfile] = useState<KauriUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const supabase = getSupabase();

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

      // Auto-création du portefeuille à 0,00 € si inexistant
      if (!walletData && profileRes.data) {
        const { data: newWallet, error: insertErr } = await supabase
          .from("wallets")
          .insert({
            user_id: currentUser.id,
            balance_eur: 0.00,
            balance_xof: 0.00,
            balance_usdt: 0.00,
          })
          .select()
          .maybeSingle();

        if (!insertErr && newWallet) {
          walletData = newWallet;
        }
      }

      setProfile(profileFromMeta(currentUser, profileRes.data, walletData));
    } catch (e) {
      console.error("Failed to fetch profile from PostgreSQL:", e);
      setProfile(profileFromMeta(currentUser));
    }
  };

  const handleSessionSync = (sess: Session | null) => {
    const currentUser = sess?.user ?? null;
    if (currentUser?.email) {
      const normEmail = currentUser.email.toLowerCase();
      localStorage.setItem("kauri_rememberED_email", currentUser.email);
      const isGoogle =
        currentUser.app_metadata?.provider === "google" ||
        (currentUser as any).identities?.some((id: any) => id.provider === "google") ||
        currentUser.user_metadata?.iss?.includes("google");
      if (isGoogle) {
        localStorage.setItem(`kauri_provider_${normEmail}`, "google");
      }
      if (sess?.refresh_token) {
        const isBioActive =
          localStorage.getItem(`kauri_bio_active_${normEmail}`) === "true" ||
          localStorage.getItem(`kauri_bio_active_${currentUser.email}`) === "true";
        if (isBioActive) {
          localStorage.setItem(
            `kauri_passkey_vault_${normEmail}`,
            JSON.stringify({
              refresh_token: sess.refresh_token,
              provider: isGoogle ? "google" : "email",
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      handleSessionSync(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      handleSessionSync(session);
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
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
    setSession(null);
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