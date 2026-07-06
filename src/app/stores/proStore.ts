// ── Store partagé pour le compte Pro ─────────────────────────────────────────
// Source de vérité unique pour tous les écrans pro.
// Persisté dans localStorage sous la clé "kauri_pro_store".

export interface ProProjet {
  id: string;
  nom: string;
  description: string;
  leve: number;
  objectif: number;
  backers: number;
  statut: 'En cours' | 'Terminé' | 'En attente' | 'Brouillon';
  color: string;
  categorie: string;
  dateDebut: string;
  dateFin: string;
  progress: number;
  finType: 'dons' | 'investissement' | 'les-deux';
  paliers: {
    label: string; montant: string; description: string;
    contrepartie_don: string; rendement_invest: string;
  }[];
}

const KEY = 'kauri_pro_store';

const BASE: ProProjet[] = [
  {
    id: 'p1', nom: 'Lolo Moderne',
    description: "Rénovation et modernisation d'une résidence communautaire à Fort-de-France avec intégration de solutions durables.",
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
    description: "Financement d'une coopérative agricole biologique en Guadeloupe, production locale et circuits courts.",
    leve: 32_000, objectif: 50_000, backers: 42,
    statut: 'En cours', color: '#059669', categorie: 'Agriculture',
    dateDebut: '15 mai 2026', dateFin: '15 août 2026', progress: 64,
    finType: 'dons',
    paliers: [
      { label: 'Palier Semence',   montant: '200',  description: 'Semences 1 saison',  contrepartie_don: 'Panier produits offert', rendement_invest: '' },
      { label: 'Palier Récolte',   montant: '1000', description: 'Équipement terrain', contrepartie_don: 'Visite exploitation',    rendement_invest: '' },
      { label: 'Palier Fondateur', montant: '5000', description: 'Expansion réseau',   contrepartie_don: 'Partenaire officiel',    rendement_invest: '' },
    ],
  },
  {
    id: 'p3', nom: 'Solaire Antilles',
    description: 'Installation de panneaux solaires collectifs pour 20 foyers. Projet clôturé avec succès.',
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
    description: "Création d'un espace de coworking et d'incubation pour entrepreneurs de la diaspora à Paris.",
    leve: 0, objectif: 75_000, backers: 0,
    statut: 'En attente', color: '#7C3AED', categorie: 'Tech',
    dateDebut: '—', dateFin: '—', progress: 0,
    finType: 'investissement',
    paliers: [
      { label: 'Palier Starter', montant: '1000',  description: 'Accès coworking 1 mois',  contrepartie_don: '', rendement_invest: '6'  },
      { label: 'Palier Builder', montant: '5000',  description: 'Bureau dédié 6 mois',     contrepartie_don: '', rendement_invest: '9'  },
      { label: 'Palier Founder', montant: '20000', description: 'Participation au capital', contrepartie_don: '', rendement_invest: '14' },
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
      { label: 'Palier 1', montant: '500',   description: 'MVP application', contrepartie_don: 'Badge fondateur',      rendement_invest: '5'  },
      { label: 'Palier 2', montant: '5000',  description: 'Lancement bêta',  contrepartie_don: 'Accès premium 1 an',   rendement_invest: '8'  },
      { label: 'Palier 3', montant: '30000', description: 'Déploiement',     contrepartie_don: 'Parts dans la SAS',    rendement_invest: '12' },
    ],
  },
];

// ── Lecture ───────────────────────────────────────────────────────────────────
export function getProjects(): ProProjet[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return BASE;
    const saved: ProProjet[] = JSON.parse(raw);
    // Fusionner : les projets sauvegardés ont priorité sur BASE (même id)
    const savedIds = new Set(saved.map(p => p.id));
    const baseOnly = BASE.filter(p => !savedIds.has(p.id));
    return [...saved, ...baseOnly];
  } catch {
    return BASE;
  }
}

// ── Écriture ──────────────────────────────────────────────────────────────────
export function saveProjects(projects: ProProjet[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(projects));
    // Déclencher un événement pour notifier les autres écrans (même onglet)
    window.dispatchEvent(new CustomEvent('kauri_pro_update'));
  } catch { /* ignore */ }
}

// ── Helpers stats ─────────────────────────────────────────────────────────────
export function getProStats(projects: ProProjet[]) {
  return {
    totalLeve:     projects.reduce((s, p) => s + p.leve, 0),
    objectifGlobal:projects.reduce((s, p) => s + p.objectif, 0),
    totalBackers:  projects.reduce((s, p) => s + p.backers, 0),
    projetsActifs: projects.filter(p => p.statut === 'En cours').length,
    projetsTotal:  projects.length,
  };
}

// ── Ajouter un projet (depuis le formulaire) ──────────────────────────────────
export function addProject(projet: ProProjet): void {
  const existing = getProjects();
  // Éviter les doublons
  if (existing.find(p => p.id === projet.id)) return;
  saveProjects([projet, ...existing]);
}

// ── Migrer depuis l'ancien store (rétrocompat) ────────────────────────────────
export function migrateOldStore(): void {
  try {
    const old = localStorage.getItem('kauri_pro_projects');
    if (!old) return;
    const oldProjects: ProProjet[] = JSON.parse(old);
    const current = getProjects();
    const currentIds = new Set(current.map(p => p.id));
    const toMerge = oldProjects.filter(p => !currentIds.has(p.id));
    if (toMerge.length > 0) saveProjects([...toMerge, ...current]);
    localStorage.removeItem('kauri_pro_projects');
  } catch { /* ignore */ }
}
