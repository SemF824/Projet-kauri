import { CheckCircle2, HandHeart, Coins, Home, ArrowRight, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

const TEAL = '#0A847E';
const GOLD_DARK = '#B8860B';

export function ContributionSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { type?: 'don' | 'investissement'; amount?: string; projectName?: string }) || {};
  const type = state.type || 'don';
  const amount = state.amount || '25';
  const projectName = state.projectName || 'Coopérative Agricole Énergie Verte';

  const isDon = type === 'don';
  const accent = isDon ? TEAL : GOLD_DARK;
  const accentLight = isDon ? `${TEAL}15` : 'rgba(212,163,115,0.15)';

  const [scale, setScale] = useState(0.6);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setScale(1); setOpacity(1); }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top decorative band */}
      <div
        style={{
          background: isDon
            ? `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`
            : 'linear-gradient(150deg, #92652A 0%, #5C3D10 100%)',
          height: 220,
          borderRadius: '0 0 48px 48px',
        }}
        className="relative flex items-center justify-center shadow-2xl"
      >
        {/* Animated checkmark */}
        <div
          style={{
            transform: `scale(${scale})`,
            opacity,
            transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
          }}
          className="flex flex-col items-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.30)' }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-80">
            {isDon ? 'Don confirmé' : 'Investissement validé'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-10 space-y-5">
        {/* Main message */}
        <div className="text-center">
          <h1 className="text-[#0F172A] text-2xl font-bold mb-2">
            {isDon ? 'Merci pour votre générosité !' : 'Investissement enregistré !'}
          </h1>
          <p className="text-[#64748B] text-sm leading-relaxed">
            {isDon
              ? `Votre don de ${amount} € a été transmis avec succès au projet.`
              : `Votre investissement de ${amount} € est maintenant actif sur le smart contract.`}
          </p>
        </div>

        {/* Summary card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div
            className="px-5 py-3.5 flex items-center gap-3"
            style={{ borderBottom: '1px solid #F1F5F9', background: accentLight }}
          >
            {isDon
              ? <HandHeart className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
              : <Coins className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
            }
            <p className="text-sm font-bold" style={{ color: accent }}>
              {isDon ? 'Le Choix Solidaire' : 'Le Choix Investisseur'}
            </p>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <p className="text-xs text-[#64748B]">Projet</p>
              <p className="text-xs font-semibold text-[#0F172A] text-right max-w-[180px]">{projectName}</p>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <p className="text-xs text-[#64748B]">{isDon ? 'Montant donné' : 'Montant investi'}</p>
              <p className="text-sm font-bold" style={{ color: accent }}>{amount} €</p>
            </div>
            {!isDon && (
              <div className="px-5 py-3.5 flex items-center justify-between">
                <p className="text-xs text-[#64748B]">Rendement annuel projeté</p>
                <p className="text-sm font-bold text-[#16A34A]">+{(Number(amount) * 0.08).toFixed(2)} €</p>
              </div>
            )}
            <div className="px-5 py-3.5 flex items-center justify-between">
              <p className="text-xs text-[#64748B]">Statut</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                <p className="text-xs font-bold text-[#16A34A]">Confirmé</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Score badge - only for don */}
        {isDon && (
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: '#D4AF3710', border: '1.5px solid #D4AF3730' }}
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              <div>
                <p className="text-xs font-bold text-[#0F172A]">+5 pts Trust Score ajoutés</p>
                <p className="text-xs text-[#64748B] mt-0.5">Votre profil solidaire progresse</p>
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: '#D4AF3720', color: GOLD_DARK }}
            >
              ✦ +5 pts
            </div>
          </div>
        )}

        {/* Next steps */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-bold text-[#0F172A]">Prochaines étapes</p>
          {isDon ? (
            <>
              <Step text="Vous recevrez une notification dès que le projet démarre." />
              <Step text="Suivez l'avancement dans « Mes projets soutenus »." />
              <Step text="Le porteur de projet vous adressera un rapport de progression." />
            </>
          ) : (
            <>
              <Step text="Vos tokens RWA apparaissent dans votre portefeuille sous 24h." />
              <Step text="Suivez vos rendements dans « Mes investissements »." />
              <Step text="Les intérêts sont versés selon le calendrier du smart contract." />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/kauri/mes-investissements')}
            className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: isDon
                ? `linear-gradient(135deg, ${TEAL}, #0D9488)`
                : 'linear-gradient(135deg, #B8860B, #D4A373)',
              color: '#fff',
              boxShadow: isDon ? `0 4px 18px ${TEAL}44` : '0 4px 18px rgba(212,163,115,0.40)',
            }}
          >
            <span>{isDon ? 'Voir mes projets soutenus' : 'Voir mes investissements'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/kauri/projets-impacts')}
            className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
          >
            <Home className="w-4 h-4" />
            <span>Retour aux projets d'impact</span>
          </button>
        </div>

        <p className="text-center text-xs pb-2 text-[#94A3B8]">
          🔒 Transaction sécurisée · Fonds protégés par l'escrow KAURI
        </p>
      </div>
    </div>
  );
}

function Step({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <CheckCircle2 className="w-4 h-4 text-[#4ADE80] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#475569] leading-snug">{text}</p>
    </div>
  );
}
