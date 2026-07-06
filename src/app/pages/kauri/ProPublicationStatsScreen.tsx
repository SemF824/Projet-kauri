import { ArrowLeft, Eye, Heart, TrendingUp, Gift, Info, Users, MousePointerClick, ChevronRight, ArrowUpRight, ArrowDownRight, MoreVertical, Pencil, Trash2, X, CheckCircle2, AlertTriangle, Hash, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useProPublications, CTA_LABEL, type ProPublication } from '../../contexts/ProPublicationsContext';

// ── Données mock des publications (gardées pour les types uniquement) ─────────
const PUBLICATIONS_LEGACY = [
  {
    id: '1',
    title: 'Ouverture de notre Lolo Moderne à Fort-de-France',
    type: 'video',
    category: 'Restauration',
    project: 'Lolo Moderne',
    ctaType: 'investir' as const,
    publishedAt: '2 juillet 2026',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    stats: {
      vues: 1247,
      vuesEvol: +18,
      likes: 342,
      likesEvol: +24,
      comments: 28,
      partages: 14,
      ctaClics: 89,
      ctaEvol: +31,
      conversions: {
        total: 12,
        investissements: { count: 8, montant: 14500 },
        dons: { count: 4, montant: 1200 },
      },
      taux_conversion: 13.5,
      portee: 3820,
      nouveaux_abonnes: 23,
    },
    timeline: [
      { jour: 'J1', vues: 380, clics: 22 },
      { jour: 'J2', vues: 290, clics: 18 },
      { jour: 'J3', vues: 210, clics: 14 },
      { jour: 'J4', vues: 180, clics: 12 },
      { jour: 'J5', vues: 110, clics: 10 },
      { jour: 'J6', vues: 77,  clics: 8  },
    ],
    top_contributeurs: [
      { initials: 'SB', name: 'Sophie B.', type: 'investissement', montant: 5000, palier: 'Palier 2' },
      { initials: 'JM', name: 'Jean-Luc M.', type: 'don', montant: 500, palier: 'Palier 1' },
      { initials: 'AC', name: 'André C.', type: 'investissement', montant: 3000, palier: 'Palier 2' },
    ],
  },
  {
    id: '2',
    title: 'Première récolte de notre coopérative manioc',
    type: 'image',
    category: 'Agriculture',
    project: 'Coopérative Agricole',
    ctaType: 'don' as const,
    publishedAt: '30 juin 2026',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
    stats: {
      vues: 634,
      vuesEvol: -4,
      likes: 215,
      likesEvol: +8,
      comments: 19,
      partages: 8,
      ctaClics: 41,
      ctaEvol: +5,
      conversions: {
        total: 6,
        investissements: { count: 0, montant: 0 },
        dons: { count: 6, montant: 1800 },
      },
      taux_conversion: 9.7,
      portee: 1540,
      nouveaux_abonnes: 9,
    },
    timeline: [
      { jour: 'J1', vues: 220, clics: 14 },
      { jour: 'J2', vues: 180, clics: 11 },
      { jour: 'J3', vues: 110, clics: 7  },
      { jour: 'J4', vues: 80,  clics: 5  },
      { jour: 'J5', vues: 44,  clics: 4  },
    ],
    top_contributeurs: [
      { initials: 'LM', name: 'Lucia M.', type: 'don', montant: 200, palier: 'Palier 1' },
      { initials: 'KD', name: 'Kofi D.', type: 'don', montant: 500, palier: 'Palier 2' },
    ],
  },
  {
    id: '3',
    title: 'Notre incubateur tech forme 200 jeunes dev par an',
    type: 'video',
    category: 'Tech',
    project: 'TechAfrika Hub',
    ctaType: 'investir' as const,
    publishedAt: '28 juin 2026',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    stats: {
      vues: 3210,
      vuesEvol: +52,
      likes: 891,
      likesEvol: +67,
      comments: 63,
      partages: 42,
      ctaClics: 204,
      ctaEvol: +78,
      conversions: {
        total: 31,
        investissements: { count: 27, montant: 78000 },
        dons: { count: 4, montant: 2400 },
      },
      taux_conversion: 15.2,
      portee: 9400,
      nouveaux_abonnes: 87,
    },
    timeline: [
      { jour: 'J1', vues: 980, clics: 66 },
      { jour: 'J2', vues: 740, clics: 50 },
      { jour: 'J3', vues: 620, clics: 41 },
      { jour: 'J4', vues: 490, clics: 28 },
      { jour: 'J5', vues: 380, clics: 19 },
    ],
    top_contributeurs: [
      { initials: 'FA', name: 'Fatou A.', type: 'investissement', montant: 10000, palier: 'Palier 3' },
      { initials: 'MN', name: 'Marc N.', type: 'investissement', montant: 5000, palier: 'Palier 2' },
      { initials: 'CE', name: 'Cédric E.', type: 'investissement', montant: 3000, palier: 'Palier 2' },
    ],
  },
];

// CTA_LABEL importé depuis ProPublicationsContext

// ── Mini sparkline SVG ───────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80, H = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  );
}

// ── Barre de progression horizontale ────────────────────────────────────────
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const CATEGORIES = ['Finance', 'Agriculture', 'Immobilier', 'Restauration', 'Tech', 'Artisanat', 'Commerce', 'Social'];
const CTA_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'investir',  label: 'Investir maintenant', color: '#006D77' },
  { value: 'don',       label: 'Faire un don',         color: '#B05B3B' },
  { value: 'decouvrir', label: 'En savoir plus',       color: '#D4AF37' },
];

type EditDraft = { title: string; caption: string; category: string; hashtags: string; ctaType: string };

export function ProPublicationStatsScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [menuId,     setMenuId]       = useState<string | null>(null);
  const [deleteId,   setDeleteId]     = useState<string | null>(null);
  const [editId,     setEditId]       = useState<string | null>(null);
  const [editDraft,  setEditDraft]    = useState<EditDraft | null>(null);
  const [editSaved,  setEditSaved]    = useState(false);
  const { publications, updatePublication, deletePublication } = useProPublications();

  const bg   = isDarkMode ? 'bg-[#0F172A]'  : 'bg-[#F8FAFC]';
  const card = isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]';
  const txt  = isDarkMode ? 'text-white'     : 'text-[#0F172A]';
  const sub  = isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]';

  const openEdit = (pub: ProPublication) => {
    setEditDraft({ title: pub.title, caption: '', category: pub.category, hashtags: '', ctaType: pub.ctaType });
    setEditId(pub.id);
    setMenuId(null);
  };

  const saveEdit = () => {
    if (!editDraft || !editId) return;
    const pub = publications.find(p => p.id === editId);
    if (pub) updatePublication({ ...pub, title: editDraft.title, category: editDraft.category, ctaType: editDraft.ctaType as any });
    setEditId(null);
    setEditDraft(null);
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2500);
  };

  const confirmDelete = () => {
    deletePublication(deleteId!);
    setDeleteId(null);
    setSelectedId(null);
  };

  const selected = publications.find(p => p.id === selectedId);

  // ── VUE DÉTAIL ──────────────────────────────────────────────────────────────
  if (selected) {
    const s = selected.stats;
    const cta = CTA_LABEL[selected.ctaType];
    const CtaIcon = cta.icon;
    const maxVues = Math.max(...selected.timeline.map(t => t.vues));

    return (
      <div className={`min-h-screen pb-24 ${bg}`}>
        {/* Header */}
        <div className={`px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A]' : 'bg-gradient-to-br from-[#0F172A] to-[#1E293B]'}`}>
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setSelectedId(null)} className="text-white/70 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Mes publications</span>
            </button>
            {/* Menu ⋯ */}
            <div className="relative">
              <button
                onClick={() => setMenuId(menuId === selected.id ? null : selected.id)}
                className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center"
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              {menuId === selected.id && (
                <div className={`absolute right-0 top-11 z-40 w-44 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
                  <button
                    onClick={() => openEdit(selected)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-black/5 transition-colors ${txt}`}
                  >
                    <Pencil className="w-4 h-4 text-[#D4AF37]" />
                    Modifier
                  </button>
                  <div className={`h-px mx-4 ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`} />
                  <button
                    onClick={() => { setDeleteId(selected.id); setMenuId(null); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={selected.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-snug line-clamp-2 mb-1">{selected.title}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 bg-white/15 text-white rounded-full">{selected.category}</span>
                <span className="text-[10px] text-white/50">{selected.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <CtaIcon className="w-3 h-3" style={{ color: cta.color }} />
                <span className="text-[10px] font-semibold" style={{ color: cta.color }}>{cta.label}</span>
                <span className="text-[10px] text-white/40">· {selected.project}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-4">

          {/* KPIs principaux */}
          <div className={`rounded-2xl border ${card} shadow-md overflow-hidden`}>
            <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: isDarkMode ? '#334155' : '#F1F5F9' }}>
              {[
                { icon: Eye,              label: 'Vues',      value: s.vues.toLocaleString(),    evol: s.vuesEvol,  color: '#006D77' },
                { icon: MousePointerClick,label: 'Clics CTA', value: s.ctaClics.toLocaleString(), evol: s.ctaEvol,   color: '#D4AF37' },
                { icon: Heart,            label: 'Likes',     value: s.likes.toLocaleString(),    evol: s.likesEvol, color: '#B05B3B' },
                { icon: Users,            label: 'Portée',    value: s.portee.toLocaleString(),   evol: null,        color: '#0D9488' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className={`p-4 ${isDarkMode ? '' : ''}`} style={{ borderColor: isDarkMode ? '#334155' : '#F1F5F9' }}>
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                      {kpi.evol !== null && (
                        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${kpi.evol >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                          {kpi.evol >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(kpi.evol)}%
                        </span>
                      )}
                    </div>
                    <p className={`text-xl font-bold ${txt}`}>{kpi.value}</p>
                    <p className={`text-xs ${sub}`}>{kpi.label}</p>
                  </div>
                );
              })}
            </div>
            {/* Taux conversion + abonnés */}
            <div className={`grid grid-cols-2 border-t px-4 py-3 gap-4 ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
              <div>
                <p className={`text-xs ${sub} mb-0.5`}>Taux de conversion</p>
                <p className={`text-lg font-bold ${txt}`}>{s.taux_conversion}%</p>
              </div>
              <div>
                <p className={`text-xs ${sub} mb-0.5`}>Nouveaux abonnés</p>
                <p className={`text-lg font-bold ${txt}`}>+{s.nouveaux_abonnes}</p>
              </div>
            </div>
          </div>

          {/* Conversions Don vs Investissement */}
          <div className={`rounded-2xl border ${card} shadow-md p-5`}>
            <p className={`font-semibold text-sm mb-4 ${txt}`}>Conversions — {s.conversions.total} au total</p>

            {/* Investissements */}
            {s.conversions.investissements.count > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#006D77]/15 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-[#006D77]" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${txt}`}>Investissements</p>
                      <p className={`text-xs ${sub}`}>{s.conversions.investissements.count} contributeur{s.conversions.investissements.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#006D77]">{s.conversions.investissements.montant.toLocaleString()} €</p>
                    <p className={`text-[10px] ${sub}`}>collectés</p>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDarkMode ? '#334155' : '#F1F5F9' }}>
                  <div className="h-full bg-[#006D77] rounded-full" style={{ width: `${Math.round(s.conversions.investissements.count / s.conversions.total * 100)}%` }} />
                </div>
                <p className={`text-[10px] ${sub} mt-1`}>{Math.round(s.conversions.investissements.count / s.conversions.total * 100)}% des conversions</p>
              </div>
            )}

            {/* Dons */}
            {s.conversions.dons.count > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#B05B3B]/15 rounded-lg flex items-center justify-center">
                      <Gift className="w-3.5 h-3.5 text-[#B05B3B]" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${txt}`}>Dons</p>
                      <p className={`text-xs ${sub}`}>{s.conversions.dons.count} donateur{s.conversions.dons.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#B05B3B]">{s.conversions.dons.montant.toLocaleString()} €</p>
                    <p className={`text-[10px] ${sub}`}>collectés</p>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDarkMode ? '#334155' : '#F1F5F9' }}>
                  <div className="h-full bg-[#B05B3B] rounded-full" style={{ width: `${Math.round(s.conversions.dons.count / s.conversions.total * 100)}%` }} />
                </div>
                <p className={`text-[10px] ${sub} mt-1`}>{Math.round(s.conversions.dons.count / s.conversions.total * 100)}% des conversions</p>
              </div>
            )}

            {s.conversions.total === 0 && (
              <p className={`text-sm text-center py-4 ${sub}`}>Aucune conversion pour l'instant</p>
            )}
          </div>

          {/* Timeline vues / clics */}
          <div className={`rounded-2xl border ${card} shadow-md p-5`}>
            <p className={`font-semibold text-sm mb-4 ${txt}`}>Évolution jour par jour</p>
            <div className="space-y-2">
              {selected.timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-xs w-6 ${sub}`}>{t.jour}</span>
                  <div className="flex-1">
                    <Bar value={t.vues} max={maxVues} color="#006D77" />
                  </div>
                  <span className={`text-xs w-14 text-right font-medium ${txt}`}>{t.vues} vues</span>
                  <span className={`text-xs w-14 text-right ${s.ctaClics > 0 ? 'text-[#D4AF37]' : sub}`}>{t.clics} clics</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: isDarkMode ? '#334155' : '#F1F5F9' }}>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#006D77]" /><span className={`text-[10px] ${sub}`}>Vues</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" /><span className={`text-[10px] ${sub}`}>Clics CTA</span></div>
            </div>
          </div>

          {/* Top contributeurs */}
          {selected.top_contributeurs.length > 0 && (
            <div className={`rounded-2xl border ${card} shadow-md p-5`}>
              <p className={`font-semibold text-sm mb-4 ${txt}`}>Top contributeurs</p>
              <div className="space-y-3">
                {selected.top_contributeurs.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${txt}`}>{c.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.type === 'investissement' ? 'bg-[#006D77]/10 text-[#006D77]' : 'bg-[#B05B3B]/10 text-[#B05B3B]'}`}>
                        {c.palier} · {c.type === 'investissement' ? 'Investissement' : 'Don'}
                      </span>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${c.type === 'investissement' ? 'text-[#006D77]' : 'text-[#B05B3B]'}`}>
                      {c.montant.toLocaleString()} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => openEdit(selected)}
              className={`py-3.5 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-1.5 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#0F172A]'}`}
            >
              <Pencil className="w-4 h-4" /> Modifier
            </button>
            <button
              onClick={() => setDeleteId(selected.id)}
              className="py-3.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Retirer
            </button>
            <button
              onClick={() => navigate('/kauri/pro-investisseurs')}
              className="py-3.5 rounded-xl bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white text-sm font-semibold shadow-lg"
            >
              Investisseurs
            </button>
          </div>
        </div>

        {/* ── Sheet Édition ── */}
        {editId === selected.id && editDraft && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditId(null)} />
            <div className={`relative rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-[#E2E8F0] rounded-full" /></div>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
                <div>
                  <h2 className={`font-bold text-lg ${txt}`}>Modifier la publication</h2>
                  <p className={`text-xs ${sub}`}>Les changements sont visibles immédiatement</p>
                </div>
                <button onClick={() => setEditId(null)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
                  <X className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5">
                {/* Titre */}
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Titre / Description</label>
                  <textarea
                    value={editDraft.title}
                    onChange={e => setEditDraft({ ...editDraft, title: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'border-[#E2E8F0] text-[#0F172A]'}`}
                  />
                </div>
                {/* Catégorie */}
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Catégorie</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setEditDraft({ ...editDraft, category: cat })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${editDraft.category === cat ? 'bg-[#0F172A] text-white' : isDarkMode ? 'bg-white/10 text-white/60' : 'bg-[#F1F5F9] text-[#64748B]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {/* CTA */}
                <div>
                  <label className={`text-sm font-semibold mb-2 block ${txt}`}>Bouton d'action</label>
                  <div className="space-y-2">
                    {CTA_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setEditDraft({ ...editDraft, ctaType: opt.value })}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${editDraft.ctaType === opt.value ? 'border-current' : isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}
                        style={{ color: editDraft.ctaType === opt.value ? opt.color : undefined }}
                      >
                        {opt.label}
                        {editDraft.ctaType === opt.value && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Hashtags */}
                <div>
                  <label className={`text-sm font-semibold mb-2 flex items-center gap-1 ${txt}`}><Hash className="w-3.5 h-3.5" /> Hashtags</label>
                  <input
                    type="text"
                    value={editDraft.hashtags}
                    onChange={e => setEditDraft({ ...editDraft, hashtags: e.target.value })}
                    placeholder="#diaspora #kauri"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30' : 'border-[#E2E8F0] text-[#0F172A]'}`}
                  />
                </div>
                <div className="flex gap-3 pb-2">
                  <button onClick={() => setEditId(null)} className={`flex-1 py-4 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                    Annuler
                  </button>
                  <button onClick={saveEdit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal Suppression ── */}
        {deleteId === selected.id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className={`text-lg font-bold text-center mb-2 ${txt}`}>Retirer cette publication ?</h3>
              <p className={`text-sm text-center mb-2 ${sub}`}>
                La publication sera retirée du fil Découverte des particuliers.
              </p>
              <p className={`text-xs text-center mb-6 px-4 ${sub}`}>
                Les statistiques et conversions déjà enregistrées sont conservées dans votre tableau de bord.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                  Annuler
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg">
                  Retirer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── VUE LISTE ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen pb-24 ${bg}`}>
      {/* Header */}
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A]' : 'bg-gradient-to-br from-[#0F172A] to-[#1E293B]'}`}>
        <button onClick={() => navigate(-1)} className="mb-5 text-white/70 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-white text-2xl font-bold mb-1">Mes Publications</h1>
        <p className="text-white/50 text-sm">Statistiques de performance</p>

        {/* Résumé global */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Vues totales', value: '5 091', color: '#D4AF37' },
            { label: 'Conversions', value: '49',    color: '#0D9488' },
            { label: 'Collecté',    value: '97 900 €', color: '#B05B3B' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toast confirmation édition */}
      {editSaved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#006D77] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Publication mise à jour
        </div>
      )}

      {/* Liste publications */}
      <div className="px-4 py-5 space-y-3">
        {publications.length === 0 && (
          <div className={`text-center py-16 ${sub}`}>
            <p className="text-sm">Aucune publication active.</p>
            <button onClick={() => navigate('/kauri/pro-publish')} className="mt-4 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold rounded-xl">
              Créer une publication
            </button>
          </div>
        )}

        {publications.map(pub => {
          const cta = CTA_LABEL[pub.ctaType];
          const CtaIcon = cta.icon;
          const sparkData = pub.timeline.map(t => t.vues);

          return (
            <div key={pub.id} className={`rounded-2xl border ${card} shadow-md p-4`}>
              <div className="flex gap-3 mb-3">
                <button onClick={() => setSelectedId(pub.id)} className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={pub.thumbnail} alt="" className="w-full h-full object-cover" />
                </button>
                <div className="flex-1 min-w-0" onClick={() => setSelectedId(pub.id)}>
                  <p className={`text-sm font-semibold line-clamp-2 leading-snug mb-1 ${txt}`}>{pub.title}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-white/60' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{pub.category}</span>
                    <CtaIcon className="w-3 h-3" style={{ color: cta.color }} />
                    <span className="text-[10px] font-medium" style={{ color: cta.color }}>{cta.label}</span>
                  </div>
                </div>
                {/* Menu ⋯ */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setMenuId(menuId === pub.id ? null : pub.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}
                  >
                    <MoreVertical className={`w-4 h-4 ${sub}`} />
                  </button>
                  {menuId === pub.id && (
                    <div className={`absolute right-0 top-9 z-40 w-40 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
                      <button
                        onClick={() => openEdit(pub)}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-black/5 ${txt}`}
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#D4AF37]" /> Modifier
                      </button>
                      <div className={`h-px mx-3 ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F1F5F9]'}`} />
                      <button
                        onClick={() => { setDeleteId(pub.id); setMenuId(null); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* KPIs inline */}
              <button onClick={() => setSelectedId(pub.id)} className="w-full text-left">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Eye className={`w-3.5 h-3.5 ${sub}`} />
                    <span className={`text-xs font-semibold ${txt}`}>{pub.stats.vues.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className={`text-xs font-semibold ${txt}`}>{pub.stats.ctaClics}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#B05B3B]" />
                    <span className={`text-xs font-semibold ${txt}`}>{pub.stats.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {pub.stats.conversions.investissements.count > 0 && (
                      <span className="text-[10px] bg-[#006D77]/10 text-[#006D77] px-1.5 py-0.5 rounded-full font-medium">
                        {pub.stats.conversions.investissements.count} invest.
                      </span>
                    )}
                    {pub.stats.conversions.dons.count > 0 && (
                      <span className="text-[10px] bg-[#B05B3B]/10 text-[#B05B3B] px-1.5 py-0.5 rounded-full font-medium">
                        {pub.stats.conversions.dons.count} dons
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Sparkline data={sparkData} color={pub.stats.vuesEvol >= 0 ? '#006D77' : '#B05B3B'} />
                  <div className="text-right">
                    <p className={`text-xs font-bold ${txt}`}>{pub.stats.taux_conversion}%</p>
                    <p className={`text-[10px] ${sub}`}>conversion</p>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Sheet Édition (vue liste) ── */}
      {editId && editDraft && !selectedId && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditId(null)} />
          <div className={`relative rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-[#E2E8F0] rounded-full" /></div>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#F1F5F9]'}`}>
              <div>
                <h2 className={`font-bold text-lg ${txt}`}>Modifier la publication</h2>
                <p className={`text-xs ${sub}`}>Les changements sont visibles immédiatement</p>
              </div>
              <button onClick={() => setEditId(null)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Titre / Description</label>
                <textarea
                  value={editDraft.title}
                  onChange={e => setEditDraft({ ...editDraft, title: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'border-[#E2E8F0] text-[#0F172A]'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setEditDraft({ ...editDraft, category: cat })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${editDraft.category === cat ? 'bg-[#0F172A] text-white' : isDarkMode ? 'bg-white/10 text-white/60' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${txt}`}>Bouton d'action</label>
                <div className="space-y-2">
                  {CTA_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setEditDraft({ ...editDraft, ctaType: opt.value })}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${editDraft.ctaType === opt.value ? 'border-current' : isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}
                      style={{ color: editDraft.ctaType === opt.value ? opt.color : undefined }}>
                      {opt.label}
                      {editDraft.ctaType === opt.value && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 flex items-center gap-1 ${txt}`}><Hash className="w-3.5 h-3.5" /> Hashtags</label>
                <input type="text" value={editDraft.hashtags} onChange={e => setEditDraft({ ...editDraft, hashtags: e.target.value })}
                  placeholder="#diaspora #kauri"
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 ${isDarkMode ? 'bg-[#0F172A] border-[#334155] text-white placeholder:text-white/30' : 'border-[#E2E8F0] text-[#0F172A]'}`} />
              </div>
              <div className="flex gap-3 pb-2">
                <button onClick={() => setEditId(null)} className={`flex-1 py-4 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
                <button onClick={saveEdit} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white text-sm font-bold shadow-lg">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Suppression (vue liste) ── */}
      {deleteId && !selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className={`text-lg font-bold text-center mb-2 ${txt}`}>Retirer cette publication ?</h3>
            <p className={`text-sm text-center mb-2 ${sub}`}>La publication sera retirée du fil Découverte des particuliers.</p>
            <p className={`text-xs text-center mb-6 px-2 ${sub}`}>Les statistiques et conversions déjà enregistrées sont conservées.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className={`flex-1 py-3.5 rounded-xl text-sm font-medium border-2 ${isDarkMode ? 'border-[#334155] text-white' : 'border-[#E2E8F0] text-[#64748B]'}`}>Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg">Retirer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
