import { Outlet, useLocation, useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { LayoutDashboard, TrendingUp, User, Leaf } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

type NavTab = 'accueil' | 'investissement' | 'kauri' | 'social' | 'profil';

// ── Icône Sociale Customisée Interconnectée ──────────────────────────────────
function SocialIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      <path d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="7" cy="10.5" r="1.1" fill={color} />
      <path d="M5.8 13.5 Q7 12.5 8.2 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="10.5" r="1.1" fill={color} />
      <path d="M15.8 13.5 Q17 12.5 18.2 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="6.5" r="1.1" fill={color} />
      <path d="M10.8 9.5 Q12 8.5 13.2 9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <line x1="8" y1="11" x2="11" y2="7.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="11" x2="13" y2="7.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── Barre de Navigation Basse Universelle Premium Flottante ──────────────────
export function KauriBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  let isDarkMode = false;
  try {
    const { isDarkMode: dm } = useDarkMode();
    isDarkMode = dm;
  } catch (e) {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  const activeColor = '#0D9488';   
  const inactiveColor = '#94A3B8'; 
  
  const bg = isDarkMode ? 'rgba(30, 41, 59, 0.90)' : 'rgba(255, 255, 255, 0.90)';
  const border = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)';
  const currentPath = location.pathname;

  // Gestionnaire d'état pour l'effet d'enfoncement physique au maintien
  const [pressingTab, setPressingTab] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getActiveTab = (): NavTab => {
    if (currentPath === '/dashboard' || currentPath.includes('/kauri/normal-dashboard')) return 'accueil';
    if (currentPath === '/investments' || currentPath.includes('/kauri/investissement')) return 'investissement';
    if (currentPath === '/tontines' || currentPath.includes('/kauri/tontines-actives') || currentPath.includes('/kauri/mes-tontines')) return 'kauri';
    if (currentPath === '/feed' || currentPath.includes('/kauri/social-feed') || currentPath.includes('/kauri/social-hub')) return 'social';
    if (currentPath === '/profile' || currentPath.includes('/kauri/profil-particulier')) return 'profil';
    return 'accueil';
  };

  const active = getActiveTab();

  const tabs = [
    { id: 'accueil',        label: 'Home',     icon: LayoutDashboard, target: currentPath.includes('/kauri/') ? '/kauri/normal-dashboard' : '/dashboard' },
    { id: 'investissement', label: 'Invest',   icon: TrendingUp,      target: currentPath.includes('/kauri/') ? '/kauri/investissement' : '/investments' },
    { id: 'kauri',          label: 'Kauri',    icon: Leaf,            target: '/kauri/tontines-actives', isCenter: true },
    { id: 'social',         label: 'Social',   icon: null,            target: currentPath.includes('/kauri/') ? '/kauri/social-hub-gateway' : '/feed' },
    { id: 'profil',         label: 'Profile',  icon: User,            target: currentPath.includes('/kauri/') ? '/kauri/profil-particulier' : '/profile' },
  ];

  // ── ⚙️ LOGIQUE DE GESTION DU LONG PRESS (MAINTIEN PROLONGÉ) ──
  const startPress = (tabId: string, target: string) => {
    setPressingTab(tabId);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Déclenchement de la navigation après 400ms de maintien continu
    timerRef.current = setTimeout(() => {
      navigate(target);
      setPressingTab(null);
    }, 400);
  };

  const cancelPress = () => {
    setPressingTab(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <nav 
      className="fixed left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl transition-all select-none"
      style={{ 
        backgroundColor: bg, 
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        width: 'calc(100% - 24px)',
        maxWidth: '406px',
        border: `1px solid ${border}`,
        borderRadius: '32px',
        paddingTop: '12px',
        paddingBottom: '12px',
        boxShadow: isDarkMode 
          ? '0 16px 36px -6px rgba(0, 0, 0, 0.6), 0 4px 16px -4px rgba(0, 0, 0, 0.4)' 
          : '0 16px 36px -6px rgba(15, 23, 42, 0.06), 0 4px 16px -4px rgba(15, 23, 42, 0.03)',
        WebkitUserSelect: 'none', // Bloque la sélection de texte native sur iOS
      }}
    >
      <div className="flex items-center justify-around px-2 relative">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const isCurrentlyPressed = pressingTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div 
                key={tab.id} 
                className="flex flex-col items-center gap-1.5 relative" 
                style={{ minWidth: 50, userSelect: 'none' }}
              >
                <div className="w-[20px] h-[20px] invisible" />
                <span className="text-[10px] font-bold invisible select-none">Kauri</span>
                
                <button
                  onMouseDown={() => startPress(tab.id, tab.target)}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onTouchStart={(e) => { e.preventDefault(); startPress(tab.id, tab.target); }}
                  onTouchEnd={cancelPress}
                  className="cursor-pointer border-none outline-none absolute"
                  style={{
                    width: 54, 
                    height: 54, 
                    borderRadius: '50%',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    left: '50%',
                    border: isActive ? '2.5px solid #ffffff' : '2px solid rgba(255,255,255,0.45)',
                    background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
                    zIndex: 10,
                    // Équation d'enfoncement dynamique basée sur la pression active
                    top: isCurrentlyPressed ? -2 : -6,
                    transform: `translateX(-50%) scale(${isCurrentlyPressed ? 0.92 : 1})`,
                    boxShadow: isCurrentlyPressed 
                      ? '0 3px 8px rgba(212,175,55,0.2)' 
                      : '0 8px 20px rgba(212,175,55,0.35), 0 3px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.15s ease, boxShadow 0.15s ease',
                  }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: 24, height: 24, color: '#fff', display: 'block', margin: 'auto' }}>
                    <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
                  </svg>
                  
                  <div
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#0F172A' : '#006D77',
                      border: '1.5px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 900, lineHeight: 1, marginTop: -1 }}>+</span>
                  </div>
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onMouseDown={() => startPress(tab.id, tab.target)}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={(e) => { e.preventDefault(); startPress(tab.id, tab.target); }}
              onTouchEnd={cancelPress}
              className="flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 relative outline-none"
              style={{ 
                color: isActive ? activeColor : inactiveColor, 
                minWidth: 50,
                transform: `scale(${isCurrentlyPressed ? 0.90 : 1})`,
                transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
                WebkitTouchCallout: 'none', // Désactive le menu de copie d'image ou lien de l'OS mobile
              }}
            >
              {tab.id === 'social' ? (
                <SocialIcon color={isActive ? activeColor : inactiveColor} size={22} />
              ) : (
                Icon && <Icon className="w-[20px] h-[20px]" style={{ strokeWidth: isActive ? 2.4 : 1.8 }} />
              )}
              <span className="text-[10px] font-bold tracking-wide transition-colors">{tab.label}</span>
              {isActive && (
                <span 
                  className="absolute rounded-full" 
                  style={{ bottom: -6, width: 4, height: 4, backgroundColor: activeColor }} 
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
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
