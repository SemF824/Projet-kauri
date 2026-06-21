import { Eye, EyeOff, TrendingUp, Users, Plus, Bell, User, Wallet, Heart, BarChart3, LogOut, WifiOff, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function ProDashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isDarkMode, toggleDarkMode, resetDarkMode } = useDarkMode();

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

  const projects = [
    { name: 'Lolo Moderne', funding: 45000, goal: 100000, backers: 87 },
    { name: 'Coopérative Agricole', funding: 32000, goal: 50000, backers: 42 },
  ];

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg ${isDarkMode ? 'bg-[#D4AF37] border-white' : 'bg-white border-[#D4AF37]'}`}>
              <span className={isDarkMode ? 'text-white' : 'text-[#D4AF37]'}>MC</span>
            </div>
            <div>
              <h2 className="text-white">Bonjour, Marie</h2>
              <p className="text-white/90 text-sm">Compte Professionnel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => navigate('/kauri/pro-notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              title="Notifications Pro"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm">Portefeuille Business</span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <h1 className="text-white text-3xl mb-4">
            {balanceVisible ? '12 750,00 €' : '•••••'}
          </h1>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/kauri/pro-manage-account')}
              className="bg-white text-[#D4AF37] py-3 rounded-xl text-sm"
            >
              Gérer
            </button>
            <button
              onClick={() => navigate('/kauri/pro-project-form')}
              className="bg-[#006D77] text-white py-3 rounded-xl text-sm"
            >
              Nouveau Projet
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
            <p className="text-white text-sm mb-1">Mode Hors-Ligne</p>
            <p className="text-white/80 text-xs">
              Données en cache • Dernière synchro : 1 mai 2026
            </p>
          </div>
        </div>
      )}

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className={`rounded-xl p-4 text-center shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
            <BarChart3 className="w-8 h-8 text-[#006D77] mx-auto mb-2" />
            <p className={`mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>77 000 €</p>
            <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Levés</p>
          </div>

          <div className={`rounded-xl p-4 text-center shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
            <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <p className={`mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>129</p>
            <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Investisseurs</p>
          </div>

          <div className={`rounded-xl p-4 text-center shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
            <TrendingUp className="w-8 h-8 text-[#0D9488] mx-auto mb-2" />
            <p className={`mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>2</p>
            <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Projets</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
              <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
              Mes Levées de Fonds
            </h3>
            <button
              onClick={() => navigate('/kauri/pro-project-form')}
              className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-[#0D9488]' : 'text-[#006D77]'}`}
            >
              <Plus className="w-4 h-4" />
              <span>Publier</span>
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project, index) => {
              const percentage = Math.round((project.funding / project.goal) * 100);
              return (
                <div
                  key={index}
                  className={`rounded-xl p-5 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>{project.name}</h4>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs rounded-full">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>
                        {project.funding.toLocaleString()} €
                      </span>
                      <span className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}> / {project.goal.toLocaleString()} €</span>
                    </div>
                    <div className={`flex items-center gap-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      <Users className="w-4 h-4" />
                      <span>{project.backers}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/kauri/pro-project-form')}
            className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Projet</span>
          </button>
          <button
            onClick={() => navigate('/kauri/pot-commun')}
            className="bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Pot Commun</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/kauri/pro-multi-signature')}
          className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl shadow-lg"
        >
          Validation Multi-Signatures Pro
        </button>
      </div>

      <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-4 max-w-md mx-auto ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <Wallet className="w-6 h-6 text-[#D4AF37]" />
            <span className="text-xs text-[#D4AF37]">FinTech</span>
          </button>
          <button
            onClick={() => navigate('/kauri/social-hub-gateway')}
            className="flex flex-col items-center gap-1"
          >
            <Heart className="w-6 h-6 text-[#94A3B8]" />
            <span className="text-xs text-[#94A3B8]">Social</span>
          </button>
          <button
            onClick={() => navigate('/kauri/profil-pro')}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-6 h-6 text-[#94A3B8]" />
            <span className="text-xs text-[#94A3B8]">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}