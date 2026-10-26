import {
  Users,
  PlusCircle,
  RefreshCcw,
  ListOrdered,
  HelpCircle,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../contexts/DarkModeContext";

interface TontineQuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorial: () => void;
  isPro?: boolean;
}

export function TontineQuickActionsModal({
  isOpen,
  onClose,
  onOpenTutorial,
  isPro = false,
}: TontineQuickActionsModalProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  const actions = [
    {
      title: "Rejoindre une tontine",
      description: "Entrez un code d'invitation reçu de vos proches",
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      action: () => {
        onClose();
        navigate("/kauri/rejoindre-tontine");
      },
    },
    {
      title: "Créer une nouvelle tontine",
      description: "Définissez le montant, la cadence et invitez vos amis",
      icon: PlusCircle,
      gradient: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
      action: () => {
        onClose();
        navigate(isPro ? "/kauri/pro-creer-tontine" : "/kauri/creer-tontine-publique");
      },
    },
    {
      title: "Mes tontines en cours",
      description: "Consultez vos tours, vos paiements et l'avancement des pots",
      icon: ListOrdered,
      gradient: "from-[#0a5c7a] to-[#0F172A]",
      bgLight: "bg-teal-50 dark:bg-teal-950/40 text-[#0a5c7a] dark:text-[#0D9488]",
      action: () => {
        onClose();
        navigate("/kauri/tontines-actives");
      },
    },
    {
      title: "Échanger ma position (Swap)",
      description: "Besoin de liquidité urgente ? Échangez votre date de tirage",
      icon: RefreshCcw,
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
      action: () => {
        onClose();
        navigate("/kauri/swap-marketplace");
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl relative transition-all duration-300 border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-100 text-slate-900"
        } animate-in slide-in-from-bottom-6 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poignée mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* En-tête */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Espace Tontines</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Que souhaitez-vous faire aujourd'hui ?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer border-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste des actions */}
        <div className="space-y-2.5">
          {actions.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 border cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200/70 hover:border-slate-300"
                } active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.bgLight}`}
                  >
                    <ItemIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Bouton Didacticiel en bas */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenTutorial();
            }}
            className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#0a5c7a] dark:text-[#0D9488] hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors border-none bg-transparent cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Nouveau ? Voir comment fonctionne la tontine</span>
          </button>
        </div>
      </div>
    </div>
  );
}

