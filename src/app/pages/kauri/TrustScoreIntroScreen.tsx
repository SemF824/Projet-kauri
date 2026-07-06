import { Shield, CheckCircle2, Star, ArrowRight, Circle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';

const TARGET_SCORE = 40;

const VERIFIED = [
  { label: "Vérification d'identité", pts: 20 },
  { label: 'Vérification vivacité',   pts: 10 },
  { label: 'Biométrie activée',        pts: 10 },
];

const LOCKED = [
  { label: 'Première transaction',       pts: 10 },
  { label: 'Cycle de tontine complété',  pts: 15 },
  { label: "Série d'assiduité 3 mois",  pts: 15 },
];

export function TrustScoreIntroScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'particulier';
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        if (prev >= TARGET_SCORE) { clearInterval(interval); return TARGET_SCORE; }
        return prev + 1;
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (accountType === 'professionnel') {
      navigate(`/kauri/wallet-creation?type=${accountType}`);
    } else {
      navigate(`/kauri/preferences-contenu?type=${accountType}`);
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#006D77';
    if (s >= 60) return '#D4AF37';
    return '#F59E0B';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">

        {/* Shield icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-white text-2xl mb-2">Votre Score de Confiance</h1>
          <p className="text-[#E0F2FE] text-sm">Basé sur votre niveau de vérification</p>
        </div>

        {/* Circular gauge */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle cx="128" cy="128" r="100" stroke="rgba(255,255,255,0.1)" strokeWidth="20" fill="none" />
            <circle
              cx="128" cy="128" r="100"
              stroke={getScoreColor(score)}
              strokeWidth="20" fill="none"
              strokeDasharray={`${(score / 100) * 628} 628`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-5xl mb-2">{score}</span>
            <span className="text-[#E0F2FE] text-sm">/ 100</span>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 2 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Composition card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-white mb-4">Composition du Score</h3>

          {/* Section 1 */}
          <p className="text-xs font-bold mb-3 uppercase tracking-wider text-[#D4AF37]">
            1. Vérification du profil (Max 40 pts)
          </p>
          <div className="space-y-3 mb-4">
            {VERIFIED.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-white text-sm">{item.label}</span>
                </div>
                <span className="text-[#D4AF37]">+{item.pts} pts</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 mb-4" />

          {/* Section 2 */}
          <p className="text-xs font-bold mb-3 uppercase tracking-wider text-white/40">
            2. Historique financier (À débloquer)
          </p>
          <div className="space-y-3">
            {LOCKED.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-white/30" />
                  <span className="text-white/50 text-sm">{item.label}</span>
                </div>
                <span className="text-white/40">+{item.pts} pts</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-[#E0F2FE] text-xs text-center">
              Votre score augmentera avec votre activité et vos transactions réussies
            </p>
          </div>
        </div>

        {/* Niveau banner — Novice */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Niveau : Novice</h4>
              <p className="text-white/70 text-sm">Profil sécurisé</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-xs leading-relaxed">
              Payez vos premières cotisations pour augmenter votre score et débloquer de nouveaux avantages.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full bg-white text-[#006D77] py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl font-semibold"
        >
          <span>Accéder à mon espace KAURI</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
