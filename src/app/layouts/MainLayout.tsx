import { Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import { LayoutDashboard, TrendingUp, User, Leaf } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

type NavTab = 'accueil' | 'investissement' | 'kauri' | 'social' | 'profil';

function SocialIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="pointer-events-none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      <path d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="7" cy="10.5" r="1.1" fill={color} />
      <circle cx="17" cy="10.5" r="1.1" fill={color} />
      <circle cx="12" cy="6.5" r="1.1" fill={color} />
    </svg>
  );
}

export function KauriBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  let isDarkMode = false;
  try { const { isDarkMode: dm } = useDarkMode(); isDarkMode = dm; } catch (e) { isDarkMode = document.documentElement.classList.contains('dark'); }

  const activeColor = '#0D9488';   
  const inactiveColor = '#94A3B8'; 
  const bg = isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const border = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)';
  
  const currentPath = location.pathname;
  const getActiveTab = (): NavTab => {
    if (currentPath.includes('/dashboard')) return 'accueil';
    if (currentPath.includes('/investissement')) return 'investissement';
    if (currentPath.includes('/tontines')) return 'kauri';
    if (currentPath.includes('/social')) return 'social';
    if (currentPath.includes('/profil')) return 'profil';
    return 'accueil';
  };
  const active = getActiveTab();

  // Moteur de Swipe
  const touchStartX = useRef<number | null>(null);
  const isSlidingRef = useRef(false);
  const tabs = [
    { id: 'accueil', label: 'Home', icon: LayoutDashboard, target: '/kauri/normal-dashboard' },
    { id: 'investissement', label: 'Invest', icon: TrendingUp, target: '/kauri/investissement' },
    { id: 'kauri', label: 'Kauri', icon: Leaf, target: '/kauri/tontines-actives', isCenter: true },
    { id: 'social', label: 'Social', icon: null, target: '/kauri/social-hub-gateway' },
    { id: 'profil', label: 'Profile', icon: User, target: '/kauri/profil-particulier' },
  ];

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) > 50) {
      const idx = tabs.findIndex(t => t.id === active);
      const next = diff > 0 ? Math.min(idx + 1, 4) : Math.max(idx - 1, 0);
      if (idx !== next) {
        if (navigator.vibrate) navigator.vibrate(10);
        navigate(tabs[next].target);
      }
    }
    touchStartX.current = null;
  };

  return (
    <nav 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl flex items-center justify-around px-3 py-2"
      style={{ 
        backgroundColor: bg, width: 'calc(100% - 32px)', maxWidth: '400px',
        border: `1px solid ${border}`, borderRadius: '40px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        if (tab.isCenter) return (
          <button key={tab.id} onClick={() => navigate(tab.target)} 
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', marginTop: -20, border: '3px solid white' }}>
            <Leaf className="w-6 h-6 text-white" />
          </button>
        );
        return (
          <button key={tab.id} onClick={() => navigate(tab.target)}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300"
            style={{ backgroundColor: isActive ? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent' }}>
            {tab.id === 'social' ? <SocialIcon color={isActive ? activeColor : inactiveColor} size={22} /> : 
             <tab.icon className="w-5 h-5" style={{ color: isActive ? activeColor : inactiveColor }} />}
            <span className="text-[9px] font-bold mt-1" style={{ color: isActive ? activeColor : inactiveColor }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MainLayout() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative pb-28">
      <Outlet />
      <KauriBottomNav />
    </div>
  );
}
export default MainLayout;
