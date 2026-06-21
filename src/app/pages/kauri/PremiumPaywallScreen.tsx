import { ArrowLeft, Check, X, Crown, CreditCard, RefreshCcw, FileText, Wallet, Users, Compass } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface ComparisonFeature {
  name: string;
  icon: React.ReactNode;
  freemium: string;
  premium: string;
  isPremiumHighlight: boolean;
}

export function PremiumPaywallScreen() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = 4.99;
  const annualPrice = 49.99; // ~4.16€/mois
  const annualSavings = 10;

  const features: ComparisonFeature[] = [
    {
      name: 'SWAP (Échange instantané)',
      icon: <RefreshCcw className="w-5 h-5" />,
      freemium: '1 gratuit par tontine',
      premium: 'Illimité & 100% Gratuit',
      isPremiumHighlight: true,
    },
    {
      name: 'Attestation de Capacité Financière',
      icon: <FileText className="w-5 h-5" />,
      freemium: '14,99 € / document',
      premium: '1 gratuite par an',
      isPremiumHighlight: true,
    },
    {
      name: 'Carte Physique KAURI',
      icon: <CreditCard className="w-5 h-5" />,
      freemium: 'Option à 9,99 €',
      premium: 'Offerte d\'office',
      isPremiumHighlight: true,
    },
    {
      name: 'Frais de Dépôt/Retrait (CICO)',
      icon: <Wallet className="w-5 h-5" />,
      freemium: '2,0 % fixes',
      premium: 'Réduits à 1,0 %',
      isPremiumHighlight: false,
    },
  ];

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/kauri/profil-particulier')} className="text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>
          </div>

          {/* 3D Card Icon Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Effet de rotation 3D simulé */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl shadow-2xl transform rotate-12 opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl shadow-2xl transform -rotate-6 opacity-50 border-2 border-white/20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl shadow-2xl flex items-center justify-center border-2 border-white/30">
                <Crown className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Passez à KAURI Premium</h1>
            <p className="text-sm text-white/90">
              Libérez la puissance de votre épargne
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-32">
          {/* Toggle Mensuel/Annuel */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setIsAnnual(false)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                  !isAnnual
                    ? 'bg-[#006D77] text-white shadow-lg'
                    : 'bg-gray-100 text-[#64748B]'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all relative ${
                  isAnnual
                    ? 'bg-[#006D77] text-white shadow-lg'
                    : 'bg-gray-100 text-[#64748B]'
                }`}
              >
                Annuel
                {isAnnual && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#D4AF37] text-white text-[10px] font-bold">
                    -{annualSavings}%
                  </span>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-[#006D77] mb-1">
                {isAnnual ? `${annualPrice}` : `${monthlyPrice}`} €
              </p>
              <p className="text-sm text-[#64748B]">
                {isAnnual ? 'par an (soit ~4,16€/mois)' : 'par mois'}
              </p>
              {isAnnual && (
                <p className="text-xs text-[#D4AF37] font-medium mt-2">
                  Économisez {((monthlyPrice * 12) - annualPrice).toFixed(2)}€ par an
                </p>
              )}
            </div>
          </div>

          {/* Comparatif des Services */}
          <div>
            <h3 className="text-[#0F172A] font-bold text-base mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
              Comparatif des Services
            </h3>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#006D77]/10 rounded-xl flex items-center justify-center text-[#006D77]">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-[#0F172A] text-sm flex-1">
                      {feature.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Freemium */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <p className="text-xs text-[#94A3B8] mb-1">Freemium</p>
                      <p className="text-sm text-[#4A4A4A] font-medium leading-tight">
                        {feature.freemium}
                      </p>
                    </div>

                    {/* Premium */}
                    <div className={`rounded-xl p-3 border-2 ${
                      feature.isPremiumHighlight
                        ? 'bg-gradient-to-br from-[#FEF9E7] to-[#FCF4DD] border-[#D4AF37]'
                        : 'bg-[#F0FDFA] border-[#006D77]/30'
                    }`}>
                      <p className="text-xs text-[#006D77] mb-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                      </p>
                      <p className={`text-sm font-bold leading-tight ${
                        feature.isPremiumHighlight ? 'text-[#D4AF37]' : 'text-[#006D77]'
                      }`}>
                        {feature.premium}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages Supplémentaires */}
          <div className="bg-gradient-to-br from-[#F0FDFA] to-[#E0F2FE] rounded-2xl p-5 border border-[#006D77]/20">
            <h4 className="font-bold text-[#006D77] text-sm mb-3">Avantages Exclusifs</h4>
            <div className="space-y-2">
              {[
                'Support client prioritaire 24/7',
                'Accès anticipé aux nouvelles fonctionnalités',
                'Rendements bonifiés sur certains projets RWA',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#006D77] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#4A4A4A]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed CTA Bottom */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white font-bold text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 mb-3">
            <Crown className="w-6 h-6" />
            Activer Premium - {isAnnual ? `${annualPrice}` : `${monthlyPrice}`}€
          </button>

          <button
            onClick={() => navigate('/kauri/normal-dashboard')}
            className="w-full text-center text-sm text-[#64748B] hover:text-[#4A4A4A] transition-colors"
          >
            Continuer avec la version gratuite (Freemium)
          </button>
        </div>

      </div>
    </div>
  );
}
