import {
  ArrowLeft, Download, Shield, CheckCircle2, Clock, AlertTriangle,
  FileText, Lock, Cpu, ChevronRight, X, ExternalLink, Users,
  TrendingUp, Copy, Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const TEAL = '#0A847E';
const TEAL_DARK = '#064E4A';
const GOLD = '#D4AF37';

// ── Types ─────────────────────────────────────────────────────────────────────

type ContractStatus = 'signed' | 'pending' | 'expired';
type ContractCategory = 'tontine_privee' | 'tontine_publique' | 'investissement';

interface ContractParty {
  name: string;
  role: string;
  address?: string;
}

interface ContractData {
  id: string;
  ref: string;
  txHash: string;
  network: string;
  category: ContractCategory;
  title: string;
  subtitle: string;
  signedAt: string;
  expiresAt: string;
  status: ContractStatus;
  amount: string;
  currency: string;
  parties: ContractParty[];
  clauses: { title: string; body: string }[];
  penaltyRate: string;
  jurisdiction: string;
  signatureHash: string;
}

// ── Mock contracts ─────────────────────────────────────────────────────────────

const CONTRACTS: ContractData[] = [
  {
    id: 'c1',
    ref: 'KR-TON-PRV-20260315-001',
    txHash: '0x7f3a9b2c4d1e8f0a5c6b3d9e2f1a4b7c8d5e6f0a3b2c1d4e5f6a7b8c9d0e1f2',
    network: 'Polygon (MATIC)',
    category: 'tontine_privee',
    title: 'Tontine Privée — Cercle Famille',
    subtitle: 'Tontine de solidarité familiale',
    signedAt: '15 mars 2026',
    expiresAt: '15 mars 2027',
    status: 'signed',
    amount: '150 000 FCFA',
    currency: 'FCFA',
    parties: [
      { name: 'Jean Dupont', role: 'Administrateur', address: '0x4f2A...3c8E' },
      { name: 'Marie Kouassi', role: 'Membre', address: '0x9bC1...7aD2' },
      { name: 'Paul Traoré', role: 'Membre', address: '0x1eF3...0b5C' },
      { name: 'KAURI Finance SAS', role: 'Opérateur Plateforme', address: '0xKauri...Platform' },
    ],
    clauses: [
      {
        title: 'Article 1 — Objet du contrat',
        body: "Le présent Smart Contract constitue un accord juridiquement contraignant entre les membres d'un cercle de tontine privée enregistré sur la blockchain Polygon. Il régit les obligations de cotisation, la rotation des fonds et les mécanismes de médiation en cas de litige.",
      },
      {
        title: 'Article 2 — Obligations de cotisation',
        body: "Chaque membre s'engage à verser 150 000 FCFA par cycle mensuel. Le versement doit intervenir au plus tard le 5 de chaque mois. Toute cotisation dépassant ce délai est considérée comme un défaut de paiement entraînant l'activation automatique des pénalités prévues à l'Article 5.",
      },
      {
        title: 'Article 3 — Smart Contract & Transparence Blockchain',
        body: "Les fonds sont déposés dans un contrat intelligent audité et déployé sur la blockchain Polygon. Toute transaction est immutable, traçable et publiquement vérifiable. KAURI Finance agit en tant qu'opérateur neutre et ne peut accéder aux fonds sans signature multi-parties des membres.",
      },
      {
        title: 'Article 4 — Responsabilité juridique',
        body: "Chaque signataire reconnaît expressément engager sa responsabilité civile et financière. En cas de défaut persistant, KAURI Finance se réserve le droit de transmettre le dossier à un service de recouvrement agréé et/ou à la juridiction compétente du lieu de résidence du débiteur, conformément aux dispositions légales en vigueur.",
      },
      {
        title: "Article 5 — Pénalités pour défaut de paiement",
        body: "En cas de retard de paiement au-delà du délai de grâce de 48 heures : (i) une pénalité de 5% du montant dû est appliquée automatiquement ; (ii) le membre concerné est suspendu de la rotation jusqu'à régularisation complète ; (iii) après 2 défauts consécutifs, le membre est exclu définitivement et son dossier transmis au médiateur KAURI.",
      },
      {
        title: 'Article 6 — Résolution des litiges',
        body: "Tout litige est soumis en premier lieu au système de médiation KAURI. À défaut de résolution amiable sous 15 jours, les parties s'engagent à recourir à l'arbitrage selon les règles de la Cour d'Arbitrage de Paris (CMAP). La langue de procédure est le français.",
      },
    ],
    penaltyRate: '5%',
    jurisdiction: 'France — Tribunal de Paris',
    signatureHash: 'SHA-256: 8f3a9b2c4d1e8f0a5c',
  },
  {
    id: 'c2',
    ref: 'KR-TON-PUB-20260201-047',
    txHash: '0x3c8d5e6f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    network: 'Polygon (MATIC)',
    category: 'tontine_publique',
    title: 'Tontine Publique — Épargne Diaspora',
    subtitle: 'Tontine communautaire ouverte',
    signedAt: '1 février 2026',
    expiresAt: '1 février 2027',
    status: 'signed',
    amount: '50 000 FCFA',
    currency: 'FCFA',
    parties: [
      { name: 'Jean Dupont', role: 'Participant', address: '0x4f2A...3c8E' },
      { name: 'Cercle Diaspora Ouest-Africaine', role: 'Organisateur', address: '0xOrg...5D2F' },
      { name: 'KAURI Finance SAS', role: 'Opérateur Plateforme', address: '0xKauri...Platform' },
    ],
    clauses: [
      {
        title: 'Article 1 — Adhésion et conditions d\'entrée',
        body: "Le présent contrat est conclu entre le Participant et le cercle de tontine publique référencé ci-dessus. L'adhésion est conditionnée à la vérification d'identité (KYC niveau 2), à l'acceptation du présent Smart Contract et au dépôt de la caution initiale.",
      },
      {
        title: 'Article 2 — Règles de cotisation et rotation',
        body: "Le Participant s'engage à verser 50 000 FCFA par cycle bimensuel. L'ordre de rotation des bénéficiaires est déterminé aléatoirement par le Smart Contract au démarrage du cycle et est irréversible. Toute tentative de manipulation de l'ordre de tirage constitue une fraude passible de poursuites.",
      },
      {
        title: 'Article 3 — Mécanisme de garantie blockchain',
        body: "Un dépôt de garantie équivalent à une cotisation est bloqué dans le Smart Contract pour la durée du cycle. Ce dépôt est restitué à la fin du cycle si le Participant a honoré l'ensemble de ses obligations. En cas de défaut, le dépôt est utilisé en priorité pour combler le manque.",
      },
      {
        title: 'Article 4 — Responsabilité et sanctions',
        body: "Le Participant reconnaît que tout défaut de paiement cause un préjudice direct et mesurable aux autres membres du cercle. Il s'engage expressément à indemniser ces membres selon les modalités de l'Article 5. La récidive expose le Participant à une inscription sur la liste noire KAURI, rendant impossible toute adhésion future à un cercle sur la plateforme.",
      },
      {
        title: "Article 5 — Pénalités et recouvrement",
        body: "Défaut simple (< 72h) : pénalité de 3% du montant dû. Défaut grave (> 72h) : pénalité de 8% + suspension. Défaut répété (2e occurrence) : exclusion + transmission au partenaire de recouvrement KAURI + signalement aux agences de crédit partenaires. Les frais de recouvrement sont intégralement à la charge du débiteur.",
      },
      {
        title: 'Article 6 — Confidentialité et données',
        body: "Les données personnelles des Participants sont traitées conformément au RGPD. Seules les adresses de portefeuille et les montants de transactions sont visibles on-chain. L'identité réelle des Participants est protégée et ne peut être divulguée qu'en cas de procédure judiciaire.",
      },
    ],
    penaltyRate: '3–8%',
    jurisdiction: 'France — Tribunal de Paris',
    signatureHash: 'SHA-256: 3c8d5e6f0a1b2c3d4e',
  },
  {
    id: 'c3',
    ref: 'KR-INV-20260410-012',
    txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    network: 'Ethereum (ETH)',
    category: 'investissement',
    title: 'Contrat d\'Investissement — SolarPay Sénégal',
    subtitle: 'Projet d\'impact — Énergie solaire',
    signedAt: '10 avril 2026',
    expiresAt: '10 avril 2029',
    status: 'signed',
    amount: '500 €',
    currency: 'EUR',
    parties: [
      { name: 'Jean Dupont', role: 'Investisseur', address: '0x4f2A...3c8E' },
      { name: 'SolarPay Sénégal SARL', role: 'Porteur de projet', address: '0xSolar...9F3C' },
      { name: 'KAURI Finance SAS', role: 'Plateforme de financement', address: '0xKauri...Platform' },
    ],
    clauses: [
      {
        title: "Article 1 — Nature de l'investissement",
        body: "Le Participant investit 500 EUR dans le projet SolarPay Sénégal via la plateforme KAURI Finance, réglementée par l'AMF (Autorité des Marchés Financiers). Cet investissement prend la forme d'un token RWA (Real World Asset) représentatif d'une quote-part du projet, émis sur la blockchain Ethereum.",
      },
      {
        title: 'Article 2 — Rendement et distribution',
        body: "Le rendement cible est de 9,5% annuel, distribué trimestriellement en EUR sur le portefeuille KAURI de l'Investisseur. Les distributions sont automatisées via Smart Contract et ne peuvent être retenues ou retardées sans accord multi-signatures des parties prenantes.",
      },
      {
        title: 'Article 3 — Risques et avertissements légaux',
        body: "L'Investisseur reconnaît avoir été informé que tout investissement comporte un risque de perte en capital. Le rendement cible n'est pas garanti. Les performances passées ne préjugent pas des performances futures. L'Investisseur atteste disposer des ressources financières suffisantes pour supporter une perte totale de son investissement.",
      },
      {
        title: "Article 4 — Obligations du porteur de projet",
        body: "SolarPay Sénégal s'engage à : (i) publier un rapport de progression trimestriel sur la plateforme KAURI ; (ii) maintenir un compte séquestre couvrant 6 mois de distributions ; (iii) soumettre ses comptes à un audit annuel indépendant. Le non-respect de ces obligations constitue un événement de défaut activant le mécanisme de protection des Investisseurs.",
      },
      {
        title: 'Article 5 — Défaut du porteur et protection des investisseurs',
        body: "En cas de défaut de paiement du porteur de projet : le Smart Contract active automatiquement le mécanisme de protection, les fonds du compte séquestre sont distribués aux Investisseurs au prorata de leur participation, et KAURI Finance engage une procédure de médiation puis, si nécessaire, de recouvrement judiciaire aux frais du porteur défaillant.",
      },
      {
        title: "Article 6 — Sortie et liquidité",
        body: "Les tokens RWA peuvent être cédés sur le marché secondaire KAURI après une période de blocage de 6 mois. KAURI Finance garantit une liquidité minimale dans la limite de 10% de la valeur totale du projet par mois. Au terme du contrat (3 ans), le remboursement du principal est effectué dans un délai de 30 jours ouvrés.",
      },
    ],
    penaltyRate: 'Séquestre activé',
    jurisdiction: 'France — AMF + Tribunal de Commerce de Paris',
    signatureHash: 'SHA-256: a1b2c3d4e5f6a7b8c9',
  },
  {
    id: 'c4',
    ref: 'KR-INV-20260501-031',
    txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    network: 'Polygon (MATIC)',
    category: 'investissement',
    title: 'Contrat d\'Investissement — AgroTech CI',
    subtitle: 'Projet d\'impact — Agriculture durable',
    signedAt: '1 mai 2026',
    expiresAt: '1 mai 2028',
    status: 'pending',
    amount: '250 €',
    currency: 'EUR',
    parties: [
      { name: 'Jean Dupont', role: 'Investisseur', address: '0x4f2A...3c8E' },
      { name: 'AgroTech CI SA', role: 'Porteur de projet', address: '0xAgro...2B1A' },
      { name: 'KAURI Finance SAS', role: 'Plateforme de financement', address: '0xKauri...Platform' },
    ],
    clauses: [
      {
        title: "Article 1 — Nature de l'investissement",
        body: "Investissement de 250 EUR dans le projet AgroTech CI via KAURI Finance. Token RWA émis sur Polygon représentant une quote-part du projet de modernisation agricole en Côte d'Ivoire.",
      },
      {
        title: 'Article 2 — Rendement et distribution',
        body: 'Rendement cible de 11% annuel. Distributions semestrielles automatisées via Smart Contract.',
      },
      {
        title: 'Article 3 — Risques',
        body: "Investissement à risque. Capital non garanti. L'Investisseur atteste avoir pris connaissance du Document d'Informations Clés (DIC) réglementaire.",
      },
      {
        title: 'Article 4 — Obligations et défaut',
        body: "En cas de non-exécution par le porteur, le mécanisme de protection est identique à celui prévu au contrat standard KAURI Investissement (version 2.1).",
      },
    ],
    penaltyRate: 'Séquestre activé',
    jurisdiction: 'France — AMF + Tribunal de Commerce de Paris',
    signatureHash: 'SHA-256: b2c3d4e5f6a7b8c9d0',
  },
];

// ── Category meta ─────────────────────────────────────────────────────────────

function categoryMeta(cat: ContractCategory) {
  if (cat === 'tontine_privee') return { label: 'Tontine Privée', color: TEAL, bg: `${TEAL}15`, icon: Lock };
  if (cat === 'tontine_publique') return { label: 'Tontine Publique', color: '#3B82F6', bg: '#3B82F615', icon: Users };
  return { label: 'Investissement', color: GOLD, bg: `${GOLD}20`, icon: TrendingUp };
}

function statusMeta(status: ContractStatus) {
  if (status === 'signed') return { label: 'Signé', color: '#059669', bg: '#05966918', icon: CheckCircle2 };
  if (status === 'pending') return { label: 'En attente', color: '#D97706', bg: '#D9770618', icon: Clock };
  return { label: 'Expiré', color: '#DC2626', bg: '#DC262618', icon: AlertTriangle };
}

// ── Blockchain badge ──────────────────────────────────────────────────────────

function BlockchainBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d1f3c 100%)', border: '1px solid rgba(139,92,246,0.5)' }}>
      <Cpu style={{ width: 10, height: 10, color: '#A78BFA' }} />
      <span className="text-xs font-bold tracking-wide" style={{ color: '#A78BFA', fontSize: 9 }}>SMART CONTRACT</span>
      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 4px #34D399' }} />
    </div>
  );
}

// ── Legal responsibility badge ────────────────────────────────────────────────

function LegalBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#FEF2F218', border: '1px solid rgba(239,68,68,0.35)' }}>
      <Shield style={{ width: 10, height: 10, color: '#EF4444' }} />
      <span className="text-xs font-bold" style={{ color: '#EF4444', fontSize: 9 }}>RESPONSABILITÉ JURIDIQUE</span>
    </div>
  );
}

// ── Contract card ─────────────────────────────────────────────────────────────

function ContractCard({
  contract,
  card,
  border,
  textP,
  textS,
  onOpen,
}: {
  contract: ContractData;
  card: string;
  border: string;
  textP: string;
  textS: string;
  onOpen: () => void;
}) {
  const cat = categoryMeta(contract.category);
  const st = statusMeta(contract.status);
  const CatIcon = cat.icon;
  const StIcon = st.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: card, border: `1.5px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />

      <div className="p-4">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <BlockchainBadge />
          <LegalBadge />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.bg }}>
            <CatIcon style={{ width: 21, height: 21, color: cat.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight" style={{ color: textP }}>{contract.title}</p>
            <p className="text-xs mt-0.5" style={{ color: textS }}>{contract.subtitle}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg }}>
            <StIcon style={{ width: 11, height: 11, color: st.color }} />
            <span className="text-xs font-semibold" style={{ color: st.color }}>{st.label}</span>
          </div>
          <span className="text-sm font-bold" style={{ color: textP }}>{contract.amount}</span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-3 rounded-xl" style={{ backgroundColor: `${TEAL}08`, border: `1px solid ${TEAL}18` }}>
          <div>
            <p className="text-xs" style={{ color: textS }}>Signé le</p>
            <p className="text-xs font-semibold" style={{ color: textP }}>{contract.signedAt}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: textS }}>Expire le</p>
            <p className="text-xs font-semibold" style={{ color: textP }}>{contract.expiresAt}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs" style={{ color: textS }}>Réf.</p>
            <p className="text-xs font-mono font-semibold" style={{ color: textP, fontSize: 10 }}>{contract.ref}</p>
          </div>
        </div>

        {/* TX hash truncated */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: '#1a0533', border: '1px solid rgba(139,92,246,0.3)' }}>
          <Cpu style={{ width: 12, height: 12, color: '#A78BFA', flexShrink: 0 }} />
          <span className="text-xs font-mono flex-1 truncate" style={{ color: '#C4B5FD', fontSize: 10 }}>
            {contract.txHash.slice(0, 20)}…{contract.txHash.slice(-8)}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: '#34D399', fontSize: 9, fontWeight: 700 }}>
            {contract.network.split(' ')[0].toUpperCase()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: TEAL, color: '#fff' }}
          >
            <FileText style={{ width: 14, height: 14 }} />
            Voir le contrat
          </button>
          <button
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: `${TEAL}14`, color: TEAL, border: `1.5px solid ${TEAL}30` }}
          >
            <Download style={{ width: 14, height: 14 }} />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Contract detail modal ─────────────────────────────────────────────────────

function ContractModal({
  contract,
  isDarkMode,
  onClose,
}: {
  contract: ContractData;
  isDarkMode: boolean;
  onClose: () => void;
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const card = isDarkMode ? '#1E293B' : '#ffffff';
  const bg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const border = isDarkMode ? '#334155' : '#E8EDF2';
  const textP = isDarkMode ? '#ffffff' : '#0F172A';
  const textS = isDarkMode ? '#94A3B8' : '#64748B';
  const cat = categoryMeta(contract.category);
  const st = statusMeta(contract.status);
  const StIcon = st.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(contract.txHash).catch(() => null);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: bg, maxWidth: 448, left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Header */}
      <div
        className="px-5 pt-14 pb-5 flex-shrink-0"
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, borderRadius: '0 0 24px 24px' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <X style={{ width: 16, height: 16, color: '#fff' }} />
          </button>
          <div className="flex-1">
            <p className="text-white/70 text-xs">Contrat numérique</p>
            <p className="text-white font-bold text-base leading-tight">{contract.title}</p>
          </div>
        </div>

        {/* Status + blockchain pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <BlockchainBadge />
          <LegalBadge />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg }}>
            <StIcon style={{ width: 11, height: 11, color: st.color }} />
            <span className="text-xs font-semibold" style={{ color: st.color }}>{st.label}</span>
          </div>
        </div>

        {/* Key figures */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p className="text-white/60 text-xs mb-1">Montant</p>
            <p className="text-white font-bold text-base">{contract.amount}</p>
          </div>
          <div className="rounded-2xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p className="text-white/60 text-xs mb-1">Pénalité défaut</p>
            <p className="font-bold text-base" style={{ color: '#FCA5A5' }}>{contract.penaltyRate}</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ scrollbarWidth: 'none' }}>

        {/* On-chain info */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(139,92,246,0.35)', backgroundColor: '#1a0533' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
            <Cpu style={{ width: 14, height: 14, color: '#A78BFA' }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#A78BFA' }}>INFORMATIONS ON-CHAIN</span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>Hash de transaction</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono flex-1 break-all" style={{ color: '#C4B5FD', lineHeight: 1.6 }}>
                  {contract.txHash}
                </p>
                <button onClick={handleCopy} className="flex-shrink-0 p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(167,139,250,0.15)' }}>
                  {copiedHash
                    ? <CheckCircle2 style={{ width: 14, height: 14, color: '#34D399' }} />
                    : <Copy style={{ width: 14, height: 14, color: '#A78BFA' }} />
                  }
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Réseau</p>
                <p className="text-xs font-semibold" style={{ color: '#E2E8F0' }}>{contract.network}</p>
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Empreinte</p>
                <p className="text-xs font-mono" style={{ color: '#34D399', fontSize: 10 }}>{contract.signatureHash}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="rounded-2xl" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${border}` }}>
            <Users style={{ width: 14, height: 14, color: TEAL }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: TEAL }}>Parties signataires</span>
          </div>
          <div className="divide-y" style={{ '--tw-divide-color': border } as React.CSSProperties}>
            {contract.parties.map((p, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: textP }}>{p.name}</p>
                  <p className="text-xs" style={{ color: textS }}>{p.role}</p>
                </div>
                {p.address && (
                  <p className="text-xs font-mono" style={{ color: textS, fontSize: 10 }}>{p.address}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal warning banner */}
        <div className="rounded-2xl p-4 flex gap-3" style={{ background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)', border: '1.5px solid rgba(239,68,68,0.25)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
            <Shield style={{ width: 18, height: 18, color: '#DC2626' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: '#DC2626' }}>Responsabilité juridique engagée</p>
            <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
              En signant ce contrat, vous avez reconnu et accepté d'engager votre responsabilité civile et financière. Tout manquement à vos obligations peut entraîner des pénalités automatiques, une exclusion du cercle et/ou des poursuites judiciaires devant{' '}
              <span style={{ fontWeight: 700 }}>{contract.jurisdiction}</span>.
            </p>
          </div>
        </div>

        {/* Clauses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText style={{ width: 14, height: 14, color: textS }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: textS }}>Clauses contractuelles</p>
          </div>
          <div className="space-y-3">
            {contract.clauses.map((clause, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${TEAL}08`, borderBottom: `1px solid ${TEAL}18` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: TEAL, color: '#fff' }}>
                    {i + 1}
                  </div>
                  <p className="text-xs font-bold" style={{ color: textP }}>{clause.title}</p>
                </div>
                <p className="px-4 py-3 text-xs leading-relaxed" style={{ color: textS }}>
                  {clause.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Jurisdiction */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: card, border: `1.5px solid ${border}` }}>
          <Info style={{ width: 16, height: 16, color: textS, flexShrink: 0 }} />
          <div>
            <p className="text-xs" style={{ color: textS }}>Juridiction compétente</p>
            <p className="text-sm font-semibold" style={{ color: textP }}>{contract.jurisdiction}</p>
          </div>
        </div>

        {/* Download + verify */}
        <div className="flex gap-2.5 pb-6">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`, color: '#fff', boxShadow: `0 4px 14px ${TEAL}40` }}
          >
            <Download style={{ width: 15, height: 15 }} />
            Télécharger PDF
          </button>
          <button
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: '#1a0533', color: '#A78BFA', border: '1.5px solid rgba(139,92,246,0.35)' }}
          >
            <ExternalLink style={{ width: 15, height: 15 }} />
            Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function CoffreNumeriqueScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [filter, setFilter] = useState<'all' | ContractCategory>('all');

  const bg     = isDarkMode ? '#0F172A' : '#F8FAFC';
  const card   = isDarkMode ? '#1E293B' : '#ffffff';
  const border = isDarkMode ? '#334155' : '#E8EDF2';
  const textP  = isDarkMode ? '#ffffff' : '#0F172A';
  const textS  = isDarkMode ? '#94A3B8' : '#64748B';

  const filtered = filter === 'all'
    ? CONTRACTS
    : CONTRACTS.filter(c => c.category === filter);

  const signedCount = CONTRACTS.filter(c => c.status === 'signed').length;
  const pendingCount = CONTRACTS.filter(c => c.status === 'pending').length;

  const filters: { id: 'all' | ContractCategory; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'tontine_privee', label: 'Privées' },
    { id: 'tontine_publique', label: 'Publiques' },
    { id: 'investissement', label: 'Investissement' },
  ];

  return (
    <div className="min-h-screen pb-8 transition-colors" style={{ backgroundColor: bg }}>

      {/* ── HEADER ── */}
      <div
        className="px-5 pt-14 pb-6 relative overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, borderRadius: '0 0 28px 28px' }}
      >
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -30, width: 140, height: 140, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div className="relative z-10">
          {/* Nav row */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate('/kauri/profil-particulier')}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <ArrowLeft style={{ width: 16, height: 16, color: '#fff' }} />
            </button>
            <div className="flex-1">
              <p className="text-white/70 text-xs">Préférences</p>
              <h1 className="text-white font-bold text-lg">Coffre-fort numérique</h1>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Lock style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Contrats', value: CONTRACTS.length, color: '#fff' },
              { label: 'Signés', value: signedCount, color: '#34D399' },
              { label: 'En attente', value: pendingCount, color: '#FCD34D' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECURITY NOTICE ── */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ backgroundColor: '#1a053325', border: '1.5px solid rgba(139,92,246,0.3)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
            <Cpu style={{ width: 16, height: 16, color: '#A78BFA' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: isDarkMode ? '#C4B5FD' : '#6D28D9' }}>Contrats sécurisés par blockchain</p>
            <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>Vos documents sont immuables et vérifiables on-chain. Aucune modification n'est possible après signature.</p>
          </div>
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="px-5 pt-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: filter === f.id ? TEAL : (isDarkMode ? '#1E293B' : '#fff'),
              color: filter === f.id ? '#fff' : textS,
              border: `1.5px solid ${filter === f.id ? TEAL : border}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── CONTRACT LIST ── */}
      <div className="px-5 pt-4 space-y-4">
        {filtered.map(contract => (
          <ContractCard
            key={contract.id}
            contract={contract}
            card={card}
            border={border}
            textP={textP}
            textS={textS}
            onOpen={() => setSelectedContract(contract)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ backgroundColor: `${TEAL}14` }}>
              <FileText style={{ width: 28, height: 28, color: TEAL }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: textP }}>Aucun contrat dans cette catégorie</p>
            <p className="text-xs mt-1" style={{ color: textS }}>Rejoignez une tontine ou investissez pour voir vos contrats ici.</p>
          </div>
        )}
      </div>

      {/* ── CONTRACT MODAL ── */}
      {selectedContract && (
        <ContractModal
          contract={selectedContract}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}
