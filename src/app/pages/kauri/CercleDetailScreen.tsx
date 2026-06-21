import {
  ArrowLeft,
  Users,
  Calendar,
  Shield,
  CheckCircle2,
  Info,
  ChevronRight,
  Lock,
  Coins,
  Star,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { ALL_CIRCLES } from './DiscoverCirclesScreen';

const TEAL = '#006D77';
const GOLD = '#D4AF37';

const MEMBER_AVATARS = [
  { initials: 'AM', color: '#006D77' },
  { initials: 'KD', color: '#D4AF37' },
  { initials: 'FS', color: '#8B5CF6' },
  { initials: 'LN', color: '#EC4899' },
  { initials: 'MB', color: '#0EA5E9' },
  { initials: 'OP', color: '#F59E0B' },
];

export function CercleDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { circleId?: string }) || {};
  const circleId = state.circleId || '1';
  const circle = ALL_CIRCLES.find((c) => c.id === circleId) || ALL_CIRCLES[0];

  const userScore = 75;
  const isLocked = !circle.isUserEligible && !!circle.scoreRequired && userScore < circle.scoreRequired;
  const isElite = circle.scoreRequired !== null && circle.scoreRequired >= 90;
  const accentColor = isElite ? GOLD : TEAL;

  const [activeTab, setActiveTab] = useState<'details' | 'regles' | 'membres'>('details');

  // Build calendar: 10 months, one member receives per month
  const months = [
    'Août 2026', 'Sept 2026', 'Oct 2026', 'Nov 2026', 'Déc 2026',
    'Jan 2027', 'Fév 2027', 'Mars 2027', 'Avr 2027', 'Mai 2027',
  ];

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9]">

        {/* Header */}
        <div
          style={{
            background: isElite
              ? 'linear-gradient(150deg, #7B5C1A 0%, #4A3508 100%)'
              : `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`,
            borderRadius: '0 0 28px 28px',
          }}
          className="px-4 pt-12 pb-6 flex-shrink-0 shadow-xl"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour</span>
          </button>

          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              {/* Tags */}
              <div className="flex gap-1.5 mb-2 flex-wrap">
                {circle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.90)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-xl font-bold text-white leading-snug">{circle.name}</h1>
              <p className="text-xs text-white/60 mt-1">Par {circle.organizer}</p>
            </div>
            {circle.scoreRequired !== null ? (
              <div className="flex-shrink-0 ml-3 px-2.5 py-1 rounded-md bg-[#B05B3B]">
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">
                  SCORE {circle.scoreRequired}+
                </p>
              </div>
            ) : (
              <div className="flex-shrink-0 ml-3 px-2.5 py-1 rounded-md bg-white/20">
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">
                  SANS SCORE
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-white/70 leading-relaxed mb-4">{circle.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Cotisation', value: `${circle.contribution} €/mois`, icon: Coins },
              { label: 'Pot final', value: `${circle.finalPot} €`, icon: Star },
              { label: 'Durée', value: `${circle.duration} mois`, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <Icon style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 3 }} />
                <p className="text-white text-sm font-bold leading-snug">{value}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.50)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-white/60">Remplissage du cercle</p>
              <p className="text-xs font-bold text-white">
                {circle.currentMembers}/{circle.maxMembers} membres
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${circle.fillPercentage}%`,
                  background: isElite
                    ? 'linear-gradient(90deg, #D4AF37, #F0D080)'
                    : 'linear-gradient(90deg, #4ADE80, #16A34A)',
                }}
              />
            </div>
            <p className="text-[10px] text-white/50 mt-1">
              Reste {circle.maxMembers - circle.currentMembers} places disponibles
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
          {(['details', 'regles', 'membres'] as const).map((tab) => {
            const labels = { details: 'Détails', regles: 'Règles', membres: 'Membres' };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-[#006D77] text-[#006D77]'
                    : 'border-transparent text-[#94A3B8]'
                }`}
                style={activeTab === tab && isElite ? { borderColor: GOLD, color: GOLD } : {}}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ─── DÉTAILS ─── */}
          {activeTab === 'details' && (
            <div className="px-4 py-4 space-y-4">
              {/* Financials */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Récapitulatif financier</p>
                </div>
                {[
                  { label: 'Cotisation mensuelle', value: `${circle.contribution} €`, colored: false },
                  { label: 'Pot final épargné', value: `${circle.finalPot} €`, colored: true },
                  { label: 'Durée totale', value: `${circle.duration} mois`, colored: false },
                  { label: 'Frais KAURI', value: 'Gratuits', colored: false },
                  { label: 'Prochain démarrage', value: circle.nextStartDate, colored: false },
                ].map(({ label, value, colored }, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-0">
                    <p className="text-xs text-[#64748B]">{label}</p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: colored ? (isElite ? GOLD : TEAL) : '#0F172A' }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calendar simulation */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Calendrier de réception</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {months.map((month, i) => {
                    const memberIndex = i % MEMBER_AVATARS.length;
                    const isCurrentUser = i === circle.currentMembers - 1;
                    return (
                      <div key={month} className={`px-4 py-2.5 flex items-center justify-between ${isCurrentUser ? 'bg-[#006D7708]' : ''}`}>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: MEMBER_AVATARS[memberIndex].color, fontSize: 9, fontWeight: 700 }}
                          >
                            {i < circle.currentMembers ? MEMBER_AVATARS[memberIndex].initials : '?'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#0F172A]">{month}</p>
                            <p className="text-[10px] text-[#94A3B8]">
                              {i < circle.currentMembers ? `Membre ${i + 1}` : 'Place disponible'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold" style={{ color: accentColor }}>{circle.finalPot} €</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: `${TEAL}08`, border: `1.5px solid ${TEAL}20` }}
              >
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-xs font-bold text-[#0F172A] mb-0.5">Smart contract KAURI · Escrow sécurisé</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Tous les fonds sont bloqués dans un smart contract audité. Les paiements sont automatiques et transparents sur la blockchain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── RÈGLES ─── */}
          {activeTab === 'regles' && (
            <div className="px-4 py-4 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Règles du cercle</p>
                </div>
                <div className="px-4 py-3 space-y-3.5">
                  {circle.rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-xs text-[#475569] leading-snug flex-1">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: '#FEF3C7', border: '1.5px solid #FCD34D' }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D97706]" />
                <div>
                  <p className="text-xs font-bold text-[#92400E] mb-0.5">Engagement attendu</p>
                  <p className="text-xs text-[#92400E]/80 leading-relaxed">
                    En rejoignant ce cercle, vous vous engagez à respecter toutes les règles ci-dessus et à maintenir vos cotisations pendant toute la durée du contrat.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">En cas de manquement</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  {[
                    'Retard de paiement : pénalité de 5% du montant dû',
                    "Non-paiement après 7 jours : exclusion du cercle",
                    "Exclusion entraîne une baisse de -10 pts Trust Score",
                    "Les fonds déjà versés sont conservés par le cercle",
                  ].map((rule, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#EF4444]" />
                      <p className="text-xs text-[#64748B] leading-snug">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── MEMBRES ─── */}
          {activeTab === 'membres' && (
            <div className="px-4 py-4 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Membres actuels</p>
                  <span className="text-xs text-[#94A3B8]">
                    {circle.currentMembers}/{circle.maxMembers}
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {Array.from({ length: circle.currentMembers }).map((_, i) => {
                    const av = MEMBER_AVATARS[i % MEMBER_AVATARS.length];
                    const scores = [82, 88, 79, 91, 76, 85];
                    return (
                      <div key={i} className="px-4 py-3 flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: av.color, fontSize: 12, fontWeight: 700 }}
                        >
                          {av.initials}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#0F172A]">Membre {i + 1}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <BadgeCheck className="w-3 h-3 text-[#4ADE80]" />
                            <p className="text-[10px] text-[#64748B]">Score : {scores[i] || 80}</p>
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${TEAL}10`, color: TEAL }}
                        >
                          Actif
                        </span>
                      </div>
                    );
                  })}
                  {/* Empty slots */}
                  {Array.from({ length: circle.maxMembers - circle.currentMembers }).map((_, i) => (
                    <div key={`empty-${i}`} className="px-4 py-3 flex items-center gap-3 opacity-40">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-[#CBD5E1]" />
                      </div>
                      <p className="text-xs text-[#CBD5E1]">Place disponible</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sticky CTA */}
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex-shrink-0">
          {isLocked ? (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-4 rounded-2xl bg-gray-200 text-[#94A3B8] font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                Verrouillé — Score {circle.scoreRequired}+ requis
              </button>
              <p className="text-center text-xs text-[#94A3B8]">
                Votre score actuel : <span className="font-bold text-[#B05B3B]">{userScore} pts</span>
              </p>
            </div>
          ) : (
            <button
              onClick={() =>
                navigate('/kauri/rejoindre-cercle', { state: { circleId: circle.id } })
              }
              className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              style={{
                background: isElite
                  ? 'linear-gradient(135deg, #7B5C1A, #D4AF37)'
                  : `linear-gradient(135deg, ${TEAL}, #0D9488)`,
                boxShadow: isElite
                  ? '0 4px 18px rgba(212,175,55,0.35)'
                  : `0 4px 18px ${TEAL}44`,
              }}
            >
              {circle.status === 'accessible' ? 'Postuler à ce cercle' : 'Rejoindre ce cercle'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <p className="text-center text-xs mt-2 text-[#94A3B8]">
            🔒 Sécurisé par KAURI Escrow · Smart contract audité
          </p>
        </div>
      </div>
    </div>
  );
}
