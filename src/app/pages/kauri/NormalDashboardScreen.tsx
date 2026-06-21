import { Eye, EyeOff, Users, Wallet, Bell, User, RefreshCcw, TrendingUp, LogOut, WifiOff, Moon, Sun, Compass, Flame, Crown, CheckCircle, Leaf, Home } from 'lucide-react';
import kauriLogo from '../../../imports/image-9.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';

// ── Custom social icon: planet + interconnected people ───────────────────────
function SocialIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Globe */}
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      {/* Latitude arc */}
      <path d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Left person */}
      <circle cx="7" cy="10.5" r="1.1" fill={color} />
      <path d="M5.8 13.5 Q7 12.5 8.2 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Right person */}
      <circle cx="17" cy="10.5" r="1.1" fill={color} />
      <path d="M15.8 13.5 Q17 12.5 18.2 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Top person */}
      <circle cx="12" cy="6.5" r="1.1" fill={color} />
      <path d="M10.8 9.5 Q12 8.5 13.2 9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {/* Connection lines */}
      <line x1="8" y1="11" x2="11" y2="7.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="11" x2="13" y2="7.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── Shared bottom nav (5 tabs) ────────────────────────────────────────────────
type NavTab = 'accueil' | 'investissement' | 'kauri' | 'social' | 'profil';

function KauriBottomNav({ active, isDarkMode, navigate }: { active: NavTab; isDarkMode: boolean; navigate: (p: string) => void }) {
  const TEAL = '#006D77';
  const bg     = isDarkMode ? '#1E293B' : '#ffffff';
  const border = isDarkMode ? '#334155' : '#E8EDF2';
  const inactive = isDarkMode ? '#475569' : '#94A3B8';

  const tabs: { id: NavTab; icon: React.ElementType; label: string; path?: string; isCenter?: boolean }[] = [
    { id: 'accueil',        icon: Home,              label: 'Accueil',       path: '/kauri/normal-dashboard'   },
    { id: 'investissement', icon: Wallet,             label: 'Investissement',path: '/kauri/investissement'     },
    { id: 'kauri',          icon: Leaf,              label: 'Kauri',         path: '/kauri/tontines-actives', isCenter: true },
    { id: 'social',         icon: null,              label: 'Social',        path: '/kauri/social-hub-gateway' },
    { id: 'profil',         icon: User,              label: 'Profil',        path: '/kauri/profil-particulier' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto"
      style={{ backgroundColor: bg, borderTop: `1px solid ${border}`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-end justify-around px-2 pt-1.5 pb-3">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => tab.path && navigate(tab.path)}
                aria-label="Kauri"
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.50), 0 2px 8px rgba(0,0,0,0.18)',
                  border: isActive ? '2.5px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.2)',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                  marginBottom: 6,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
                }}
              >
                <svg viewBox="0 0 100 100" style={{ width: 28, height: 28, color: '#fff' }}>
                    <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
                  </svg>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => tab.path && navigate(tab.path)}
              aria-label={tab.label}
              className="flex flex-col items-center gap-0.5 relative"
              style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}
            >
              {tab.id === 'social'
                ? <SocialIcon color={isActive ? TEAL : inactive} size={22} />
                : Icon && <Icon style={{ width: 22, height: 22, color: isActive ? TEAL : inactive, strokeWidth: isActive ? 2.2 : 1.8, transition: 'color 0.15s' }} />
              }
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? TEAL : inactive, transition: 'color 0.15s' }}>
                {tab.label}
              </span>
              {isActive && (
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', backgroundColor: TEAL }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function NormalDashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isDarkMode, toggleDarkMode, resetDarkMode } = useDarkMode();

  const trustScore = 88;
  const paymentStreak = 6;
  const userStatus = 'Membre Émérite';

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    resetDarkMode();
    localStorage.removeItem('kauri_account_type');
    navigate('/kauri/login');
  };

  // Calcul du cercle de progression pour Trust Score
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center border-2 border-white shadow-xl">
              <span className="text-white text-lg font-bold">JD</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Bonjour, Jean</h2>
              <p className="text-[#E0F2FE] text-sm">Bon retour sur KAURI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-medium text-white">{userStatus}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => navigate('/kauri/notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Trust Score & Streak compacts */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Trust Score */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#E0F2FE" strokeWidth="6" fill="none" opacity="0.3" />
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
                  />
                  <defs>
                    <linearGradient id="miniTrustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-bold text-white">{trustScore}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/80">Trust Score</p>
                <p className="text-lg font-bold text-white">{trustScore}/100</p>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B05B3B] to-[#DC2626] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/80">Série Active</p>
                <p className="text-lg font-bold text-white">{paymentStreak} mois</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#E0F2FE] text-sm">Solde total</span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <h1 className="text-white text-3xl mb-4">
            {balanceVisible ? '2 450,00 €' : '•••••'}
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/kauri/portefeuille')}
              className="bg-white text-[#006D77] py-3 rounded-xl text-sm font-medium"
            >
              Détails
            </button>
            <button
              onClick={() => navigate('/kauri/send-money')}
              className="bg-[#D4AF37] text-white py-3 rounded-xl text-sm font-medium"
            >
              Envoyer
            </button>
          </div>
        </div>

        {/* Avantage Elite */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-[#D4AF37]/30">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">
                Avantage Membre Émérite
              </p>
              <p className="text-white/80 text-xs leading-relaxed">
                Frais CICO réduits à <span className="font-bold text-[#D4AF37]">0%</span> ce mois-ci
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
            <p className="text-white text-sm mb-1">Mode Hors-Ligne</p>
            <p className="text-white/80 text-xs">
              Solde en cache • Prochain tour : 8 mai 2026
            </p>
          </div>
        </div>
      )}

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
            <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
            Tableau de bord
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => navigate('/kauri/tontines-actives')}
              className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#006D77]" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Tontines</p>
              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>3 actives</p>
            </button>

            <button
              onClick={() => navigate('/kauri/projets-impacts')}
              className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Projets</p>
              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>d'impacts</p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/kauri/historique-swaps')}
              className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                <RefreshCcw className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Swap</p>
              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>1</p>
            </button>

            <button
              onClick={() => navigate('/kauri/discover-circles')}
              className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#006D77]" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Cercles</p>
              <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Publics</p>
            </button>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
            <div className="w-1 h-5 bg-[#006D77] rounded-full"></div>
            Mes Tontines Privées
          </h3>

          <div className="space-y-3">
            <div className={`rounded-xl p-4 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>Cercle Familial</h4>
                <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs rounded-full">
                  Actif
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Prochain pot</span>
                <span className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>500,00 €</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`}>
                <div className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488] w-4/5"></div>
              </div>
            </div>
          </div>
        </div>


        <button
          onClick={() => navigate('/kauri/emergency-swap')}
          className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <RefreshCcw className="w-5 h-5" />
          <span>Échanger ma position d'urgence</span>
        </button>

      </div>

      <KauriBottomNav active="accueil" isDarkMode={isDarkMode} navigate={navigate} />
    </div>
  );
}