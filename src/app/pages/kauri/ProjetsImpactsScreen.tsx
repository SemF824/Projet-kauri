import {
  ArrowLeft, Heart, TrendingUp, Leaf, Droplets, Sun,
  Building2, ChevronRight, Search, SlidersHorizontal,
  CheckCircle2, Clock, Star
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { SERVER_URL, authHeaders } from '../../../utils/supabase';

const TEAL = '#0A847E';
const GOLD = '#D4AF37';

// ── Types ────────────────────────────────────────────────────────────────────
interface Participation {
  id: string;
  project: string;
  category: string;
  type: 'don' | 'investissement';
  amount: number;
  date: string;
  status: 'actif' | 'clôturé' | 'en_attente';
  icon: React.ElementType;
  iconColor: string;
  earned?: number;
}

interface Projet {
  id: string;
  name: string;
  category: string;
  description: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  tags: string[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const PARTICIPATIONS: Participation[] = [
  {
    id: 'p1', project: 'Kouroukan Énergie', category: 'Agriculture · Afrique',
    type: 'investissement', amount: 230, date: 'janv. 2026',
    status: 'actif', icon: Leaf, iconColor: TEAL, earned: 9.80,
  },
  {
    id: 'p2', project: 'Soleil Levant Solar', category: 'Énergie · Asie',
    type: 'investissement', amount: 162, date: 'mars 2026',
    status: 'actif', icon: Sun, iconColor: GOLD, earned: 3.20,
  },
  {
    id: 'p3', project: 'Racines Créoles', category: 'Solidarité · Martinique',
    type: 'don', amount: 50, date: 'fév. 2026',
    status: 'clôturé', icon: Droplets, iconColor: '#3B82F6',
  },
  {
    id: 'p4', project: 'Campus Numérique Global', category: 'Éducation · Europe',
    type: 'don', amount: 30, date: 'avr. 2026',
    status: 'en_attente', icon: Building2, iconColor: '#8B5CF6',
  },
];

const PROJETS: Projet[] = [
  {
    id: 'q1', name: 'Kouroukan\nÉnergie Verte', category: 'Agriculture · Afrique de l\'Ouest',
    description: 'Coopérative solaire et irrigation durable portée par des agriculteurs locaux organisés en réseau.',
    raised: 18750, goal: 25000, backers: 142, daysLeft: 18,
    icon: Leaf, iconColor: TEAL, iconBg: `${TEAL}18`,
    tags: ['8% rdt', 'RWA', 'Don accepté'],
  },
  {
    id: 'q2', name: 'Soleil Levant\nSolar Farm', category: 'Énergie · Asie du Sud-Est',
    description: 'Ferme photovoltaïque communautaire alimentant 3 villages ruraux en électricité propre.',
    raised: 9200, goal: 20000, backers: 87, daysLeft: 31,
    icon: Sun, iconColor: GOLD, iconBg: `${GOLD}18`,
    tags: ['10% rdt', 'RWA', 'Don accepté'],
  },
  {
    id: 'q3', name: 'Racines Créoles\nSanté+', category: 'Santé · Martinique',
    description: 'Unité médicale mobile et prévention communautaire dans les zones rurales de Martinique.',
    raised: 4100, goal: 15000, backers: 63, daysLeft: 44,
    icon: Droplets, iconColor: '#3B82F6', iconBg: '#3B82F614',
    tags: ['Don solidaire', '+Trust Score'],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  actif:       { label: 'Actif',       bg: '#D1FAE5', text: '#16A34A' },
  clôturé:     { label: 'Clôturé',    bg: '#F1F5F9', text: '#64748B' },
  en_attente:  { label: 'En attente', bg: '#FEF3C7', text: '#D97706' },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function ParticipationCard({ p, isDark }: { p: Participation; isDark: boolean }) {
  const st = STATUS_STYLE[p.status];
  const Icon = p.icon;
  const isDon = p.type === 'don';

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: isDark ? '#1E293B' : '#fff',
        border: `1.5px solid ${isDark ? '#334155' : '#EEF2F7'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.iconColor}18` }}>
          <Icon style={{ width: 18, height: 18, color: p.iconColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.project}</p>
              <p className="text-xs text-[#94A3B8]">{p.category} · {p.date}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.text }}>
              {st.label}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#F1F5F9'}` }}>
            {/* Type badge */}
            <div className="flex items-center gap-1.5">
              {isDon
                ? <Heart style={{ width: 12, height: 12, color: '#EC4899' }} />
                : <TrendingUp style={{ width: 12, height: 12, color: GOLD }} />
              }
              <span className="text-xs font-medium" style={{ color: isDon ? '#EC4899' : GOLD }}>
                {isDon ? 'Don solidaire' : 'Investissement'}
              </span>
            </div>

            {/* Amount + earnings */}
            <div className="text-right">
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{formatEur(p.amount)}</p>
              {p.earned && (
                <p className="text-xs font-semibold" style={{ color: '#16A34A' }}>+{formatEur(p.earned)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjetCard({ p, isDark, onPress }: { p: Projet; isDark: boolean; onPress: () => void }) {
  const pct = Math.round((p.raised / p.goal) * 100);
  const Icon = p.icon;

  return (
    <button
      onClick={onPress}
      className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.99]"
      style={{
        backgroundColor: isDark ? '#1E293B' : '#fff',
        border: `1.5px solid ${isDark ? '#334155' : '#EEF2F7'}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.iconBg }}>
            <Icon style={{ width: 20, height: 20, color: p.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold whitespace-pre-line leading-snug ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{p.name}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{p.category}</p>
          </div>
          <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1', flexShrink: 0, marginTop: 2 }} />
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed mb-3">{p.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.tags.map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.iconColor}14`, color: p.iconColor }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#94A3B8]">{p.backers} contributeurs</span>
            <span className="text-xs font-bold" style={{ color: p.iconColor }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#334155' : '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.iconColor, opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: `1px solid ${isDark ? '#334155' : '#F1F5F9'}`, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FAFBFC' }}
      >
        <div>
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{(p.raised / 1000).toFixed(1)}k €</span>
          <span className="text-xs text-[#94A3B8]"> / {(p.goal / 1000).toFixed(0)}k € objectif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock style={{ width: 12, height: 12, color: '#94A3B8' }} />
          <span className="text-xs text-[#94A3B8]">{p.daysLeft} jours</span>
        </div>
      </div>
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export function ProjetsImpactsScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [tab, setTab] = useState<'participations' | 'decouvrir'>('participations');
  const [search, setSearch] = useState('');
  const [serverProjects, setServerProjects] = useState<Projet[]>([]);
  const [userInvestments, setUserInvestments] = useState<Participation[]>([]);

  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';

  useEffect(() => {
    // Fetch available projects
    authHeaders().then(headers => {
      fetch(`${SERVER_URL}/projects`, { headers })
        .then(r => r.ok ? r.json() : [])
        .then((data: any[]) => {
          const mapped: Projet[] = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description || '',
            raised: p.raisedAmount || 0,
            goal: p.targetAmount || 1,
            backers: p.investors?.length || 0,
            daysLeft: 30,
            icon: p.category?.toLowerCase().includes('éducation') ? Building2 : p.category?.toLowerCase().includes('agriculture') ? Leaf : Sun,
            iconColor: p.category?.toLowerCase().includes('éducation') ? '#8B5CF6' : TEAL,
            iconBg: p.category?.toLowerCase().includes('éducation') ? '#8B5CF614' : `${TEAL}18`,
            tags: ['Impact+'],
          }));
          setServerProjects(mapped);
        })
        .catch(e => console.error('Projects fetch error:', e));

      fetch(`${SERVER_URL}/user/investments`, { headers })
        .then(r => r.ok ? r.json() : [])
        .then((data: any[]) => {
          const mapped: Participation[] = data.map(inv => ({
            id: inv.id,
            project: inv.projectName || 'Projet',
            category: 'Investissement',
            type: 'investissement' as const,
            amount: inv.amount,
            date: new Date(inv.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
            status: 'actif' as const,
            icon: TrendingUp,
            iconColor: GOLD,
          }));
          setUserInvestments(mapped);
        })
        .catch(e => console.error('Investments fetch error:', e));
    });
  }, []);

  const displayParticipations = userInvestments.length > 0 ? userInvestments : PARTICIPATIONS;
  const displayProjects = serverProjects.length > 0 ? serverProjects : PROJETS;

  const totalInvesti = displayParticipations.filter(p => p.type === 'investissement').reduce((s, p) => s + p.amount, 0);
  const totalDons    = displayParticipations.filter(p => p.type === 'don').reduce((s, p) => s + p.amount, 0);
  const totalGains   = displayParticipations.filter(p => p.earned).reduce((s, p) => s + (p.earned ?? 0), 0);

  const filtered = displayProjects.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: bg }}>

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Financement</p>
            <h1 className="text-white text-2xl font-bold">Projets d'impacts</h1>
          </div>
          <Leaf className="w-8 h-8 text-white/30" />
        </div>

        {/* Summary chips — only on participations tab */}
        {tab === 'participations' && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {[
              { label: 'Investi',  value: formatEur(totalInvesti), color: GOLD },
              { label: 'Dons',     value: formatEur(totalDons),    color: '#3B82F6' },
              { label: 'Gains',    value: '+' + formatEur(totalGains), color: '#4ADE80' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex-shrink-0 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-xs text-white/55">{label}</p>
                <p className="text-sm font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="px-5 pt-5">
        <div className="flex rounded-2xl p-1 mb-5" style={{ backgroundColor: isDarkMode ? '#1E293B' : '#E8EDF2' }}>
          {([
            ['participations', 'Mes participations', CheckCircle2],
            ['decouvrir',      'Découvrir',          Star],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: tab === key ? '#fff' : 'transparent',
                color: tab === key ? TEAL : '#64748B',
                boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── MES PARTICIPATIONS ── */}
        {tab === 'participations' && (
          <div className="space-y-3">
            {displayParticipations.length === 0 ? (
              <div className="text-center py-12">
                <Heart style={{ width: 36, height: 36, color: '#CBD5E1', margin: '0 auto 12px' }} />
                <p className="text-[#94A3B8] text-sm">Vous n'avez encore financé aucun projet.</p>
                <button onClick={() => setTab('decouvrir')} className="mt-4 text-sm font-semibold" style={{ color: TEAL }}>
                  Découvrir des projets →
                </button>
              </div>
            ) : (
              displayParticipations.map(p => <ParticipationCard key={p.id} p={p} isDark={isDarkMode} />)
            )}
          </div>
        )}

        {/* ── DÉCOUVRIR ── */}
        {tab === 'decouvrir' && (
          <div className="space-y-4">
            {/* Search */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', border: `1.5px solid ${isDarkMode ? '#334155' : '#E8EDF2'}` }}
            >
              <Search style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un projet..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: isDarkMode ? '#fff' : '#0F172A' }}
              />
              <SlidersHorizontal style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} />
            </div>

            {/* Project count */}
            <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>
              {filtered.length} projet{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            </p>

            {/* Project cards */}
            {filtered.map(p => (
              <ProjetCard
                key={p.id}
                p={p}
                isDark={isDarkMode}
                onPress={() => navigate('/kauri/projet-detail')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
