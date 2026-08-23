import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, ShieldAlert, X, Check, Loader2 } from "lucide-react";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

export type ReportContentType = "message" | "user" | "room" | "media";
export type ReportReason =
  | "harassment"
  | "hate_speech"
  | "fraud_scam"
  | "inappropriate_media"
  | "illegal_content"
  | "other";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ReportContentType;
  contentId: string;
  reportedUserId?: string;
  plainTextSnapshot?: string; // Utilisé pour transmettre la version en clair d'un message E2EE/privé
}

const REASONS: { id: ReportReason; label: string; desc: string }[] = [
  {
    id: "fraud_scam",
    label: "Arnaque ou Fraude Financière",
    desc: "Proposition d'investissement suspecte, phishing ou escroquerie.",
  },
  {
    id: "harassment",
    label: "Harcèlement ou Intimidation",
    desc: "Menaces, insultes répétées ou comportement déplacé.",
  },
  {
    id: "hate_speech",
    label: "Discours haineux",
    desc: "Discrimination, racisme, homophobie ou incitation à la haine.",
  },
  {
    id: "inappropriate_media",
    label: "Contenu Explicite / Inapproprié",
    desc: "Images ou vidéos violentes, pornographiques ou non sollicitées.",
  },
  {
    id: "illegal_content",
    label: "Activité Illégale",
    desc: "Infraction grave aux lois en vigueur.",
  },
  {
    id: "other",
    label: "Autre motif",
    desc: "Ne respecte pas la charte de confiance Kauri.",
  },
];

export function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  reportedUserId,
  plainTextSnapshot,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [consentSnapshot, setConsentSnapshot] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Veuillez sélectionner un motif de signalement.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Vous devez être connecté pour effectuer un signalement.");
        return;
      }

      const { error } = await supabase.from("moderation_reports").insert({
        reporter_id: user.id,
        content_type: contentType,
        content_id: contentId,
        reported_user_id: reportedUserId || null,
        reason: selectedReason,
        details: details.trim() || null,
        plain_text_snapshot: consentSnapshot ? plainTextSnapshot || null : null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Signalement transmis à l'équipe de modération Kauri.");
      onClose();
    } catch (err: any) {
      console.error("Erreur signalement:", err);
      toast.error(err.message || "Échec de l'envoi du signalement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Signaler un abus</h3>
                <p className="text-xs text-slate-500">Protection et sécurité de la communauté</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Reasons List */}
          <div className="my-5 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Motif du signalement
            </label>
            {REASONS.map((r) => {
              const isSelected = selectedReason === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-red-500 bg-red-50/50"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/40"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      isSelected ? "border-red-500 bg-red-500 text-white" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{r.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional details */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Détails complémentaires (optionnel)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Précisez ce qui s'est passé..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* E2EE Snapshot Notice (si contenu chiffré) */}
          {plainTextSnapshot && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-relaxed">
                <p className="font-semibold">Transmission du contenu chiffré</p>
                <p className="text-amber-800/90 mt-0.5">
                  Pour examiner ce message privé, un instantané en clair sera transmis confidentiellement à l'équipe de modération.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 py-3 text-xs font-bold text-white bg-red-600 rounded-xl shadow-lg shadow-red-600/25 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirmer le signalement"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
