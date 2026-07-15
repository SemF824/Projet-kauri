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

// ── Barre de Navigation Basse Universelle Réutilisable ───────────────────────
export function KauriBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sécurisation de la détection du mode sombre
  let isDarkMode = false;
  try {
    const { isDarkMode: dm } = useDarkMode();
    isDarkMode = dm;
  } catch (e) {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  const activeColor = '#0D9488';   // Couleur active d'origine text-[#0D9488]
  const inactiveColor = '#94A3B8'; // Couleur inactive d'origine text-[#94A3B8]
  
  const bg = isDarkMode ? '#1E293B' : '#ffffff';
  const border = isDarkMode ? '#334155' : '#E2E8F0';
  const currentPath = location.pathname;

  // Analyse et mappage des trajectoires d'onglets pour réagir aux deux univers de routes
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
    { id: 'accueil',        label: 'Home',     icon: LayoutDashboard, paths: ['/dashboard', '/kauri/normal-dashboard'], target: currentPath.includes('/kauri/') ? '/kauri/normal-dashboard' : '/dashboard' },
    { id: 'investissement', label: 'Invest',   icon: TrendingUp,      paths: ['/investments', '/kauri/investissement'],   target: currentPath.includes('/kauri/') ? '/kauri/investissement' : '/investments' },
    { id: 'kauri',          label: 'Kauri',    icon: Leaf,            paths: ['/tontines', '/kauri/tontines-actives', '/kauri/mes-tontines'], target: '/kauri/tontines-actives', isCenter: true },
    { id: 'social',         label: 'Social',   icon: null,            paths: ['/feed', '/kauri/social-feed', '/kauri/social-hub-gateway'], target: currentPath.includes('/kauri/') ? '/kauri/social-hub-gateway' : '/feed' },
    { id: 'profil',         icon: User,        label: 'Profile',      paths: ['/profile', '/kauri/profil-particulier'],   target: currentPath.includes('/kauri/') ? '/kauri/profil-particulier' : '/profile' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 border-t px-6 py-4 max-w-md mx-auto z-50 shadow-2xl transition-colors"
      style={{ backgroundColor: bg, borderColor: border, paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
    >
      <div className="flex items-end justify-around">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative flex flex-col items-center justify-end" style={{ minWidth: 60, height: 56 }}>
                <button
                  onClick={() => navigate(tab.target)}
                  className="cursor-pointer border-none relative bg-transparent p-0 outline-none"
                  style={{
                    width: 54, height: 54, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(212,175,55,0.40), 0 2px 6px rgba(0,0,0,0.15)',
                    border: isActive ? '2.5px solid rgba(255,255,255,0.6)' : '2px solid rgba(255,255,255,0.2)',
                    transform: isActive ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                    flexShrink: 0,
                    overflow: 'visible',
                    background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
                  }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: 26, height: 26, color: '#fff', margin: 'auto' }}>
                    <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
                  </svg>
                  
                  {/* ── 🎯 ACCROCHAGE VISUEL DU PLUS EN HAUT À DROITE ── */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#0F172A' : '#006D77',
                      border: isDarkMode ? '1.5px solid #334155' : '1.5px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1.5px 4px rgba(0,0,0,0.2)',
                      zIndex: 10
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
              className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0 relative outline-none"
              style={{ color: isActive ? activeColor : inactiveColor, minWidth: 44 }}
            >
              {tab.id === 'social' ? (
                <SocialIcon color={isActive ? activeColor : inactiveColor} size={24} />
              ) : (
                Icon && <Icon className="w-6 h-6" style={{ strokeWidth: isActive ? 2.2 : 1.8 }} />
              )}
              <span className="text-xs font-semibold">{tab.label}</span>
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

// ── Layout de Structure Racine pour les routes de l'univers (/) ────────────────
export function MainLayout() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative pb-24">
      <Outlet />
      <KauriBottomNav />
    </div>
  );
}

export default MainLayout;
