import { Eye, EyeOff, TrendingUp, Users, Plus, Bell, User, BarChart3, WifiOff, Moon, Sun, Home, Briefcase, Play, BarChart2, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useProData } from '../../contexts/ProDataContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProPublications, computeSocialStats } from '../../contexts/ProPublicationsContext';

// ── Social icon (même que dashboard normal) ───────────────────────────────────
function SocialIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      <path d="M3 12 Q7 9.5 12 9.5 Q17 9.5 21 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="7"  cy="10.5" r="1.1" fill={color} />
      <path d="M5.8 13.5 Q7 12.5 8.2 13.5"   stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="10.5" r="1.1" fill={color} />
      <path d="M15.8 13.5 Q17 12.5 18.2 13.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="6.5"  r="1.1" fill={color} />
      <path d="M10.8 9.5 Q12 8.5 13.2 9.5"   stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <line x1="8"   y1="11" x2="11"  y2="7.5"  stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="16"  y1="11" x2="13"  y2="7.5"  stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── Pro bottom nav ────────────────────────────────────────────────────────────
type ProTab = 'accueil' | 'projets' | 'kauri' | 'social' | 'profil';

function ProBottomNav({
  active, isDarkMode, navigate,
}: { active: ProTab; isDarkMode: boolean; navigate: (p: string) => void }) {
  const GOLD = '#D4AF37';
  const TEAL = '#006D77';
  const bg      = isDarkMode ? '#1E293B' : '#ffffff';
  const border  = isDarkMode ? '#334155' : '#E8EDF2';
  const inactive = isDarkMode ? '#475569' : '#94A3B8';

  const tabs: { id: ProTab; icon?: React.ElementType; label: string; path?: string; isCenter?: boolean }[] = [
    { id: 'accueil', icon: Home,      label: 'Accueil',  path: '/kauri/pro-dashboard' },
    { id: 'projets', icon: Briefcase, label: 'Projets',  path: '/kauri/pro-projets' },
    { id: 'kauri',                    label: 'Kauri',    path: '/kauri/pro-creer-tontine', isCenter: true },
    { id: 'social',                   label: 'Social',   path: '/kauri/social-hub-gateway' },
    { id: 'profil',  icon: User,      label: 'Profil',   path: '/kauri/profil-pro' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50"
      style={{
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
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
                aria-label="Kauri Pro"
                className="cursor-pointer"
                style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  marginBottom: 6,
                  display: 'flex', alignItems: 'center', justifycontent: 'center',
                  background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
                  boxShadow: '0 4px 16px rgba(212,175,55,0.50), 0 2px 8px rgba(0,0,0,0.18)',
                  border: isActive ? '2.5px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.2)',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                  overflow: 'hidden',
                }}
              >
                <svg viewBox="0 0 100 100" style={{ width: 28, height: 28, color: '#fff', margin: 'auto' }}>
                  <path
                    d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                    fill="currentColor"
                  />
                </svg>
              </button>
            );
          }

          if (tab.id === 'social') {
            return (
              <button
                key={tab.id}
                onClick={() => tab.path && navigate(tab.path)}
                aria-label="Social"
                className="flex flex-col items-center gap-0.5 relative cursor-pointer border-none bg-transparent"
                style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}
              >
                <SocialIcon color={isActive ? TEAL : inactive} size={22} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? TEAL : inactive, transition: 'color 0.15s' }}>
                  {tab.label}
                </span>
                {isActive && (
                  <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', backgroundColor: TEAL }} />
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
              style={{ minWidth: 44, paddingTop: 6, paddingBottom: 2 }}
            >
              {Icon && (
                <Icon
                  style={{
                    width: 22, height: 22,
                    color: isActive ? GOLD : inactive,
                    strokeWidth: isActive ? 2.2 : 1.8,
                    transition: 'color 0.15s',
                  }}
                />
              )}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? GOLD : inactive, transition: 'color 0.15s' }}>
                {tab.label}
              </span>
              {isActive && (
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', backgroundColor: GOLD }} />
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
  const { isDarkMode, toggleDarkMode, resetDarkMode } = useDarkMode();
  const { profile } = useAuth();

  const displayName = profile?.businessName || profile?.firstName || profile?.first_name || 'Professionnel';
  
  const currentKycStatus = profile?.kyc_status || profile?.kycStatus || 'pending';
  const isKycVerified = currentKycStatus === 'verified' || profile?.kyc_completed === true || profile?.kycCompleted === true;
  const isKycRejected = currentKycStatus === 'rejected';

  const initials = profile?.businessName
    ? profile.businessName.slice(0, 2).toUpperCase()
    : `${(profile?.firstName?.[0] ?? profile?.first_name?.[0] ?? 'P')}${(profile?.lastName?.[0] ?? profile?.last_name?.[0] ?? '')}`.toUpperCase();

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

  const { projets } = useProData();
  const { publications } = useProPublications();
  const socialStats = computeSocialStats(publications);
  const projetsActifs = projets.filter(p => p.statut === 'En cours');
  const totalLeve  = projets.reduce((s, p) => s + p.leve, 0);
  const totalBackers = projets.reduce((s, p) => s + p.backers, 0);
  const projects = projetsActifs.slice(0, 3).map(p => ({
    name: p.nom, funding: p.leve, goal: p.objectif, backers: p.backers,
  }));

  return (
    <div className={`min-h-screen pb-24 transition-colors relative ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      
      {/* ── CONTENU DU DASHBOARD (FLOUTÉ SI PAS VERIFIÉ) ── */}
      <div className={`transition-all duration-300 ${!isKycVerified ? 'blur-[6px] pointer-events-none select-none opacity-40' : ''}`}>
        <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg ${isDarkMode ? 'bg-[#D4AF37] border-white' : 'bg-white border-[#D4AF37]'}`}>
                <span className={isDarkMode ? 'text-white' : 'text-[#D4AF37]'}>{initials}</span>
              </div>
              <div>
                <h2 className="text-white">Bonjour, {displayName}</h2>
                <p className="text-white/90 text-sm">Compte Professionnel</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-none cursor-pointer"
                title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => navigate('/kauri/pro-notifications')}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-none cursor-pointer"
                title="Notifications Pro"
              >
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm">Portefeuille Business</span>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white bg-transparent border-none cursor-pointer"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <h1 className="text-white text-3xl mb-4">
              {balanceVisible ? '12 750,00 €' : '•••••'}
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/kauri/pro-portefeuille')}
                className="bg-white text-[#D4AF37] py-3 rounded-xl text-sm font-medium border-none cursor-pointer"
              >
                Détail
              </button>
              <button
                onClick={() => navigate('/kauri/pro-projets')}
                className="bg-[#006D77] text-white py-3 rounded-xl text-sm font-medium border-none cursor-pointer"
              >
                Gérer
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
            <button
              onClick={() => navigate('/kauri/pro-leves')}
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <BarChart3 className="w-8 h-8 text-[#006D77] mx-auto mb-2" />
              <p className={`mb-1 font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{totalLeve.toLocaleString('fr-FR')} €</p>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Levés</p>
            </button>

            <button
              onClick={() => navigate('/kauri/pro-investisseurs')}
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <p className={`mb-1 font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{totalBackers}</p>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Investisseurs</p>
            </button>

            <button
              onClick={() => navigate('/kauri/pro-projets')}
              className={`rounded-xl p-4 text-center shadow-md border transition-opacity active:opacity-70 border-none cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <TrendingUp className="w-8 h-8 text-[#0D9488] mx-auto mb-2" />
              <p className={`mb-1 font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{projetsActifs.length}</p>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Projets</p>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
                Mes Levées de Fonds
              </h3>
              <button
                onClick={() => navigate('/kauri/pro-projets')}
                className={`text-sm underline underline-offset-2 bg-transparent border-none cursor-pointer ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
              >
                Tout voir
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

          {/* ── Réseau Social ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                <div className="w-1 h-5 bg-[#B05B3B] rounded-full" />
                Réseau Social
              </h3>
              <button
                onClick={() => navigate('/kauri/pro-publication-stats')}
                className={`text-sm underline underline-offset-2 bg-transparent border-none cursor-pointer ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
              >
                Statistiques
              </button>
            </div>

            <div className={`rounded-2xl p-4 border mb-3 grid grid-cols-3 gap-3 ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'} shadow-md`}>
              {[
                { label: 'Publications', value: String(socialStats.nbPublications), icon: Play, color: '#006D77' },
                { label: 'Vues totales', value: socialStats.totalVues >= 1000 ? `${(socialStats.totalVues / 1000).toFixed(1)}k` : String(socialStats.totalVues), icon: BarChart2, color: '#D4AF37' },
                { label: 'Abonnés', value: String(socialStats.totalAbonnes), icon: Users, color: '#B05B3B' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="w-9 h-9 mx-auto mb-1.5 rounded-full flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{stat.value}</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/kauri/pro-publish')}
              className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg font-semibold border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle Publication</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/kauri/pro-project-form')}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg font-semibold border-none cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Projet</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/kauri/pot-commun')}
              className={`py-4 rounded-xl border-2 font-medium text-sm transition-colors cursor-pointer bg-transparent ${isDarkMode ? 'border-[#334155] text-[#94A3B8]' : 'border-[#E2E8F0] text-[#64748B]'}`}
            >
              Pot Commun
            </button>
            <button
              onClick={() => navigate('/kauri/multi-signature')}
              className="bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl font-medium text-sm shadow-lg border-none cursor-pointer"
            >
              Multi-Signatures
            </button>
          </div>
        </div>
      </div>

      {/* ── ENCLAVE OVERLAY RÉGLEMENTAIRE FINANCIER BUSINESS (PROTÉGÉ) ── */}
      {!isKycVerified && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-transparent z-40">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 text-center space-y-5 ${isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${isKycRejected ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {isKycRejected ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>
            <div className="space-y-2">
              <h2 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                {isKycRejected ? 'Dossier de conformité rejeté' : 'Compte en cours de validation'}
              </h2>
              <p className={`text-xs leading-relaxed px-2 ${isDarkMode ? 'text-slate-400' : 'text-[#475569]'}`}>
                {isKycRejected 
                  ? "Vos pièces justificatives d'entreprise n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents professionnels."
                  : "Bonjour ! Vos pièces justificatives professionnelles ont été transmises avec succès au registre de contrôle de KAURI. Votre dossier est en cours d'analyse."}
              </p>
            </div>
            {!isKycRejected && (
              <div className={`${isDarkMode ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20' : 'bg-[#FEF3C7] border border-[#D4AF37]/10'} rounded-2xl p-4`}>
                <p className={`text-xs font-semibold leading-relaxed text-center ${isDarkMode ? 'text-amber-400' : 'text-[#92400E]'}`}>
                  ⏳ Activation de vos accès de levées de fonds sous 24 heures maximum.
                </p>
              </div>
            )}
            <div className={`rounded-2xl p-4 text-left text-[11px] leading-normal space-y-1.5 border ${isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              <p className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Fonctionnalités gelées temporairement :</p>
              <p>• Lancement, modification et publication de projets</p>
              <p>• Réception des capitaux d'investisseurs</p>
              <p>• Retraits et transferts vers vos comptes bancaires</p>
            </div>
            <button
              onClick={() => navigate('/kauri/kyc-verification')}
              className={`w-full py-4 rounded-xl text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none ${isKycRejected ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]'}`}
            >
              <span>{isKycRejected ? 'Soumettre à nouveau les pièces' : 'Vérifier mes documents'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <ProBottomNav active="accueil" isDarkMode={isDarkMode} navigate={navigate} />
    </div>
  );
}
