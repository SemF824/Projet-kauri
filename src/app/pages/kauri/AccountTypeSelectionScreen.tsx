import { ArrowRight, User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AccountTypeSelectionScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-12 flex flex-col">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-14 h-14 text-white">
            <path
              d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-white text-3xl mb-3">Bienvenue sur KAURI</h1>
        <p className="text-[#E0F2FE] text-sm px-4">
          L'union de la communauté, la force de l'investissement
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h2 className="text-white text-center mb-2">Choisissez votre type de compte</h2>

        <button
          onClick={() => navigate('/kauri/kyc-verification?type=particulier')}
          className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-[#006D77]" />
          </div>
          <h3 className="text-[#0F172A] text-xl mb-2">Compte Particulier</h3>
          <p className="text-[#4A4A4A] text-sm mb-4">
            Rejoignez des tontines privées, investissez dans des projets communautaires, et
            connectez-vous avec la diaspora.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#006D77]/10 text-[#006D77] text-xs rounded-full">
              Tontines
            </span>
            <span className="px-3 py-1 bg-[#006D77]/10 text-[#006D77] text-xs rounded-full">
              Investissement
            </span>
            <span className="px-3 py-1 bg-[#006D77]/10 text-[#006D77] text-xs rounded-full">
              Social
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate('/kauri/kyc-verification?type=professionnel')}
          className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white text-xl mb-2">Compte Professionnel</h3>
          <p className="text-white/90 text-sm mb-4">
            Lancez des levées de fonds pour vos projets d'entreprise, accédez à un réseau
            d'investisseurs et développez votre activité.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
              Levée de fonds
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
              Analytics
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
              Réseau Pro
            </span>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[#E0F2FE] text-xs">
          En continuant, vous acceptez nos Conditions Générales et notre Politique de
          Confidentialité
        </p>
      </div>
    </div>
  );
}
