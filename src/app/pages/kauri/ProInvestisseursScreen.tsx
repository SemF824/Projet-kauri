import { ArrowLeft, Eye, EyeOff, Users, Search, ChevronDown, TrendingUp, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useProData } from '../../contexts/ProDataContext';

const TEAL  = '#006D77';
const GOLD  = '#D4AF37';
const TERRA = '#B05B3B';
const AMBER = '#92400E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}

// ── Data ──────────────────────────────────────────────────────────────────────
const INVESTISSEURS = [
  { id: 'i01', pseudo: 'Investisseur #001', initials: 'MC', color: '#8B5CF6', montant: 12_500, projet: 'Lolo Moderne',          date: '15 juin 2026',  badge: 'Top Investisseur', trust: 98 },
  { id: 'i02', pseudo: 'Investisseur #002', initials: 'JB', color: TEAL,      montant: 8_000,  projet: 'Coopérative Agricole',  date: '10 juin 2026',  badge: null,               trust: 91 },
  { id: 'i03', pseudo: 'Investisseur #003', initials: 'IM', color: GOLD,      montant: 7_200,  projet: 'Lolo Moderne',          date: '8 juin 2026',   badge: 'Fidèle',           trust: 97 },
  { id: 'i04', pseudo: 'Investisseur #004', initials: 'MJ', color: '#059669', montant: 5_500,  projet: 'Coopérative Agricole',  date: '3 juin 2026',   badge: null,               trust: 88 },
  { id: 'i05', pseudo: 'Investisseur #005', initials: 'AD', color: TERRA,     montant: 5_000,  projet: 'Lolo Moderne',          date: '1 juin 2026',   badge: null,               trust: 85 },
  { id: 'i06', pseudo: 'Investisseur #006', initials: 'SL', color: '#0EA5E9', montant: 4_800,  projet: 'Coopérative Agricole',  date: '28 mai 2026',   badge: 'Fidèle',           trust: 92 },
  { id: 'i07', pseudo: 'Investisseur #007', initials: 'RK', color: '#EC4899', montant: 3_500,  projet: 'Lolo Moderne',          date: '24 mai 2026',   badge: null,               trust: 79 },
  { id: 'i08', pseudo: 'Investisseur #008', initials: 'DN', color: '#F59E0B', montant: 3_000,  projet: 'Coopérative Agricole',  date: '20 mai 2026',   badge: null,               trust: 83 },
  { id: 'i09', pseudo: 'Investisseur #009', initials: 'KP', color: '#7C3AED', montant: 2_500,  projet: 'Lolo Moderne',          date: '15 mai 2026',   badge: null,               trust: 76 },
  { id: 'i10', pseudo: 'Investisseur #010', initials: 'NM', color: TEAL,      montant: 2_000,  projet: 'Coopérative Agricole',  date: '10 mai 2026',   badge: null,               trust: 81 },
];

// Noms réels pour le mode non-anonymisé
const NOMS_REELS: Record<string, string> = {
  'i01': 'Marie-Claire Dubois',
  'i02': 'Jean-Baptiste Laurent',
  'i03': 'Isabelle Moutoussamy',
  'i04': 'Marcus Johnson',
  'i05': 'Amina Diallo',
  'i06': 'Sophie Laurent',
  'i07': 'Rodrigue Kambou',
  'i08': 'David Nkosi',
  'i09': 'Kevin Pelletier',
  'i10': 'Nadia Mbeki',
};

// ── Main ──────────────────────────────────────────────────────────────────────
export function ProInvestisseursScreen() {
  const navigate = useNavigate();
  const { projets } = useProData();
  // Filtre dynamique depuis les projets du contexte
  const PROJETS_FILTRE = ['Tous', ...projets.map(p => p.nom)];
  const [anonymous, setAnonymous]     = useState(true);
  const [montantsVisible, setMontantsVisible] = useState(true);
  const [search, setSearch]           = useState('');
  const [projetFilter, setProjetFilter] = useState('Tous');
  const [sortBy, setSortBy]           = useState<'montant' | 'date' | 'trust'>('montant');

  const filtered = INVESTISSEURS
    .filter(inv => {
      const name = anonymous ? inv.pseudo : NOMS_REELS[inv.id];
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || inv.projet.toLowerCase().includes(search.toLowerCase());
      const matchProjet = projetFilter === 'Tous' || inv.projet === projetFilter;
      return matchSearch && matchProjet;
    })
    .sort((a, b) => {
      if (sortBy === 'montant') return b.montant - a.montant;
      if (sortBy === 'trust')   return b.trust - a.trust;
      return 0; // date order is already default
    });

  const total      = INVESTISSEURS.reduce((s, i) => s + i.montant, 0);
  const moyenne    = Math.round(total / INVESTISSEURS.length);
  const plusGros   = INVESTISSEURS[0].montant;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">

      {/* ── HEADER ── */}
      <div style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }} className="px-5 pt-14 pb-6 shadow-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Communauté · Pro</p>
            <h1 className="text-white text-2xl font-bold">Investisseurs</h1>
          </div>
          <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-white text-xs font-semibold">{INVESTISSEURS.length} membres</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* ── KPIs ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users,     label: 'Investisseurs', value: String(INVESTISSEURS.length), color: TEAL,     bg: `${TEAL}14` },
            { icon: TrendingUp, label: 'Ticket moyen', value: formatEur(moyenne),            color: AMBER,    bg: '#FEF3C7'   },
            { icon: Award,     label: 'Plus gros',     value: formatEur(plusGros),           color: '#7C3AED', bg: '#7C3AED14' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="rounded-2xl p-3 bg-white" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: bg }}>
                <Icon style={{ width: 15, height: 15, color }} />
              </div>
              <p className="text-[#0F172A] text-sm font-bold leading-tight">{value}</p>
              <p className="text-[#94A3B8] text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Toggles confidentialité ── */}
        <div className="rounded-2xl bg-white p-4" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield style={{ width: 14, height: 14, color: TEAL }} />
            <p className="text-[#0F172A] text-sm font-bold">Confidentialité</p>
          </div>
          <div className="space-y-3">
            {/* Anonymiser les noms */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#374151] text-sm font-medium">Anonymiser les noms</p>
                <p className="text-[#94A3B8] text-xs">Afficher "Investisseur #XXX" ou le vrai nom</p>
              </div>
              <button
                onClick={() => setAnonymous(v => !v)}
                className="flex-shrink-0"
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: anonymous ? TEAL : '#E5E7EB',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2,
                  left: anonymous ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
            {/* Masquer les montants */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#374151] text-sm font-medium">Afficher les montants</p>
                <p className="text-[#94A3B8] text-xs">Masquer pour les captures d'écran</p>
              </div>
              <button
                onClick={() => setMontantsVisible(v => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: '#F4F6F8', border: '1px solid #E5E7EB' }}
              >
                {montantsVisible
                  ? <Eye style={{ width: 15, height: 15, color: '#64748B' }} />
                  : <EyeOff style={{ width: 15, height: 15, color: '#64748B' }} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Filtres & tri ── */}
        <div className="space-y-3">
          {/* Recherche */}
          <div className="relative">
            <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94A3B8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un investisseur..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              style={{ border: '1.5px solid #E8EDF2' }}
            />
          </div>

          {/* Filtre projet */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PROJETS_FILTRE.map(p => (
              <button key={p} onClick={() => setProjetFilter(p)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: projetFilter === p ? TEAL : '#fff',
                  color: projetFilter === p ? '#fff' : '#64748B',
                  border: `1.5px solid ${projetFilter === p ? TEAL : '#E8EDF2'}`,
                }}>
                {p}
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex gap-2">
            {([
              { key: 'montant', label: 'Montant ↓' },
              { key: 'trust',   label: 'Trust Score' },
              { key: 'date',    label: 'Date' },
            ] as const).map(opt => (
              <button key={opt.key} onClick={() => setSortBy(opt.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0"
                style={{
                  background: sortBy === opt.key ? `${AMBER}15` : '#fff',
                  color: sortBy === opt.key ? AMBER : '#64748B',
                  border: `1.5px solid ${sortBy === opt.key ? AMBER : '#E8EDF2'}`,
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Séparateur ── */}
        <div className="h-px bg-[#E8EDF2]" />

        {/* ── Liste investisseurs ── */}
        <div>
          <p className="text-[#0F172A] text-sm font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: TEAL }} />
            {filtered.length} investisseur{filtered.length > 1 ? 's' : ''}
            {projetFilter !== 'Tous' ? ` · ${projetFilter}` : ''}
          </p>

          <div className="space-y-3">
            {filtered.map((inv, idx) => {
              const displayName = anonymous ? inv.pseudo : NOMS_REELS[inv.id];
              const isTop = idx === 0 && projetFilter === 'Tous' && sortBy === 'montant';
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white"
                  style={{
                    border: isTop ? `1.5px solid ${GOLD}50` : '1.5px solid #EEF2F7',
                    boxShadow: isTop ? `0 4px 16px ${GOLD}15` : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Rang */}
                  <span className="text-xs font-bold w-5 text-center flex-shrink-0" style={{ color: idx < 3 ? AMBER : '#CBD5E1' }}>
                    {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${idx + 1}`}
                  </span>

                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: inv.color }}>
                    {anonymous ? inv.initials.slice(0, 1) + '?' : inv.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[#0F172A] text-sm font-semibold truncate">{displayName}</p>
                      {inv.badge && (
                        <span className="flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: inv.badge === 'Top Investisseur' ? '#FEF3C7' : '#EFF6FF', color: inv.badge === 'Top Investisseur' ? '#92400E' : TEAL }}>
                          {inv.badge === 'Top Investisseur' ? '⭐ ' : '🔄 '}{inv.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8] text-xs truncate">{inv.projet}</span>
                      <span className="text-[#E2E8F0]">·</span>
                      <span className="text-[#94A3B8] text-xs flex-shrink-0 flex items-center gap-1">
                        <Shield style={{ width: 9, height: 9 }} />{inv.trust}
                      </span>
                    </div>
                  </div>

                  {/* Montant */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#0F172A] text-sm font-bold">
                      {montantsVisible ? formatEur(inv.montant) : '•••••'}
                    </p>
                    <p className="text-[#94A3B8] text-xs">{inv.date.split(' ')[2] ? inv.date.slice(-8) : inv.date}</p>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-[#64748B] text-sm">Aucun investisseur trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        <p className="text-[#94A3B8] text-xs">Données confidentielles · Visible uniquement par vous</p>
      </div>
    </div>
  );
}
