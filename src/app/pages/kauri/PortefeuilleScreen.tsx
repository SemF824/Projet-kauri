import { ArrowLeft, ChevronRight, Users, BarChart2, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Percent, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { SERVER_URL, authHeaders } from '../../../utils/supabase';

const TEAL = '#0A847E';
const GOLD = '#D4A373';
const SIZE = 210;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 84;
const R_INNER = 50;
const GAP = 3;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
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
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Financial snapshot data ──────────────────────────────────────────────────
const METRICS = [
  { icon: ArrowDownLeft, label: 'Total déposé',    value: '3 200,00 €', color: TEAL,      bg: `${TEAL}14`,    trend: null },
  { icon: ArrowUpRight,  label: 'Total retiré',    value: '850,00 €',   color: '#B05B3B',  bg: '#B05B3B14',    trend: null },
  { icon: TrendingUp,    label: 'Gains nets',       value: '+100,00 €',  color: '#16A34A',  bg: '#16A34A14',    trend: '+4,1%' },
  { icon: Percent,       label: 'Rendement moy.',  value: '8,5 %',      color: GOLD,       bg: `${GOLD}1A`,    trend: null },
  { icon: Clock,         label: 'Prochaine éch.',  value: '1 juil.',    color: '#7C3AED',  bg: '#7C3AED14',    trend: null },
  { icon: TrendingDown,  label: 'En attente',      value: '120,00 €',   color: '#F59E0B',  bg: '#F59E0B14',    trend: null },
];

export function PortefeuilleScreen() {
  const navigate = useNavigate();
  const [activeSlice, setActiveSlice] = useState<'tontines' | 'invest' | null>(null);
  const [animated, setAnimated] = useState(false);
  const [walletData, setWalletData] = useState<{ balance: number; transactions: any[] } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    authHeaders().then(headers =>
      fetch(`${SERVER_URL}/wallet`, { headers })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setWalletData(data);
            setRecentTransactions((data.transactions || []).slice(0, 6));
          }
        })
        .catch(e => console.error('Wallet fetch error:', e))
    );
  }, []);

  const realTotal = walletData?.balance ?? 0;
  const tontinesPct = realTotal > 0 ? 0.6 : 0.5;
  const investPct = realTotal > 0 ? 0.4 : 0.5;
  const sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, GAP / 2, 360 * tontinesPct - GAP / 2);
  const sliceInvest   = donutSlice(CX, CY, R_OUTER, R_INNER, 360 * tontinesPct + GAP / 2, 360 - GAP / 2);

  const centerLabel = activeSlice === 'tontines'
    ? { pct: '60%', amount: formatEur(realTotal * 0.6), color: TEAL, label: 'Tontines' }
    : activeSlice === 'invest'
    ? { pct: '40%', amount: formatEur(realTotal * 0.4), color: GOLD, label: 'Invest. RWA' }
    : { pct: '100%', amount: formatEur(realTotal), color: '#1A1A1A', label: 'Total' };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">

      {/* ── HEADER ── */}
      <div
        style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }}
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
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Détails</p>
            <h1 className="text-white text-2xl font-bold">Mon Portefeuille</h1>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="text-white text-xs font-semibold">{formatEur(realTotal)}</span>
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
              filter: 'drop-shadow(0 8px 24px rgba(10,132,126,0.15))',
            }}
          >
            <path d={sliceTontines} fill={TEAL}
              style={{ transform: activeSlice === 'tontines' ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'tontines' ? `drop-shadow(0 4px 12px ${TEAL}88)` : 'none' }}
              onClick={() => setActiveSlice(s => s === 'tontines' ? null : 'tontines')}
            />
            <path d={sliceInvest} fill={GOLD}
              style={{ transform: activeSlice === 'invest' ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'invest' ? `drop-shadow(0 4px 12px ${GOLD}88)` : 'none' }}
              onClick={() => setActiveSlice(s => s === 'invest' ? null : 'invest')}
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
        <div className="flex items-center gap-6 mt-4">
          {[
            { key: 'tontines' as const, color: TEAL,  label: 'Tontines 60%' },
            { key: 'invest'   as const, color: GOLD,  label: 'Invest. RWA 40%' },
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
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: TEAL }} />
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

      {/* ── ALLOCATION ROWS ── */}
      <div className="px-5 space-y-3">
        <p className="text-[#0F172A] text-sm font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
          Répartition
        </p>

        {/* Tontines */}
        <button
          onClick={() => navigate('/kauri/portefeuille-tontines')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:bg-[#F0FFFE] transition-colors"
          style={{ border: '1.5px solid #E0F0EF', boxShadow: '0 2px 10px rgba(10,132,126,0.06)' }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${TEAL}14` }}>
            <Users style={{ width: 20, height: 20, color: TEAL }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-semibold">Tontines</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${tontinesPct * 80}px`, backgroundColor: TEAL, opacity: 0.4 }} />
              <span className="text-[#94A3B8] text-xs">60 %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-bold">1 470,00 €</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>

        {/* Investissements */}
        <button
          onClick={() => navigate('/kauri/portefeuille-investissements')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:bg-[#FFFDF5] transition-colors"
          style={{ border: '1.5px solid #F0E8D8', boxShadow: '0 2px 10px rgba(212,163,115,0.07)' }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${GOLD}1A` }}>
            <BarChart2 style={{ width: 20, height: 20, color: GOLD }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-semibold">Investissements RWA</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${investPct * 80}px`, backgroundColor: GOLD, opacity: 0.5 }} />
              <span className="text-[#94A3B8] text-xs">40 %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-bold">980,00 €</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>
      </div>

      {/* ── FOOTER ── */}
      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        <p className="text-[#94A3B8] text-xs">Valorisation en temps réel · Mis à jour il y a 2 min</p>
      </div>
    </div>
  );
}
