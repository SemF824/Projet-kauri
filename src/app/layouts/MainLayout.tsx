import { Outlet, useLocation, useNavigate } from 'react-router';
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

// ── Barre de Navigation Basse Universelle Premium ────────────────────────────
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
  
  const bg = isDarkMode ? 'rgba(30, 41, 59, 0.94)' : 'rgba(255, 255, 255, 0.92)';
  const border = isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(232, 237, 242, 0.8)';
  const currentPath = location.pathname;

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

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 backdrop-blur-xl transition-all"
      style={{ 
        backgroundColor: bg, 
        borderTop: `1px solid ${border}`,
        // ── LIBÉRATION DU PADDING INFÉRIEUR POUR EMPECHER LE BLOCAGE DE LA BORDURE ──
        paddingTop: '14px',
        paddingBottom: 'calc(26px + env(safe-area-inset-bottom, 0px))',
        boxShadow: isDarkMode 
          ? '0 -12px 30px -5px rgba(0, 0, 0, 0.4), 0 -4px 12px -5px rgba(0, 0, 0, 0.3)' 
          : '0 -12px 30px -5px rgba(0, 0, 0, 0.04), 0 -4px 12px -5px rgba(0, 0, 0, 0.02)'
      }}
    >
      <div className="flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative flex flex-col items-center justify-center" style={{ minWidth: 64, height: 44 }}>
                <button
                  onClick={() => navigate(tab.target)}
                  className="cursor-pointer border-none outline-none"
                  style={{
                    width: 58, height: 58, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    // ── SURÉLÉVATION STRATÉGIQUE POUR SÉPARER LE LOGO DU RESTE DU BLOC ──
                    transform: 'translateY(-16px)',
                    boxShadow: '0 6px 20px rgba(212,175,55,0.45), 0 3px 8px rgba(0,0,0,0.12)',
                    border: isActive ? '2.5px solid #ffffff' : '2px solid rgba(255,255,255,0.4)',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
                  }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: 26, height: 26, color: '#fff', margin: 'auto' }}>
                    <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
                  </svg>
                  
                  {/* Plus Badge ajusté au millimètre supérieur */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: -1,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#0F172A' : '#006D77',
                      border: '1.5px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
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
              onClick={() => navigate(tab.target)}
              className="flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 relative outline-none transition-transform active:scale-95"
              style={{ color: isActive ? activeColor : inactiveColor, minWidth: 50 }}
            >
              {tab.id === 'social' ? (
                <SocialIcon color={isActive ? activeColor : inactiveColor} size={24} />
              ) : (
                Icon && <Icon className="w-[22px] h-[22px]" style={{ strokeWidth: isActive ? 2.3 : 1.7 }} />
              )}
              <span className="text-[11px] font-bold tracking-wide transition-colors">{tab.label}</span>
              {isActive && (
                <span 
                  className="absolute rounded-full" 
                  style={{ bottom: -8, width: 4, height: 4, backgroundColor: activeColor }} 
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
