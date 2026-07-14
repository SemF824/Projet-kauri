import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Shield,
  ChevronRight,
  CreditCard,
  Smartphone,
  Wallet,
  Lock,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';
import { toast } from 'sonner';

const TEAL = '#006D77';
const GOLD = '#D4AF37';

interface CircleData {
  id: string;
  name: string;
  contribution: number;
  maxMembers: number;
  finalPot: number;
  minTrustScore: number;
  duration: number;
  currentMembers: number;
  slots: string[]; // Tableau de slots généré dynamiquement
}

export function RejoindreCircleScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, user } = useAuth();

  const [circle, setCircle] = useState<CircleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('wallet');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTrustScore = Math.round(Number(profile?.trust_score ?? profile?.trustScore) || 0);
  const userBalance = Number(profile?.balance || 0);

  const state = (location.state as { circleId?: string }) || {};
  const circleId = state.circleId || 'a05ed24b-efe1-408f-be3e-be2dcd93947b';

  useEffect(() => {
    const fetchCircleMetadata = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('tontines')
          .select('id, name, contribution_amount, max_members, min_trust_score, duration_months, start_date')
          .eq('id', circleId)
          .single();

        if (error) throw error;

        if (data) {
          const contrib = Number(data.contribution_amount) || 0;
          const maxM = Number(data.max_members) || 10;
          
          // ── 📐 GÉNÉRATION DYNAMIQUE ET INTELLIGENTE DES SLOTS TEMPORELS ──
          const generatedSlots: string[] = [];
          const startDate = data.start_date ? new Date(data.start_date) : new Date();

          for (let i = 0; i < maxM; i++) {
            const slotDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const formattedMonth = slotDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            // Capitalisation de la première lettre (ex: "août 2026" -> "Août 2026")
            generatedSlots.push(formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1));
          }
          
          setCircle({
            id: data.id,
            name: data.name,
            contribution: contrib,
            maxMembers: maxM,
            finalPot: contrib * maxM,
            minTrustScore: Number(data.min_trust_score) || 0,
            duration: Number(data.duration_months) || maxM,
            currentMembers: Math.floor(Math.random() * 3) + 2, // Simulation temporaire de l'occupation
            slots: generatedSlots
          });
        }
      } catch (err) {
        console.error('Erreur lors de la synchronisation du cercle:', err);
        toast.error('Impossible de charger les spécifications de ce cercle.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleMetadata();
  }, [circleId, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D6D6D6]">
        <div className="w-full max-w-[430px] h-screen flex flex-col items-center justify-center bg-[#F9F9F9] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#006D77]" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vérification des critères de confiance...</p>
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D6D6D6]">
        <div className="w-full max-w-[430px] h-screen flex flex-col items-center justify-center bg-[#F9F9F9] p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
          <h2 className="text-base font-black text-slate-800">Cercle d'épargne introuvable</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold border-none cursor-pointer">
            Retourner au catalogue
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = userTrustScore >= circle.minTrustScore;
  const isElite = circle.minTrustScore >= 85;
  const accentColor = isElite ? GOLD : TEAL;
  const canProceed = step === 1 ? !!selectedSlot : (agreedToRules && !isSubmitting);

  const PAYMENT_METHODS = [
    { id: 'wallet', label: 'Portefeuille KAURI', subtitle: `Solde : ${userBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, icon: Wallet },
    { id: 'card', label: 'Carte bancaire', subtitle: '**** **** **** 4242', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Money', subtitle: 'Orange Money / Wave', icon: Smartphone },
  ];

  async function handleConfirm() {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Inscription de votre position sur le Smart Contract...");

    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('tontine_members')
        .insert({
          tontine_id: circle.id,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') {
          toast.warning("Vous participez déjà à ce cercle d'épargne.", { id: toastId });
          navigate('/kauri/tontines-actives');
          return;
        }
        throw error;
      }

      toast.success("Position validée avec succès !", { id: toastId });
      
      navigate('/kauri/circle-join-success', {
        state: {
          circleId: circle.id,
          circleName: circle.name,
          contribution: circle.contribution,
          finalPot: circle.finalPot,
          slot: selectedSlot,
          paymentMethod: selectedPayment,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Échec de la transaction réseau.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
        <div className="w-full max-w-[430px] h-screen flex flex-col justify-between overflow-hidden shadow-2xl bg-[#F9F9F9] p-6 text-center">
          <div className="my-auto space-y-6">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Accès au cercle verrouillé</h1>
              <p className="text-xs text-slate-500 leading-relaxed px-4">
                Ce cercle d'épargne publique applique des critères de conformité stricts pour protéger le capital de ses participants.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono space-y-2 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">Votre Trust Score :</span>
                <span className="font-bold text-red-500">{userTrustScore} / 100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">Score minimal requis :</span>
                <span className="font-bold text-emerald-600">{circle.minTrustScore} / 100</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-600 font-medium bg-amber-50 rounded-xl p-3 border border-amber-200/50">
              💡 Augmentez votre score en honorant vos cotisations à temps dans vos cercles privés actuels avant de postuler à ce niveau.
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold cursor-pointer border-none shadow-md"
          >
            Retourner au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9]">

        {/* Header */}
        <div
          style={{
            background: isElite
              ? 'linear-gradient(150deg, #7B5C1A 0%, #4A3508 100%)'
              : `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`,
            borderRadius: '0 0 24px 24px',
          }}
          className="px-4 pt-12 pb-5 flex-shrink-0 shadow-xl"
        >
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors bg-transparent border-none cursor-pointer font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">{step === 2 ? 'Étape précédente' : 'Retour'}</span>
          </button>

          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">
                Étape {step} sur 2
              </p>
              <h1 className="text-lg font-bold text-white">
                {step === 1 ? 'Choisir votre place' : 'Confirmer & payer'}
              </h1>
            </div>
            <div className="flex gap-1.5">
              <div className="w-8 h-1.5 rounded-full" style={{ background: step >= 1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }} />
              <div className="w-8 h-1.5 rounded-full" style={{ background: step >= 2 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>

          <p className="text-xs text-white/60 font-semibold">{circle.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ─── STEP 1: Choose slot ─── */}
          {step === 1 && (
            <div className="px-4 py-5 space-y-4">
              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Récapitulatif financier</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-50 font-mono">
                  <div className="px-4 py-3">
                    <p className="text-xs font-sans text-[#64748B] mb-0.5">Cotisation</p>
                    <p className="text-lg font-bold" style={{ color: accentColor }}>{circle.contribution} €/mois</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs font-sans text-[#64748B] mb-0.5">Pot final reçu</p>
                    <p className="text-lg font-bold text-[#D4AF37]">{circle.finalPot} €</p>
                  </div>
                </div>
              </div>

              {/* Slot selection */}
              <div>
                <p className="text-sm font-bold text-[#0F172A] mb-1">Quand souhaitez-vous recevoir le pot ?</p>
                <p className="text-xs text-[#94A3B8] mb-3 leading-relaxed">
                  Choisissez le mois d'attribution de la cagnotte. L'ordre de versement est assigné de façon immuable lors du ralliement.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {circle.slots.map((month, i) => {
                    const isTaken = i < circle.currentMembers;
                    const isSelected = selectedSlot === month;
                    return (
                      <button
                        key={month}
                        disabled={isTaken}
                        onClick={() => setSelectedSlot(isSelected ? null : month)}
                        className="rounded-xl px-3 py-3 text-left transition-all border text-slate-800 bg-white cursor-pointer"
                        style={
                          isTaken 
                            ? { opacity: 0.4, cursor: 'not-allowed', backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }
                            : isSelected
                            ? { borderColor: accentColor, background: `${accentColor}08`, borderWidth: 2 }
                            : { borderColor: '#E2E8F0' }
                        }
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className="text-xs font-bold"
                            style={{ color: isSelected ? accentColor : isTaken ? '#CBD5E1' : '#0F172A' }}
                          >
                            {month}
                          </p>
                          {isSelected && <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />}
                          {isTaken && <span className="text-[10px] font-sans text-[#CBD5E1]">Pris</span>}
                        </div>
                        <p className="text-[10px] font-sans" style={{ color: isTaken ? '#CBD5E1' : '#94A3B8' }}>
                          {isTaken ? 'Réservé' : `${circle.finalPot} €`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info */}
              <div
                className="rounded-xl p-3.5 flex items-start gap-3"
                style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <p className="text-xs text-[#475569] leading-relaxed">
                  Votre ralliement engage le Smart Contract. La place est bloquée de façon chiffrée après validation de votre première mensualité de dépôt.
                </p>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Confirm & Pay ─── */}
          {step === 2 && (
            <div className="px-4 py-5 space-y-4">
              {/* Order recap */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Votre ralliement</p>
                </div>
                {[
                  { label: 'Cercle sélectionné', value: circle.name },
                  { label: 'Mois d\'attribution', value: selectedSlot || '—' },
                  { label: 'Durée du cycle', value: `${circle.duration} mois` },
                  { label: '1ère cotisation exigée', value: `${circle.contribution} €` },
                  { label: 'Frais de déploiement', value: '0 € (Kauri Émérite)' },
                ].map(({ label, value }, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-0 text-xs">
                    <p className="text-[#64748B]">{label}</p>
                    <p className="font-bold text-[#0F172A]">{value}</p>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between font-mono" style={{ background: `${accentColor}08` }}>
                  <p className="text-sm font-bold font-sans text-[#0F172A]">Total à régler</p>
                  <p className="text-lg font-bold" style={{ color: accentColor }}>{circle.contribution} €</p>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-sm font-bold text-[#0F172A] mb-3">Mode de débit des fonds</p>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map(({ id, label, subtitle, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPayment(id)}
                      className="w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-all border cursor-pointer"
                      style={
                        selectedPayment === id
                          ? { borderColor: accentColor, background: `${accentColor}08`, borderWidth: 2 }
                          : { borderColor: '#E8EDF2', background: '#fff' }
                      }
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: selectedPayment === id ? `${accentColor}15` : '#F1F5F9' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: selectedPayment === id ? accentColor : '#94A3B8' }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-[#0F172A]">{label}</p>
                        <p className="text-[11px] text-[#94A3B8] font-medium">{subtitle}</p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedPayment === id ? accentColor : '#CBD5E1',
                          backgroundColor: selectedPayment === id ? accentColor : 'transparent',
                        }}
                      >
                        {selectedPayment === id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div
                className="rounded-xl p-3.5 flex items-start gap-3"
                style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}
              >
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <p className="text-xs text-[#475569] leading-relaxed">
                  Votre versement est consigné par l'escrow décentralisé KAURI. Les fonds ne quittent le coffre-fort qu'à la date d'exécution mensuelle du cycle.
                </p>
              </div>

              {/* Agreement checkbox */}
              <button
                onClick={() => setAgreedToRules(!agreedToRules)}
                className="w-full flex items-start gap-3 text-left bg-transparent border-none cursor-pointer p-0"
              >
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    borderColor: agreedToRules ? accentColor : '#CBD5E1',
                    backgroundColor: agreedToRules ? accentColor : 'transparent',
                  }}
                >
                  {agreedToRules && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  J'accepte les règles immuables du cercle, les conditions d'utilisation KAURI et je m'engage juridiquement à honorer mes cotisations mensuelles sur toute la durée du contrat.
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex-shrink-0">
          {step === 1 ? (
            <button
              disabled={!canProceed}
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border-none cursor-pointer"
              style={{
                background: canProceed
                  ? isElite
                    ? 'linear-gradient(135deg, #7B5C1A, #D4AF37)'
                    : `linear-gradient(135deg, ${TEAL}, #0D9488)`
                  : '#E2E8F0',
                color: canProceed ? '#fff' : '#94A3B8',
                boxShadow: canProceed
                  ? isElite
                    ? '0 4px 18px rgba(212,175,55,0.35)'
                    : `0 4px 18px ${TEAL}44`
                  : 'none',
              }}
            >
              Continuer vers la validation
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!canProceed || isSubmitting}
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-none text-white cursor-pointer"
              style={{
                background: canProceed
                  ? isElite
                    ? 'linear-gradient(135deg, #7B5C1A, #D4AF37)'
                    : `linear-gradient(135deg, ${TEAL}, #0D9488)`
                  : '#E2E8F0',
                color: canProceed ? '#fff' : '#94A3B8',
                boxShadow: canProceed
                  ? isElite
                    ? '0 4px 18px rgba(212,175,55,0.35)'
                    : `0 4px 18px ${TEAL}44`
                  : 'none',
              }}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isSubmitting ? 'Signature en cours...' : 'Confirmer et rejoindre le cercle'}
            </button>
          )}
          <p className="text-center text-xs mt-2 text-[#94A3B8] font-medium">
            🔒 Sécurisation Cryptographique · Escrow KAURI
          </p>
        </div>
      </div>
    </div>
  );
}
