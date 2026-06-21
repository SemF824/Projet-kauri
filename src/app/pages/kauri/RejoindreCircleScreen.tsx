import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Shield,
  ChevronRight,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { ALL_CIRCLES } from './DiscoverCirclesScreen';

const TEAL = '#006D77';
const GOLD = '#D4AF37';

const PAYMENT_METHODS = [
  { id: 'wallet', label: 'Portefeuille KAURI', subtitle: 'Solde : 320 €', icon: Wallet },
  { id: 'card', label: 'Carte bancaire', subtitle: '**** **** **** 4242', icon: CreditCard },
  { id: 'mobile', label: 'Mobile Money', subtitle: 'Orange Money / Wave', icon: Smartphone },
];

const MONTH_SLOTS = [
  'Août 2026', 'Sept 2026', 'Oct 2026', 'Nov 2026', 'Déc 2026',
  'Jan 2027', 'Fév 2027', 'Mars 2027', 'Avr 2027', 'Mai 2027',
];

export function RejoindreCircleScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { circleId?: string }) || {};
  const circleId = state.circleId || '1';
  const circle = ALL_CIRCLES.find((c) => c.id === circleId) || ALL_CIRCLES[0];

  const isElite = circle.scoreRequired !== null && circle.scoreRequired >= 90;
  const accentColor = isElite ? GOLD : TEAL;

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('wallet');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const canProceed = step === 1 ? !!selectedSlot : agreedToRules;

  function handleConfirm() {
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
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors"
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

          <p className="text-xs text-white/60">{circle.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ─── STEP 1: Choose slot ─── */}
          {step === 1 && (
            <div className="px-4 py-5 space-y-4">
              {/* Summary card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Récapitulatif</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-50">
                  <div className="px-4 py-3">
                    <p className="text-xs text-[#64748B] mb-0.5">Cotisation</p>
                    <p className="text-lg font-bold" style={{ color: accentColor }}>{circle.contribution} €/mois</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-[#64748B] mb-0.5">Pot final</p>
                    <p className="text-lg font-bold text-[#D4AF37]">{circle.finalPot} €</p>
                  </div>
                </div>
              </div>

              {/* Slot selection */}
              <div>
                <p className="text-sm font-bold text-[#0F172A] mb-1">Quand souhaitez-vous recevoir le pot ?</p>
                <p className="text-xs text-[#94A3B8] mb-3 leading-relaxed">
                  Choisissez le mois où vous recevrez la totalité du pot. L'ordre est attribué selon la disponibilité.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MONTH_SLOTS.map((month, i) => {
                    const isTaken = i < circle.currentMembers;
                    const isSelected = selectedSlot === month;
                    return (
                      <button
                        key={month}
                        disabled={isTaken}
                        onClick={() => setSelectedSlot(isSelected ? null : month)}
                        className={`rounded-xl px-3 py-3 text-left transition-all border ${
                          isTaken
                            ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50'
                            : isSelected
                            ? 'border-2'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        style={
                          isSelected
                            ? { borderColor: accentColor, background: `${accentColor}08` }
                            : {}
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
                          {isTaken && <span className="text-[10px] text-[#CBD5E1]">Pris</span>}
                        </div>
                        <p className="text-[10px]" style={{ color: isTaken ? '#CBD5E1' : '#94A3B8' }}>
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
                  Votre demande sera confirmée par l'organisateur sous 24h. La place n'est définitive qu'après validation et premier paiement.
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
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Votre commande</p>
                </div>
                {[
                  { label: 'Cercle', value: circle.name },
                  { label: 'Mois choisi', value: selectedSlot || '—' },
                  { label: 'Durée', value: `${circle.duration} mois` },
                  { label: '1ère cotisation', value: `${circle.contribution} €` },
                  { label: 'Frais', value: 'Gratuits' },
                ].map(({ label, value }, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-0">
                    <p className="text-xs text-[#64748B]">{label}</p>
                    <p className="text-xs font-semibold text-[#0F172A]">{value}</p>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${accentColor}08` }}>
                  <p className="text-sm font-bold text-[#0F172A]">Total aujourd'hui</p>
                  <p className="text-lg font-bold" style={{ color: accentColor }}>{circle.contribution} €</p>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-sm font-bold text-[#0F172A] mb-3">Mode de paiement</p>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map(({ id, label, subtitle, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPayment(id)}
                      className="w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-all border"
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
                        <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>
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
                  Votre paiement est protégé par l'escrow KAURI. Les fonds ne sont transférés qu'une fois le cercle complet et validé.
                </p>
              </div>

              {/* Agreement checkbox */}
              <button
                onClick={() => setAgreedToRules(!agreedToRules)}
                className="w-full flex items-start gap-3 text-left"
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
                <p className="text-xs text-[#64748B] leading-relaxed">
                  J'accepte les règles du cercle, les conditions d'utilisation KAURI et je m'engage à respecter mes cotisations mensuelles sur toute la durée du contrat.
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
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
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
              Continuer
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!canProceed}
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
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
              <CheckCircle2 className="w-4 h-4" />
              Confirmer et rejoindre
            </button>
          )}
          <p className="text-center text-xs mt-2 text-[#94A3B8]">
            🔒 Paiement sécurisé · Escrow KAURI
          </p>
        </div>
      </div>
    </div>
  );
}
