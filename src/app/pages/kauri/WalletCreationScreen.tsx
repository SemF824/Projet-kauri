import { CheckCircle2, Wallet, Shield, Globe } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

export function WalletCreationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'particulier';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (accountType === 'professionnel') {
              localStorage.setItem('kauri_account_type', 'professionnel');
              navigate('/kauri/pro-dashboard');
            } else {
              localStorage.setItem('kauri_account_type', 'particulier');
              navigate('/kauri/normal-dashboard');
            }
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [navigate, accountType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl animate-pulse">
            <Wallet className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-white text-2xl mb-3">Création de votre portefeuille</h1>
          <p className="text-[#E0F2FE] text-sm">
            Initialisation sécurisée en cours...
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">Progression</span>
              <span className="text-[#D4AF37] text-sm">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress >= 30 ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                {progress >= 30 && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm ${progress >= 30 ? 'text-white' : 'text-white/60'}`}>
                Génération des clés de sécurité
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress >= 60 ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                {progress >= 60 && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm ${progress >= 60 ? 'text-white' : 'text-white/60'}`}>
                Configuration multi-devises (EUR, CAD, USD)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress >= 90 ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                {progress >= 90 && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm ${progress >= 90 ? 'text-white' : 'text-white/60'}`}>
                Activation de la protection bancaire
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-white text-xs">Cryptage AES-256</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Globe className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-white text-xs">Multi-devises</p>
          </div>
        </div>

        {progress === 100 && (
          <div className="mt-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-3 animate-bounce" />
            <p className="text-white">Portefeuille créé avec succès !</p>
          </div>
        )}
      </div>
    </div>
  );
}
