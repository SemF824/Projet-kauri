import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  User,
  Leaf,
  Sparkles,
} from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { TontineQuickActionsModal } from "../components/TontineQuickActionsModal";
import { OnboardingTutorialModal } from "../components/OnboardingTutorialModal";

type NavTab =
  | "accueil"
  | "bientot"
  | "kauri"
  | "social"
  | "profil";

// ── Icône Sociale Customisée Interconnectée ──────────────────────────────────
function SocialIcon({
  color,
  size = 24,
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
      className="pointer-events-none"
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

// ── Barre de Navigation Basse Universelle Premium Flottante Capsule ──────────
export function KauriBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  let isDarkMode = false;
  try {
    const { isDarkMode: dm } = useDarkMode();
    isDarkMode = dm;
  } catch (e) {
    isDarkMode =
      document.documentElement.classList.contains("dark");
  }

  let isPro = false;
  try {
    const { profile } = useAuth();
    isPro = profile?.accountType === "professionnel";
  } catch {
    isPro = false;
  }

  const activeColor = "#0D9488";
  const inactiveColor = "#94A3B8";

  const bg = isDarkMode
    ? "rgba(30, 41, 59, 0.90)"
    : "rgba(255, 255, 255, 0.90)";
  const border = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 23, 42, 0.06)";
  const capsuleActiveBg = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 23, 42, 0.05)";
  const currentPath = location.pathname;

  // ── 🛡️ SYNC LOCKS : Références matérielles pour empêcher le spam de navigation ──
  const isSlidingRef = useRef(false);
  const lastNavigatedPathRef = useRef(currentPath);

  // Synchronisation forcée du pointeur de référence lors des changements de route externes
  useEffect(() => {
    lastNavigatedPathRef.current = currentPath;
  }, [currentPath]);

  const getActiveTab = (): NavTab => {
    if (
      currentPath === "/dashboard" ||
      currentPath.includes("/kauri/normal-dashboard")
    )
      return "accueil";
    if (
      currentPath === "/investments" ||
      currentPath.includes("/kauri/investissement")
    )
      return "bientot";
    if (
      currentPath === "/tontines" ||
      currentPath.includes("/kauri/tontines-actives") ||
      currentPath.includes("/kauri/mes-tontines")
    )
      return "kauri";
    if (
      currentPath === "/feed" ||
      currentPath.includes("/kauri/social-feed") ||
      currentPath.includes("/kauri/social-hub")
    )
      return "social";
    if (
      currentPath === "/profile" ||
      currentPath.includes("/kauri/profil-particulier") ||
      currentPath.includes("/kauri/profil-pro")
    )
      return "profil";
    if (currentPath.includes("/kauri/pro-publish"))
      return "social";
    return "accueil";
  };

  const active = getActiveTab();

  const tabs = [
    {
      id: "accueil",
      label: "Home",
      icon: LayoutDashboard,
      target: currentPath.includes("/kauri/")
        ? "/kauri/normal-dashboard"
        : "/dashboard",
    },
    {
      id: "bientot",
      label: "Bientôt",
      icon: Sparkles,
      target: "#",
      isPlaceholder: true,
    },
    {
      id: "kauri",
      label: "Tontines",
      icon: Leaf,
      target: "/kauri/tontines-actives",
      isCenter: true,
    },
    {
      id: "social",
      label: "Bientôt",
      icon: null,
      target: "#",
      isPlaceholder: true,
    },
    {
      id: "profil",
      label: "Profile",
      icon: User,
      target: currentPath.includes("/kauri/")
        ? isPro ? "/kauri/profil-pro" : "/kauri/profil-particulier"
        : "/profile",
    },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === active);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const displayedIndex = dragIndex !== null ? dragIndex : (activeIndex !== -1 ? activeIndex : 0);

  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Référence au conteneur nav pour le calcul géométrique du glissement de doigt
  const navRef = useRef<HTMLElement>(null);
  const isDraggingRef = useRef(false);
  const lastActiveIndexRef = useRef<number>(activeIndex);

  useEffect(() => {
    lastActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  // ── ⚡ MOTEUR D'INTERCEPTION GÉOMÉTRIQUE FLUIDE & GLISSADE TACTILE (STYLE INSTAGRAM) ──
  const handlePointerDrag = (clientX: number, clientY: number) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();

    // Tolérance verticale pour la glissade au doigt
    if (clientY < navRect.top - 35 || clientY > navRect.bottom + 35) return;

    const relativeX = clientX - navRect.left;
    if (navRect.width <= 0) return;

    const segmentWidth = navRect.width / tabs.length;
    const targetIndex = Math.min(
      tabs.length - 1,
      Math.max(0, Math.floor(relativeX / segmentWidth))
    );

    if (targetIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = targetIndex;
      setDragIndex(targetIndex);
      const targetTab = tabs[targetIndex];

      // Retour haptique tactile léger
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(8);
      }

      if (targetTab.isPlaceholder) {
        toast.info("Espace en préparation", {
          description: "Cette section est réservée pour une prochaine fonctionnalité.",
          duration: 1500,
        });
      } else if (targetTab.target && targetTab.target !== currentPath) {
        lastNavigatedPathRef.current = targetTab.target;
        navigate(targetTab.target);
      }
    }
  };

  const handleGestureStart = (
    targetPath: string,
    isPlaceholder?: boolean,
    isCenter?: boolean
  ) => {
    setDragIndex(null);
    if (isCenter) {
      setIsQuickActionsOpen(true);
      return;
    }
    if (isPlaceholder || targetPath === "#") {
      toast.info("Espace en préparation", {
        description: "Cette section est réservée pour une prochaine fonctionnalité.",
        duration: 1500,
      });
      return;
    }
    isSlidingRef.current = true;
    if (currentPath !== targetPath) {
      lastNavigatedPathRef.current = targetPath;
      navigate(targetPath);
    }
  };

  // Fin globale du geste tactile
  useEffect(() => {
    const handleGlobalRelease = () => {
      isDraggingRef.current = false;
      isSlidingRef.current = false;
      setDragIndex(null);
    };
    window.addEventListener("mouseup", handleGlobalRelease);
    window.addEventListener("touchend", handleGlobalRelease);
    return () => {
      window.removeEventListener("mouseup", handleGlobalRelease);
      window.removeEventListener("touchend", handleGlobalRelease);
    };
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-1/2 -translate-x-1/2 z-50 select-none transition-all duration-300"
        style={{
          bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          width: "calc(100% - 24px)",
          maxWidth: "406px",
          borderRadius: "36px",
          padding: "8px 6px",
          touchAction: "none",
          // ── STYLE LIQUID GLASS ULTRA-PUR ET EFFET DE PROFONDEUR ──
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.78) 0%, rgba(30, 41, 59, 0.52) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.76) 0%, rgba(240, 248, 255, 0.48) 100%)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          border: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.14)"
            : "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow: isDarkMode
            ? "0 24px 48px -12px rgba(0, 0, 0, 0.75), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4)"
            : "0 20px 40px -10px rgba(0, 109, 119, 0.14), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04)",
          WebkitUserSelect: "none",
        }}
        onTouchStart={(e) => {
          isDraggingRef.current = true;
          const touch = e.touches[0];
          handlePointerDrag(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          if (!isDraggingRef.current) return;
          const touch = e.touches[0];
          handlePointerDrag(touch.clientX, touch.clientY);
        }}
        onTouchEnd={() => {
          isDraggingRef.current = false;
          setDragIndex(null);
        }}
      >
        <div className="grid grid-cols-5 items-center relative w-full">
          {/* ── CAPSULE GLISSANTE FLUIDE (SLIDING LIQUID GLASS PILL - 120 FPS) ── */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] px-1 py-0.5"
            style={{
              width: "20%",
              left: 0,
              transform: `translateX(${displayedIndex * 100}%)`,
              opacity: tabs[displayedIndex]?.isCenter ? 0 : 1,
              zIndex: 1,
            }}
          >
            <div
              className="w-full h-full rounded-2xl"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)"
                  : "linear-gradient(135deg, rgba(0, 109, 119, 0.14) 0%, rgba(0, 109, 119, 0.07) 100%)",
                backdropFilter: "blur(14px) saturate(180%)",
                WebkitBackdropFilter: "blur(14px) saturate(180%)",
                boxShadow: isDarkMode
                  ? "inset 0 1px 1px rgba(255,255,255,0.22), 0 3px 10px rgba(0,0,0,0.3)"
                  : "inset 0 1px 1.5px rgba(255,255,255,0.9), 0 3px 10px rgba(0,109,119,0.12)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid rgba(255,255,255,0.85)",
              }}
            />
          </div>

          {tabs.map((tab, idx) => {
            const isActive = displayedIndex === idx;
            const Icon = tab.icon;

            if (tab.isCenter) {
              return (
                <div
                  key={tab.id}
                  data-kauri-target={tab.target}
                  className="flex flex-col items-center justify-center relative cursor-pointer z-10 py-1"
                  style={{ userSelect: "none" }}
                  onMouseDown={() =>
                    handleGestureStart(tab.target, false, true)
                  }
                  onTouchStart={() =>
                    handleGestureStart(tab.target, false, true)
                  }
                >
                  <div className="w-[20px] h-[20px] invisible pointer-events-none" />
                  <span className="text-[10px] font-bold invisible select-none pointer-events-none">
                    Tontines
                  </span>

                  <button
                    className="cursor-pointer border-none outline-none absolute pointer-events-none transition-transform active:scale-90"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      top: -8,
                      left: "50%",
                      transform: `translateX(-50%) ${isActive ? "scale(1.08)" : "scale(1)"}`,
                      transition:
                        "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow:
                        "0 8px 20px rgba(212,175,55,0.38), 0 3px 6px rgba(0,0,0,0.12)",
                      border: isActive
                        ? "2.5px solid #ffffff"
                        : "2px solid rgba(255,255,255,0.6)",
                      background:
                        "linear-gradient(135deg, #D4AF37, #F59E0B)",
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
                        backgroundColor: isDarkMode
                          ? "#0F172A"
                          : "#006D77",
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

            return (
              <button
                key={tab.id}
                data-kauri-target={tab.target}
                onMouseDown={() =>
                  handleGestureStart(tab.target, (tab as any).isPlaceholder)
                }
                onTouchStart={() =>
                  handleGestureStart(tab.target, (tab as any).isPlaceholder)
                }
                className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer p-0 relative outline-none py-1.5 rounded-2xl select-none z-10 transition-colors duration-200"
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  WebkitTouchCallout: "none",
                }}
              >
                <div
                  className="flex flex-col items-center gap-1 pointer-events-none transition-transform duration-200"
                  style={{
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {tab.id === "social" ? (
                    <SocialIcon
                      color={isActive ? activeColor : inactiveColor}
                      size={22}
                    />
                  ) : (
                    Icon && (
                      <Icon
                        className="w-[20px] h-[20px]"
                        style={{
                          strokeWidth: isActive ? 2.5 : 1.8,
                        }}
                      />
                    )
                  )}
                  <span
                    className="text-[10px] tracking-wide transition-all"
                    style={{
                      fontWeight: isActive ? 800 : 600,
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MODALS CONTEXTUELS TONTINES ET DIDACTICIEL D'ONBOARDING ── */}
      <TontineQuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        isPro={isPro}
      />

      <OnboardingTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onStartAction={(action) => {
          setIsTutorialOpen(false);
          if (action === "rejoindre") {
            navigate("/kauri/rejoindre-circle");
          } else if (action === "creer") {
            navigate(
              isPro
                ? "/kauri/pro-creer-tontine"
                : "/kauri/creer-tontine"
            );
          }
        }}
      />
    </>
  );
}

// ── Layout de Structure Racine ───────────────────────────────────────────────
export function MainLayout() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative pb-36">
      <Outlet />
      <KauriBottomNav />
    </div>
  );
}

export default MainLayout;