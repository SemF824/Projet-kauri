import {
  Shield,
  CheckCircle2,
  Star,
  ArrowRight,
  ArrowLeft,
  Circle,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect, useRef } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Vérifie si l'utilisateur a déjà terminé son onboarding de préférences
  const hasSavedPreferences = Boolean(localStorage.getItem("kauri_preferences"));
  const isAlreadyOnboarded = Boolean(
    profile?.id && (profile.kycCompleted || hasSavedPreferences || localStorage.getItem("kauri_account_type"))
  );

  const targetDashboard =
    accountType === "professionnel" || profile?.accountType === "professionnel"
      ? "/kauri/pro-dashboard"
      : "/kauri/normal-dashboard";

  // Score cible dynamique (par défaut 88 pour démontrer le passage au vert)
  const dbScore = profile?.trustScore ?? 0;
  const TARGET_SCORE = dbScore > 0 ? dbScore : 88;

  // Calcul dynamique de couleur : Rouge (0) -> Jaune (50) -> Vert (100)
  const getScoreColor = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    // 0% -> hue = 0 (rouge)
    // 50% -> hue = 60 (jaune)
    // 100% -> hue = 142 (vert vif)
    const hue = (clamped / 100) * 142;
    return `hsl(${hue.toFixed(1)}, 90%, 48%)`;
  };

  const currentColor = getScoreColor(score);

  const startAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsAnimating(true);
    setScore(0);

    const startTime = performance.now();
    const duration = 2000; // Montée progressive sur 2 secondes

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Courbe ease-out : démarre vite dans le rouge, traverse le jaune et s'installe doucement dans le vert
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(eased * TARGET_SCORE);

      setScore(currentVal);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setScore(TARGET_SCORE);
        setIsAnimating(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (authLoading) return;
    const timer = setTimeout(() => {
      startAnimation();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [TARGET_SCORE, authLoading]);

  const handleContinue = () => {
    if (isAlreadyOnboarded || hasSavedPreferences) {
      navigate(targetDashboard);
      return;
    }

    if (accountType === "professionnel") {
      navigate(`/kauri/wallet-creation?type=${accountType}`);
    } else {
      navigate(`/kauri/preferences-contenu?type=${accountType}`);
    }
  };

  const getBadgeLabel = (s: number) => {
    if (s >= 80)
      return {
        level: "Membre de Confiance",
        desc: "Compte hautement sécurisé · Plafonds débloqués",
      };
    if (s >= 50)
      return {
        level: "Niveau Intermédiaire",
        desc: "Dossier en progression positive",
      };
    return {
      level: "Niveau Initial",
      desc: "Profil en cours de sécurisation",
    };
  };

  const currentBadge = getBadgeLabel(score);

  // Géométrie SVG du cercle
  const radius = 90;
  const circumference = 2 * Math.PI * radius; // ~565.487
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a5c7a] to-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a5c7a] to-[#0F172A] px-6 py-8 flex flex-col items-center justify-center relative select-none">
      {/* Barre supérieure avec bouton retour */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(targetDashboard)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer transition-colors shadow-sm"
          title="Retour au tableau de bord"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
          Indicateur de Confiance
        </span>
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer transition-colors shadow-sm disabled:opacity-40"
          title="Rejouer l'animation dynamique"
        >
          <RefreshCw className={`w-4 h-4 ${isAnimating ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="max-w-md w-full">
        {/* Shield icon */}
        <div className="text-center mb-6">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: currentColor,
              boxShadow: `0 10px 30px ${currentColor}55`,
            }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">
            Votre Score de Confiance
          </h1>
          <p className="text-[#E0F2FE] text-xs">
            Indicateur dynamique fondé sur vos garanties et votre assiduité
          </p>
        </div>

        {/* Circular dynamic gauge */}
        <div
          onClick={startAnimation}
          className="relative w-56 h-56 mx-auto mb-4 cursor-pointer group"
          title="Cliquer pour rejouer l'animation"
        >
          <svg
            className="transform -rotate-90 w-56 h-56"
            style={{
              filter: `drop-shadow(0 0 16px ${currentColor}66)`,
            }}
          >
            {/* Anneau de fond */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="18"
              fill="none"
            />
            {/* Anneau animé dynamique : rouge -> jaune -> vert */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              stroke={currentColor}
              strokeWidth="18"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Affichage central du score avec couleur synchronisée */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-5xl font-black mb-0.5 tabular-nums drop-shadow-md transition-colors duration-75"
              style={{ color: currentColor }}
            >
              {score}
            </span>
            <span className="text-[#E0F2FE] text-xs font-semibold tracking-wider">
              / 100
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 transition-all duration-150"
                  style={{
                    color: i < Math.ceil(score / 20) ? currentColor : "rgba(255,255,255,0.2)",
                    fill: i < Math.ceil(score / 20) ? currentColor : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bandeau d'état dynamique */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
            style={{
              backgroundColor: `${currentColor}25`,
              color: currentColor,
              border: `1px solid ${currentColor}60`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentColor }}
            />
            {currentBadge.level}
          </span>
          <button
            type="button"
            onClick={startAnimation}
            disabled={isAnimating}
            className="text-[11px] font-semibold text-white/80 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer border-none flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isAnimating ? "animate-spin" : ""}`} />
            Rejouer
          </button>
        </div>

        {/* Composition card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 mb-4 shadow-lg">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center justify-between">
            <span>Composition du Score</span>
            <span className="text-xs font-bold" style={{ color: currentColor }}>
              {score} / 100 pts
            </span>
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
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-5 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md"
              style={{ backgroundColor: `${currentColor}33`, color: currentColor }}
            >
              <Shield className="w-5 h-5" />
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
          className="w-full bg-white text-[#0a5c7a] py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl font-bold text-sm border-none cursor-pointer hover:bg-slate-50 transition-colors"
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
