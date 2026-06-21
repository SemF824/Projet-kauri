import { ArrowLeft, Leaf, Users, Target, Clock, TrendingUp, Heart, BadgePercent, ChevronRight, CheckCircle2, HandHeart, Coins, Info, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

const TEAL = '#0A847E';

type ContribType = 'don' | 'investissement' | null;

const STATS = [
  { icon: Users,  label: 'Contributeurs', value: '142'      },
  { icon: Target, label: 'Objectif',       value: '25 000 €' },
  { icon: Clock,  label: 'Jours restants', value: '18 j.'   },
];

const FUNDERS = [
  { initials: 'AM', color: '#0A847E' },
  { initials: 'KD', color: '#D4AF37' },
  { initials: 'FS', color: '#8B5CF6' },
  { initials: 'LN', color: '#EC4899' },
];

export function ProjetDetailScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ContribType>(null);
  const [amount, setAmount]     = useState('');
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);

  const progress = 75;
  const raised   = 18750;

  const ctaLabel = selected === 'don'
    ? 'Confirmer le don'
    : selected === 'investissement'
    ? "Valider l'investissement"
    : 'Choisir une option';

  const ctaActive = !!selected && !!amount;

  function handleCta() {
    if (!ctaActive) return;
    const projectName = 'Coopérative Agricole Énergie Verte';
    if (selected === 'don') {
      navigate('/kauri/confirmation-don', { state: { amount, projectName } });
    } else {
      navigate('/kauri/confirmation-investissement', { state: { amount, projectName } });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`, borderRadius: '0 0 32px 32px' }}
        className="px-5 pt-14 pb-8 shadow-2xl"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(74,222,128,0.25)', color: '#4ADE80' }}>
                ● En cours
              </span>
              <span className="text-xs text-white/50">Agriculture · Mali</span>
            </div>
            <h1 className="text-white text-xl font-bold leading-snug">
              Coopérative Agricole<br />Énergie Verte
            </h1>
          </div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-6">
          Financement d'une coopérative agricole solaire au Mali : panneaux photovoltaïques, irrigation durable et formation de 80 agriculteurs locaux.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl px-3 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <Icon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }} />
              <p className="text-white text-sm font-bold">{value}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs">Progression</span>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold">{raised.toLocaleString('fr-FR')} €</span>
              <span className="text-white/50 text-xs">/ 25 000 €</span>
            </div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <div
              style={{
                height: '100%', borderRadius: 999,
                width: animated ? `${progress}%` : '0%',
                background: 'linear-gradient(90deg, #4ADE80, #16A34A)',
                transition: 'width 1s cubic-bezier(0.34,1.2,0.64,1)',
                boxShadow: '0 0 10px rgba(74,222,128,0.5)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex -space-x-1.5">
              {FUNDERS.map(f => (
                <div key={f.initials} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: f.color }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>{f.initials}</span>
                </div>
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: 8, color: '#fff' }}>+138</span>
              </div>
            </div>
            <span className="text-sm font-bold" style={{ color: '#4ADE80' }}>{progress}% atteint</span>
          </div>
        </div>
      </div>

      {/* ── TYPE DE CONTRIBUTION ── */}
      <div className="px-5 pt-6 space-y-4">

        {/* Section header */}
        <div className="mb-1">
          <p className="text-[#0F172A] text-base font-bold mb-1">Type de contribution</p>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Choisissez comment vous souhaitez soutenir ce projet. Deux profils, deux impacts.
          </p>
        </div>

        {/* ── Option A : Don ── */}
        <button
          onClick={() => setSelected(s => s === 'don' ? null : 'don')}
          className="w-full text-left rounded-3xl transition-all overflow-hidden"
          style={{
            backgroundColor: selected === 'don' ? `${TEAL}08` : '#fff',
            border: `2px solid ${selected === 'don' ? TEAL : '#E8EDF2'}`,
            boxShadow: selected === 'don' ? `0 6px 24px ${TEAL}20` : '0 1px 6px rgba(0,0,0,0.05)',
          }}
        >
          {/* Card top band */}
          <div
            className="px-5 pt-4 pb-3 flex items-start gap-4"
            style={{ borderBottom: `1px solid ${selected === 'don' ? `${TEAL}18` : '#F1F5F9'}` }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: selected === 'don' ? `${TEAL}15` : '#F1F5F9' }}
            >
              <HandHeart style={{ width: 20, height: 20, color: selected === 'don' ? TEAL : '#94A3B8' }} />
            </div>

            <div className="flex-1">
              {/* Title row */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selected === 'don' ? TEAL : '#94A3B8' }}>
                    Option A
                  </span>
                  <p className="text-sm font-bold text-[#0F172A] mt-0.5">Le Choix Solidaire</p>
                </div>
                {/* Radio */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: selected === 'don' ? TEAL : '#CBD5E1', backgroundColor: selected === 'don' ? TEAL : 'transparent' }}
                >
                  {selected === 'don' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Message */}
              <p className="text-xs leading-relaxed" style={{ color: '#475569', fontStyle: 'italic' }}>
                « Je soutiens ma communauté sans contrepartie financière. »
              </p>
            </div>
          </div>

          {/* Card body — mechanics */}
          <div className="px-5 py-3.5 space-y-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 style={{ width: 14, height: 14, color: TEAL, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs text-[#475569] leading-snug">
                Votre argent va directement au projet sous forme de <span className="font-semibold text-[#0F172A]">don participatif</span>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Info style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs text-[#94A3B8] leading-snug">
                Capital non remboursé — vous agissez pour le développement local.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#D4AF3720', color: '#B8860B' }}>
                ✦ +5 pts Trust Score
              </div>
            </div>
          </div>
        </button>

        {/* ── Option B : Investissement ── */}
        <button
          onClick={() => setSelected(s => s === 'investissement' ? null : 'investissement')}
          className="w-full text-left rounded-3xl transition-all overflow-hidden"
          style={{
            backgroundColor: selected === 'investissement' ? '#D4A37308' : '#fff',
            border: `2px solid ${selected === 'investissement' ? '#D4A373' : '#E8EDF2'}`,
            boxShadow: selected === 'investissement' ? '0 6px 24px rgba(212,163,115,0.18)' : '0 1px 6px rgba(0,0,0,0.05)',
          }}
        >
          {/* Card top band */}
          <div
            className="px-5 pt-4 pb-3 flex items-start gap-4"
            style={{ borderBottom: `1px solid ${selected === 'investissement' ? '#D4A37320' : '#F1F5F9'}` }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: selected === 'investissement' ? 'rgba(212,163,115,0.15)' : '#F1F5F9' }}
            >
              <Coins style={{ width: 20, height: 20, color: selected === 'investissement' ? '#D4A373' : '#94A3B8' }} />
            </div>

            <div className="flex-1">
              {/* Title row */}
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selected === 'investissement' ? '#D4A373' : '#94A3B8' }}>
                    Option B
                  </span>
                  <p className="text-sm font-bold text-[#0F172A] mt-0.5">Le Choix Investisseur</p>
                </div>
                {/* Radio */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: selected === 'investissement' ? '#D4A373' : '#CBD5E1', backgroundColor: selected === 'investissement' ? '#D4A373' : 'transparent' }}
                >
                  {selected === 'investissement' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Message */}
              <p className="text-xs leading-relaxed" style={{ color: '#475569', fontStyle: 'italic' }}>
                « J'achète des tokens RWA et je perçois un rendement de 8%. »
              </p>
            </div>
          </div>

          {/* Card body — mechanics */}
          <div className="px-5 py-3.5 space-y-2">
            <div className="flex items-start gap-2.5">
              <TrendingUp style={{ width: 14, height: 14, color: '#D4A373', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs text-[#475569] leading-snug">
                Votre argent est converti en <span className="font-semibold text-[#0F172A]">tokens d'actifs réels (RWA)</span> adossés au projet.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Lock style={{ width: 14, height: 14, color: '#94A3B8', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs text-[#94A3B8] leading-snug">
                Capital bloqué — remboursé avec intérêts sur la durée du projet.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(212,163,115,0.15)', color: '#B8860B' }}>
                ◎ 8% rendement annuel
              </div>
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                RWA tokenisé
              </div>
            </div>
          </div>
        </button>

        {/* Amount input */}
        {selected && (
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#fff', border: '1.5px solid #E8EDF2', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-semibold text-[#64748B] mb-2">
              {selected === 'don' ? 'Montant du don' : "Montant à investir"}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center rounded-xl px-4 py-3 gap-2" style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <span className="text-sm font-bold" style={{ color: TEAL }}>€</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-[#0F172A]"
                  style={{ minWidth: 0 }}
                />
              </div>
              {[25, 50, 100].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  className="px-3 py-3 rounded-xl text-xs font-semibold transition-colors"
                  style={{ backgroundColor: amount === String(v) ? TEAL : '#F1F5F9', color: amount === String(v) ? '#fff' : '#64748B' }}
                >
                  {v}€
                </button>
              ))}
            </div>
            {selected === 'investissement' && amount && Number(amount) > 0 && (
              <div className="flex items-center gap-2 mt-3 px-1">
                <CheckCircle2 style={{ width: 13, height: 13, color: '#16A34A' }} />
                <p className="text-xs text-[#64748B]">
                  Projection annuelle :{' '}
                  <span className="font-bold text-[#16A34A]">+{(Number(amount) * 0.08).toFixed(2)} €</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!ctaActive}
          onClick={handleCta}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
          style={{
            background: ctaActive
              ? selected === 'don'
                ? `linear-gradient(135deg, ${TEAL}, #0D9488)`
                : 'linear-gradient(135deg, #B8860B, #D4A373)'
              : '#E2E8F0',
            color: ctaActive ? '#fff' : '#94A3B8',
            boxShadow: ctaActive
              ? selected === 'don' ? `0 4px 18px ${TEAL}44` : '0 4px 18px rgba(212,163,115,0.40)'
              : 'none',
            cursor: ctaActive ? 'pointer' : 'not-allowed',
          }}
        >
          <span>{ctaLabel}</span>
          {ctaActive && <ChevronRight style={{ width: 16, height: 16 }} />}
        </button>

        <p className="text-center text-xs pb-2 text-[#94A3B8]">
          🔒 Transaction sécurisée · Fonds protégés par l'escrow KAURI
        </p>
      </div>
    </div>
  );
}
