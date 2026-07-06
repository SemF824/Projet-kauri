import { CheckCircle2, Wallet } from 'lucide-react';
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
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const targetDashboard = accountType === 'professionnel' ? '/kauri/pro-dashboard' : '/kauri/normal-dashboard';
      const timer = setTimeout(() => {
        localStorage.setItem('kauri_account_type', accountType);
        navigate(targetDashboard);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, accountType, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl animate-pulse">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-white text-2xl mb-3">Création de votre portefeuille</h1>
          <p className="text-[#E0F2FE] text-sm">Initialisation sécurisée en cours...</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">Progression</span>
              <span className="text-[#D4AF37] text-sm">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { threshold: 30, label: 'Génération des clés de sécurité' },
              { threshold: 60, label: 'Configuration multi-devises (EUR, CAD, USD)' },
              { threshold: 90, label: 'Activation du portefeuille KAURI' },
            ].map(({ threshold, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${progress >= threshold ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                  {progress >= threshold && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-sm transition-all ${progress >= threshold ? 'text-white' : 'text-white/60'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            <span className="text-white/70 text-sm">Connexion sécurisée établie</span>
          </div>
        </div>
      </div>
    </div>
  );
}
