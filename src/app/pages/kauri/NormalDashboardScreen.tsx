import { Eye, EyeOff, Users, Wallet, Bell, User, RefreshCcw, TrendingUp, LogOut, WifiOff, Moon, Sun, Compass, Flame, Crown, CheckCircle, Leaf, Home, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';
import { KauriBottomNav } from '../../layouts/MainLayout';

export function NormalDashboardScreen() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { profile, user, refreshProfile } = useAuth();
  const [tontinesCount, setTontinesCount] = useState<number | null>(null);
  const [investmentsCount, setInvestmentsCount] = useState<number | null>(null);

  const [rwaTotalAmount, setRwaTotalAmount] = useState<number>(0);
  const [tontinesTotalAmount, setTontinesTotalAmount] = useState<number>(0);

  const rawScore = profile?.trust_score !== undefined ? profile.trust_score : (profile?.trustScore !== undefined ? profile.trustScore : 0);
  const trustScore = Math.round(Number(rawScore) || 0);
  
  const calculateStreak = () => {
    if (!profile?.created_at) return 0;
    const createdDate = new Date(profile.created_at);
    const now = new Date();
    const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
    return Math.max(0, diffMonths);
  };
  const paymentStreak = calculateStreak();

  const userStatus = trustScore >= 85 ? 'Membre Émérite' : trustScore >= 40 ? 'Membre Actif' : 'Nouveau Membre';
  const firstName = profile?.firstName ?? profile?.first_name ?? 'Vous';
  
  const availableLiquidity = Number(profile?.balance ?? 0);
  const totalCombinedWealth = availableLiquidity + rwaTotalAmount + tontinesTotalAmount;
  
  const currentKycStatus = profile?.kyc_status || profile?.kycStatus || 'pending';
  const isKycVerified = currentKycStatus === 'verified' || profile?.kyc_completed === true || profile?.kycCompleted === true;
  const isKycRejected = currentKycStatus === 'rejected';

  const initials = profile?.firstName && profile?.lastName 
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase() 
    : (profile?.first_name && profile?.last_name ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase() : 'KA');

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

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

  useEffect(() => {
    refreshProfile();
    const fetchCountsAndWealth = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();
        
        const { data: tData, error: tError } = await supabase
          .from('tontine_members')
          .select(`
            tontine_id,
            tontines (
              contribution_amount
            )
          `)
          .eq('user_id', user.id);

        if (!tError && tData) {
          setTontinesCount(tData.length);
          const totalTontineSum = tData.reduce((acc, curr: any) => acc + (Number(curr.tontines?.contribution_amount) || 0), 0);
          setTontinesTotalAmount(totalTontineSum);
        }

        const { data: iData, error: iError } = await supabase
          .from('rwa_investments')
          .select('id, amount');

        if (!iError && iData) {
          setInvestmentsCount(iData.length);
          const totalRwaSum = iData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
          setRwaTotalAmount(totalRwaSum);
        }
      } catch (err) {
        console.error('Erreur synchronisation compteurs dashboard:', err);
      }
    };
    fetchCountsAndWealth();
  }, [user]);

  return (
    <div className={`min-h-screen pb-24 transition-colors relative ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      
      {/* ── CONTENU DU DASHBOARD (FLOUTÉ SI PAS VERIFIÉ) ── */}
      <div className={`transition-all duration-300 ${!isKycVerified ? 'blur-[6px] pointer-events-none select-none opacity-40' : ''}`}>
        <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center border-2 border-white shadow-xl">
                <span className="text-white text-lg font-bold">{initials}</span>
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Bonjour, {firstName}</h2>
                <p className="text-[#E0F2FE] text-sm">Bon retour sur KAURI</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div 
                onClick={() => navigate('/kauri/portefeuille')}
                className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black cursor-pointer transition-transform active:scale-95 shadow-sm"
              >
                {availableLiquidity.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-medium text-white">{userStatus}</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer border-none"
                title={isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => navigate('/kauri/notifications')}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer border-none"
              >
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 cursor-pointer" onClick={() => navigate('/kauri/trust-score-intro')}>
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
                      className="transition-all duration-1000 ease-out"
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
              <span className="text-[#E0F2FE] text-sm">Solde total (Patrimoine)</span>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-white cursor-pointer bg-transparent border-none"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <h1 className="text-white text-3xl mb-4 font-black tracking-tight">
              {balanceVisible ? `${totalCombinedWealth.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '•••••'}
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/kauri/portefeuille')}
                className="bg-white text-[#006D77] py-3 rounded-xl text-sm font-bold cursor-pointer border-none transition-transform active:scale-95 shadow-md"
              >
                Détails
              </button>
              <button
                onClick={() => navigate('/kauri/send-money')}
                className="bg-[#D4AF37] text-white py-3 rounded-xl text-sm font-bold cursor-pointer border-none transition-transform active:scale-95 shadow-md"
              >
                Envoyer
              </button>
            </div>
          </div>

          <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 border transition-all mt-3 ${trustScore >= 85 ? 'border-[#D4AF37]/50' : 'border-white/10 opacity-50'}`}>
            <div className="flex items-start gap-3">
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${trustScore >= 85 ? 'text-[#D4AF37]' : 'text-white/30'}`} />
              <div>
                <p className="text-white text-sm font-bold mb-1">
                  Avantage Membre Émérite
                </p>
                <p className="text-white/80 text-xs leading-relaxed">
                  {trustScore >= 85 
                    ? <><span className="font-bold text-[#D4AF37]">Frais réduits à 0%</span> débloqués pour vos CICO de ce mois-ci.</>
                    : "Atteignez 85 pts de confiance pour débloquer les transactions à 0% de frais."
                  }
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
              <p className="text-white text-sm font-bold mb-1">Mode Hors-Ligne</p>
              <p className="text-white/80 text-xs">
                Solde en cache. Reconnexion requise pour actualiser.
              </p>
            </div>
          </div>
        )}

        <div className="px-6 py-6 space-y-6">
          <div>
            <h3 className={`mb-4 flex items-center gap-2 font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full"></div>
              Tableau de bord
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => navigate('/kauri/tontines-actives')}
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#006D77]" />
                </div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Tontines</p>
                <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{tontinesCount !== null ? `${tontinesCount} active${tontinesCount !== 1 ? 's' : ''}` : '…'}</p>
              </button>

              <button
                onClick={() => navigate('/kauri/mes-investissements')}
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Projets</p>
                <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{investmentsCount !== null ? `${investmentsCount} actif${investmentsCount !== 1 ? 's' : ''}` : '…'}</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/kauri/historique-swaps')}
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Swap</p>
                <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>1</p>
              </button>

              <button
                onClick={() => navigate('/kauri/discover-circles')}
                className={`rounded-xl p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-[#006D77]" />
                </div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#4A4A4A]'}`}>Cercles</p>
                <p className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Publics</p>
              </button>
            </div>
          </div>

          <div>
            <h3 className={`mb-4 flex items-center gap-2 font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
              <div className="w-1.5 h-5 bg-[#006D77] rounded-full"></div>
              Mes Tontines Privées
            </h3>

            <div className="space-y-3">
              <div className={`rounded-xl p-4 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Cercle Familial</h4>
                  <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-[10px] rounded-full font-bold uppercase tracking-wider">
                    Actif
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Prochain pot</span>
                  <span className={`font-black ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>500,00 €</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`}>
                  <div className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488] w-4/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/kauri/emergency-swap')}
            className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 font-bold cursor-pointer border-none"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Échanger ma position d'urgence</span>
          </button>
        </div>
      </div>

      {/* ── ENCLAVE OVERLAY RÉGLEMENTAIRE FINANCIER (PROTÉGÉ) ── */}
      {!isKycVerified && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-transparent z-40">
          <div className={`w-full max-w-md rounded-[2rem] border shadow-2xl p-6 text-center space-y-6 ${isDarkMode ? 'bg-[#1E293B] border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${isKycRejected ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {isKycRejected ? <ShieldAlert className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
            </div>
            <div className="space-y-2">
              <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                {isKycRejected ? 'Dossier de conformité rejeté' : 'Compte en cours de validation'}
              </h2>
              <p className={`text-xs leading-relaxed px-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-[#475569]'}`}>
                {isKycRejected 
                  ? "Vos pièces justificatives n'ont pas pu être validées par notre équipe de conformité. Veuillez soumettre à nouveau vos documents réglementaires."
                  : "Bonjour ! Vos pièces justificatives ont été transmises avec succès au registre central de KAURI. Votre dossier est en cours d'analyse."}
              </p>
            </div>
            
            {!isKycRejected && (
              <div className={`${isDarkMode ? 'bg-[#006D77]/10 border border-[#006D77]/20' : 'bg-[#E6F4F5] border border-[#006D77]/10'} rounded-2xl p-4`}>
                <p className={`text-xs font-bold leading-relaxed text-center ${isDarkMode ? 'text-teal-400' : 'text-[#006D77]'}`}>
                  ⏳ Activation de vos accès financiers sous 24 heures.
                </p>
              </div>
            )}

            <div className={`rounded-2xl p-4 text-left text-xs leading-relaxed space-y-2 border ${isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              <p className={`font-black uppercase tracking-wider text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Fonctionnalités gelées temporairement :</p>
              <div className="space-y-1 font-medium">
                <p>• Création et paiement de Tontines</p>
                <p>• Dépôts et retraits de capitaux</p>
                <p>• Souscription aux levées de fonds</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/kauri/kyc-verification')}
              className={`w-full py-4 rounded-xl text-white font-bold text-[13px] tracking-wide uppercase shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none ${isKycRejected ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#006D77] hover:bg-[#00525a] shadow-[#006D77]/20'}`}
            >
              <span>{isKycRejected ? 'Soumettre à nouveau les pièces' : 'Vérifier mes documents'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* INTÉGRATION DE LA BARRE CENTRALE */}
      <KauriBottomNav />
    </div>
  );
}

export default NormalDashboardScreen;
