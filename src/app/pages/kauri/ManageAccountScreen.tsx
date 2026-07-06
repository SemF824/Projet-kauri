import { ArrowLeft, CreditCard, Shield, Bell, Smartphone, Lock, Eye, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function ManageAccountScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const cards = [
    { id: '1', type: 'Virtuelle', number: '**** 8762', expires: '12/27', status: 'active' },
    { id: '2', type: 'Physique', number: '**** 3421', expires: '08/28', status: 'active' },
  ];

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Gérer mon compte</h1>
        <p className="text-white/90 text-sm">Cartes, sécurité & paramètres</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Mes Cartes</h3>
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl p-5 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Carte {card.type}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{card.number}</p>
                    </div>
                  </div>
                  <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Expire : {card.expires}</p>
                  <span className="px-3 py-1 bg-[#D1FAE5] text-[#006D77] text-xs rounded-full">Active</span>
                </div>
              </div>
            ))}
            <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl shadow-lg">
              + Ajouter une carte
            </button>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Sécurité</h3>
          <div className="space-y-3">
            <button className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#006D77]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Code PIN</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Modifier votre PIN</p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
            </button>

            <button className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Biométrie</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Touch ID activé</p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
            </button>

            <button onClick={() => navigate('/kauri/setup-2fa')} className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Authentification 2FA</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Désactivé</p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
            </button>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Préférences</h3>
          <div className="space-y-3">
            <button className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Notifications</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Gérer les alertes</p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
            </button>

            <button className={`w-full rounded-xl p-4 flex items-center justify-between border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B05B3B]/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#B05B3B]" />
                </div>
                <div className="text-left">
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Confidentialité</p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Contrôler vos données</p>
                </div>
              </div>
              <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
