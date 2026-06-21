import {
  CheckCircle2,
  ArrowRight,
  Home,
  Users,
  Calendar,
  Coins,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

const TEAL = '#006D77';

export function CircleJoinSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as {
    circleId?: string;
    circleName?: string;
    contribution?: number;
    finalPot?: number;
    slot?: string;
    paymentMethod?: string;
  }) || {};

  const circleName = state.circleName || 'Cercle Horizon 50';
  const contribution = state.contribution || 50;
  const finalPot = state.finalPot || 500;
  const slot = state.slot || 'À définir';
  const isElite = finalPot >= 2000;
  const accentColor = isElite ? '#D4AF37' : TEAL;

  const [scale, setScale] = useState(0.5);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setScale(1); setOpacity(1); }, 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col shadow-2xl bg-[#F9F9F9]">

        {/* Top band */}
        <div
          style={{
            background: isElite
              ? 'linear-gradient(150deg, #7B5C1A 0%, #4A3508 100%)'
              : `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`,
            height: 230,
            borderRadius: '0 0 48px 48px',
          }}
          className="relative flex items-center justify-center shadow-2xl flex-shrink-0"
        >
          <div
            style={{
              transform: `scale(${scale})`,
              opacity,
              transition: 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
            }}
            className="flex flex-col items-center"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.30)' }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <p className="text-white text-xs font-bold tracking-widest uppercase opacity-80">
              Inscription confirmée
            </p>
          </div>
        </div>

        <div className="flex-1 px-5 pt-8 pb-10 space-y-5">

          {/* Message */}
          <div className="text-center">
            <h1 className="text-[#0F172A] text-2xl font-bold mb-2">
              Bienvenue dans le cercle !
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Vous avez rejoint <span className="font-semibold text-[#0F172A]">{circleName}</span>. Votre premier paiement a été enregistré.
            </p>
          </div>

          {/* Summary */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <div
              className="px-5 py-3.5 flex items-center gap-2"
              style={{ borderBottom: '1px solid #F1F5F9', background: `${accentColor}10` }}
            >
              <Users className="w-4 h-4" style={{ color: accentColor }} />
              <p className="text-sm font-bold" style={{ color: accentColor }}>{circleName}</p>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {[
                { icon: Coins, label: 'Cotisation mensuelle', value: `${contribution} €` },
                { icon: Calendar, label: 'Mois de réception', value: slot },
                { icon: CheckCircle2, label: 'Pot final', value: `${finalPot} €`, accent: true },
              ].map(({ icon: Icon, label, value, accent }, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: accent ? '#D4AF37' : '#94A3B8' }} />
                    <p className="text-xs text-[#64748B]">{label}</p>
                  </div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: accent ? '#D4AF37' : accentColor }}
                  >
                    {value}
                  </p>
                </div>
              ))}
              <div className="px-5 py-3.5 flex items-center justify-between">
                <p className="text-xs text-[#64748B]">Statut</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                  <p className="text-xs font-bold text-[#16A34A]">Actif</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
          >
            <p className="text-sm font-bold text-[#0F172A]">Prochaines étapes</p>
            {[
              'Votre place dans le cercle est confirmée et enregistrée sur le smart contract.',
              `Votre prochaine cotisation de ${contribution} € sera prélevée automatiquement le 5 du mois prochain.`,
              `Vous recevrez ${finalPot} € lors de votre mois sélectionné (${slot}).`,
              "Suivez l'avancement du cercle dans votre portefeuille KAURI.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#4ADE80]" />
                <p className="text-xs text-[#475569] leading-snug">{text}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/kauri/mes-tontines')}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              style={{
                background: isElite
                  ? 'linear-gradient(135deg, #7B5C1A, #D4AF37)'
                  : `linear-gradient(135deg, ${TEAL}, #0D9488)`,
                boxShadow: isElite
                  ? '0 4px 18px rgba(212,175,55,0.35)'
                  : `0 4px 18px ${TEAL}44`,
              }}
            >
              <span>Voir mes tontines</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/kauri/discover-circles')}
              className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
            >
              <Home className="w-4 h-4" />
              <span>Découvrir d'autres cercles</span>
            </button>
          </div>

          <p className="text-center text-xs text-[#94A3B8]">
            🔒 Transaction sécurisée · Fonds protégés par l'escrow KAURI
          </p>
        </div>
      </div>
    </div>
  );
}
