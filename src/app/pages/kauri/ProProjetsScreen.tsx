import { ArrowLeft, Plus, Users, TrendingUp, Clock, ChevronRight, Briefcase, CheckCircle, AlertCircle, Pencil, X, CheckCircle2, Gift, Info, Save, Lock, Trophy, CalendarX, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useProData, ProProjet } from '../../contexts/ProDataContext';

const TEAL  = '#006D77';
const GOLD  = '#D4AF37';
const TERRA = '#B05B3B';
const AMBER = '#92400E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}

type Statut = 'En cours' | 'Terminé' | 'En attente' | 'Brouillon';
type FinType = 'dons' | 'investissement' | 'les-deux';
type EditTab = 'general' | 'paliers' | 'cta';

interface Palier {
  label: string;
  montant: string;
  description: string;
  contrepartie_don: string;
  rendement_invest: string;
}

interface Projet {
  id: string; nom: string; description: string;
  leve: number; objectif: number; backers: number;
  statut: Statut; color: string; categorie: string;
  dateDebut: string; dateFin: string; progress: number;
  finType: FinType;
  paliers: Palier[];
}

const INITIAL_PROJETS: Projet[] = [
  {
    id: 'p1', nom: 'Lolo Moderne',
    description: "Rénovation et modernisation d'une résidence communautaire à Fort-de-France avec intégration de solutions durables.",
    leve: 45_000, objectif: 100_000, backers: 87,
    statut: 'En cours', color: TEAL, categorie: 'Immobilier',
    dateDebut: '1 avr. 2026', dateFin: '1 oct. 2026', progress: 45,
    finType: 'les-deux',
    paliers: [
      { label: 'Palier Soutien',    montant: '5000',   description: 'Équipement de base',    contrepartie_don: 'Remerciement public', rendement_invest: '5' },
      { label: 'Palier Partenaire', montant: '30000',  description: 'Recrutement & local',   contrepartie_don: 'Invitation inauguration', rendement_invest: '8' },
      { label: 'Palier Visionnaire',montant: '100000', description: 'Lancement complet',     contrepartie_don: 'Nom gravé + accès VIP', rendement_invest: '12' },
    ],
  },
  {
    id: 'p2', nom: 'Coopérative Agricole',
    description: "Financement d'une coopérative agricole biologique en Guadeloupe, production locale et circuits courts.",
    leve: 32_000, objectif: 50_000, backers: 42,
    statut: 'En cours', color: '#059669', categorie: 'Agriculture',
    dateDebut: '15 mai 2026', dateFin: '15 août 2026', progress: 64,
    finType: 'dons',
    paliers: [
      { label: 'Palier Semence',  montant: '200',   description: 'Semences 1 saison',  contrepartie_don: 'Panier produits offert', rendement_invest: '' },
      { label: 'Palier Récolte',  montant: '1000',  description: 'Équipement terrain', contrepartie_don: 'Visite exploitation', rendement_invest: '' },
      { label: 'Palier Fondateur',montant: '5000',  description: 'Expansion réseau',   contrepartie_don: 'Partenaire officiel',   rendement_invest: '' },
    ],
  },
  {
    id: 'p3', nom: 'Solaire Antilles',
    description: 'Installation de panneaux solaires collectifs pour 20 foyers. Projet clôturé avec succès.',
    leve: 28_500, objectif: 28_500, backers: 61,
    statut: 'Terminé', color: GOLD, categorie: 'Énergie',
    dateDebut: '1 jan. 2026', dateFin: '30 mar. 2026', progress: 100,
    finType: 'investissement',
    paliers: [
      { label: 'Palier 1', montant: '500',   description: '1 panneau',   contrepartie_don: '', rendement_invest: '4' },
      { label: 'Palier 2', montant: '2000',  description: '4 panneaux',  contrepartie_don: '', rendement_invest: '7' },
      { label: 'Palier 3', montant: '10000', description: '20 panneaux', contrepartie_don: '', rendement_invest: '10' },
    ],
  },
  {
    id: 'p4', nom: 'Tech Hub Diaspora',
    description: "Création d'un espace de coworking et d'incubation pour entrepreneurs de la diaspora à Paris.",
    leve: 0, objectif: 75_000, backers: 0,
    statut: 'En attente', color: '#7C3AED', categorie: 'Tech',
    dateDebut: '—', dateFin: '—', progress: 0,
    finType: 'investissement',
    paliers: [
      { label: 'Palier Starter',   montant: '1000',  description: 'Accès coworking 1 mois',  contrepartie_don: '', rendement_invest: '6' },
      { label: 'Palier Builder',   montant: '5000',  description: 'Bureau dédié 6 mois',     contrepartie_don: '', rendement_invest: '9' },
      { label: 'Palier Founder',   montant: '20000', description: 'Participation au capital', contrepartie_don: '', rendement_invest: '14' },
    ],
  },
  {
    id: 'p5', nom: 'Livraison Caribéenne',
    description: "Application de livraison de produits caribéens authentiques en métropole.",
    leve: 0, objectif: 30_000, backers: 0,
    statut: 'Brouillon', color: '#64748B', categorie: 'Commerce',
    dateDebut: '—', dateFin: '—', progress: 0,
    finType: 'les-deux',
    paliers: [
      { label: 'Palier 1', montant: '500',   description: 'MVP application', contrepartie_don: 'Badge fondateur', rendement_invest: '5' },
      { label: 'Palier 2', montant: '5000',  description: 'Lancement bêta',  contrepartie_don: 'Accès premium 1 an', rendement_invest: '8' },
      { label: 'Palier 3', montant: '30000', description: 'Déploiement',     contrepartie_don: 'Parts dans la SAS', rendement_invest: '12' },
    ],
  },
];

const ONGLETS: Statut[] = ['En cours', 'Terminé', 'En attente', 'Brouillon'];
const CATEGORIES = ['Agriculture', 'Immobilier', 'Technologie', 'Social', 'Commerce', 'Hôtellerie', 'Artisanat', 'Énergie', 'Tech', 'Autre'];

const STATUT_CONFIG: Record<Statut, { bg: string; color: string; icon: React.ElementType; label: string }> = {
  'En cours':   { bg: `${TEAL}14`,  color: TEAL,      icon: TrendingUp,  label: '● En cours'   },
  'Terminé':    { bg: '#D1FAE5',    color: '#059669',  icon: CheckCircle, label: '✓ Terminé'    },
  'En attente': { bg: '#FEF3C7',    color: AMBER,      icon: Clock,       label: '⏳ En attente' },
  'Brouillon':  { bg: '#F1F5F9',    color: '#64748B',  icon: Briefcase,   label: '✏️ Brouillon'  },
};

const FIN_OPTIONS: { value: FinType; label: string; sub: string; color: string }[] = [
  { value: 'dons',           label: 'Dons uniquement',    sub: 'Contribution solidaire',  color: TERRA },
  { value: 'investissement', label: 'Investissement',     sub: 'Retour financier attendu', color: TEAL },
  { value: 'les-deux',       label: 'Les deux',           sub: 'Donateurs & investisseurs', color: GOLD },
];

const PALIER_META = [
  { tier: 'Palier 1', sublabel: 'Le plus bas',    placeholder: '500',   color: TEAL },
  { tier: 'Palier 2', sublabel: 'Intermédiaire',  placeholder: '5 000', color: GOLD },
  { tier: 'Palier 3', sublabel: 'Maximum',        placeholder: '20 000',color: TERRA },
];

export function ProProjetsScreen() {
  const navigate = useNavigate();
  const { projets, updateProjet, cloturerProjet } = useProData();
  const [onglet, setOnglet] = useState<Statut>('En cours');
  const [animated, setAnimated] = useState(false);

  // Edit state
  const [editId,  setEditId]  = useState<string | null>(null);
  const [editTab, setEditTab] = useState<EditTab>('general');
  const [draft,   setDraft]   = useState<Projet | null>(null);
  const [saved,   setSaved]   = useState(false);

  // Clôture state
  const [clotureId,     setClotureId]     = useState<string | null>(null);
  const [clotureMot,    setClotureMot]    = useState<'objectif' | 'expiration' | 'manuel' | ''>('');
  const [clotureRaison, setClotureRaison] = useState('');
  const [clotureDone,   setClotureDone]   = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const openEdit = (proj: Projet) => {
    setDraft(JSON.parse(JSON.stringify(proj))); // deep copy
    setEditId(proj.id);
    setEditTab('general');
  };

  const openCloture = (proj: Projet) => {
    const motif = proj.progress >= 100 ? 'objectif' : '';
    setClotureId(proj.id);
    setClotureMot(motif);
    setClotureRaison('');
  };

  const confirmCloture = () => {
    if (!clotureId) return;
    cloturerProjet(clotureId, '4 juil. 2026');
    setClotureDone(prev => [...prev, clotureId]);
    setClotureId(null);
    setClotureMot('');
    setClotureRaison('');
    setSaved(true); // réutilise le toast
    setTimeout(() => setSaved(false), 2500);
  };

  const saveEdit = () => {
    if (!draft) return;
    updateProjet(draft as unknown as ProProjet);
    setEditId(null);
    setDraft(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const updatePalier = (i: number, field: keyof Palier, value: string) => {
    if (!draft) return;
    const paliers = [...draft.paliers];
    paliers[i] = { ...paliers[i], [field]: value };
    setDraft({ ...draft, paliers });
  };

  const filtered = projets.filter(p => p.statut === onglet);
  const totalLeve    = projets.reduce((s, p) => s + p.leve, 0);
  const totalBackers = projets.reduce((s, p) => s + p.backers, 0);
  const totalObjectif = projets.reduce((s, p) => s + p.objectif, 0);

  const acceptsDons   = draft?.finType === 'dons'    || draft?.finType === 'les-deux';
  const acceptsInvest = draft?.finType === 'investissement' || draft?.finType === 'les-deux';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">

      {/* Toast */}
      {saved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#006D77] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4" />
          {clotureDone.length > 0 ? 'Levée clôturée et archivée' : 'Projet mis à jour'}
        </div>
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }} className="px-5 pt-14 pb-6 shadow-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Levée de fonds · Pro</p>
            <h1 className="text-white text-2xl font-bold">Mes Projets</h1>
          </div>
          <button
            onClick={() => navigate('/kauri/pro-project-form')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Plus style={{ width: 14, height: 14, color: '#fff' }} />
            <span className="text-white text-xs font-semibold">Nouveau</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Briefcase,  label: 'Total projets', value: String(projets.length), color: TEAL,      bg: `${TEAL}14`   },
            { icon: TrendingUp, label: 'Total levé',    value: formatEur(totalLeve),   color: AMBER,     bg: '#FEF3C7'     },
            { icon: Users,      label: 'Backers',       value: String(totalBackers),   color: '#7C3AED', bg: '#7C3AED14'   },
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

        {/* Barre progression globale */}
        <div className="rounded-2xl p-4 bg-white" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#0F172A] text-sm font-bold">Encaissé / Objectif global</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#16A34A' }}>
              {Math.round((totalLeve / totalObjectif) * 100)}%
            </span>
          </div>
          <div className="flex items-end justify-between mb-2 text-sm">
            <span className="font-bold text-[#0F172A]">{formatEur(totalLeve)}</span>
            <span className="text-[#94A3B8]">/ {formatEur(totalObjectif)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div className="h-full rounded-full" style={{
              width: animated ? `${Math.round((totalLeve / totalObjectif) * 100)}%` : '0%',
              background: `linear-gradient(90deg, ${TEAL}, #0D9488)`,
              transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        </div>

        <div className="h-px bg-[#E8EDF2]" />

        {/* Onglets */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ONGLETS.map(tab => {
            const cfg   = STATUT_CONFIG[tab];
            const count = projets.filter(p => p.statut === tab).length;
            return (
              <button key={tab} onClick={() => setOnglet(tab)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: onglet === tab ? cfg.color : '#fff',
                  color:      onglet === tab ? '#fff'    : '#64748B',
                  border:     `1.5px solid ${onglet === tab ? cfg.color : '#E8EDF2'}`,
                }}>
                {tab}
                {count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: onglet === tab ? 'rgba(255,255,255,0.25)' : cfg.bg, color: onglet === tab ? '#fff' : cfg.color }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Liste projets */}
        <div>
          <p className="text-[#0F172A] text-sm font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: STATUT_CONFIG[onglet].color }} />
            {filtered.length} projet{filtered.length > 1 ? 's' : ''} · {onglet}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white" style={{ border: '1.5px solid #EEF2F7' }}>
              <span className="text-4xl">📂</span>
              <p className="text-[#64748B] text-sm mt-3">Aucun projet dans cette catégorie</p>
              <button onClick={() => navigate('/kauri/pro-project-form')}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: TEAL, color: '#fff' }}>
                <Plus style={{ width: 14, height: 14 }} /> Créer un projet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(proj => {
                const cfg = STATUT_CONFIG[proj.statut];
                const editable = proj.statut !== 'Terminé';
                return (
                  <div key={proj.id} className="rounded-2xl bg-white overflow-hidden"
                    style={{ border: `1.5px solid ${proj.color}25`, boxShadow: `0 2px 12px ${proj.color}0C` }}>

                    {/* Corps */}
                    <div className="px-5 py-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${proj.color}14` }}>
                            <Briefcase style={{ width: 18, height: 18, color: proj.color }} />
                          </div>
                          <div>
                            <p className="text-[#0F172A] text-sm font-bold">{proj.nom}</p>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${proj.color}14`, color: proj.color }}>
                              {proj.categorie}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#64748B] text-xs leading-relaxed mb-3 line-clamp-2">{proj.description}</p>

                      {proj.statut !== 'Brouillon' && (
                        <div className="mb-3">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[#94A3B8] text-xs">Levé</span>
                            <span className="text-xs font-bold" style={{ color: proj.color }}>{proj.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: animated ? `${Math.min(proj.progress, 100)}%` : '0%',
                              backgroundColor: proj.color,
                              transition: 'width 0.8s ease',
                            }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                        {proj.leve > 0 && <span className="font-semibold text-[#0F172A]">{formatEur(proj.leve)}</span>}
                        {proj.objectif > 0 && <span>/ {formatEur(proj.objectif)}</span>}
                        {proj.backers > 0 && (
                          <span className="flex items-center gap-1 ml-auto">
                            <Users style={{ width: 11, height: 11 }} /> {proj.backers} backers
                          </span>
                        )}
                        {proj.dateDebut !== '—' && (
                          <span className="flex items-center gap-1 ml-auto">
                            <Clock style={{ width: 11, height: 11 }} /> {proj.dateFin}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bannière objectif atteint */}
                    {proj.progress >= 100 && proj.statut === 'En cours' && (
                      <div className="mx-5 mb-3 bg-gradient-to-r from-[#D4AF37]/15 to-[#FEF9E7] rounded-xl p-3 border border-[#D4AF37]/40 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#92400E]">Objectif atteint !</p>
                          <p className="text-[10px] text-[#92400E]/70">Vous pouvez clôturer et archiver cette levée.</p>
                        </div>
                      </div>
                    )}

                    {/* Barre actions */}
                    <div className="flex border-t" style={{ borderColor: '#F1F5F9' }}>
                      {editable && (
                        <button
                          onClick={() => openEdit(proj)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors hover:bg-[#F8FAFC]"
                          style={{ color: proj.color, borderRight: '1px solid #F1F5F9' }}
                        >
                          <Pencil className="w-3.5 h-3.5" /> Modifier
                        </button>
                      )}
                      {editable && (
                        <button
                          onClick={() => openCloture(proj)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#B05B3B] hover:bg-red-50 transition-colors"
                          style={{ borderRight: '1px solid #F1F5F9' }}
                        >
                          <Lock className="w-3.5 h-3.5" /> Clôturer
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/kauri/pro-leves')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                      >
                        Levées <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={() => navigate('/kauri/pro-project-form')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${TEAL}, #0D9488)`, boxShadow: `0 4px 16px ${TEAL}40` }}>
          <Plus style={{ width: 18, height: 18, color: '#fff' }} />
          <span className="text-white text-sm font-bold">Lancer un nouveau projet</span>
        </button>
      </div>

      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        <p className="text-[#94A3B8] text-xs">Valorisation en temps réel · Mis à jour il y a 2 min</p>
      </div>

      {/* ── MODAL CLÔTURE ─────────────────────────────────────────────────────── */}
      {clotureId && (() => {
        const proj = projets.find(p => p.id === clotureId);
        if (!proj) return null;
        const isObjectifAtteint = proj.progress >= 100;
        const canConfirm = clotureMot !== '';

        const MOTIFS = [
          {
            id: 'objectif' as const,
            icon: Trophy,
            label: 'Objectif atteint',
            desc: `${formatEur(proj.leve)} collectés sur ${formatEur(proj.objectif)}`,
            color: '#D4AF37',
            bg: 'bg-[#FEF9E7] border-[#D4AF37]/30',
          },
          {
            id: 'expiration' as const,
            icon: CalendarX,
            label: 'Campagne expirée',
            desc: 'La date de fin de campagne est dépassée',
            color: '#B05B3B',
            bg: 'bg-[#FEF3EE] border-[#B05B3B]/30',
          },
          {
            id: 'manuel' as const,
            icon: Lock,
            label: 'Clôture manuelle',
            desc: 'Vous choisissez de mettre fin à la levée',
            color: '#64748B',
            bg: 'bg-[#F1F5F9] border-[#E2E8F0]',
          },
        ];

        return (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setClotureId(null)} />
            <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="font-bold text-[#0F172A] text-base">Clôturer la levée</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">{proj.nom}</p>
                </div>
                <button onClick={() => setClotureId(null)} className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>

              <div className="px-5 py-5 space-y-5">
                {/* Résumé financier */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Collecté',      value: formatEur(proj.leve),    color: TEAL },
                    { label: 'Objectif',      value: formatEur(proj.objectif), color: '#64748B' },
                    { label: 'Contributeurs', value: String(proj.backers),    color: '#7C3AED' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-[#E2E8F0]">
                      <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Motif de clôture */}
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] mb-3">Motif de clôture <span className="text-red-500">*</span></p>
                  <div className="space-y-2">
                    {MOTIFS.map(m => {
                      const Icon = m.icon;
                      const selected = clotureMot === m.id;
                      return (
                        <button key={m.id} onClick={() => setClotureMot(m.id)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${selected ? `border-current ${m.bg}` : 'border-[#E2E8F0]'}`}
                          style={{ color: selected ? m.color : undefined }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: selected ? `${m.color}18` : '#F1F5F9' }}>
                            <Icon className="w-4 h-4" style={{ color: selected ? m.color : '#94A3B8' }} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${selected ? '' : 'text-[#0F172A]'}`}>{m.label}</p>
                            <p className="text-xs text-[#64748B]">{m.desc}</p>
                          </div>
                          {selected && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message optionnel */}
                <div>
                  <label className="text-sm font-semibold text-[#0F172A] mb-2 block">Message aux contributeurs (optionnel)</label>
                  <textarea value={clotureRaison} onChange={e => setClotureRaison(e.target.value)}
                    placeholder="Ex : Merci à tous pour votre soutien ! Les fonds seront utilisés pour..."
                    rows={3} maxLength={300}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006D77]/20" />
                  <p className="text-xs text-[#94A3B8] text-right mt-1">{clotureRaison.length}/300</p>
                </div>

                {/* Conséquences */}
                <div className="bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#92400E] space-y-1">
                    <p><strong>Conséquences de la clôture :</strong></p>
                    <p>• Le CTA "Investir / Faire un don" disparaît dans Découverte</p>
                    <p>• Les contributions en cours sont figées</p>
                    <p>• Le projet passe au statut <strong>Terminé</strong></p>
                    <p>• Les statistiques restent accessibles</p>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3">
                  <button onClick={() => setClotureId(null)}
                    className="flex-1 py-4 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] text-sm font-medium">
                    Annuler
                  </button>
                  <button onClick={confirmCloture} disabled={!canConfirm}
                    className="flex-1 py-4 rounded-xl text-white text-sm font-bold shadow-lg disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ background: canConfirm ? `linear-gradient(135deg, #B05B3B, #D4803A)` : '#E2E8F0' }}>
                    <Lock className="w-4 h-4" /> Clôturer la levée
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── SHEET ÉDITION ─────────────────────────────────────────────────────── */}
      {editId && draft && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditId(null)} />
          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col">

            {/* Handle + Header */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9] flex-shrink-0">
              <div>
                <h2 className="font-bold text-[#0F172A] text-base">{draft.nom}</h2>
                <p className="text-xs text-[#64748B]">Modifier le projet</p>
              </div>
              <button onClick={() => setEditId(null)} className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#F1F5F9] flex-shrink-0 px-5">
              {([
                { id: 'general', label: 'Général' },
                { id: 'paliers', label: 'Paliers' },
                { id: 'cta',     label: 'Financement' },
              ] as { id: EditTab; label: string }[]).map(t => (
                <button key={t.id} onClick={() => setEditTab(t.id)}
                  className={`py-3 mr-5 text-sm font-semibold border-b-2 transition-colors ${editTab === t.id ? 'border-[#006D77] text-[#006D77]' : 'border-transparent text-[#94A3B8]'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">

              {/* ── Général ── */}
              {editTab === 'general' && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-[#0F172A] mb-2 block">Nom du projet</label>
                    <input value={draft.nom} onChange={e => setDraft({ ...draft, nom: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/30" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0F172A] mb-2 block">Description</label>
                    <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}
                      rows={4} maxLength={500}
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006D77]/30" />
                    <p className="text-xs text-[#94A3B8] text-right mt-1">{draft.description.length}/500</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0F172A] mb-2 block">Catégorie</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setDraft({ ...draft, categorie: cat })}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${draft.categorie === cat ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Paliers ── */}
              {editTab === 'paliers' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
                    Les particuliers verront ces 3 paliers dans Découverte. Modifier un montant réinitialise les contributions en cours.
                  </p>
                  {draft.paliers.map((p, i) => {
                    const meta = PALIER_META[i];
                    return (
                      <div key={i} className="rounded-2xl border border-[#E2E8F0] overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F1F5F9]" style={{ background: `${meta.color}08` }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: meta.color }}>{i + 1}</span>
                          <input value={p.label} onChange={e => updatePalier(i, 'label', e.target.value)}
                            className="flex-1 text-sm font-bold text-[#0F172A] bg-transparent focus:outline-none" />
                          <span className="text-[10px] text-[#94A3B8]">{meta.sublabel}</span>
                        </div>
                        <div className="p-4 space-y-3">
                          {/* Montant */}
                          <div>
                            <label className="text-xs text-[#64748B] mb-1 block">Montant objectif (€)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold text-sm">€</span>
                              <input type="number" value={p.montant} onChange={e => updatePalier(i, 'montant', e.target.value)}
                                placeholder={meta.placeholder}
                                className="w-full pl-8 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20" />
                            </div>
                          </div>
                          {/* Description */}
                          <div>
                            <label className="text-xs text-[#64748B] mb-1 block">Ce que finance ce palier</label>
                            <input value={p.description} onChange={e => updatePalier(i, 'description', e.target.value)}
                              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]/20" />
                          </div>
                          {/* Contrepartie don */}
                          {acceptsDons && (
                            <div className="bg-[#FEF3EE] rounded-xl p-3 border border-[#B05B3B]/15">
                              <label className="text-[10px] font-semibold text-[#B05B3B] mb-1.5 flex items-center gap-1 block">
                                <Gift className="w-3 h-3" /> Contrepartie donateurs
                              </label>
                              <input value={p.contrepartie_don} onChange={e => updatePalier(i, 'contrepartie_don', e.target.value)}
                                placeholder="Ex: Remerciement, goodies, invitation..."
                                className="w-full px-3 py-2 bg-white border border-[#B05B3B]/20 rounded-lg text-xs focus:outline-none" />
                            </div>
                          )}
                          {/* Rendement investisseur */}
                          {acceptsInvest && (
                            <div className="bg-[#E0F2FE] rounded-xl p-3 border border-[#006D77]/15">
                              <label className="text-[10px] font-semibold text-[#006D77] mb-1.5 flex items-center gap-1 block">
                                <TrendingUp className="w-3 h-3" /> Rendement annuel investisseurs
                              </label>
                              <div className="relative">
                                <input type="number" value={p.rendement_invest} onChange={e => updatePalier(i, 'rendement_invest', e.target.value)}
                                  placeholder="Ex: 8"
                                  className="w-full pl-3 pr-8 py-2 bg-white border border-[#006D77]/20 rounded-lg text-xs focus:outline-none" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#006D77] text-xs font-bold">%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Type de financement ── */}
              {editTab === 'cta' && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">Type de financement accepté</p>
                  <p className="text-xs text-[#64748B] mb-3">Définit ce que les particuliers peuvent faire sur votre projet depuis Découverte.</p>
                  {FIN_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setDraft({ ...draft, finType: opt.value })}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${draft.finType === opt.value ? 'border-current' : 'border-[#E2E8F0]'}`}
                      style={{ color: draft.finType === opt.value ? opt.color : undefined }}>
                      <div>
                        <p className={`text-sm font-semibold ${draft.finType === opt.value ? '' : 'text-[#0F172A]'}`}>{opt.label}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{opt.sub}</p>
                      </div>
                      {draft.finType === opt.value && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                    </button>
                  ))}

                  <div className="mt-4 rounded-xl p-4 bg-[#FEF9E7] border border-[#D4AF37]/30">
                    <p className="text-xs text-[#92400E]">
                      <strong>Note :</strong> Changer le type de financement met à jour les boutons CTA visibles par les particuliers dans Découverte. Les contributions déjà enregistrées ne sont pas affectées.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer fixe */}
            <div className="flex gap-3 px-5 py-4 border-t border-[#F1F5F9] flex-shrink-0">
              <button onClick={() => setEditId(null)}
                className="flex-1 py-4 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] text-sm font-medium">
                Annuler
              </button>
              <button onClick={saveEdit}
                className="flex-1 py-4 rounded-xl text-white text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${TEAL}, #0D9488)` }}>
                <Save className="w-4 h-4" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
