import { createContext, useContext, useState, ReactNode } from 'react';
import { TrendingUp, Gift, Info } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PublicationStats {
  vues: number;
  vuesEvol: number;
  likes: number;
  likesEvol: number;
  comments: number;
  partages: number;
  ctaClics: number;
  ctaEvol: number;
  conversions: {
    total: number;
    investissements: { count: number; montant: number };
    dons: { count: number; montant: number };
  };
  taux_conversion: number;
  portee: number;
  nouveaux_abonnes: number;
}

export interface Contributeur {
  initials: string;
  name: string;
  type: string;
  montant: number;
  palier: string;
}

export interface TimelinePoint {
  jour: string;
  vues: number;
  clics: number;
}

export interface ProPublication {
  id: string;
  title: string;
  type: string;
  category: string;
  project: string;
  ctaType: 'investir' | 'don' | 'decouvrir';
  publishedAt: string;
  thumbnail: string;
  stats: PublicationStats;
  timeline: TimelinePoint[];
  top_contributeurs: Contributeur[];
}

// ── Données initiales ─────────────────────────────────────────────────────────
const INITIAL_PUBLICATIONS: ProPublication[] = [
  {
    id: '1',
    title: "Ouverture de notre Lolo Moderne à Fort-de-France",
    type: 'video',
    category: 'Restauration',
    project: 'Lolo Moderne',
    ctaType: 'investir',
    publishedAt: '2 juillet 2026',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    stats: {
      vues: 1247, vuesEvol: +18, likes: 342, likesEvol: +24,
      comments: 28, partages: 14, ctaClics: 89, ctaEvol: +31,
      conversions: { total: 12, investissements: { count: 8, montant: 14500 }, dons: { count: 4, montant: 1200 } },
      taux_conversion: 13.5, portee: 3820, nouveaux_abonnes: 23,
    },
    timeline: [
      { jour: 'J1', vues: 380, clics: 22 }, { jour: 'J2', vues: 290, clics: 18 },
      { jour: 'J3', vues: 210, clics: 14 }, { jour: 'J4', vues: 180, clics: 12 },
      { jour: 'J5', vues: 110, clics: 10 }, { jour: 'J6', vues: 77,  clics: 8  },
    ],
    top_contributeurs: [
      { initials: 'SB', name: 'Sophie B.',    type: 'investissement', montant: 5000, palier: 'Palier 2' },
      { initials: 'JM', name: 'Jean-Luc M.',  type: 'don',            montant: 500,  palier: 'Palier 1' },
      { initials: 'AC', name: 'André C.',      type: 'investissement', montant: 3000, palier: 'Palier 2' },
    ],
  },
  {
    id: '2',
    title: "Première récolte de notre coopérative manioc",
    type: 'image',
    category: 'Agriculture',
    project: 'Coopérative Agricole',
    ctaType: 'don',
    publishedAt: '30 juin 2026',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
    stats: {
      vues: 634, vuesEvol: -4, likes: 215, likesEvol: +8,
      comments: 19, partages: 8, ctaClics: 41, ctaEvol: +5,
      conversions: { total: 6, investissements: { count: 0, montant: 0 }, dons: { count: 6, montant: 1800 } },
      taux_conversion: 9.7, portee: 1540, nouveaux_abonnes: 9,
    },
    timeline: [
      { jour: 'J1', vues: 220, clics: 14 }, { jour: 'J2', vues: 180, clics: 11 },
      { jour: 'J3', vues: 110, clics: 7  }, { jour: 'J4', vues: 80,  clics: 5  },
      { jour: 'J5', vues: 44,  clics: 4  },
    ],
    top_contributeurs: [
      { initials: 'LM', name: 'Lucia M.', type: 'don', montant: 200, palier: 'Palier 1' },
      { initials: 'KD', name: 'Kofi D.',  type: 'don', montant: 500, palier: 'Palier 2' },
    ],
  },
  {
    id: '3',
    title: "Notre incubateur tech forme 200 jeunes dev par an",
    type: 'video',
    category: 'Tech',
    project: 'TechAfrika Hub',
    ctaType: 'investir',
    publishedAt: '28 juin 2026',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    stats: {
      vues: 3210, vuesEvol: +52, likes: 891, likesEvol: +67,
      comments: 63, partages: 42, ctaClics: 204, ctaEvol: +78,
      conversions: { total: 31, investissements: { count: 27, montant: 78000 }, dons: { count: 4, montant: 2400 } },
      taux_conversion: 15.2, portee: 9400, nouveaux_abonnes: 87,
    },
    timeline: [
      { jour: 'J1', vues: 980, clics: 66 }, { jour: 'J2', vues: 740, clics: 50 },
      { jour: 'J3', vues: 620, clics: 41 }, { jour: 'J4', vues: 490, clics: 28 },
      { jour: 'J5', vues: 380, clics: 19 },
    ],
    top_contributeurs: [
      { initials: 'FA', name: 'Fatou A.',  type: 'investissement', montant: 10000, palier: 'Palier 3' },
      { initials: 'MN', name: 'Marc N.',   type: 'investissement', montant: 5000,  palier: 'Palier 2' },
      { initials: 'CE', name: 'Cédric E.', type: 'investissement', montant: 3000,  palier: 'Palier 2' },
    ],
  },
];

export const CTA_LABEL: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  investir:  { label: 'Investir',    color: '#006D77', icon: TrendingUp },
  don:       { label: 'Don',         color: '#B05B3B', icon: Gift },
  decouvrir: { label: 'En savoir +', color: '#D4AF37', icon: Info },
};

// ── Aggregate helpers ─────────────────────────────────────────────────────────
export function computeSocialStats(pubs: ProPublication[]) {
  const totalVues      = pubs.reduce((s, p) => s + p.stats.vues, 0);
  const totalAbonnes   = pubs.reduce((s, p) => s + p.stats.nouveaux_abonnes, 0) + 200; // base 200
  return {
    nbPublications: pubs.length,
    totalVues,
    totalAbonnes,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────
interface ProPublicationsContextValue {
  publications: ProPublication[];
  updatePublication: (p: ProPublication) => void;
  deletePublication: (id: string) => void;
}

const ProPublicationsContext = createContext<ProPublicationsContextValue | null>(null);

export function ProPublicationsProvider({ children }: { children: ReactNode }) {
  const [publications, setPublications] = useState<ProPublication[]>(INITIAL_PUBLICATIONS);

  const updatePublication = (p: ProPublication) =>
    setPublications(prev => prev.map(x => x.id === p.id ? p : x));

  const deletePublication = (id: string) =>
    setPublications(prev => prev.filter(x => x.id !== id));

  return (
    <ProPublicationsContext.Provider value={{ publications, updatePublication, deletePublication }}>
      {children}
    </ProPublicationsContext.Provider>
  );
}

export function useProPublications() {
  const ctx = useContext(ProPublicationsContext);
  if (!ctx) throw new Error('useProPublications must be used inside ProPublicationsProvider');
  return ctx;
}
