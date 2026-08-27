import {
  ArrowLeft, ChevronRight, Users, BarChart2, TrendingUp, TrendingDown,
  ArrowDownLeft, ArrowUpRight, Briefcase, Clock, Percent, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { useProData } from '../../contexts/ProDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

// ── Palette ───────────────────────────────────────────────────────────────────
const AMBER = '#92400E';
const TEAL  = '#006D77';
const GOLD  = '#D4A373';
const TERRA = '#B05B3B';

// ── Donut constants ───────────────────────────────────────────────────────────
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

function formatXof(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' F CFA';
}

function formatUsdt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USDT';
}

export function ProPortefeuilleScreen() {
  const navigate = useNavigate();
  const { projets } = useProData();
  const { profile, refreshProfile } = useAuth();

  const [activeSlice, setActiveSlice] = useState<'projets' | 'tontines' | 'invest' | null>(null);
  const [animated, setAnimated]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const balanceEur = profile?.balance ?? 2450.00;
  const balanceXof = profile?.balanceXof ?? 1600000;
  const balanceUsdt = profile?.balanceUsdt ?? 1250;

  // Conversion équivalente totale en EUR
  const eurToXofRate = 655.957;
  const usdtToEurRate = 0.92;
  const totalEquivEur = balanceEur + (balanceXof / eurToXofRate) + (balanceUsdt * usdtToEurRate);

  const tontinesTotal = balanceEur * 0.35;
  const investTotal = balanceEur * 0.65;

  const tontinesPct = totalEquivEur > 0 ? tontinesTotal / totalEquivEur : 0.35;
  const investPct = totalEquivEur > 0 ? investTotal / totalEquivEur : 0.65;

  // slices
  const sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, GAP / 2, 360 * tontinesPct - GAP / 2);
  const sliceInvest   = donutSlice(CX, CY, R_OUTER, R_INNER, 360 * tontinesPct + GAP / 2, 360 - GAP / 2);

  const centerLabel =
    activeSlice === 'tontines' ? { pct: `${Math.round(tontinesPct * 100)} %`, amount: formatEur(tontinesTotal), color: GOLD, label: 'Tontines' } :
    activeSlice === 'invest'   ? { pct: `${Math.round(investPct * 100)} %`,   amount: formatEur(investTotal),   color: TERRA,  label: 'Invest. RWA' } :
    { pct: '100 %', amount: formatEur(totalEquivEur), color: '#1A1A1A', label: 'Caisse Totale' };

  const metrics = [
    { icon: ArrowDownLeft, label: 'Solde EUR', value: formatEur(balanceEur), color: TEAL, bg: `${TEAL}14`, trend: null },
    { icon: ArrowDownLeft, label: 'Solde CFA', value: formatXof(balanceXof), color: '#0284C7', bg: '#0284C714', trend: null },
    { icon: ArrowDownLeft, label: 'Solde USDT', value: formatUsdt(balanceUsdt), color: '#16A34A', bg: '#16A34A14', trend: null },
    { icon: Percent, label: 'Rendement moyen', value: '11.5 %', color: GOLD, bg: `${GOLD}1A`, trend: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">
      {/* HEADER */}
      <div style={{ backgroundColor: AMBER, borderRadius: '0 0 28px 28px' }} className="px-5 pt-14 pb-6 shadow-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors border-none bg-transparent cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">Détails · Pro</p>
            <h1 className="text-white text-2xl font-black tracking-tight">Caisse Trésorerie</h1>
          </div>
          <button onClick={refreshProfile} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-none cursor-pointer">
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="flex flex-col items-center pt-7 pb-3 px-6">
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            style={{
              transform: animated ? 'scale(1)' : 'scale(0.85)',
              opacity: animated ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
              overflow: 'visible',
            }}
          >
            <path
              d={sliceTontines}
              fill={GOLD}
              style={{
                transform: activeSlice === 'tontines' ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${CX}px ${CY}px`,
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => setActiveSlice(s => s === 'tontines' ? null : 'tontines')}
            />
            <path
              d={sliceInvest}
              fill={TERRA}
              style={{
                transform: activeSlice === 'invest' ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${CX}px ${CY}px`,
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => setActiveSlice(s => s === 'invest' ? null : 'invest')}
            />
          </svg>

          <div
            className="absolute flex flex-col items-center justify-center text-center rounded-full bg-white"
            style={{ top: '13.5%', left: '13.5%', width: '73%', height: '73%', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{centerLabel.label}</p>
            <h2 className="text-sm font-black mb-1 leading-none tracking-tight" style={{ color: centerLabel.color }}>{centerLabel.amount}</h2>
            <span className="text-[11px] font-bold text-slate-500">{centerLabel.pct}</span>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="flex-1 px-4 pt-3">
        {/* DISCLAIMER INTEGRATION BANCAIRE / CARD */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-amber-800 text-xs font-bold mb-1">🔌 Statut Intégration API Bancaire & PSP</p>
          <p className="text-amber-700 text-[10px] leading-relaxed">
            Les liaisons de cartes bancaires d'entreprise et les flux de trésorerie réels s'activeront après connexion de vos identifiants d'API bancaire sécurisés lors de l'intégration finale.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-4 border border-[#F1F5F9] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: metric.bg }}>
                    <Icon style={{ width: 16, height: 16, color: metric.color }} />
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{metric.label}</p>
                  <p className="text-sm font-black text-slate-800 leading-none">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProPortefeuilleScreen;