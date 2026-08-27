import {
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  Plus,
  Bell,
  User,
  BarChart3,
  WifiOff,
  Moon,
  Sun,
  Home,
  Briefcase,
  Play,
  BarChart2,
  Lock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useProData } from "../../contexts/ProDataContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  useProPublications,
  computeSocialStats,
} from "../../contexts/ProPublicationsContext";

function SocialIcon({
  color,
  size = 22,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke={color}
        strokeWidth="1.6"
      />
      <path
        d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <circle cx="7" cy="10.5" r="1.1" fill={color} />
      <path
        d="M5.8 13.5 Q7 12.5 8.2 13.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="17" cy="10.5" r="1.1" fill={color} />
      <path
        d="M15.8 13.5 Q17 12.5 18.2 13.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="6.5" r="1.1" fill={color} />
      <path
        d="M10.8 9.5 Q12 8.5 13.2 9.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="8"
        y1="11"
        x2="11"
        y2="7.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="16"
        y1="11"
        x2="13"
        y2="7.5"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="8.5"
        y1="12"
        x2="15.5"
        y2="12"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

type ProTab =
  | "accueil"
  | "projets"
  | "kauri"
  | "social"
  | "profil";

function ProBottomNav({
  active,
  isDarkMode,
  navigate,
}: {
  active: ProTab;
  isDarkMode: boolean;
  navigate: (p: string) => void;
}) {
  const GOLD = "#D4AF37";
  const TEAL = "#006D77";
  const bg = isDarkMode ? "#1E293B" : "#ffffff";
  const border = isDarkMode ? "#334155" : "#E8EDF2";
  const inactive = isDarkMode ? "#475569" : "#94A3B8";

  const tabs: {
    id: ProTab;
    icon?: React.ElementType;
    label: string;
    path?: string;
    isCenter?: boolean;
  }[] = [
    {
      id: "accueil",
      icon: Home,
      label: "Accueil",
      path: "/kauri/pro-dashboard",
    },
    {
      id: "projets",
      icon: Briefcase,
      label: "Projets",
      path: "/kauri/pro-projets",
    },
    {
      id: "kauri",
      label: "Kauri",
      path: "/kauri/pro-creer-tontine",
      isCenter: true,
    },
    {
      id: "social",
      label: "Social",
      path: "/kauri/social-hub-gateway",
    },
    {
      id: "profil",
      icon: User,
      label: "Profil",
      path: "/kauri/profil-pro",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50"
      style={{
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-end justify-around px-2 pt-1.5 pb-3">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div
                key={tab.id}
                className="flex flex-col items-center gap-1.5 relative cursor-pointer"
                style={{ minWidth: 50 }}
                onClick={() => tab.path && navigate(tab.path)}
              >
                <div className="w-[20px] h-[20px] invisible pointer-events-none" />
                <span className="text-[10px] font-bold invisible select-none pointer-events-none">
                  Kauri
                </span>
                <button
                  aria-label="Kauri Pro"
                  className="cursor-pointer border-none outline-none absolute pointer-events-none transition-all active:scale-90"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    top: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #D4AF37, #F59E0B)",
                    boxShadow: "0 6px 16px rgba(212,175,55,0.30), 0 3px 6px rgba(0,0,0,0.08)",
                    border: isActive
                      ? "2.5px solid #ffffff"
                      : "2px solid rgba(255,255,255,0.45)",
                    zIndex: 10,
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      width: 24,
                      height: 24,
                      color: "#fff",
                      display: "block",
                      margin: "auto",
                    }}
                  >
                    <path
                      d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                      fill="currentColor"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: isDarkMode ? "#0F172A" : "#006D77",
                      border: "1.5px solid #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 900,
                        lineHeight: 1,
                        marginTop: -1,
                      }}
                    >
                      +
                    </span>
                  </div>
                </button>
              </div>
            );
          }

          if (tab.id === "social") {
            return (
              <button
                key={tab.id}
                onClick={() => tab.path && navigate(tab.path)}
                aria-label="Social"
                className="flex flex-col items-center gap-0.5 relative cursor-pointer border-none bg-transparent"
                style={{
                  minWidth: 44,
                  paddingTop: 6,
                  paddingBottom: 2,
                }}
              >
                <SocialIcon
                  color={isActive ? TEAL : inactive}
                  size={22}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? TEAL : inactive,
                    transition: "color 0.15s",
                  }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: TEAL,
                    }}
                  />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => tab.path && navigate(tab.path)}
              aria-label={tab.label}
              className="flex flex-col items-center gap-0.5 relative cursor-pointer border-none bg-transparent"
              style={{
                minWidth: 44,
                paddingTop: 6,
                paddingBottom: 2,
              }}
            >
              {Icon && (
                <Icon
                  style={{
                    width: 22,
                    height: 22,
                    color: isActive ? GOLD : inactive,
                    strokeWidth: isActive ? 2.2 : 1.8,
                    transition: "color 0.15s",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? GOLD : inactive,
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: GOLD,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function ProDashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isDarkMode, toggleDarkMode, resetDarkMode } =
    useDarkMode();
  const { profile, refreshProfile } = useAuth();

  const displayName =
    profile?.businessName ||
    profile?.firstName ||
    "Professionnel";

  const initials = profile?.businessName
    ? profile.businessName.slice(0, 2).toUpperCase()
    : `${profile?.firstName?.[0] ?? "P"}${profile?.lastName?.[0] ?? ""}`.toUpperCase();

  const balanceEur = profile?.balance ?? 2450.00;

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

  const { projets } = useProData();
  const projetsActifs = projets.filter(
    (p) => p.statut === "En cours",
  );
  const totalLeve = projets.reduce((s, p) => s + p.leve, 0);
  const totalBackers = projets.reduce(
    (s, p) => s + p.backers,
    0,
  );

  return (
    <div
      className={`min-h-screen pb-24 transition-colors relative ${isDarkMode ? "bg-[#0F172A]" : "bg-[#F9F9F9]"}`}
    >
      <div>
        <div
          className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? "bg-gradient-to-br from-[#1E293B] to-[#334155]" : "bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]"}`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg ${isDarkMode ? "bg-[#D4AF37] border-white" : "bg-white border-[#D4AF37]"}`}
              >
                <span
                  className={
                    isDarkMode ? "text-white" : "text-[#D4AF37]"
                  }
                >
                  {initials}
                </span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  Bonjour, {displayName}
                </h2>
                <p className="text-white/90 text-sm">
                  Compte Professionnel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-none cursor-pointer"
                title={
                  isDarkMode ? "Mode Clair" : "Mode Sombre"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() =>
                  navigate("/kauri/pro-notifications")
                }
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-none cursor-pointer"
                title="Notifications Pro"
              >
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-bold">
                Portefeuille Entreprise (EUR)
              </span>
              <button
                onClick={() =>
                  setBalanceVisible(!balanceVisible)
                }
                className="text-white bg-transparent border-none cursor-pointer"
              >
                {balanceVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <h1 className="text-white text-3xl mb-4 font-black">
              {balanceVisible ? `${balanceEur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : "•••••"}
            </h1>
            
            {/* DISCLAIMER NON-MENSONGER PSP */}
            <p className="text-white/60 text-[10px] mb-4 leading-normal">
              ℹ️ Solde de démonstration sécurisé. La connexion à vos comptes bancaires et au processeur de paiement (PSP) sera activée lors de l'intégration finale de l'API Stripe / Banxo.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  navigate("/kauri/pro-portefeuille")
                }
                className="bg-white text-[#D4AF37] py-3 rounded-xl text-sm font-bold border-none cursor-pointer"
              >
                Détails de Caisse
              </button>
              <button
                onClick={() => navigate("/kauri/pro-projets")}
                className="bg-[#006D77] text-white py-3 rounded-xl text-sm font-bold border-none cursor-pointer"
              >
                Suivi Levées
              </button>
            </div>
          </div>
        </div>

        {isOffline && (
          <div className="mx-6 mt-4 bg-gradient-to-r from-[#64748B] to-[#475569] rounded-xl p-4 border-2 border-[#94A3B8] flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm mb-1 font-bold">
                Mode Hors-Ligne
              </p>
              <p className="text-white/80 text-xs">
                Données synchronisées localement
              </p>
            </div>
          </div>
        )}

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate("/kauri/pro-leves")}
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
            >
              <BarChart3 className="w-8 h-8 text-[#006D77] mx-auto mb-2" />
              <p
                className={`mb-1 font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {totalLeve.toLocaleString("fr-FR")} €
              </p>
              <p
                className={`text-xs font-bold ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
              >
                Levés
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/kauri/pro-investisseurs")
              }
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
            >
              <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <p
                className={`mb-1 font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {totalBackers}
              </p>
              <p
                className={`text-xs font-bold ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
              >
                Investisseurs
              </p>
            </button>

            <button
              onClick={() => navigate("/kauri/pro-projets")}
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
            >
              <TrendingUp className="w-8 h-8 text-[#0D9488] mx-auto mb-2" />
              <p
                className={`mb-1 font-bold ${isDarkMode ? "text-white" : "text-[#0F172A]"}`}
              >
                {projetsActifs.length}
              </p>
              <p
                className={`text-xs font-bold ${isDarkMode ? "text-[#94A3B8]" : "text-[#4A4A4A]"}`}
              >
                En cours
              </p>
            </button>
          </div>
        </div>
      </div>
      <ProBottomNav active="accueil" isDarkMode={isDarkMode} navigate={navigate} />
    </div>
  );
}

export default ProDashboardScreen;