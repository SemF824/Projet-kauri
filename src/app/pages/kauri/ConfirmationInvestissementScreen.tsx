import {
  ArrowLeft,
  Leaf,
  Coins,
  TrendingUp,
  Lock,
  Shield,
  ChevronRight,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const GOLD = '#D4A373';
const GOLD_DARK = '#B8860B';

export function ConfirmationInvestissementScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { amount?: string; projectName?: string }) || {};
  const amount = state.amount || '50';
  const projectName = state.projectName || 'Coopérative Agricole Énergie Verte';

  const numAmount = Number(amount) || 0;
  const annualReturn = (numAmount * 0.08).toFixed(2);
  const totalYear3 = (numAmount * 1.08 ** 3).toFixed(2);
  const tokens = (numAmount / 1.25).toFixed(2);

  function handleConfirm() {
    navigate('/kauri/contribution-success', {
      state: { type: 'investissement', amount, projectName },
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(150deg, #92652A 0%, #5C3D10 100%)',
          borderRadius: '0 0 32px 32px',
        }}
        className="px-5 pt-14 pb-8 shadow-2xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Modifier</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Option B</p>
            <p className="text-white font-bold text-base">Le Choix Investisseur</p>
          </div>
        </div>

        <p className="text-white/60 text-xs leading-relaxed mt-3">
          Vérifiez les détails de votre investissement avant de valider définitivement.
        </p>
      </div>

      <div className="px-5 pt-6 space-y-4">
        {/* Project card */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(212,163,115,0.15)` }}
          >
            <Leaf className="w-6 h-6" style={{ color: GOLD }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#94A3B8] font-semibold mb-0.5">Agriculture · Mali</p>
            <p className="text-[#0F172A] font-bold text-sm leading-snug">{projectName}</p>
          </div>
          <BadgeCheck className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} />
        </div>

        {/* Amount & tokens summary */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-sm text-[#64748B]">Montant investi</p>
            <p className="text-xl font-bold text-[#0F172A]">{amount} €</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-sm text-[#64748B]">Tokens RWA alloués</p>
            <p className="text-sm font-bold" style={{ color: GOLD_DARK }}>{tokens} RWA</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-sm text-[#64748B]">Rendement annuel</p>
            <p className="text-sm font-bold text-[#16A34A]">+{annualReturn} €</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm font-bold text-[#0F172A]">Valeur projetée (3 ans)</p>
            <p className="text-xl font-bold" style={{ color: GOLD_DARK }}>{totalYear3} €</p>
          </div>
        </div>

        {/* Projection table */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-bold text-[#0F172A] mb-4">Projection des rendements</p>

          <div className="space-y-3">
            {[1, 2, 3].map((year) => {
              const val = (numAmount * 1.08 ** year).toFixed(2);
              const gain = (numAmount * 1.08 ** year - numAmount).toFixed(2);
              const width = Math.min(100, (year / 3) * 100);
              return (
                <div key={year}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-[#64748B]">Année {year}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#16A34A]">+{gain} €</span>
                      <span className="text-xs font-bold text-[#0F172A]">{val} €</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mechanics */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-bold text-[#0F172A] mb-1">Comment ça fonctionne</p>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
            <p className="text-xs text-[#475569] leading-snug">
              Votre argent est converti en <span className="font-semibold text-[#0F172A]">tokens d'actifs réels (RWA)</span> adossés au projet agricole.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#16A34A]" />
            <p className="text-xs text-[#475569] leading-snug">
              8% de rendement annuel versé via le <span className="font-semibold text-[#0F172A]">smart contract KAURI</span>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#94A3B8]" />
            <p className="text-xs text-[#94A3B8] leading-snug">
              Capital bloqué pendant la durée du projet — remboursé avec intérêts à l'échéance.
            </p>
          </div>
        </div>

        {/* Sécurité */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: 'rgba(212,163,115,0.08)', border: `1.5px solid rgba(212,163,115,0.25)` }}
        >
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD_DARK }} />
          <div>
            <p className="text-xs font-bold text-[#0F172A] mb-0.5">Smart contract audité · Escrow KAURI</p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Votre investissement est sécurisé par un smart contract vérifié et des fonds placés en escrow jusqu'au déblocage contractuel.
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'rgba(212,163,115,0.15)', color: GOLD_DARK }}
          >
            ◎ 8% rendement annuel
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
          >
            RWA tokenisé
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
          >
            Audité
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #D4A373)',
            color: '#fff',
            boxShadow: '0 4px 18px rgba(212,163,115,0.40)',
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Valider définitivement</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs pb-2 text-[#94A3B8]">
          🔒 Transaction sécurisée · Fonds protégés par l'escrow KAURI
        </p>
      </div>
    </div>
  );
}
