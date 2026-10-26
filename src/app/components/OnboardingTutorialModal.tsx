import { useState } from "react";
import {
  Users,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  PlayCircle,
} from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAction?: (action: "rejoindre" | "creer") => void;
}

export function OnboardingTutorialModal({
  isOpen,
  onClose,
  onStartAction,
}: OnboardingTutorialModalProps) {
  const { isDarkMode } = useDarkMode();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: "Étape 1 sur 3 • Le Concept",
      title: "La Tontine Digitale & Sécurisée",
      subtitle: "L'épargne collective ancestrale réinventée avec la sécurité d'une banque moderne.",
      icon: Users,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      accentColor: "#0a5c7a",
      bullets: [
        "Chaque membre du cercle verse une cotisation mensuelle fixe.",
        "À chaque cycle, l'un des participants empoche l'intégralité du pot commun.",
        "Zéro carnet papier : les prélèvements et versements sont 100% automatisés.",
      ],
    },
    {
      badge: "Étape 2 sur 3 • La Sérénité",
      title: "Score de Confiance & Garantie",
      subtitle: "Fini la peur des impayés : votre réputation financière vous protège.",
      icon: ShieldCheck,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      accentColor: "#D4AF37",
      bullets: [
        "Chaque membre est certifié via pièce d'identité (KYC officiel).",
        "Votre ponctualité augmente votre Trust Score de 0 à 100.",
        "À 85 points, devenez Membre Émérite et débloquez 0% de frais sur vos transactions.",
      ],
    },
    {
      badge: "Étape 3 sur 3 • L'Innovation",
      title: "Le Swap d'Urgence Instantané",
      subtitle: "Une dépense imprévue ? Vous n'êtes plus obligé d'attendre votre tour.",
      icon: RefreshCcw,
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      accentColor: "#0D9488",
      bullets: [
        "Proposez en 1 clic d'échanger votre position dans le calendrier de tirage.",
        "Un autre membre valide le swap en quelques secondes.",
        "Recevez le pot d'avance sans pénalité ni rupture du cercle.",
      ],
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("kauri_tutorial_seen", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-100 text-slate-900"
        }`}
      >
        {/* Bouton Fermer */}
        <button
          onClick={handleComplete}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer border-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Indicateurs d'étapes (Barres de progression en haut) */}
        <div className="flex items-center gap-1.5 mb-6 pr-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                idx === currentStep
                  ? "bg-[#0a5c7a] dark:bg-[#0D9488]"
                  : idx < currentStep
                  ? "bg-slate-300 dark:bg-slate-700"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Badge & Titre */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-[#0a5c7a] dark:text-[#0D9488]">
            <Sparkles className="w-3.5 h-3.5" />
            {step.badge}
          </span>

          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${step.iconBg}`}
            >
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold leading-tight">
                {step.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {step.subtitle}
          </p>
        </div>

        {/* Points clés avec puces stylisées */}
        <div className="mt-5 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          {step.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#0a5c7a] dark:text-[#0D9488] shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {bullet}
              </span>
            </div>
          ))}
        </div>

        {/* Actions du bas */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              Précédent
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              Passer
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#0a5c7a] hover:bg-[#005a63] text-white text-xs font-bold shadow-md shadow-[#0a5c7a]/20 transition-all active:scale-95 cursor-pointer border-none"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-1 justify-end">
              {onStartAction ? (
                <>
                  <button
                    onClick={() => {
                      handleComplete();
                      onStartAction("rejoindre");
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-200 transition-all border-none cursor-pointer"
                  >
                    Rejoindre
                  </button>
                  <button
                    onClick={() => {
                      handleComplete();
                      onStartAction("creer");
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#0a5c7a] to-[#0F172A] text-white text-xs font-bold shadow-md shadow-[#0a5c7a]/20 transition-all active:scale-95 border-none cursor-pointer"
                  >
                    Créer
                  </button>
                </>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#0a5c7a] to-[#0F172A] text-white text-xs font-bold shadow-md shadow-[#0a5c7a]/20 transition-all active:scale-95 cursor-pointer border-none"
                >
                  J'ai compris, c'est parti !
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

