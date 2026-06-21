import {
  ArrowLeft, TrendingUp, TrendingDown, Wallet, ChevronRight,
  Calendar, Leaf, Sun, Building2, Sprout, BarChart2,
  QrCode, Star, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const GOLD = '#D4A373';
const TEAL = '#0A847E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Portfolio data ───────────────────────────────────────────────────────────
const PORTFOLIO = [
  {
    id: 'i1', name: 'Kouroukan Énergie Verte', category: 'Agriculture',
    icon: Leaf, color: TEAL,
    investi: 2500, valeur: 2800, gain: 300, roiPct: 12,
    date: '15 mars 2026', positif: true,
  },
  {
    id: 'i2', name: 'Coopérative Agricole Mali', category: 'Agriculture',
    icon: Sprout, color: '#10B981',
    investi: 1500, valeur: 1650, gain: 150, roiPct: 10,
    date: '1 avr. 2026', positif: true,
  },
  {
    id: 'i3', name: 'Soleil Levant Solar Farm', category: 'Énergie',
    icon: Sun, color: GOLD,
    investi: 1800, valeur: 1764, gain: -36, roiPct: -2,
    date: '20 avr. 2026', positif: false,
  },
  {
    id: 'i4', name: 'Racines Créoles Santé+', category: 'Santé',
    icon: Building2, color: '#8B5CF6',
    investi: 1200, valeur: 1176, gain: -24, roiPct: -2,
    date: '5 mai 2026', positif: false,
  },
];

const TOTAL_INVESTI = PORTFOLIO.reduce((s, p) => s + p.investi, 0);
const TOTAL_VALEUR  = PORTFOLIO.reduce((s, p) => s + p.valeur, 0);
const ROI_GLOBAL    = ((TOTAL_VALEUR - TOTAL_INVESTI) / TOTAL_INVESTI * 100).toFixed(1);

// ── Marketplace data ─────────────────────────────────────────────────────────
const PROJETS = [
  {
    id: 'm1', name: 'Modernisation Exploitation Bananière', region: 'Martinique',
    category: 'Agriculture Durable', icon: Leaf, color: '#10B981', bgColor: '#10B98115',
    roiBrut: 9, roiNet: 8, raised: 37500, goal: 50000, minInvest: 10,
    tags: ['RWA', 'Tokens'], daysLeft: 14,
  },
  {
    id: 'm2', name: 'Kouroukan Énergie Verte', region: 'Afrique de l\'Ouest',
    category: 'Énergie Solaire', icon: Sun, color: GOLD, bgColor: `${GOLD}18`,
    roiBrut: 11, roiNet: 9, raised: 18750, goal: 25000, minInvest: 50,
    tags: ['RWA', 'Tokens'], daysLeft: 18,
  },
  {
    id: 'm3', name: 'Soleil Levant Solar Farm', region: 'Asie du Sud-Est',
    category: 'Énergie Renouvelable', icon: BarChart2, color: '#6366F1', bgColor: '#6366F115',
    roiBrut: 13, roiNet: 11, raised: 9200, goal: 20000, minInvest: 25,
    tags: ['RWA', 'Tokens'], daysLeft: 31,
  },
];

const SOLDE_DISPO = 140;

// ── Sub-components ────────────────────────────────────────────────────────────
function PortfolioCard({ p, isDark }: { p: typeof PORTFOLIO[0]; isDark: boolean }) {
  const navigate = useNavigate();
  const Icon = p.icon;
  return (
    <button
      onClick={() => navigate('/kauri/projet-detail')}
      className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
      style={{
        backgroundColor: isDark ? '#1E293B' : '#fff',
        border: `1.5px solid ${isDark ? '#334155' : '#EEF2F7'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.color}18` }}>
            <Icon style={{ width: 17, height: 17, color: p.color }} />
          </div>
          <div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.name}</p>
            <p className="text-xs text-[#94A3B8]">{p.category}</p>
          </div>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: p.positif ? '#D1FAE5' : '#FEE2E2', color: p.positif ? '#16A34A' : '#DC2626' }}
        >
          {p.positif ? '+' : ''}{p.roiPct}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Investi',  value: formatEur(p.investi) },
          { label: 'Valeur',   value: formatEur(p.valeur)  },
          { label: 'Gain',     value: (p.gain >= 0 ? '+' : '') + formatEur(p.gain), color: p.positif ? '#16A34A' : '#DC2626' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p className="text-xs text-[#94A3B8] mb-0.5">{label}</p>
            <p className="text-xs font-bold" style={{ color: color ?? (isDark ? '#fff' : '#0F172A') }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#F1F5F9'}` }}>
        <div className="flex items-center gap-1.5">
          <Calendar style={{ width: 11, height: 11, color: '#94A3B8' }} />
          <span className="text-xs text-[#94A3B8]">{p.date}</span>
        </div>
        <ChevronRight style={{ width: 14, height: 14, color: '#CBD5E1' }} />
      </div>
    </button>
  );
}

function MarketCard({ p, isDark }: { p: typeof PROJETS[0]; isDark: boolean }) {
  const navigate = useNavigate();
  const Icon = p.icon;
  const pct = Math.round((p.raised / p.goal) * 100);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? '#1E293B' : '#fff',
        border: `1.5px solid ${isDark ? '#334155' : '#EEF2F7'}`,
        boxShadow: '0 3px 14px rgba(0,0,0,0.07)',
      }}
    >
      {/* Colored top strip */}
      <div className="px-4 pt-4 pb-3" style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)` }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: p.color }}>{p.category}</p>
            <p className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.name}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{p.region}</p>
          </div>
          <div
            className="flex-shrink-0 px-2.5 py-1.5 rounded-xl text-right"
            style={{ backgroundColor: p.color, minWidth: 64 }}
          >
            <p className="text-white text-xs font-bold">{p.roiBrut}% Brut</p>
            <p className="text-white/75 text-xs">{p.roiNet}% Net</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#94A3B8]">Progression</span>
            <span className="text-xs font-bold" style={{ color: p.color }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#334155' : '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            {(p.raised / 1000).toFixed(1)}k € / {(p.goal / 1000).toFixed(0)}k €
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/kauri/projet-detail')}
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-2"
          style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}CC)`, color: '#fff', boxShadow: `0 3px 12px ${p.color}44` }}
        >
          <TrendingUp style={{ width: 15, height: 15 }} />
          Acheter des Tokens (Dès {p.minInvest}€)
        </button>
        <p className="text-center text-xs text-[#94A3B8]">
          <Clock style={{ width: 10, height: 10, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          Investissement minimum : {p.minInvest} € · {p.daysLeft} jours restants
        </p>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function InvestissementScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [tab, setTab] = useState<'investir' | 'portfolio'>('investir');

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const roiPositif = Number(ROI_GLOBAL) >= 0;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: bg }}>

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8860B 100%)`, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {tab === 'investir' ? (
          <>
            <h1 className="text-white text-2xl font-bold mb-1">Investir au Pays</h1>
            <p className="text-white/70 text-sm mb-5">Fractionnez vos investissements dans l'économie réelle à partir de 10 €</p>

            {/* Solde card */}
            <div
              className="rounded-2xl px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div>
                <p className="text-white/60 text-xs mb-1">Solde disponible</p>
                <p className="text-white text-2xl font-bold">{formatEur(SOLDE_DISPO)}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Star style={{ width: 11, height: 11, color: '#4ADE80', fill: '#4ADE80' }} />
                  <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>+40 € bonus d'assiduité</span>
                </div>
              </div>
              <QrCode style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.35)' }} />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-white text-2xl font-bold mb-1">Mes Investissements</h1>
            <p className="text-white/70 text-sm mb-5">Portfolio & rendements</p>

            {/* Overview card */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <p className="text-white/70 text-xs font-semibold mb-3">Vue d'ensemble</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Investi total</p>
                  <p className="text-white text-xl font-bold">{formatEur(TOTAL_INVESTI)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Valeur actuelle</p>
                  <p className="text-white text-xl font-bold">{formatEur(TOTAL_VALEUR)}</p>
                </div>
              </div>
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: roiPositif ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)' }}
              >
                <span className="text-white/80 text-sm font-medium">ROI Global</span>
                <div className="flex items-center gap-2">
                  {roiPositif
                    ? <TrendingUp style={{ width: 15, height: 15, color: '#4ADE80' }} />
                    : <TrendingDown style={{ width: 15, height: 15, color: '#F87171' }} />
                  }
                  <span className="text-sm font-bold" style={{ color: roiPositif ? '#4ADE80' : '#F87171' }}>
                    {roiPositif ? '+' : ''}{ROI_GLOBAL}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="px-5 pt-5">
        <div className="flex rounded-2xl p-1 mb-5" style={{ backgroundColor: isDarkMode ? '#1E293B' : '#E8EDF2' }}>
          {([
            ['investir',  'Investir',        TrendingUp],
            ['portfolio', 'Mon Portfolio',   Wallet],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: tab === key ? '#fff' : 'transparent',
                color: tab === key ? GOLD : '#64748B',
                boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── INVESTIR TAB ── */}
        {tab === 'investir' && (
          <div className="space-y-4">
            <p className="text-[#0F172A] text-sm font-bold flex items-center gap-2">
              <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
              Projets en Financement
            </p>
            {PROJETS.map(p => <MarketCard key={p.id} p={p} isDark={isDarkMode} />)}
          </div>
        )}

        {/* ── PORTFOLIO TAB ── */}
        {tab === 'portfolio' && (
          <div className="space-y-3">
            <p className="text-[#0F172A] text-sm font-bold flex items-center gap-2">
              <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
              Projets investis
            </p>
            {PORTFOLIO.map(p => <PortfolioCard key={p.id} p={p} isDark={isDarkMode} />)}
          </div>
        )}
      </div>
    </div>
  );
}
