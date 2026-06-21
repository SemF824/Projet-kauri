import { ArrowLeft, Flame, CheckCircle, Clock, Users, Crown, Wallet, Heart, User, Compass } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function GamifiedDashboardScreen() {
  const navigate = useNavigate();
  const [isDarkMode] = useState(false);

  const trustScore = 88;
  const paymentStreak = 6;
  const userStatus = 'Membre Émérite';

  const activeTontines = [
    {
      id: '1',
      name: 'Tontine Famille',
      daysUntilDeadline: 4,
      amount: 50,
      isPaid: false,
    },
    {
      id: '2',
      name: 'Cercle Entrepreneurs',
      daysUntilDeadline: 12,
      amount: 100,
      isPaid: true,
    },
    {
      id: '3',
      name: 'Épargne Vacances',
      daysUntilDeadline: 8,
      amount: 75,
      isPaid: false,
    },
  ];

  // Calcul du cercle de progression
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white text-xl font-bold shadow-xl border-2 border-white">
                LM
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Bonjour Laura M.</h2>
                <p className="text-white/80 text-sm">Ravie de vous revoir !</p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg flex items-center gap-1.5 border border-white/30">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">{userStatus}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
          {/* Section Hub de Confiance */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#006D77] font-bold text-lg mb-6 text-center">
              Hub de Confiance
            </h3>

            {/* Trust Score Radial */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  {/* Cercle de fond */}
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Cercle de progression */}
                  <circle
                    cx="96"
                    cy="96"
                    r="70"
                    stroke="url(#trustGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#006D77" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-[#006D77]">{trustScore}</p>
                  <p className="text-sm text-[#64748B]">/ 100</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Trust Score</p>
                </div>
              </div>
            </div>

            {/* Payment Streak */}
            <div className="bg-gradient-to-br from-[#FEF3F2] to-[#FDE8E8] rounded-2xl p-4 mb-4 border border-[#B05B3B]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B05B3B] to-[#DC2626] rounded-xl flex items-center justify-center shadow-md">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[#B05B3B] font-bold text-base">Série d'Assiduité</p>
                  <p className="text-[#64748B] text-sm">
                    {paymentStreak} mois consécutifs à l'heure
                  </p>
                </div>
              </div>
            </div>

            {/* Avantage Elite */}
            <div className="bg-gradient-to-br from-[#FEF9E7] to-[#FCF4DD] rounded-2xl p-4 border border-[#D4AF37]/30">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">
                    <span className="font-bold text-[#D4AF37]">Félicitations !</span> Vous bénéficiez du statut Élite
                  </p>
                  <p className="text-[#64748B] text-xs mt-1">
                    Frais CICO réduits à <span className="font-bold text-[#006D77]">0%</span> ce mois-ci
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mes Tontines Actives */}
          <div>
            <h3 className="text-[#0F172A] font-bold text-base mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#006D77] rounded-full"></div>
              Mes Tontines Actives
            </h3>

            <div className="space-y-3">
              {activeTontines.map((tontine) => (
                <div
                  key={tontine.id}
                  className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#006D77] to-[#0D9488] rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-[#0F172A] font-semibold text-sm">{tontine.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Échéance dans {tontine.daysUntilDeadline} jours</span>
                        </div>
                      </div>
                    </div>

                    {tontine.isPaid ? (
                      <div className="px-3 py-1.5 rounded-full bg-[#D1FAE5] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
                        <span className="text-xs font-medium text-[#059669]">Payé</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-full bg-[#FEF3F2]">
                        <span className="text-xs font-medium text-[#B05B3B]">En attente</span>
                      </div>
                    )}
                  </div>

                  {!tontine.isPaid && (
                    <button className="w-full py-3 rounded-xl bg-[#006D77] hover:bg-[#005A63] text-white font-medium text-sm transition-colors shadow-md">
                      Payer {tontine.amount} € maintenant
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto shadow-lg">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1">
              <Wallet className="w-6 h-6 text-[#006D77]" />
              <span className="text-xs text-[#006D77] font-medium">Accueil</span>
            </button>
            <button
              onClick={() => navigate('/kauri/tontines-actives')}
              className="flex flex-col items-center gap-1"
            >
              <Users className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-xs text-[#94A3B8]">Mes Cercles</span>
            </button>
            <button
              onClick={() => navigate('/kauri/discover-circles')}
              className="flex flex-col items-center gap-1"
            >
              <Compass className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-xs text-[#94A3B8]">Découvrir</span>
            </button>
            <button
              onClick={() => navigate('/kauri/premium-paywall')}
              className="flex flex-col items-center gap-1"
            >
              <Crown className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-xs text-[#94A3B8]">Premium</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
