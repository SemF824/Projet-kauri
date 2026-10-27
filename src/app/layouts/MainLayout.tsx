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

  const activeColor = "#0a5c7a";
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
      label: "Accueil",
      icon: LayoutDashboard,
      target: currentPath.includes("/kauri/")
        ? isPro ? "/kauri/pro-dashboard" : "/kauri/normal-dashboard"
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
      label: "Social",
      icon: null,
      target: currentPath.includes("/kauri/")
        ? isPro ? "/kauri/pro-publish" : "/kauri/social-hub-gateway"
        : "/feed",
    },
    {
      id: "profil",
      label: "Profil",
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
  const touchStartPosRef = useRef({ x: 0, y: 0 });
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
      } else if (targetTab.isCenter) {
        setIsQuickActionsOpen((prev) => !prev);
      } else if (targetTab.target && targetTab.target !== currentPath) {
        setIsQuickActionsOpen(false);
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
      setIsQuickActionsOpen((prev) => !prev);
      return;
    }
    // Fermer le modal d'actions rapides si l'on clique sur un autre onglet
    setIsQuickActionsOpen(false);
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
            : "0 20px 40px -10px rgba(10, 92, 122, 0.16), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04)",
          WebkitUserSelect: "none",
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const dist = Math.hypot(
            touch.clientX - touchStartPosRef.current.x,
            touch.clientY - touchStartPosRef.current.y
          );
          if (dist > 15) {
            isDraggingRef.current = true;
            handlePointerDrag(touch.clientX, touch.clientY);
          }
        }}
        onTouchEnd={() => {
          isDraggingRef.current = false;
          setDragIndex(null);
        }}
      >
        <div className="grid grid-cols-5 items-center relative w-full">
          {/* ── CAPSULE GLISSANTE FLUIDE (SLIDING LIQUID GLASS PILL) ── */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: "20%",
              left: 0,
              transform: `translateX(${displayedIndex * 100}%)`,
              opacity: tabs[displayedIndex]?.isCenter ? 0 : 1,
              zIndex: 1,
              padding: "4px 6px",
            }}
          >
            <div
              className="w-full h-full rounded-2xl"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)"
                  : "linear-gradient(135deg, rgba(10, 92, 122, 0.12) 0%, rgba(10, 92, 122, 0.05) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: isDarkMode
                  ? "inset 0 1px 1px rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.25)"
                  : "inset 0 1px 1px rgba(255,255,255,0.85), 0 2px 6px rgba(10,92,122,0.08)",
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.14)"
                  : "1px solid rgba(10, 92, 122, 0.14)",
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
                  onClick={() =>
                    handleGestureStart(tab.target, false, true)
                  }
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleGestureStart(tab.target, false, true);
                  }}
                >
                  <div className="w-[20px] h-[20px] invisible pointer-events-none" />
                  <span className="text-[10px] font-bold invisible select-none pointer-events-none">
                    Tontines
                  </span>

                  {/* ── BOUTON SIGNATURE : LE COQUILLAGE KAURI EST LE BOUTON ── */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGestureStart(tab.target, false, true);
                    }}
                    className="kauree-fab cursor-pointer outline-none absolute"
                    style={{
                      left: "50%",
                      top: 0,
                      transform: `translateX(-50%) ${isActive ? "scale(1.06)" : "scale(1)"}`,
                      zIndex: 10,
                      pointerEvents: "auto",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 120"
                      width="44"
                      height="53"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Kauree"
                    >
                      <defs>
                        {/* Coquille base */}
                        <radialGradient id="kShell" cx="35%" cy="28%" r="80%">
                          <stop offset="0%" stopColor="#F6E7B0" />
                          <stop offset="35%" stopColor="#E2C25A" />
                          <stop offset="75%" stopColor="#C9A032" />
                          <stop offset="100%" stopColor="#8F6A1C" />
                        </radialGradient>

                        {/* Lèvres bombées (dégradé doré chaleureux) */}
                        <linearGradient id="kLips" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#C9A032" stopOpacity="0.75" />
                          <stop offset="25%" stopColor="#F3E196" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#DBB041" stopOpacity="0.8" />
                          <stop offset="75%" stopColor="#F3E196" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#C9A032" stopOpacity="0.75" />
                        </linearGradient>

                        {/* Fente sombre profonde */}
                        <linearGradient id="kSlit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2D1F08" />
                          <stop offset="30%" stopColor="#141B2D" />
                          <stop offset="70%" stopColor="#0B101E" />
                          <stop offset="100%" stopColor="#2D1F08" />
                        </linearGradient>

                        {/* Reflet spéculaire coquille */}
                        <radialGradient id="kShine">
                          <stop offset="0%" stopColor="#FFF" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      {/* Coquille */}
                      <path
                        d="M50 6 C76 6 92 34 92 66 C92 96 74 114 50 114 C26 114 8 96 8 66 C8 34 24 6 50 6 Z"
                        fill="url(#kShell)"
                        stroke="#7A5A16"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                      />

                      {/* Lèvres bombées (coussinets latéraux) */}
                      <path
                        d="M50 10 C37 28 30 50 31 72 C32 90 39 102 46 110 L54 110 C61 102 68 90 69 72 C70 50 63 28 50 10 Z"
                        fill="url(#kLips)"
                      />

                      {/* Bande claire gauche : effet bombé de la lèvre */}
                      <path
                        d="M40 18 C33 38 33 62 35 80 C36 90 40 98 44 104"
                        stroke="#FFFDF0"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeOpacity="0.45"
                        fill="none"
                      />
                      {/* Bande claire droite : effet bombé de la lèvre */}
                      <path
                        d="M60 18 C67 38 67 62 65 80 C64 90 60 98 56 104"
                        stroke="#FFFDF0"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeOpacity="0.38"
                        fill="none"
                      />

                      {/* Fente affinée avec courbe en S */}
                      <path
                        d="M 51 13 C 45 40, 46 54, 48 64 C 50 74, 53.5 86, 49.5 107"
                        fill="none"
                        stroke="url(#kSlit)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Reflet brillant coquille */}
                      <ellipse
                        cx="30"
                        cy="36"
                        rx="12"
                        ry="20"
                        fill="url(#kShine)"
                        transform="rotate(-20 30 36)"
                      />
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                data-kauri-target={tab.target}
                onClick={() =>
                  handleGestureStart(tab.target, (tab as any).isPlaceholder)
                }
                onMouseDown={() =>
                  handleGestureStart(tab.target, (tab as any).isPlaceholder)
                }
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleGestureStart(tab.target, (tab as any).isPlaceholder);
                }}
                className="flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer p-0 relative outline-none py-1.5 rounded-2xl select-none z-10 transition-colors duration-200"
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  WebkitTouchCallout: "none",
                }}
              >
                <div
                  className="flex flex-col items-center gap-1 pointer-events-none transition-transform duration-200"
                  style={{
                    transform: isActive ? "scale(1.02)" : "scale(1)",
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
            navigate("/kauri/rejoindre-tontine");
          } else if (action === "creer") {
            navigate(
              isPro
                ? "/kauri/pro-creer-tontine"
                : "/kauri/creer-tontine-publique"
            );
          }
        }}
      />
    </>
  );
}

// ── Layout de Structure Racine ───────────────────────────────────────────────
export function MainLayout() {
  const { pathname } = useLocation();

  // Scroll systématique en haut de page à chaque changement de route
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative pb-36">
      <Outlet />
      <KauriBottomNav />
    </div>
  );
}

export default MainLayout;