import {
  ArrowLeft,
  Lock,
  Users,
  Calendar,
  Euro,
  Shuffle,
  Link2,
  QrCode,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

const TEAL = "#006D77";

type Frequence =
  | "mensuelle"
  | "hebdomadaire"
  | "bihebdomadaire";
type OrdrePassage = "aleatoire" | "fixe";
type ModeInvitation = "lien" | "qr" | "les_deux";
type Duree = "3" | "6" | "9" | "12" | "18" | "24";

export function CreerTontinePriveeScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [cotisation, setCotisation] = useState("");
  const [maxMembres, setMaxMembres] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [frequence, setFrequence] =
    useState<Frequence>("mensuelle");
  const [ordre, setOrdre] = useState<OrdrePassage>("aleatoire");
  const [invitation, setInvitation] =
    useState<ModeInvitation>("lien");
  const [duree, setDuree] = useState<Duree | "">("");
  const [showFrequence, setShowFrequence] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bg = isDarkMode ? "#0F172A" : "#F8FAFC";
  const cardBg = isDarkMode ? "#1E293B" : "#ffffff";
  const border = isDarkMode ? "#334155" : "#E8EDF2";
  const textPrimary = isDarkMode ? "#ffffff" : "#0F172A";
  const textSecondary = "#94A3B8";
  const inputBg = isDarkMode ? "#0F172A" : "#F8FAFC";

  const FREQUENCES: { value: Frequence; label: string }[] = [
    { value: "mensuelle", label: "Mensuelle" },
    { value: "hebdomadaire", label: "Hebdomadaire" },
    { value: "bihebdomadaire", label: "Toutes les 2 sem." },
  ];

  const potTotal =
    cotisation && maxMembres && duree
      ? parseFloat(cotisation) *
        parseInt(maxMembres) *
        parseInt(duree)
      : null;

  function Field({
    label,
    icon: Icon,
    children,
  }: {
    label: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <label
          className="flex items-center gap-1.5 text-xs font-semibold mb-2"
          style={{ color: textSecondary }}
        >
          <Icon style={{ width: 13, height: 13 }} />
          {label}
        </label>
        {children}
      </div>
    );
  }

  function Input({
    value,
    onChange,
    placeholder,
    type = "text",
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
  }) {
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={{
          backgroundColor: inputBg,
          border: `1.5px solid ${border}`,
          color: textPrimary,
        }}
      />
    );
  }

  function ToggleGroup<T extends string>({
    options,
    value,
    onChange,
    color,
  }: {
    options: { value: T; label: string; icon?: any }[];
    value: T;
    onChange: (v: T) => void;
    color: string;
  }) {
    return (
      <div
        className="flex rounded-xl p-1"
        style={{
          backgroundColor: isDarkMode ? "#0F172A" : "#F1F5F9",
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor:
                value === opt.value ? color : "transparent",
              color:
                value === opt.value ? "#fff" : textSecondary,
              boxShadow:
                value === opt.value
                  ? `0 2px 8px ${color}44`
                  : "none",
            }}
          >
            {opt.icon && (
              <opt.icon style={{ width: 13, height: 13 }} />
            )}
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  const isValid =
    nom.trim() &&
    cotisation &&
    maxMembres &&
    dateDebut &&
    duree !== "";

  const handleCreate = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const supabase = getSupabase();

      // Obtention sécurisée de l'utilisateur connecté
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        throw new Error("Session expirée ou introuvable.");

      // 1. Insertion de la Tontine dans PostgreSQL
      const { data: newTontine, error: tontineError } =
        await supabase
          .from("tontines")
          .insert({
            creator_id: user.id,
            name: nom,
            description: description || null,
            contribution_amount: Number(cotisation),
            frequency: frequence,
            max_members: Number(maxMembres),
            duration_months: Number(duree),
            start_date: dateDebut,
            order_type: ordre,
            invitation_mode: invitation,
            type: "privee",
            status: "en_attente",
            current_round: 0,
            total_rounds: Number(maxMembres),
          })
          .select()
          .single();

      if (tontineError) throw tontineError;

      // 2. Rattachement immédiat du créateur comme Admin du groupe
      const { error: memberError } = await supabase
        .from("tontine_members")
        .insert({
          tontine_id: newTontine.id,
          user_id: user.id,
          role: "admin",
          payout_order: 1,
        });

      if (memberError) throw memberError;

      toast.success("Tontine privée créée avec succès !");
      navigate("/kauri/mes-tontines");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message ||
          "Erreur lors de la communication avec Supabase",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-10"
      style={{ backgroundColor: bg }}
    >
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${TEAL} 0%, #0D9488 100%)`,
          borderRadius: "0 0 28px 28px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest">
              Nouvelle tontine
            </p>
            <h1 className="text-white text-xl font-bold">
              Créer • Privée
            </h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Infos générales */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: cardBg,
            border: `1.5px solid ${border}`,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: TEAL }}
          >
            Informations générales
          </p>

          <Field label="Nom de la tontine" icon={Lock}>
            <Input
              value={nom}
              onChange={setNom}
              placeholder="Ex : Cercle Familial"
            />
          </Field>

          <Field label="Description (optionnel)" icon={Lock}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'objectif de ce cercle..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{
                backgroundColor: inputBg,
                border: `1.5px solid ${border}`,
                color: textPrimary,
              }}
            />
          </Field>
        </div>

        {/* Paramètres financiers */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: cardBg,
            border: `1.5px solid ${border}`,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: TEAL }}
          >
            Paramètres financiers
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cotisation (€)" icon={Euro}>
              <Input
                value={cotisation}
                onChange={setCotisation}
                placeholder="100"
                type="number"
              />
            </Field>
            <Field label="Membres max" icon={Users}>
              <Input
                value={maxMembres}
                onChange={setMaxMembres}
                placeholder="10"
                type="number"
              />
            </Field>
          </div>

          <Field label="Durée de la tontine" icon={Calendar}>
            <div className="grid grid-cols-3 gap-2">
              {(
                ["3", "6", "9", "12", "18", "24"] as Duree[]
              ).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuree(d)}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: duree === d ? TEAL : inputBg,
                    color: duree === d ? "#fff" : textSecondary,
                    border: `1.5px solid ${duree === d ? TEAL : border}`,
                    boxShadow:
                      duree === d
                        ? `0 2px 8px ${TEAL}40`
                        : "none",
                  }}
                >
                  {d} mois
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Fréquence de cotisation"
            icon={Calendar}
          >
            <button
              onClick={() => setShowFrequence((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: inputBg,
                border: `1.5px solid ${border}`,
                color: textPrimary,
              }}
            >
              <span>
                {
                  FREQUENCES.find((f) => f.value === frequence)
                    ?.label
                }
              </span>
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  color: textSecondary,
                  transform: showFrequence
                    ? "rotate(180deg)"
                    : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {showFrequence && (
              <div
                className="mt-1 rounded-xl overflow-hidden"
                style={{ border: `1.5px solid ${border}` }}
              >
                {FREQUENCES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setFrequence(f.value);
                      setShowFrequence(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      backgroundColor:
                        frequence === f.value
                          ? `${TEAL}14`
                          : cardBg,
                      color:
                        frequence === f.value
                          ? TEAL
                          : textPrimary,
                      fontWeight:
                        frequence === f.value ? 600 : 400,
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <Field label="Date de début" icon={Calendar}>
            <Input
              value={dateDebut}
              onChange={setDateDebut}
              placeholder=""
              type="date"
            />
          </Field>

          {/* Pot estimé */}
          {potTotal !== null && (
            <div
              className="rounded-xl p-3.5 flex items-center gap-3"
              style={{
                background: `${TEAL}08`,
                border: `1.5px solid ${TEAL}25`,
              }}
            >
              <TrendingUp
                style={{
                  width: 16,
                  height: 16,
                  color: TEAL,
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  className="text-xs font-bold"
                  style={{ color: TEAL }}
                >
                  Pot total estimé :{" "}
                  {potTotal.toLocaleString("fr-FR")} €
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: textSecondary }}
                >
                  {cotisation} € × {maxMembres} membres ×{" "}
                  {duree} mois
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Règles du groupe */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: cardBg,
            border: `1.5px solid ${border}`,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: TEAL }}
          >
            Règles du groupe
          </p>

          <Field label="Ordre de passage" icon={Shuffle}>
            <ToggleGroup
              value={ordre}
              onChange={setOrdre}
              color={TEAL}
              options={[
                {
                  value: "aleatoire",
                  label: "Aléatoire",
                  icon: Shuffle,
                },
                { value: "fixe", label: "Fixe", icon: Users },
              ]}
            />
          </Field>

          <Field label="Mode d'invitation" icon={Link2}>
            <ToggleGroup
              value={invitation}
              onChange={setInvitation}
              color={TEAL}
              options={[
                { value: "lien", label: "Lien", icon: Link2 },
                { value: "qr", label: "QR Code", icon: QrCode },
                {
                  value: "les_deux",
                  label: "Les deux",
                  icon: Users,
                },
              ]}
            />
          </Field>
        </div>

        {/* CTA */}
        <button
          disabled={!isValid || isSubmitting}
          onClick={handleCreate}
          className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: isValid
              ? `linear-gradient(135deg, ${TEAL}, #0D9488)`
              : "#CBD5E1",
            boxShadow: isValid
              ? `0 4px 16px ${TEAL}44`
              : "none",
            opacity: isValid ? 1 : 0.7,
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Création…
            </>
          ) : (
            "Créer ma tontine privée"
          )}
        </button>

        <p
          className="text-center text-xs pb-4"
          style={{ color: textSecondary }}
        >
          Un lien d'invitation sera généré automatiquement après
          création.
        </p>
      </div>
    </div>
  );
}
