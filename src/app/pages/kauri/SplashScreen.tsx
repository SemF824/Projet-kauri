import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Vérifier si l'utilisateur a déjà un compte
      const accountType = localStorage.getItem('kauri_account_type');
      if (accountType === 'professionnel') {
        navigate('/kauri/pro-dashboard');
      } else if (accountType === 'particulier') {
        navigate('/kauri/normal-dashboard');
      } else {
        navigate('/kauri');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006D77] via-[#0D9488] to-[#006D77] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Motif de coquillages en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 100 100"
            className="absolute text-white animate-float"
            style={{
              width: `${40 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <path
              d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>

      {/* Logo KAURI */}
      <div className="relative z-10 text-center animate-fadeIn">
        {/* Icône Cowrie Shell */}
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-[#D4AF37] rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-0 bg-[#D4AF37] rounded-full opacity-40 animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white">
              <path
                d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Typographie KAURI */}
        <h1 className="text-white text-5xl mb-3 tracking-wider" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          KAURI
        </h1>
        <p className="text-[#E0F2FE] text-lg mb-2">L'Unité dans la Finance</p>
        <p className="text-[#E0F2FE]/80 text-sm">La Force dans la Communauté</p>

        {/* Barre de chargement */}
        <div className="mt-12 max-w-xs mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-white animate-shimmer w-1/2"></div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 text-white/60 text-xs">
          <p>Fondé par Laura Monlouis-Bonnaire</p>
          <p className="mt-1">Une Initiative Citoyenne</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
