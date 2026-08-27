import {
  Shield,
  CheckCircle2,
  Star,
  ArrowRight,
  ArrowLeft,
  Circle,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const VERIFIED = [
  { label: "Vérification d'identité", pts: 20 },
  { label: "Vérification vivacité", pts: 10 },
  { label: "Biométrie activée", pts: 10 },
];

const LOCKED = [
  { label: "Première transaction", pts: 10 },
  { label: "Cycle de tontine complété", pts: 15 },
  { label: "Série d'assiduité 3 mois", pts: 15 },
];

export function TrustScoreIntroScreen() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") || profile?.accountType || "particulier";

  const [score, setScore] = useState(0);

  // Vérifie si l'utilisateur a déjà terminé son onboarding de préférences
  const hasSavedPreferences = Boolean(localStorage.getItem("kauri_preferences"));
  const isAlreadyOnboarded = Boolean(
    profile?.id && (profile.kycCompleted || hasSavedPreferences || localStorage.getItem("kauri_account_type"))
  );

  const targetDashboard =
    accountType === "professionnel" || profile?.accountType === "professionnel"
      ? "/kauri/pro-dashboard"
      : "/kauri/normal-dashboard";

  // Score cible : base de données ou pallier initial vérifié
  const dbScore = profile?.trustScore ?? 0;
  const TARGET_SCORE = dbScore > 0 ? dbScore : 40;

  useEffect(() => {
    if (authLoading) return;

    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= TARGET_SCORE) {
          clearInterval(interval);
          return TARGET_SCORE;
        }
        return prev + 1;
      });
    }, 28);
    return () => clearInterval(interval);
  }, [TARGET_SCORE, authLoading]);

  const handleContinue = () => {
    // Si l'utilisateur est déjà configuré ou consulte depuis son compte, retour au dashboard
    if (isAlreadyOnboarded || hasSavedPreferences) {
      navigate(targetDashboard);
      return;
    }

    // Premier parcours d'onboarding initial uniquement
    if (accountType === "professionnel") {
      navigate(`/kauri/wallet-creation?type=${accountType}`);
    } else {
      navigate(`/kauri/preferences-contenu?type=${accountType}`);
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#006D77";
    if (s >= 60) return "#D4AF37";
    return "#F59E0B";
  };

  const getBadgeLabel = (s: number) => {
    if (s >= 85)
      return {
        level: "Vérifié Argent",
        desc: "Compte certifié par le registre",
      };
    if (s >= 40)
      return {
        level: "Novice Premium",
        desc: "Profil sécurisé en attente",
      };
    return {
      level: "Novice",
      desc: "Profil en cours de sécurisation",
    };
  };

  const currentBadge = getBadgeLabel(score);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-8 flex flex-col items-center justify-center relative">
      {/* Barre supérieure avec bouton retour */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(targetDashboard)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer transition-colors"
          title="Retour au tableau de bord"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
          Indicateur de Confiance
        </span>
        <div className="w-10" />
      </div>

      <div className="max-w-md w-full">
        {/* Shield icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">
            Votre Score de Confiance
          </h1>
          <p className="text-[#E0F2FE] text-xs">
            Basé sur votre niveau de vérification et votre activité
          </p>
        </div>

        {/* Circular gauge */}
        <div className="relative w-56 h-56 mx-auto mb-6">
          <svg className="transform -rotate-90 w-56 h-56">
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="18"
              fill="none"
            />
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke={getScoreColor(score)}
              strokeWidth="18"
              fill="none"
              strokeDasharray={`${(score / 100) * 565.5} 565.5`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-4xl font-extrabold mb-1">
              {score}
            </span>
            <span className="text-[#E0F2FE] text-xs font-semibold">
              / 100
            </span>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.ceil(score / 20)
                      ? "fill-[#D4AF37] text-[#D4AF37]"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Composition card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 mb-4">
          <h3 className="text-white text-sm font-bold mb-3">
            Composition du Score
          </h3>

          {/* Section 1 */}
          <p className="text-[11px] font-bold mb-2 uppercase tracking-wider text-[#D4AF37]">
            1. Vérification du profil (Max 40 pts)
          </p>
          <div className="space-y-2 mb-3">
            {VERIFIED.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white text-xs">
                    {item.label}
                  </span>
                </div>
                <span className="text-[#D4AF37] text-xs font-semibold">
                  +{item.pts} pts
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 mb-3" />

          {/* Section 2 */}
          <p className="text-[11px] font-bold mb-2 uppercase tracking-wider text-white/50">
            2. Historique financier (À débloquer)
          </p>
          <div className="space-y-2">
            {LOCKED.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Circle className="w-4 h-4 text-white/30" />
                  <span className="text-white/60 text-xs">
                    {item.label}
                  </span>
                </div>
                <span className="text-white/40 text-xs">
                  +{item.pts} pts
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-[#E0F2FE] text-[11px] text-center">
              Votre score augmentera avec vos cotisations régulières et transactions réussies.
            </p>
          </div>
        </div>

        {/* Niveau banner */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-5 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">
                Niveau : {currentBadge.level}
              </h4>
              <p className="text-white/70 text-[11px]">
                {currentBadge.desc}
              </p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5">
            <p className="text-white/80 text-[11px] leading-relaxed">
              Payez vos premières cotisations pour augmenter votre score et débloquer de nouveaux avantages.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full bg-white text-[#006D77] py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl font-bold text-sm border-none cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <span>
            {isAlreadyOnboarded || hasSavedPreferences
              ? "Retour au tableau de bord"
              : "Continuer vers mes préférences"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TrustScoreIntroScreen;