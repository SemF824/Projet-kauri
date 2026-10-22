import {
  Eye,
  EyeOff,
  Users,
  Wallet,
  Bell,
  User,
  RefreshCcw,
  TrendingUp,
  LogOut,
  WifiOff,
  Moon,
  Sun,
  Compass,
  Flame,
  Crown,
  CheckCircle,
  Leaf,
  Home,
  Lock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { KauriBottomNav } from "../../layouts/MainLayout";
import { OnboardingTutorialModal } from "../../components/OnboardingTutorialModal";

export function NormalDashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { profile, user, refreshProfile } = useAuth();
  const [tontinesCount, setTontinesCount] = useState<
    number | null
  >(null);
  const [investmentsCount, setInvestmentsCount] = useState<
    number | null
  >(null);
  const [userTontines, setUserTontines] = useState<any[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // Détection première visite pour lancer le didacticiel
  useEffect(() => {
    const hasSeen = localStorage.getItem("kauri_tutorial_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => setShowTutorial(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const [rwaTotalAmount, setRwaTotalAmount] =
    useState<number>(0);
  const [tontinesTotalAmount, setTontinesTotalAmount] =
    useState<number>(0);

  const rawScore =
    profile?.trustScore !== undefined
      ? profile.trustScore
      : profile?.trustScore !== undefined
        ? profile.trustScore
        : 0;
  const trustScore = Math.round(Number(rawScore) || 0);

  const calculateStreak = () => {
    if (!profile?.createdAt) return 0;
    const createdDate = new Date(profile.createdAt);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());
    return Math.max(0, diffMonths);
  };
  const paymentStreak = calculateStreak();

  const userStatus =
    trustScore >= 85
      ? "Membre Émérite"
      : trustScore >= 40
        ? "Membre Actif"
        : "Nouveau Membre";
  const firstName =
    profile?.firstName ?? profile?.firstName ?? "Vous";

  const availableLiquidity = Number(profile?.balance ?? 0);
  const totalCombinedWealth =
    availableLiquidity + rwaTotalAmount + tontinesTotalAmount;

  const currentKycStatus =
    profile?.kycStatus || profile?.kycStatus || "pending";
  const isKycVerified =
    currentKycStatus === "verified" ||
    profile?.kycCompleted === true ||
    profile?.kycCompleted === true;
  const isKycRejected = currentKycStatus === "rejected";

  // ── 🎯 EXTRACTION DYNAMIQUE DE LA PHOTO DE PROFIL OAUTH ──
  const socialAvatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;
  const avatarUrl =
    profile?.avatar_url ||
    profile?.avatar_url ||
    socialAvatarUrl;

  const initials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : profile?.firstName && profile?.lastName
        ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
        : "KA";

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset =
    circumference - (trustScore / 100) * circumference;

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── 🔄 AUTO-SYNCHRONISATION DE L'AVATAR DANS LA TABLE PROFILES EN BDD ──
  useEffect(() => {
    refreshProfile();

    const syncSocialAvatarAndFetch = async () => {
      if (!user) return;
      const supabase = getSupabase();

      // Si avatar_url est NULL dans la table profiles mais présent dans auth.users -> UPDATE BDD instantané
      if (
        profile &&
        !profile.avatar_url &&
        !profile.avatarUrl &&
        socialAvatarUrl
      ) {
        try {
          await supabase
            .from("profiles")
            .update({ avatar_url: socialAvatarUrl })
            .eq("id", user.id);
        } catch (e) {
          console.error(
            "Échec de synchronisation de l'avatar dans la BDD:",
            e,
          );
        }
      }

      // Synchronisation des compteurs financiers
      try {
        const { data: tData, error: tError } = await supabase
          .from("tontine_members")
          .select(
            `
            tontine_id,
            tontines (
              id,
              name,
              contribution_amount,
              status
            )
          `,
          )
          .eq("user_id", user.id);

        if (!tError && tData) {
          setTontinesCount(tData.length);
          setUserTontines(tData.map((d: any) => d.tontines).filter(Boolean));
          const totalTontineSum = tData.reduce(
            (acc, curr: any) =>
              acc +
              (Number(curr.tontines?.contribution_amount) || 0),
            0,
          );
          setTontinesTotalAmount(totalTontineSum);
        }

        const { data: iData, error: iError } = await supabase
          .from("rwa_investments")
          .select("id, amount");

        if (!iError && iData) {
          setInvestmentsCount(iData.length);
          const totalRwaSum = iData.reduce(
            (acc, curr) => acc + (Number(curr.amount) || 0),
            0,
          );
          setRwaTotalAmount(totalRwaSum);
        }
      } catch (err) {
        console.error(
          "Erreur synchronisation compteurs dashboard:",
          err,
        );
      }
    };

    syncSocialAvatarAndFetch();
  }, [user, profile?.avatar_url]);

  return (
    <div
      className={`min-h-screen pb-[calc(env(safe-area-inset-bottom,20px)+120px)] transition-colors relative ${isDarkMode ? "bg-[#0F172A]" : "bg-[#F9F9F9]"}`}
    >
      {/* ── CONTENU DU DASHBOARD (FLOUTÉ SI PAS VERIFIÉ) ── */}
      <div
        className={`transition-all duration-300 ${!isKycVerified ? "blur-[6px] pointer-events-none select-none opacity-40" : ""}`}
      >
        <div
          className={`px-5 pt-[calc(env(safe-area-inset-top,47px)+16px)] pb-7 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? "bg-gradient-to-br from-[#1E293B] to-[#334155]" : "bg-gradient-to-br from-[#006D77] to-[#0D9488]"}`}
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              {/* ── 🖼️ AVATAR PROFIL OAUTH / INITIALES ── */}
              <div
                onClick={() => navigate("/kauri/profil-particulier")}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center border-2 border-white shadow-xl overflow-hidden shrink-0 cursor-pointer transition-transform active:scale-95"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <span className="text-white text-base font-bold">
                    {initials}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-white text-base font-extrabold truncate leading-tight">
                    Bonjour, {firstName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white inline-flex items-center gap-1 shrink-0">
                    <Crown className="w-3 h-3 text-[#D4AF37]" />
                    {userStatus}
                  </span>
                </div>
                <p className="text-[#E0F2FE] text-xs truncate mt-0.5 opacity-90">
                  Bon retour sur KAUREE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer border-none transition-transform active:scale-95"
                title={
                  isDarkMode ? "Mode Clair" : "Mode Sombre"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-white" />
                ) : (
                  <Moon className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => navigate("/kauri/notifications")}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer border-none transition-transform active:scale-95"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 cursor-pointer"
              onClick={() =>
                navigate("/kauri/trust-score-intro")
              }
            >
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#E0F2FE"
                      strokeWidth="6"
                      fill="none"
                      opacity="0.3"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#miniTrustGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="miniTrustGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop
                          offset="100%"
                          stopColor="#B8860B"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xl font-bold text-white">
                      {trustScore}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/80">
                    Trust Score
                  </p>
                  <p className="text-lg font-bold text-white">
                    {trustScore}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B05B3B] to-[#DC2626] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/80">
                    Série Active
                  </p>
                  <p className="text-lg font-bold text-white">
                    {paymentStreak} mois
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#E0F2FE] text-sm">
                Solde total (Patrimoine)
              </span>
              <button
                onClick={() =>
                  setBalanceVisible(!balanceVisible)
                }
                className="text-white cursor-pointer bg-transparent border-none"
              >
                {balanceVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <h1 className="text-white text-3xl mb-4 font-black tracking-tight">
              {balanceVisible
                ? `${totalCombinedWealth.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`
                : "•••••"}
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/kauri/portefeuille")}
                className="bg-white text-[#006D77] py-3 rounded-xl text-sm font-bold cursor-pointer border-none transition-transform active:scale-95 shadow-md"
              >
                Détails
              </button>
              <button
                onClick={() => navigate("/kauri/send-money")}
                className="bg-[#D4AF37] text-white py-3 rounded-xl text-sm font-bold cursor-pointer border-none transition-transform active:scale-95 shadow-md"
              >
                Envoyer
              </button>
            </div>
          </div>

          <div
            className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 border transition-all mt-3 ${trustScore >= 85 ? "border-[#D4AF37]/50" : "border-white/10 opacity-50"}`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${trustScore >= 85 ? "text-[#D4AF37]" : "text-white/30"}`}
              />
              <div>
                <p className="text-white text-sm font-bold mb-1">
                  Avantage Membre Émérite
                </p>
                <p className="text-white/80 text-xs leading-relaxed">
                  {trustScore >= 85 ? (
                    <>
                      <span className="font-bold text-[#D4AF37]">
                        Frais réduits à 0%
                      </span>{" "}
                      débloqués pour vos CICO de ce mois-ci.
                    </>
                  ) : (
                    "Atteignez 85 pts de confiance pour débloquer les transactions à 0% de frais."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isOffline && (
          <div className="mx-6 mt-4 bg-gradient-to-r from-[#64748B] to-[#475569] rounded-xl p-4 border-2 border-[#94A3B8] flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold mb-1">
                Mode Hors-Ligne
              </p>
              <p className="text-white/80 text-xs">
                Solde en cache. Reconnexion requise pour
                actualiser.
              </p>
            </div>
          </div>
        )}

        <div className="px-6 py-6 space-y-6">
          {/* ── BANNIÈRE D'ACCUEIL & DÉCOUVERTE POUR NOUVEAU CLIENT ── */}
          <div
            className={`rounded-2xl p-4 border transition-all ${
              isDarkMode
                ? "bg-gradient-to-r from-teal-950/40 to-slate-900 border-teal-800/40"
                : "bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200/70"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#006D77] dark:text-[#0D9488]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Guide rapide
                </span>
                <h4
                  className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  Comment fonctionne la Tontine KAUREE ?
                </h4>
                <p
                  className={`text-xs ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                >
                  Découvrez en 1 minute comment épargner à plusieurs et toucher le pot en toute sécurité.
                </p>
              </div>
              <button
                onClick={() => setShowTutorial(true)}
                className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#005a63] text-white text-xs font-bold shrink-0 cursor-pointer border-none shadow-sm transition-transform active:scale-95"
              >
                Voir
              </button>
            </div>
          </div>

          <div>
            <h3
              className={`mb-4 flex items-center gap-2 font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
            >
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full"></div>
              Tableau de bord
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() =>
                  navigate("/kauri/tontines-actives")
                }
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#006D77]" />
                </div>
                <p
                  className={`text-xs font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
                >
                  Tontines
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                >
                  {tontinesCount !== null
                    ? `${tontinesCount} active${tontinesCount !== 1 ? "s" : ""}`
                    : "…"}
                </p>
              </button>

              <button
                onClick={() => {
                  toast.info("Espace Projets en préparation", {
                    description: "Cette section sera disponible prochainement.",
                    duration: 1500,
                  });
                }}
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p
                  className={`text-xs font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
                >
                  Projets
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                >
                  {investmentsCount !== null
                    ? `${investmentsCount} actif${investmentsCount !== 1 ? "s" : ""}`
                    : "…"}
                </p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  navigate("/kauri/historique-swaps")
                }
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <p
                  className={`text-xs font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
                >
                  Swap
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                >
                  1
                </p>
              </button>

              <button
                onClick={() =>
                  navigate("/kauri/discover-circles")
                }
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#006D77]" />
                </div>
                <p
                  className={`text-xs font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
                >
                  Cercles
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                >
                  Publics
                </p>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`flex items-center gap-2 font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                <div className="w-1.5 h-5 bg-[#006D77] rounded-full"></div>
                Mes Tontines
              </h3>
              <button
                onClick={() => navigate("/kauri/tontines-actives")}
                className="text-xs font-bold text-[#006D77] dark:text-[#0D9488] bg-transparent border-none cursor-pointer hover:underline"
              >
                Tout voir
              </button>
            </div>

            {userTontines.length > 0 ? (
              <div className="space-y-3">
                {userTontines.map((tontine: any) => (
                  <div
                    key={tontine.id}
                    onClick={() => navigate(`/kauri/tontine/${tontine.id}`)}
                    className={`rounded-xl p-4 shadow-md border cursor-pointer transition-all hover:scale-[1.01] ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4
                        className={`font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {tontine.name}
                      </h4>
                      <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-[10px] rounded-full font-bold uppercase tracking-wider">
                        {tontine.status || "Actif"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span
                        className={`font-medium ${isDarkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
                      >
                        Cotisation
                      </span>
                      <span
                        className={`font-black ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {Number(tontine.contribution_amount || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-[#334155]" : "bg-[#F1F5F9]"}`}
                    >
                      <div className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488] w-4/5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`rounded-2xl p-6 text-center border space-y-4 ${
                  isDarkMode
                    ? "bg-[#1E293B]/60 border-[#334155]"
                    : "bg-white border-[#E2E8F0]"
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#006D77]/10 flex items-center justify-center text-[#006D77]">
                  <Users className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4
                    className={`font-black text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    Vous n'avez pas encore de tontine
                  </h4>
                  <p
                    className={`text-xs max-w-xs mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Rejoignez un cercle existant avec le code de vos proches ou lancez votre propre tontine en quelques clics.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => navigate("/kauri/rejoindre-circle")}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-200 transition-all border-none cursor-pointer"
                  >
                    Rejoindre
                  </button>
                  <button
                    onClick={() => navigate("/kauri/creer-tontine")}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-xs font-bold shadow-md shadow-[#006D77]/20 transition-all active:scale-95 border-none cursor-pointer"
                  >
                    Créer un cercle
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/kauri/emergency-swap")}
            className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 font-bold cursor-pointer border-none"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Échanger ma position d'urgence</span>
          </button>
        </div>
      </div>

      {/* ── ENCLAVE OVERLAY RÉGLEMENTAIRE FINANCIER (PROTÉGÉ) ── */}
      {!isKycVerified && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-transparent z-40">
          <div
            className={`w-full max-w-md rounded-[2rem] border shadow-2xl p-6 text-center space-y-6 ${isDarkMode ? "bg-[#1E293B] border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${isKycRejected ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}
            >
              {isKycRejected ? (
                <ShieldAlert className="w-7 h-7" />
              ) : (
                <Lock className="w-7 h-7" />
              )}
            </div>
            <div className="space-y-2">
              <h2
                className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {isKycRejected
                  ? "Dossier de conformité rejeté"
                  : "Compte en cours de validation"}
              </h2>
              <p
                className={`text-xs leading-relaxed px-2 font-medium ${isDarkMode ? "text-slate-400" : "text-[#475569]"}`}
              >
                {isKycRejected
                  ? "Vos pièces justificatives n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents réglementaires."
                  : "Bonjour ! Vos pièces justificatives ont été transmises avec succès au registre central de KAUREE. Votre dossier est en cours d'analyse."}
              </p>
            </div>

            {!isKycRejected && (
              <div
                className={`${isDarkMode ? "bg-[#006D77]/10 border border-[#006D77]/20" : "bg-[#E6F4F5] border border-[#006D77]/10"} rounded-2xl p-4`}
              >
                <p
                  className={`text-xs font-bold leading-relaxed text-center ${isDarkMode ? "text-teal-400" : "text-[#006D77]"}`}
                >
                  ⏳ Activation de vos accès financiers sous 24
                  heures.
                </p>
              </div>
            )}

            <div
              className={`rounded-2xl p-4 text-left text-xs leading-relaxed space-y-2 border ${isDarkMode ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"}`}
            >
              <p
                className={`font-black uppercase tracking-wider text-[10px] ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Fonctionnalités gelées temporairement :
              </p>
              <div className="space-y-1 font-medium">
                <p>• Création et paiement de Tontines</p>
                <p>• Dépôts et retraits de capitaux</p>
                <p>• Souscription aux levées de fonds</p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/kauri/kyc-verification")
              }
              className={`w-full py-4 rounded-xl text-white font-bold text-[13px] tracking-wide uppercase shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none ${isKycRejected ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-[#006D77] hover:bg-[#00525a] shadow-[#006D77]/20"}`}
            >
              <span>
                {isKycRejected
                  ? "Soumettre à nouveau les pièces"
                  : "Vérifier mes documents"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DIDACTICIEL D'ACCUEIL POUR NOUVEAU CLIENT ── */}
      <OnboardingTutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartAction={(action) => {
          setShowTutorial(false);
          if (action === "rejoindre") navigate("/kauri/rejoindre-circle");
          if (action === "creer") navigate("/kauri/creer-tontine");
        }}
      />

      {/* INTÉGRATION DE LA BARRE CENTRALE */}
      <KauriBottomNav />
    </div>
  );
}

export default NormalDashboardScreen;