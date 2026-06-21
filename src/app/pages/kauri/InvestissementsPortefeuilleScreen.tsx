import {
  ArrowLeft, Building2, Sprout, Zap, HeartPulse,
  Cpu, ShoppingBag, Globe, Landmark, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

const GOLD = '#D4A373';
const TEAL = '#0A847E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Sector taxonomy ──────────────────────────────────────────────────────────
const SECTORS = [
  { id: 'immobilier',  label: 'Immobilier',     icon: Building2,  color: GOLD,      active: true  },
  { id: 'agriculture', label: 'Agriculture',    icon: Sprout,     color: TEAL,      active: true  },
  { id: 'energie',     label: 'Énergie verte',  icon: Zap,        color: '#10B981', active: true  },
  { id: 'sante',       label: 'Santé',          icon: HeartPulse, color: '#EC4899', active: false },
  { id: 'tech',        label: 'Tech & Digital', icon: Cpu,        color: '#6366F1', active: false },
  { id: 'commerce',    label: 'Commerce',       icon: ShoppingBag,color: '#F59E0B', active: false },
  { id: 'infra',       label: 'Infrastructure', icon: Globe,      color: '#64748B', active: false },
  { id: 'microfinance',label: 'Microfinance',   icon: Landmark,   color: '#8B5CF6', active: false },
] as const;

type SectorId = typeof SECTORS[number]['id'];

// ── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 'i1', sectorId: 'immobilier' as SectorId, name: 'Résidences Abidjan Nord', subSector: 'Résidentiel',   amount: 300, status: 'En cours'        },
  { id: 'i2', sectorId: 'immobilier' as SectorId, name: 'Lolo Moderne – Dakar',    subSector: 'Commercial',    amount: 200, status: 'En cours'        },
  { id: 'i3', sectorId: 'immobilier' as SectorId, name: 'Complexe Hôtelier Lomé',  subSector: 'Hôtellerie',   amount:  88, status: 'En cours'        },
  { id: 'a1', sectorId: 'agriculture' as SectorId,name: 'Coopérative Agricole Mali',subSector: 'Export',       amount: 230, status: 'Bientôt clôturé' },
  { id: 'e1', sectorId: 'energie' as SectorId,    name: 'Ferme Solaire Sénégal',   subSector: 'Énergie solaire',amount:162, status: 'En cours'        },
];

const TOTAL = PROJECTS.reduce((s, p) => s + p.amount, 0); // 980

// per-sector aggregate
function sStats(id: SectorId) {
  const ps = PROJECTS.filter(p => p.sectorId === id);
  return { count: ps.length, total: ps.reduce((s, p) => s + p.amount, 0) };
}

const ACTIVE_SECTORS = SECTORS.filter(s => s.active);
const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'En cours':         { bg: '#D1FAE5', text: '#16A34A' },
  'Bientôt clôturé':  { bg: '#FEF3C7', text: '#D97706' },
};

// ── Multi-segment donut ───────────────────────────────────────────────────────
const SIZE = 200, CX = 100, CY = 100, R_OUT = 82, R_IN = 54, GAP_DEG = 5;

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(startDeg: number, endDeg: number) {
  const o1 = polarXY(CX, CY, R_OUT, startDeg), o2 = polarXY(CX, CY, R_OUT, endDeg);
  const i1 = polarXY(CX, CY, R_IN, endDeg),   i2 = polarXY(CX, CY, R_IN, startDeg);
  const la = endDeg - startDeg > 180 ? 1 : 0;
  return `M${o1.x} ${o1.y} A${R_OUT} ${R_OUT} 0 ${la} 1 ${o2.x} ${o2.y} L${i1.x} ${i1.y} A${R_IN} ${R_IN} 0 ${la} 0 ${i2.x} ${i2.y}Z`;
}

// Build slices for active sectors proportionally
const slices = (() => {
  let cursor = 0;
  return ACTIVE_SECTORS.map(s => {
    const { total } = sStats(s.id as SectorId);
    const sweep = (total / TOTAL) * 360 - GAP_DEG;
    const start = cursor + GAP_DEG / 2;
    const end = cursor + sweep + GAP_DEG / 2;
    cursor += (total / TOTAL) * 360;
    return { id: s.id, color: s.color, path: arcPath(start, end), pct: Math.round((total / TOTAL) * 100) };
  });
})();

// ── Component ─────────────────────────────────────────────────────────────────
export function InvestissementsPortefeuilleScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SectorId | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);

  const activeSector = selected ? SECTORS.find(s => s.id === selected) : null;
  const visibleProjects = selected ? PROJECTS.filter(p => p.sectorId === selected) : PROJECTS;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #BF8C10 100%)`, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs mb-1 uppercase tracking-widest">Portefeuille</p>
            <h1 className="text-white text-2xl font-bold">Investissements RWA</h1>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs mb-0.5">Solde investi</p>
            <p className="text-white text-lg font-bold">{formatEur(TOTAL)}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* ── DONUT + SECTOR CHIPS ── */}
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: '#fff', border: '1.5px solid #EEF2F7',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
          }}
        >
          {/* Donut */}
          <div className="flex items-center gap-5">
            <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
              <svg width={SIZE} height={SIZE} style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.10))' }}>
                {slices.map(sl => (
                  <path
                    key={sl.id}
                    d={sl.path}
                    fill={sl.color}
                    style={{
                      transform: selected === sl.id ? 'scale(1.06)' : 'scale(1)',
                      transformOrigin: `${CX}px ${CY}px`,
                      transition: 'transform 0.2s ease, opacity 0.2s ease',
                      opacity: selected && selected !== sl.id ? 0.3 : 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelected(s => s === sl.id ? null : sl.id as SectorId)}
                  />
                ))}
                {/* hole */}
                <circle cx={CX} cy={CY} r={R_IN - 2} fill="#fff" />
              </svg>

              {/* Center label */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {activeSector ? (
                  <>
                    <span style={{ fontSize: 20, fontWeight: 800, color: activeSector.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {slices.find(s => s.id === selected)?.pct}%
                    </span>
                    <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, fontWeight: 500 }}>
                      {activeSector.label}
                    </span>
                    <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 700, marginTop: 2 }}>
                      {formatEur(sStats(selected!).total)}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      {formatEur(TOTAL)}
                    </span>
                    <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
                      {PROJECTS.length} projets
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Sector legend — vertical list */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {ACTIVE_SECTORS.map(s => {
                const { total, count } = sStats(s.id as SectorId);
                const Icon = s.icon;
                const pct = Math.round((total / TOTAL) * 100);
                const isSel = selected === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(sel => sel === s.id ? null : s.id as SectorId)}
                    className="flex items-center gap-2.5 text-left w-full"
                    style={{ opacity: selected && !isSel ? 0.4 : 1, transition: 'opacity 0.2s' }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isSel ? s.color : `${s.color}20` }}
                    >
                      <Icon style={{ width: 13, height: 13, color: isSel ? '#fff' : s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-[#0F172A] truncate">{s.label}</span>
                        <span className="text-xs font-bold ml-1 flex-shrink-0" style={{ color: s.color }}>{pct}%</span>
                      </div>
                      {/* Mini bar */}
                      <div className="h-1 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: s.color, opacity: 0.7, transition: 'width 0.6s ease' }}
                        />
                      </div>
                      <span className="text-xs text-[#94A3B8]">{formatEur(total)} · {count} projet{count > 1 ? 's' : ''}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* All 8 sectors mini row */}
          <div className="mt-5 pt-4 flex gap-2 flex-wrap" style={{ borderTop: '1px solid #F1F5F9' }}>
            {SECTORS.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: s.active ? `${s.color}14` : '#F1F5F9',
                    border: `1px solid ${s.active ? s.color + '30' : '#E2E8F0'}`,
                  }}
                >
                  <Icon style={{ width: 10, height: 10, color: s.active ? s.color : '#CBD5E1' }} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: s.active ? '#0F172A' : '#CBD5E1' }}>{s.label}</span>
                  {!s.active && <Lock style={{ width: 8, height: 8, color: '#CBD5E1' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COMPACT PROJECT LIST ── */}
        <div>
          <p className="text-[#0F172A] text-sm font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: activeSector?.color ?? GOLD }} />
            {activeSector ? `${activeSector.label}` : 'Tous les projets'}
            <span className="text-[#94A3B8] font-normal text-xs ml-0.5">({visibleProjects.length})</span>
          </p>

          <div className="space-y-2">
            {visibleProjects.map(p => {
              const sector = SECTORS.find(s => s.id === p.sectorId)!;
              const sc = STATUS_STYLE[p.status] ?? { bg: '#F1F5F9', text: '#64748B' };
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: '#fff', border: '1.5px solid #EEF2F7', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  {/* Sector dot */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sector.color }}
                  />

                  {/* Name + sub-sector */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0F172A] text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-[#94A3B8] text-xs">{p.subSector}</p>
                  </div>

                  {/* Amount + status */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[#0F172A] text-sm font-bold">{formatEur(p.amount)}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
