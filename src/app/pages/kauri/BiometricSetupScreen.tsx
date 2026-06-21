import { ArrowLeft, Fingerprint, Scan, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';

export function BiometricSetupScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'particulier';
  const [setupComplete, setSetupComplete] = useState(false);

  const handleActivate = () => {
    setSetupComplete(true);
    setTimeout(() => {
      navigate(`/kauri/trust-score-intro?type=${accountType}`);
    }, 1500);
  };

  const handleSkip = () => {
    const targetDashboard = accountType === 'professionnel' ? '/kauri/pro-dashboard' : '/kauri/normal-dashboard';
    navigate(targetDashboard);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Sécurité biométrique</h1>
        <p className="text-[#E0F2FE] text-sm">
          Protégez votre compte avec Face ID ou Touch ID
        </p>
      </div>

      <div className="px-6 py-8">
        {!setupComplete ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#E2E8F0] text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
                <Scan className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-[#0F172A] text-xl mb-3">Connexion rapide et sécurisée</h3>
              <p className="text-[#64748B] text-sm mb-6">
                Utilisez votre empreinte digitale ou reconnaissance faciale pour accéder
                instantanément à votre compte
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#0F172A] text-sm mb-1">Cryptage de niveau bancaire</p>
                    <p className="text-[#64748B] text-xs">
                      Vos données biométriques restent sur votre appareil
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#006D77]/10 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-6 h-6 text-[#006D77]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#0F172A] text-sm mb-1">Connexion instantanée</p>
                    <p className="text-[#64748B] text-xs">Plus besoin de mémoriser un mot de passe</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleActivate}
                className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl shadow-lg mb-3"
              >
                Activer la biométrie
              </button>

              <button
                onClick={handleSkip}
                className="w-full text-[#64748B] text-sm py-3"
              >
                Ignorer cette étape
              </button>
            </div>

            <div className="bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
              <p className="text-[#92400E] text-xs">
                💡 <strong>Recommandé :</strong> La biométrie est le moyen le plus sûr et le plus
                rapide pour accéder à votre compte KAURI.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#E2E8F0] text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D1FAE5] flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#006D77]" />
            </div>

            <h3 className="text-[#0F172A] text-xl mb-3">Biométrie activée !</h3>
            <p className="text-[#64748B] text-sm mb-6">
              Votre compte est maintenant sécurisé avec {accountType === 'professionnel' ? 'Face ID' : 'Touch ID'}
            </p>

            <div className="flex items-center justify-center gap-2 text-[#006D77]">
              <div className="w-2 h-2 bg-[#006D77] rounded-full animate-pulse"></div>
              <span className="text-sm">Préparation de votre espace...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
