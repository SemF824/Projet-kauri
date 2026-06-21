import {
  ArrowLeft,
  Leaf,
  HandHeart,
  CheckCircle2,
  Info,
  Shield,
  Heart,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const TEAL = '#0A847E';

export function ConfirmationDonScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { amount?: string; projectName?: string }) || {};
  const amount = state.amount || '25';
  const projectName = state.projectName || 'Coopérative Agricole Énergie Verte';

  const trustBonus = 5;

  function handleConfirm() {
    navigate('/kauri/contribution-success', {
      state: { type: 'don', amount, projectName },
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`,
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
            <HandHeart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Option A</p>
            <p className="text-white font-bold text-base">Le Choix Solidaire</p>
          </div>
        </div>

        <p className="text-white/60 text-xs leading-relaxed mt-3">
          Vérifiez les détails de votre don avant de confirmer définitivement.
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
            style={{ background: `${TEAL}15` }}
          >
            <Leaf className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#94A3B8] font-semibold mb-0.5">Agriculture · Mali</p>
            <p className="text-[#0F172A] font-bold text-sm leading-snug">{projectName}</p>
          </div>
          <BadgeCheck className="w-5 h-5 text-[#4ADE80] flex-shrink-0" />
        </div>

        {/* Amount summary */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-sm text-[#64748B]">Montant du don</p>
            <p className="text-xl font-bold text-[#0F172A]">{amount} €</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <p className="text-sm text-[#64748B]">Frais de transaction</p>
            <p className="text-sm font-semibold text-[#16A34A]">Gratuits</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm font-bold text-[#0F172A]">Total débité</p>
            <p className="text-xl font-bold" style={{ color: TEAL }}>{amount} €</p>
          </div>
        </div>

        {/* Impact du don */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-bold text-[#0F172A] mb-1">Impact de votre don</p>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
            <p className="text-xs text-[#475569] leading-snug">
              Votre argent va <span className="font-semibold text-[#0F172A]">directement au projet</span> sous forme de don participatif.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
            <p className="text-xs text-[#475569] leading-snug">
              Contribue à financer <span className="font-semibold text-[#0F172A]">80 agriculteurs locaux</span> et l'infrastructure solaire.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#94A3B8]" />
            <p className="text-xs text-[#94A3B8] leading-snug">
              Capital non remboursé — vous agissez pour le développement local.
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: '#D4AF3710', border: '1.5px solid #D4AF3730' }}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" style={{ color: '#B8860B' }} />
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Bonus Trust Score</p>
              <p className="text-xs text-[#64748B] mt-0.5">Récompense solidarité communautaire</p>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#D4AF3720', color: '#B8860B' }}
          >
            ✦ +{trustBonus} pts
          </div>
        </div>

        {/* Sécurité */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: `${TEAL}08`, border: `1.5px solid ${TEAL}20` }}
        >
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
          <div>
            <p className="text-xs font-bold text-[#0F172A] mb-0.5">Paiement sécurisé par KAURI Escrow</p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Votre don est transféré uniquement lorsque le projet atteint son seuil minimum. Sinon, vous êtes intégralement remboursé.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
          style={{
            background: `linear-gradient(135deg, ${TEAL}, #0D9488)`,
            color: '#fff',
            boxShadow: `0 4px 18px ${TEAL}44`,
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirmer définitivement</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs pb-2 text-[#94A3B8]">
          🔒 Transaction sécurisée · Fonds protégés par l'escrow KAURI
        </p>
      </div>
    </div>
  );
}
