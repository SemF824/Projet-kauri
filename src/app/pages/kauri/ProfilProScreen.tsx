import { ArrowLeft, Building, Shield, FileText, Users, TrendingUp, Award, ChevronRight, Settings, LogOut, BarChart3, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function ProfilProScreen() {
  const navigate = useNavigate();
  const { isDarkMode, resetDarkMode } = useDarkMode();

  const trustScore = 92;

  const handleLogout = () => {
    resetDarkMode();
    localStorage.removeItem('kauri_account_type');
    navigate('/kauri/login');
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-[#D4AF37] shadow-xl">
            <Building className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl mb-1">SARL Innovation Caraïbes</h1>
            <p className="text-white/90 text-sm">Compte professionnel vérifié</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white text-sm">Trust Score Corporate</span>
            </div>
            <span className="text-[#D4AF37] text-2xl font-bold">{trustScore}</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]"
              style={{ width: `${trustScore}%` }}
            ></div>
          </div>
          <p className="text-white/80 text-xs mt-2">Excellent • Partenaire de confiance</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className={`rounded-2xl p-5 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>Vérification KYB</h3>
            <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs rounded-full">✓ Vérifié</span>
          </div>
          <div className="space-y-3">
            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#334155] border-[#475569]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>SIRET</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>123 456 789 00012</p>
                  </div>
                </div>
                <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
              </div>
            </div>

            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#334155] border-[#475569]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Forme juridique</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>SARL</p>
                  </div>
                </div>
                <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
              </div>
            </div>

            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#334155] border-[#475569]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Dirigeants</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Marie Céleste (Gérante)</p>
                  </div>
                </div>
                <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Métriques business</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <DollarSign className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-[#0D9488]' : 'text-[#006D77]'}`} />
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Levés total</p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>77 000 €</p>
            </div>

            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <Users className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-[#F59E0B]' : 'text-[#D4AF37]'}`} />
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Investisseurs</p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>129</p>
            </div>

            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <BarChart3 className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-[#0D9488]' : 'text-[#006D77]'}`} />
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Projets actifs</p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>2</p>
            </div>

            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <TrendingUp className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-[#F59E0B]' : 'text-[#D4AF37]'}`} />
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Taux de succès</p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>100%</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Certifications & badges</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Impact Social</p>
            </div>

            <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Vérifié KYB</p>
            </div>

            <div className={`rounded-xl p-4 text-center ${isDarkMode ? 'bg-[#1E293B] border border-[#334155]' : 'bg-white border border-[#E2E8F0]'}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Top Performer</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Paramètres professionnels</span>
            </div>
            <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl p-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B05B3B] to-[#DC2626] text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
