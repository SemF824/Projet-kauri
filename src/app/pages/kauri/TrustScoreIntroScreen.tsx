import { ArrowLeft, Shield, CheckCircle2, Info, Star, Circle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';

const TEAL = '#006D77';

const VERIFIED = [
  { label: "Vérification d'identité", pts: 40 },
  { label: 'Vérification faciale vivante', pts: 30 },
  { label: 'Compte bancaire lié',        pts: 30 },
];

const LOCKED = [
  { label: 'Première transaction',       pts: 10 },
  { label: 'Cycle de tontine complété',  pts: 15 },
  { label: "Série d'assiduité 3 mois",  pts: 15 },
];

export function TrustScoreIntroScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { profile, loading } = useAuth();
  
  // Correction chirurgicale : On extrait le score réel de la base (100 par défaut via le trigger)
  // Si le profil charge encore, on anticipe la valeur nominale de 100 pour éviter le flash à 40
  const targetScore = profile?.trustScore !== undefined ? Math.round(profile.trustScore) : 100;
  const [score, setScore] = useState(0);

  useEffect(() => {
    // On attend que le AuthContext ait fini de valider le profil pour lancer l'animation finale
    if (loading) return;

    const interval = setInterval(() => {
      setScore(prev => {
        if (prev >= targetScore) { 
          clearInterval(interval); 
          return targetScore; 
        }
        return prev + 1;
      });
    }, 12); // Accélération légère de l'animation pour une sensation de réactivité accrue
    
    return () => clearInterval(interval);
  }, [targetScore, loading]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#10B981'; // Vert Émeraude / Succès
    if (s >= 60) return '#D4AF37'; // Or Kauri
    return '#F59E0B';
  };

  // Calcul dynamique des étoiles basé sur la note réelle (ex: 100/100 = 5 étoiles)
  const starCount = Math.min(5, Math.floor(score / 20));

  const bg = isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]';
  const cardBg = isDarkMode ? 'bg-[#1E293B]' : 'bg-white';
  const border = isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#0F172A]';
  const textSecondary = isDarkMode ? 'text-slate-400' : 'text-[#64748B]';

  return (
    <div className={`min-h-screen pb-12 ${bg}`}>
      {/* Header */}
      <div className="px-5 pt-14 pb-6 rounded-b-[28px] shadow-xl bg-gradient-to-br from-[#006D77] to-[#0D9488]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Algorithme</p>
            <h1 className="text-white text-xl font-bold">Indice de Confiance</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        {/* Current score circle card */}
        <div className={`rounded-3xl p-6 text-center border ${cardBg} ${border}`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <p className="text-xs uppercase tracking-wider font-bold mb-4" style={{ color: TEAL }}>Votre score actuel</p>
          
          <div className="relative w-44 h-44 mx-auto mb-4">
            <svg className="transform -rotate-90 w-44 h-44">
              <circle cx="88" cy="88" r="72" stroke={isDarkMode ? '#334155' : '#F1F5F9'} strokeWidth="14" fill="none" />
              <circle
                cx="88"
                cy="88"
                r="72"
                stroke={getScoreColor(score)}
                strokeWidth="14" fill="none"
                strokeDasharray={`${(score / 100) * 452} 452`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${textPrimary}`}>{score}</span>
              <span className={`text-xs font-bold ${textSecondary}`}>/ 100</span>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < starCount ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Profil Certifié de Confiance
          </div>
          <p className={`text-xs leading-relaxed max-w-xs mx-auto ${textSecondary}`}>
            Félicitations ! Votre score vous donne accès à 100% des opportunités de la plateforme.
          </p>
        </div>

        {/* Composition card */}
        <div className={`rounded-2xl border p-5 space-y-3 ${cardBg} ${border}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Composition du Score</h3>

          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            1. Vérification du profil (Max 100 pts)
          </p>
          <div className="space-y-3 mb-2">
            {VERIFIED.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className={`text-sm ${textPrimary}`}>{item.label}</span>
                </div>
                <span className="font-bold text-xs text-emerald-500">+{item.pts} pts</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-3" />

          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            2. Historique financier (À débloquer)
          </p>
          <div className="space-y-3">
            {LOCKED.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  <span className="text-sm text-gray-400 dark:text-gray-500">{item.label}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">+{item.pts} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation info panel */}
        <div className={`rounded-2xl border p-5 space-y-3 ${cardBg} ${border}`}>
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5" style={{ color: TEAL }} />
            <h4 className={`font-bold text-sm ${textPrimary}`}>Pourquoi ce score est important ?</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Pour maintenir la sécurité financière au sein de l'écosystème KAURI, les créateurs de tontines publiques peuvent fixer un seuil d'Indice de Confiance requis pour rejoindre leur groupe. Plus votre score est élevé, plus vos opportunités d'épargne se multiplient.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-xl text-white text-sm font-bold shadow-lg mt-2 flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${TEAL}, #0D9488)` }}
        >
          <span>Retour</span>
        </button>
      </div>
    </div>
  );
}
