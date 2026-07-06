import { ArrowLeft, ChevronRight, Users, BarChart2, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Briefcase, Clock, Percent } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

// ── Tokens (pro palette) ──────────────────────────────────────────────────────
const AMBER = '#92400E';   // header – deep amber pro
const TEAL  = '#006D77';   // accent projets
const GOLD  = '#D4A373';   // accent tontines
const TERRA = '#B05B3B';   // accent investissements

const SIZE    = 210;
const CX      = SIZE / 2;
const CY      = SIZE / 2;
const R_OUTER = 84;
const R_INNER = 50;
const GAP     = 3;

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(cx: number, cy: number, rO: number, rI: number, s: number, e: number) {
  const o1 = polarToXY(cx, cy, rO, s), o2 = polarToXY(cx, cy, rO, e);
  const i1 = polarToXY(cx, cy, rI, e), i2 = polarToXY(cx, cy, rI, s);
  const la = e - s > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`, `A ${rO} ${rO} 0 ${la} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`, `A ${rI} ${rI} 0 ${la} 0 ${i2.x} ${i2.y}`, 'Z',
  ].join(' ');
}

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TOTAL = 12750;
const PROJETS_PCT  = 0.565;
const TONTINE_PCT  = 0.243;
const INVEST_PCT   = 0.192;

const METRICS = [
  { icon: ArrowDownLeft, label: 'Revenus encaissés',  value: '8 650,00 €', color: TEAL,    bg: `${TEAL}14`,    trend: null     },
  { icon: ArrowUpRight,  label: 'Charges & sorties',  value: '2 819,00 €', color: TERRA,   bg: `${TERRA}14`,   trend: null     },
  { icon: TrendingUp,    label: 'Marge nette',        value: '+5 831,00 €',color: '#16A34A',bg: '#16A34A14',   trend: '+45,7%' },
  { icon: Percent,       label: 'Rendement moy.',     value: '11,2 %',     color: GOLD,    bg: `${GOLD}1A`,    trend: null     },
  { icon: Clock,         label: 'Prochaine échéance', value: '15 juil.',   color: '#7C3AED',bg: '#7C3AED14',   trend: null     },
  { icon: TrendingDown,  label: 'En attente',         value: '1 250,00 €', color: '#F59E0B',bg: '#F59E0B14',   trend: null     },
];

type TxCategory = 'projets' | 'tontines' | 'invest' | 'frais';

const TRANSACTIONS: { id: string; type: 'in'|'out'; label: string; amount: number; date: string; color: string; category: TxCategory; projet?: string }[] = [
  { id: 't1', type: 'in',  label: 'Contribution — Lolo Moderne',       amount:  5000,  date: "Aujourd'hui", color: TEAL,        category: 'projets',  projet: 'Lolo Moderne'       },
  { id: 't2', type: 'in',  label: 'Don — Coopérative Agricole',        amount:   500,  date: "Aujourd'hui", color: TEAL,        category: 'projets',  projet: 'Coopérative Agricole'},
  { id: 't3', type: 'out', label: 'Retrait validé — Lolo Moderne',     amount: -8000,  date: '2 juil.',     color: TERRA,       category: 'projets',  projet: 'Lolo Moderne'       },
  { id: 't4', type: 'in',  label: 'Dividende RWA — Immo Guadeloupe',   amount:  1250,  date: '28 juin',     color: TERRA,       category: 'invest'                                   },
  { id: 't5', type: 'out', label: 'Cotisation tontine Famille',         amount:  -400,  date: '25 juin',     color: GOLD,        category: 'tontines'                                 },
  { id: 't6', type: 'in',  label: 'Contribution — Lolo Moderne',       amount:  3000,  date: '20 juin',     color: TEAL,        category: 'projets',  projet: 'Lolo Moderne'       },
  { id: 't7', type: 'in',  label: 'Contribution — Lolo Moderne',       amount:  2100,  date: '18 juin',     color: TEAL,        category: 'projets',  projet: 'Lolo Moderne'       },
  { id: 't8', type: 'out', label: 'Frais plateforme KAURI',             amount:   -49,  date: '1 juin',      color: '#94A3B8',   category: 'frais'                                    },
];

// ── Donut slices ──────────────────────────────────────────────────────────────
const s0 = GAP / 2;
const e0 = 360 * PROJETS_PCT - GAP / 2;
const s1 = 360 * PROJETS_PCT + GAP / 2;
const e1 = 360 * (PROJETS_PCT + TONTINE_PCT) - GAP / 2;
const s2 = 360 * (PROJETS_PCT + TONTINE_PCT) + GAP / 2;
const e2 = 360 - GAP / 2;

const sliceProjets  = donutSlice(CX, CY, R_OUTER, R_INNER, s0, e0);
const sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, s1, e1);
const sliceInvest   = donutSlice(CX, CY, R_OUTER, R_INNER, s2, e2);

// ── Main ──────────────────────────────────────────────────────────────────────
export function ProPortefeuilleScreen() {
  const navigate = useNavigate();
  const [activeSlice, setActiveSlice] = useState<'projets' | 'tontines' | 'invest' | null>(null);
  const [animated, setAnimated] = useState(false);
  const [txFilter, setTxFilter] = useState<TxCategory | 'all'>('all');

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const centerLabel =
    activeSlice === 'projets'  ? { pct: '56%', amount: formatEur(TOTAL * PROJETS_PCT), color: TEAL,  label: 'Projets' } :
    activeSlice === 'tontines' ? { pct: '24%', amount: formatEur(TOTAL * TONTINE_PCT), color: GOLD,  label: 'Tontines' } :
    activeSlice === 'invest'   ? { pct: '20%', amount: formatEur(TOTAL * INVEST_PCT),  color: TERRA, label: 'Invest. RWA' } :
    { pct: '100%', amount: formatEur(TOTAL), color: '#1A1A1A', label: 'Total' };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">

      {/* ── HEADER ── */}
      <div
        style={{ backgroundColor: AMBER, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Détails · Pro</p>
            <h1 className="text-white text-2xl font-bold">Portefeuille Business</h1>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="text-white text-xs font-semibold">{formatEur(TOTAL)}</span>
          </div>
        </div>
      </div>

      {/* ── DONUT CHART ── */}
      <div className="flex flex-col items-center pt-7 pb-3 px-6">
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <svg
            width={SIZE} height={SIZE}
            style={{
              transform: animated ? 'scale(1)' : 'scale(0.85)',
              opacity: animated ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
              overflow: 'visible',
              filter: 'drop-shadow(0 8px 24px rgba(146,64,14,0.15))',
            }}
          >
            <path d={sliceProjets} fill={TEAL}
              style={{ transform: activeSlice === 'projets'  ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'projets'  ? `drop-shadow(0 4px 12px ${TEAL}88)` : 'none' }}
              onClick={() => setActiveSlice(s => s === 'projets'  ? null : 'projets')}
            />
            <path d={sliceTontines} fill={GOLD}
              style={{ transform: activeSlice === 'tontines' ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'tontines' ? `drop-shadow(0 4px 12px ${GOLD}88)` : 'none' }}
              onClick={() => setActiveSlice(s => s === 'tontines' ? null : 'tontines')}
            />
            <path d={sliceInvest} fill={TERRA}
              style={{ transform: activeSlice === 'invest'   ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'invest'   ? `drop-shadow(0 4px 12px ${TERRA}88)` : 'none' }}
              onClick={() => setActiveSlice(s => s === 'invest'   ? null : 'invest')}
            />
            <circle cx={CX} cy={CY} r={R_INNER - 2} fill="#F8FAFC" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: centerLabel.color, letterSpacing: '-0.03em', lineHeight: 1, transition: 'color 0.2s' }}>{centerLabel.pct}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8', marginTop: 3 }}>{centerLabel.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginTop: 2 }}>{centerLabel.amount}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 flex-wrap justify-center">
          {[
            { key: 'projets'  as const, color: TEAL,  label: 'Projets 56%'      },
            { key: 'tontines' as const, color: GOLD,  label: 'Tontines 24%'     },
            { key: 'invest'   as const, color: TERRA, label: 'Invest. RWA 20%'  },
          ].map(({ key, color, label }) => (
            <button key={key} className="flex items-center gap-2" onClick={() => setActiveSlice(s => s === key ? null : key)}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color, boxShadow: activeSlice === key ? `0 0 0 2.5px ${color}44` : 'none', transition: 'box-shadow 0.2s' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: activeSlice === key ? color : '#64748B' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-5 h-px bg-[#E8EDF2] my-1" />

      {/* ── FINANCIAL SNAPSHOT ── */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[#0F172A] text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: AMBER }} />
          Synthèse financière
        </p>
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(({ icon: Icon, label, value, color, bg, trend }) => (
            <div
              key={label}
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#fff', border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon style={{ width: 16, height: 16, color }} />
                </div>
                <span className="text-[#64748B] text-xs leading-tight">{label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[#0F172A] text-sm font-bold">{value}</span>
                {trend && (
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#16A34A' }}>
                    {trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-5 h-px bg-[#E8EDF2] mt-4 mb-3" />

      {/* ── RÉPARTITION ── */}
      <div className="px-5 space-y-3">
        <p className="text-[#0F172A] text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
          Répartition
        </p>

        {/* Projets */}
        <button
          onClick={() => navigate('/kauri/pro-projets')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:bg-[#F0FFFE] transition-colors"
          style={{ border: `1.5px solid ${TEAL}25`, boxShadow: `0 2px 10px ${TEAL}0A` }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${TEAL}14` }}>
            <Briefcase style={{ width: 20, height: 20, color: TEAL }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-semibold">Projets & Clients</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${PROJETS_PCT * 80}px`, backgroundColor: TEAL, opacity: 0.4 }} />
              <span className="text-[#94A3B8] text-xs">56 %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-bold">{formatEur(TOTAL * PROJETS_PCT)}</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>

        {/* Tontines */}
        <button
          onClick={() => navigate('/kauri/portefeuille-tontines')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:bg-[#FFFDF5] transition-colors"
          style={{ border: `1.5px solid ${GOLD}35`, boxShadow: `0 2px 10px ${GOLD}0C` }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${GOLD}1A` }}>
            <Users style={{ width: 20, height: 20, color: GOLD }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-semibold">Tontines</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${TONTINE_PCT * 80}px`, backgroundColor: GOLD, opacity: 0.5 }} />
              <span className="text-[#94A3B8] text-xs">24 %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-bold">{formatEur(TOTAL * TONTINE_PCT)}</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>

        {/* Investissements */}
        <button
          onClick={() => navigate('/kauri/portefeuille-investissements')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white transition-colors"
          style={{ border: `1.5px solid ${TERRA}25`, boxShadow: `0 2px 10px ${TERRA}0A` }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${TERRA}14` }}>
            <BarChart2 style={{ width: 20, height: 20, color: TERRA }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-semibold">Investissements RWA</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${INVEST_PCT * 80}px`, backgroundColor: TERRA, opacity: 0.5 }} />
              <span className="text-[#94A3B8] text-xs">20 %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-bold">{formatEur(TOTAL * INVEST_PCT)}</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-5 h-px bg-[#E8EDF2] mt-5 mb-3" />

      {/* ── MOUVEMENTS RÉCENTS ── */}
      <div className="px-5">
        <p className="text-[#0F172A] text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: TEAL }} />
          Mouvements récents
        </p>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {([
            { id: 'all',      label: 'Tout',        color: '#64748B' },
            { id: 'projets',  label: 'Projets',     color: TEAL      },
            { id: 'invest',   label: 'RWA',         color: TERRA     },
            { id: 'tontines', label: 'Tontines',    color: GOLD      },
            { id: 'frais',    label: 'Frais',       color: '#94A3B8' },
          ] as { id: TxCategory | 'all'; label: string; color: string }[]).map(f => {
            const active = txFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setTxFilter(f.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: active ? f.color : '#fff',
                  color:      active ? '#fff'   : '#64748B',
                  border:     `1.5px solid ${active ? f.color : '#E8EDF2'}`,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {TRANSACTIONS
            .filter(tx => txFilter === 'all' || tx.category === txFilter)
            .map(tx => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
                style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: `${tx.color}14` }}>
                  {tx.type === 'in'
                    ? <ArrowDownLeft style={{ width: 15, height: 15, color: tx.color }} />
                    : <ArrowUpRight  style={{ width: 15, height: 15, color: tx.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] text-sm font-medium truncate">{tx.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[#94A3B8] text-xs">{tx.date}</p>
                    {tx.projet && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${TEAL}12`, color: TEAL }}>
                        {tx.projet}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{ color: tx.type === 'in' ? '#16A34A' : '#EF4444' }}
                >
                  {tx.type === 'in' ? '+' : ''}{Math.abs(tx.amount).toLocaleString('fr-FR')} €
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        <p className="text-[#94A3B8] text-xs">Valorisation en temps réel · Mis à jour il y a 2 min</p>
      </div>

    </div>
  );
}
