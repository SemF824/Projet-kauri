import { ArrowLeft, Palette, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DesignSystemDemo() {
  const navigate = useNavigate();

  const colors = [
    { name: 'Deep Caribbean Teal', hex: '#006D77', usage: 'Headers, Boutons Primaires, Navigation Active' },
    { name: 'Antique Gold', hex: '#D4AF37', usage: 'Pot Kauri, Trust Score, Succès' },
    { name: 'Terracotta', hex: '#B05B3B', usage: 'Live Social, Impact, CTAs Communauté' },
    { name: 'Off-White', hex: '#F9F9F9', usage: 'Arrière-plans' },
    { name: 'Slate Grey', hex: '#4A4A4A', usage: 'Texte Secondaire' },
  ];

  const demoScreens = [
    { name: 'Splash Screen', path: '/splash', color: '#006D77' },
    { name: 'Pot Commun (Teal Border + Gold Shells)', path: '/kauri/pot-commun', color: '#D4AF37' },
    { name: 'Compte Suspendu (Terracotta Overlay)', path: '/kauri/suspended', color: '#B05B3B' },
    { name: 'Icônes Animées (Gold Halo + Confetti)', path: '/kauri/animated-icons', color: '#D4AF37' },
    { name: 'Social Feed (Live Indicators)', path: '/kauri/social-feed', color: '#B05B3B' },
    { name: 'Dashboard Pro', path: '/kauri/pro-dashboard', color: '#006D77' },
    { name: 'Dashboard Particulier', path: '/kauri/normal-dashboard', color: '#006D77' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-2xl mb-2">Design System KAURI</h1>
          <p className="text-[#E0F2FE] text-sm">Nouvelle Identité de Marque "Ancestral Future"</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Palette de Couleurs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#006D77]" />
            Palette de Couleurs
          </h3>

          <div className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-[#F9F9F9] rounded-xl">
                <div
                  className="w-16 h-16 rounded-lg shadow-md flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="flex-1">
                  <p className="text-[#0F172A] mb-1">{color.name}</p>
                  <p className="text-[#4A4A4A] text-xs mb-1">{color.hex}</p>
                  <p className="text-[#4A4A4A] text-xs italic">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Écrans de Démonstration */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#006D77]" />
            Écrans Mis à Jour
          </h3>

          <div className="space-y-3">
            {demoScreens.map((screen, index) => (
              <button
                key={index}
                onClick={() => navigate(screen.path)}
                className="w-full p-4 bg-[#F9F9F9] rounded-xl border-2 border-[#E2E8F0] hover:border-[#006D77] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: screen.color }}
                  ></div>
                  <span className="text-[#0F172A]">{screen.name}</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-[#006D77] rotate-180" />
              </button>
            ))}
          </div>
        </div>

        {/* Typographie */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#006D77] mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Typographie Sans-Serif Bold
          </h3>
          <p className="text-[#4A4A4A] mb-2">
            Texte secondaire en Slate Grey (#4A4A4A)
          </p>
          <p className="text-[#0F172A]">
            Texte principal en noir pour lisibilité
          </p>
        </div>

        {/* Logo Cowrie Shell */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] rounded-2xl p-8 shadow-lg text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-white">
              <path
                d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="text-white text-lg mb-1">Logo Cowrie Shell KAURI</p>
          <p className="text-[#E0F2FE] text-sm">Identité Visuelle "Ancestral Future"</p>
        </div>

        {/* Signature */}
        <div className="bg-[#F9F9F9] rounded-2xl p-6 border-2 border-[#D4AF37]">
          <p className="text-[#0F172A] text-center mb-2">
            <strong>Mission Éducative et Citoyenne</strong>
          </p>
          <p className="text-[#4A4A4A] text-center text-sm">
            Fondé par Laura Monlouis-Bonnaire
          </p>
          <p className="text-[#4A4A4A] text-center text-xs mt-2">
            Tout le texte est en FRANÇAIS 🇫🇷
          </p>
        </div>
      </div>
    </div>
  );
}
