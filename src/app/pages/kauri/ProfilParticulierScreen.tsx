import {
  Shield,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  LogOut,
  Crown,
  CreditCard,
  Lock,
  Smartphone,
  Bell,
  Eye,
  Briefcase,
  Rocket,
  FolderOpen,
  ArrowLeft,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { KauriBottomNav } from "../../layouts/MainLayout";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

const PETROLE = "#0a5c7a";
const GOLD = "#D4AF37";
const NAVY = "#0F172A";

export function ProfilParticulierScreen() {
  const navigate = useNavigate();
  const { isDarkMode, resetDarkMode } = useDarkMode();
  const { profile, user, signOut } = useAuth();

  const [activeSpace, setActiveSpace] = useState<"personnel" | "professionnel">("personnel");
  const [showSettingsSubscreen, setShowSettingsSubscreen] = useState(false);
  const [isPasskeyActive, setIsPasskeyActive] = useState(false);
  const [isActivatingBio, setIsActivatingBio] = useState(false);

  const trustScore =
    profile?.trustScore !== undefined
      ? Math.round(Number(profile.trustScore))
      : 92;

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "Membre KAUREE"
    : "Membre KAUREE";

  const socialAvatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const avatarUrl = (profile as any)?.avatar_url || socialAvatarUrl;

  const initials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase() || "KA";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "juillet 2026";

  useEffect(() => {
    if (user?.email) {
      const savedBio = localStorage.getItem(`kauri_bio_active_${user.email}`);
      setIsPasskeyActive(savedBio === "true");
    }
  }, [user]);

  // Synchronisation silencieuse de l'avatar dans Supabase
  useEffect(() => {
    const syncAvatarInDatabase = async () => {
      if (user && profile && !(profile as any)?.avatar_url && socialAvatarUrl) {
        try {
          const supabase = getSupabase();
          await supabase
            .from("profiles")
            .update({ avatar_url: socialAvatarUrl })
            .eq("id", user.id);
        } catch (e) {
          console.error("Échec de synchronisation avatar:", e);
        }
      }
    };
    syncAvatarInDatabase();
  }, [user, (profile as any)?.avatar_url, socialAvatarUrl]);

  const handleTogglePasskey = async () => {
    if (!user?.email || !user?.id) return;

    if (isPasskeyActive) {
      localStorage.removeItem(`kauri_bio_active_${user.email}`);
      localStorage.removeItem("kauri_rememberED_email");
      setIsPasskeyActive(false);
      toast.success("Clé d’accès biométrique révoquée.");
      return;
    }

    if (!window.PublicKeyCredential) {
      toast.error("Votre appareil ne prend pas en charge les clés biométriques.");
      return;
    }

    setIsActivatingBio(true);

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userIdBuffer = Uint8Array.from(user.id.slice(0, 16), (c) => c.charCodeAt(0));

      const options: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: { name: "KAUREE", id: window.location.hostname },
          user: {
            id: userIdBuffer,
            name: user.email,
            displayName: fullName,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      };

      const credential = await navigator.credentials.create(options);
      if (!credential) throw new Error("Authentification annulée.");

      const normalizedEmail = user.email.toLowerCase();
      localStorage.setItem(`kauri_bio_active_${normalizedEmail}`, "true");
      localStorage.setItem(`kauri_bio_active_${user.email}`, "true");
      localStorage.setItem("kauri_rememberED_email", user.email);

      setIsPasskeyActive(true);
      toast.success("Clé d'accès biométrique activée avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Liaison biométrique annulée.");
    } finally {
      setIsActivatingBio(false);
    }
  };

  const handleLogout = async () => {
    resetDarkMode();
    await signOut();
    navigate("/kauri/login");
  };

  const bg = isDarkMode ? "#0B0F19" : "#F8FAFC";
  const cardBg = isDarkMode ? "#131C2E" : "#FFFFFF";
  const border = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0";
  const textPrimary = isDarkMode ? "#F8FAFC" : "#0F172A";
  const textSecondary = isDarkMode ? "#94A3B8" : "#64748B";

  // ── VUE SOUS-ÉCRAN « PARAMÈTRES » ──────────────────────────────────────────
  if (showSettingsSubscreen) {
    return (
      <div className="min-h-screen pb-32 transition-colors font-sans" style={{ backgroundColor: bg }}>
        {/* Header Paramètres */}
        <div
          className="px-5 pt-12 pb-5 border-b sticky top-0 z-20 backdrop-blur-md"
          style={{
            backgroundColor: isDarkMode ? "rgba(11, 15, 25, 0.88)" : "rgba(248, 250, 252, 0.88)",
            borderColor: border,
          }}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSettingsSubscreen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-xl border-none cursor-pointer font-bold text-xs transition-colors"
              style={{
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#EDF2F7",
                color: textPrimary,
              }}
            >
              <ArrowLeft size={16} />
              <span>Profil</span>
            </button>
            <h1 className="text-base font-bold m-0" style={{ color: textPrimary }}>
              Paramètres
            </h1>
            <div className="w-16" />
          </div>
        </div>

        <div className="px-5 pt-5 space-y-6">
          {/* SECTION 1 : Mes informations */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: textSecondary }}>
              Mes informations
            </p>
            <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: border }}>
              <div
                onClick={() => navigate("/kauri/manage-account")}
                className="p-4 flex items-center justify-between cursor-pointer border-b"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs m-0" style={{ color: textSecondary }}>Email</p>
                    <p className="text-sm font-semibold m-0 mt-0.5" style={{ color: textPrimary }}>
                      {user?.email || "Non renseigné"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>

              <div
                onClick={() => navigate("/kauri/manage-account")}
                className="p-4 flex items-center justify-between cursor-pointer border-b"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs m-0" style={{ color: textSecondary }}>Téléphone</p>
                    <p className="text-sm font-semibold m-0 mt-0.5" style={{ color: textPrimary }}>
                      {profile?.phone || "+33 6 12 34 56 78"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>

              <div
                onClick={() => navigate("/kauri/manage-account")}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs m-0" style={{ color: textSecondary }}>Adresse</p>
                    <p className="text-sm font-semibold m-0 mt-0.5" style={{ color: textPrimary }}>
                      Paris, France
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>
            </div>
          </div>

          {/* SECTION 2 : Sécurité */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: textSecondary }}>
              Sécurité du compte
            </p>
            <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: border }}>
              {/* Mot de passe */}
              <div
                onClick={() => navigate("/kauri/biometric-setup")}
                className="p-4 flex items-center justify-between cursor-pointer border-b"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                  >
                    <Lock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>Mot de passe</p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                      Modifier votre mot de passe
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>

              {/* Clé biométrique */}
              <div
                onClick={handleTogglePasskey}
                className="p-4 flex items-center justify-between cursor-pointer border-b"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isPasskeyActive ? `${GOLD}22` : `${PETROLE}12`,
                      color: isPasskeyActive ? GOLD : PETROLE,
                    }}
                  >
                    {isActivatingBio ? (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                    ) : (
                      <Smartphone size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                        Clé biométrique
                      </p>
                      {isPasskeyActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                      {isPasskeyActive ? "Face ID / Touch ID configuré" : "Activer la connexion sans mot de passe"}
                    </p>
                  </div>
                </div>
                <div
                  className="w-11 h-6 rounded-full transition-colors relative cursor-pointer"
                  style={{ backgroundColor: isPasskeyActive ? GOLD : isDarkMode ? "#334155" : "#CBD5E1" }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm"
                    style={{ transform: isPasskeyActive ? "translateX(22px)" : "translateX(2px)" }}
                  />
                </div>
              </div>

              {/* 2FA : Activée par défaut */}
              <div
                onClick={() => navigate("/kauri/setup-2fa")}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
                  >
                    <Shield size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                        Double authentification (2FA)
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Activée par défaut
                      </span>
                    </div>
                    <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                      Protection renforcée sur toutes vos opérations financières
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>
            </div>
          </div>

          {/* SECTION 3 : Préférences */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: textSecondary }}>
              Préférences
            </p>
            <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: border }}>
              <div
                onClick={() => navigate("/kauri/notifications")}
                className="p-4 flex items-center justify-between cursor-pointer border-b"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                  >
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>Notifications</p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                      Alertes tontines, versements et messages
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>

              <div
                onClick={() => navigate("/kauri/preferences-contenu")}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
                  >
                    <Eye size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>Confidentialité</p>
                    <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                      Contrôler la visibilité de vos données et cercles
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: textSecondary }} />
              </div>
            </div>
          </div>
        </div>

        <KauriBottomNav />
      </div>
    );
  }

  // ── VUE PRINCIPALE DU PROFIL ───────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32 transition-colors font-sans" style={{ backgroundColor: bg }}>
      {/* ── 1. EN-TÊTE SUR FOND CLAIR (PLUS DE BLOC TEAL) ── */}
      <div
        className="px-5 pt-12 pb-5 border-b"
        style={{
          backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
          borderColor: border,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar or avec initiales */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden shadow-md shadow-[#D4AF37]/20 border-2 border-[#D4AF37]/40"
              style={{
                background: "linear-gradient(135deg, #F3E196 0%, #D4AF37 55%, #8F6A1C 100%)",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="drop-shadow-sm font-bold tracking-wider">{initials}</span>
              )}
            </div>

            {/* Nom en typo serif & Membre depuis */}
            <div>
              <h1
                className="text-2xl font-bold tracking-tight m-0"
                style={{
                  fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                  color: textPrimary,
                }}
              >
                {fullName}
              </h1>
              <p className="text-xs font-medium m-0 mt-1" style={{ color: textSecondary }}>
                Membre depuis {memberSince}
              </p>
            </div>
          </div>

          {/* Petit bouton crayon pour modifier */}
          <button
            type="button"
            onClick={() => navigate("/kauri/manage-account")}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border transition-colors shrink-0"
            style={{
              backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
              borderColor: border,
              color: textSecondary,
            }}
            title="Modifier mes informations"
          >
            <Edit size={15} />
          </button>
        </div>

        {/* Sélecteur Espace Personnel / Pro */}
        <div
          className="flex p-1 rounded-2xl"
          style={{
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
            border: `1px solid ${border}`,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSpace("personnel")}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer border-none text-xs font-bold"
            style={{
              backgroundColor: activeSpace === "personnel" ? (isDarkMode ? "#1E293B" : "#FFFFFF") : "transparent",
              color: activeSpace === "personnel" ? textPrimary : textSecondary,
              boxShadow: activeSpace === "personnel" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <User size={14} style={{ color: activeSpace === "personnel" ? PETROLE : textSecondary }} />
            <span>Espace Personnel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (profile?.accountType === "professionnel") {
                navigate("/kauri/profil-pro");
              } else {
                setActiveSpace("professionnel");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer border-none text-xs font-bold"
            style={{
              backgroundColor: activeSpace === "professionnel" ? (isDarkMode ? "#1E293B" : "#FFFFFF") : "transparent",
              color: activeSpace === "professionnel" ? textPrimary : textSecondary,
              boxShadow: activeSpace === "professionnel" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <Briefcase size={14} style={{ color: activeSpace === "professionnel" ? GOLD : textSecondary }} />
            <span>Espace Pro</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {activeSpace === "personnel" ? (
          <>
            {/* ── 2. CARTE TRUST SCORE (NAVY COMME LE SOLDE DE L'ACCUEIL) ── */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden shadow-xl"
              style={{
                backgroundColor: NAVY,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 12px 30px -8px rgba(15, 23, 42, 0.4)",
              }}
            >
              {/* Lueur d'ambiance or en fond */}
              <div
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Ligne haute : Titre + Badge Membre Émérite */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: GOLD }}
                    >
                      <Shield size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Trust Score
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold"
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.14)",
                      borderColor: "rgba(212, 175, 55, 0.35)",
                      color: GOLD,
                    }}
                  >
                    <Sparkles size={11} />
                    <span>Membre Émérite</span>
                  </div>
                </div>

                {/* Score en grand et en or */}
                <div className="flex items-baseline gap-2 my-2">
                  <span
                    className="text-4xl font-extrabold tracking-tight"
                    style={{
                      color: GOLD,
                      textShadow: "0 2px 10px rgba(212, 175, 55, 0.3)",
                    }}
                  >
                    {trustScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>

                {/* Barre en or pur */}
                <div className="h-2 w-full rounded-full overflow-hidden bg-white/10 my-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${trustScore}%`,
                      background: "linear-gradient(90deg, #D4AF37 0%, #F59E0B 100%)",
                      boxShadow: "0 0 10px rgba(212, 175, 55, 0.6)",
                    }}
                  />
                </div>

                {/* Statut & Lien Comment l'améliorer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                    <CheckCircle2 size={13} style={{ color: GOLD }} />
                    <span>Excellent · Membre de confiance</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/kauri/trust-score-intro")}
                    className="text-xs font-bold bg-transparent border-none p-0 cursor-pointer hover:underline flex items-center gap-1"
                    style={{ color: GOLD }}
                  >
                    <span>Comment l'améliorer ?</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── 3. STATISTIQUES (3 CASES : ICÔNES PÉTROLE OU OR UNIQUEMENT) ── */}
            <div className="grid grid-cols-3 gap-3">
              {/* Tontines (Pétrole) */}
              <div
                onClick={() => navigate("/kauri/tontines-actives")}
                className="rounded-2xl p-3.5 text-center cursor-pointer border transition-all active:scale-[0.98]"
                style={{ backgroundColor: cardBg, borderColor: border }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                >
                  <Users size={19} />
                </div>
                <p className="text-lg font-extrabold m-0" style={{ color: textPrimary }}>3</p>
                <p className="text-xs m-0 mt-0.5 font-medium" style={{ color: textSecondary }}>Tontines</p>
              </div>

              {/* Investis (Or) */}
              <div
                onClick={() => navigate("/kauri/mes-investissements")}
                className="rounded-2xl p-3.5 text-center cursor-pointer border transition-all active:scale-[0.98]"
                style={{ backgroundColor: cardBg, borderColor: border }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
                >
                  <TrendingUp size={19} />
                </div>
                <p className="text-lg font-extrabold m-0" style={{ color: textPrimary }}>2</p>
                <p className="text-xs m-0 mt-0.5 font-medium" style={{ color: textSecondary }}>Investis</p>
              </div>

              {/* Badges (Pétrole) */}
              <div
                onClick={() => navigate("/kauri/badges")}
                className="rounded-2xl p-3.5 text-center cursor-pointer border transition-all active:scale-[0.98]"
                style={{ backgroundColor: cardBg, borderColor: border }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${PETROLE}15`, color: PETROLE }}
                >
                  <Award size={19} />
                </div>
                <p className="text-lg font-extrabold m-0" style={{ color: textPrimary }}>12</p>
                <p className="text-xs m-0 mt-0.5 font-medium" style={{ color: textSecondary }}>Badges</p>
              </div>
            </div>

            {/* ── 4. BANDEAU PREMIUM COMPACT (UNE SEULE LIGNE DORÉE) ── */}
            <div
              onClick={() => navigate("/kauri/premium-paywall")}
              className="rounded-2xl p-3.5 flex items-center justify-between cursor-pointer border transition-all active:scale-[0.99] shadow-sm"
              style={{
                background: isDarkMode
                  ? "linear-gradient(90deg, #1A1405 0%, #2A1F08 100%)"
                  : "linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)",
                borderColor: `${GOLD}55`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                    color: "#FFFFFF",
                  }}
                >
                  <Crown size={18} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold m-0"
                    style={{ color: isDarkMode ? "#FDE68A" : "#92400E" }}
                  >
                    KAUREE Premium · 4,99 €/mois
                  </p>
                  <p
                    className="text-[11px] m-0 text-amber-700/80 dark:text-amber-200/70"
                  >
                    Avantages exclusifs et frais réduits
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer text-white shadow-sm transition-transform active:scale-95 shrink-0"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                }}
              >
                Découvrir
              </button>
            </div>

            {/* ── 5. MON PORTEFEUILLE ── */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: textSecondary }}>
                Mon Portefeuille
              </p>
              <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: border }}>
                {/* La carte virtuelle KAUREE */}
                <div
                  onClick={() => navigate("/kauri/manage-account")}
                  className="p-4 flex items-center justify-between cursor-pointer border-b transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  style={{ borderColor: border }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${PETROLE}, #0F172A)`,
                        color: "#fff",
                      }}
                    >
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                          Carte virtuelle KAUREE
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      </div>
                      <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                        •••• {profile?.id ? profile.id.slice(-4).toUpperCase() : "9820"} · Expire 12/28
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: textSecondary }} />
                </div>

                {/* Mes documents (contrats signés, coffre-fort) */}
                <div
                  onClick={() => navigate("/kauri/coffre-numerique")}
                  className="p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                        color: "#fff",
                      }}
                    >
                      <FolderOpen size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                        Mes documents
                      </p>
                      <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                        Contrats signés · Coffre-fort numérique
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${PETROLE}15`,
                        color: PETROLE,
                      }}
                    >
                      4
                    </span>
                    <ChevronRight size={16} style={{ color: textSecondary }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 6. UNE SEULE LIGNE « PARAMÈTRES » QUI OUVRE UN SOUS-ÉCRAN ── */}
            <div
              onClick={() => setShowSettingsSubscreen(true)}
              className="rounded-2xl p-4 flex items-center justify-between cursor-pointer border transition-all active:scale-[0.99] shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
              style={{ backgroundColor: cardBg, borderColor: border }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${PETROLE}15`,
                    color: PETROLE,
                  }}
                >
                  <Settings size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold m-0" style={{ color: textPrimary }}>
                    Paramètres
                  </p>
                  <p className="text-xs m-0 mt-0.5" style={{ color: textSecondary }}>
                    Mes informations · Sécurité · Préférences
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: textSecondary }} />
            </div>

            {/* ── 7. TOUT EN BAS : SE DÉCONNECTER (GARDÉ TEL QUEL) ── */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer border-none shadow-md transition-all active:scale-[0.98] mt-2"
              style={{
                background: "linear-gradient(135deg, #B05B3B, #DC2626)",
                color: "#fff",
                boxShadow: "0 3px 12px rgba(220,38,38,0.25)",
              }}
            >
              <LogOut size={17} />
              <span>Se déconnecter</span>
            </button>
          </>
        ) : (
          /* Espace Professionnel (vue alternative) */
          <div className="rounded-3xl p-6 text-center border" style={{ backgroundColor: cardBg, borderColor: border }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-md"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: "#fff",
              }}
            >
              <Briefcase size={28} />
            </div>
            <h2 className="text-lg font-bold m-0 mb-1" style={{ color: textPrimary }}>
              Espace Professionnel
            </h2>
            <p className="text-xs leading-relaxed max-w-xs mx-auto mb-5" style={{ color: textSecondary }}>
              Activez votre profil Pro pour accéder aux outils de levée de fonds, tontines d'entreprise et tableau de bord dédié.
            </p>
            <button
              type="button"
              onClick={() => navigate("/kauri/pro-verification")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold text-white border-none cursor-pointer shadow-md"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              }}
            >
              <Rocket size={16} />
              <span>Activer mon Profil Professionnel</span>
            </button>
          </div>
        )}
      </div>

      <KauriBottomNav />
    </div>
  );
}

export default ProfilParticulierScreen;
