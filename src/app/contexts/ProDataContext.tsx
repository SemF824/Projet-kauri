import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
export type ProjetStatut = 'En cours' | 'Terminé' | 'En attente' | 'Brouillon';
export type FinType = 'dons' | 'investissement' | 'les-deux';

export interface Palier {
  label: string;
  montant: string;
  description: string;
  contrepartie_don: string;
  rendement_invest: string;
}

export interface ProProjet {
  id: string;
  nom: string;
  description: string;
  leve: number;
  objectif: number;
  backers: number;
  statut: ProjetStatut;
  color: string;
  categorie: string;
  dateDebut: string;
  dateFin: string;
  progress: number;
  finType: FinType;
  paliers: Palier[];
}

// ── Données initiales ─────────────────────────────────────────────────────────
const INITIAL_PROJETS: ProProjet[] = [
  {
    id: 'p1', nom: 'Lolo Moderne',
    description: "Rénovation et modernisation d'une résidence communautaire à Fort-de-France.",
    leve: 45_000, objectif: 100_000, backers: 87,
    statut: 'En cours', color: '#006D77', categorie: 'Immobilier',
    dateDebut: '1 avr. 2026', dateFin: '1 oct. 2026', progress: 45,
    finType: 'les-deux',
    paliers: [
      { label: 'Palier Soutien',    montant: '5000',   description: 'Équipement de base',  contrepartie_don: 'Remerciement public',     rendement_invest: '5'  },
      { label: 'Palier Partenaire', montant: '30000',  description: 'Recrutement & local', contrepartie_don: 'Invitation inauguration',  rendement_invest: '8'  },
      { label: 'Palier Visionnaire',montant: '100000', description: 'Lancement complet',   contrepartie_don: 'Nom gravé + accès VIP',    rendement_invest: '12' },
    ],
  },
  {
    id: 'p2', nom: 'Coopérative Agricole',
    description: "Financement d'une coopérative agricole biologique en Guadeloupe.",
    leve: 32_000, objectif: 50_000, backers: 42,
    statut: 'En cours', color: '#059669', categorie: 'Agriculture',
    dateDebut: '15 mai 2026', dateFin: '15 août 2026', progress: 64,
    finType: 'dons',
    paliers: [
      { label: 'Palier Semence',  montant: '200',  description: 'Semences 1 saison',  contrepartie_don: 'Panier produits offert', rendement_invest: '' },
      { label: 'Palier Récolte',  montant: '1000', description: 'Équipement terrain', contrepartie_don: 'Visite exploitation',    rendement_invest: '' },
      { label: 'Palier Fondateur',montant: '5000', description: 'Expansion réseau',   contrepartie_don: 'Partenaire officiel',    rendement_invest: '' },
    ],
  },
  {
    id: 'p3', nom: 'Solaire Antilles',
    description: 'Installation de panneaux solaires collectifs pour 20 foyers.',
    leve: 28_500, objectif: 28_500, backers: 61,
    statut: 'Terminé', color: '#D4AF37', categorie: 'Énergie',
    dateDebut: '1 jan. 2026', dateFin: '30 mar. 2026', progress: 100,
    finType: 'investissement',
    paliers: [
      { label: 'Palier 1', montant: '500',   description: '1 panneau',   contrepartie_don: '', rendement_invest: '4'  },
      { label: 'Palier 2', montant: '2000',  description: '4 panneaux',  contrepartie_don: '', rendement_invest: '7'  },
      { label: 'Palier 3', montant: '10000', description: '20 panneaux', contrepartie_don: '', rendement_invest: '10' },
    ],
  },
  {
    id: 'p4', nom: 'Tech Hub Diaspora',
    description: "Espace de coworking et d'incubation pour entrepreneurs diaspora.",
    leve: 0, objectif: 75_000, backers: 0,
    statut: 'En attente', color: '#7C3AED', categorie: 'Tech',
    dateDebut: '—', dateFin: '—', progress: 0,
    finType: 'investissement',
    paliers: [
      { label: 'Palier Starter', montant: '1000',  description: 'Accès 1 mois',        contrepartie_don: '', rendement_invest: '6'  },
      { label: 'Palier Builder', montant: '5000',  description: 'Bureau dédié 6 mois', contrepartie_don: '', rendement_invest: '9'  },
      { label: 'Palier Founder', montant: '20000', description: 'Part au capital',      contrepartie_don: '', rendement_invest: '14' },
    ],
  },
  {
    id: 'p5', nom: 'Livraison Caribéenne',
    description: "Application de livraison de produits caribéens authentiques.",
    leve: 0, objectif: 30_000, backers: 0,
    statut: 'Brouillon', color: '#64748B', categorie: 'Commerce',
    dateDebut: '—', dateFin: '—', progress: 0,
    finType: 'les-deux',
    paliers: [
      { label: 'Palier 1', montant: '500',   description: 'MVP application', contrepartie_don: 'Badge fondateur',    rendement_invest: '5'  },
      { label: 'Palier 2', montant: '5000',  description: 'Lancement bêta',  contrepartie_don: 'Accès premium 1 an', rendement_invest: '8'  },
      { label: 'Palier 3', montant: '30000', description: 'Déploiement',     contrepartie_don: 'Parts dans la SAS',  rendement_invest: '12' },
    ],
  },
];

const LS_KEY = 'kauri_pro_projects_v2';

// ── Context ───────────────────────────────────────────────────────────────────
interface ProDataContextValue {
  projets: ProProjet[];
  addProjet:    (p: ProProjet) => void;
  updateProjet: (p: ProProjet) => void;
  cloturerProjet: (id: string, dateFin?: string) => void;
}

const ProDataContext = createContext<ProDataContextValue | null>(null);

export function ProDataProvider({ children }: { children: ReactNode }) {
  const [projets, setProjets] = useState<ProProjet[]>(() => {
    try {
      const saved: ProProjet[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      if (saved.length > 0) {
        const baseIds = new Set(INITIAL_PROJETS.map(p => p.id));
        const extras  = saved.filter(p => !baseIds.has(p.id));
        // Merge: apply any saved updates to base projects
        const updated = INITIAL_PROJETS.map(base => {
          const override = saved.find(s => s.id === base.id);
          return override ?? base;
        });
        return [...updated, ...extras];
      }
    } catch { /* ignore */ }
    return INITIAL_PROJETS;
  });

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(projets)); } catch { /* ignore */ }
  }, [projets]);

  const addProjet = (p: ProProjet) =>
    setProjets(prev => [p, ...prev]);

  const updateProjet = (p: ProProjet) =>
    setProjets(prev => prev.map(x => x.id === p.id ? p : x));

  const cloturerProjet = (id: string, dateFin = '4 juil. 2026') =>
    setProjets(prev => prev.map(x =>
      x.id === id ? { ...x, statut: 'Terminé' as ProjetStatut, dateFin } : x
    ));

  return (
    <ProDataContext.Provider value={{ projets, addProjet, updateProjet, cloturerProjet }}>
      {children}
    </ProDataContext.Provider>
  );
}

export function useProData() {
  const ctx = useContext(ProDataContext);
  if (!ctx) throw new Error('useProData must be used inside ProDataProvider');
  return ctx;
}
