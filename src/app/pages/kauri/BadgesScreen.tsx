import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TEAL = '#006D77';
const GOLD = '#D4AF37';
const TERRA = '#B05B3B';
const BG = '#F4F6F8';
const CARD = '#FFFFFF';
const TEXT_P = '#0F172A';
const TEXT_S = '#64748B';
const BORDER = '#E8ECF0';

interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  detail: string;
  color: string;
  bg: string;
  unlocked: boolean;
  date?: string;
  category: string;
  xp: number;
}

const BADGES: Badge[] = [
  {
    id: 'premier-pas',
    emoji: '⭐',
    name: 'Premier Pas',
    description: 'Premier dépôt effectué',
    detail: 'Vous avez effectué votre premier dépôt sur KAURI. Le début de votre aventure financière diaspora commence ici.',
    color: GOLD,
    bg: `${GOLD}18`,
    unlocked: true,
    date: 'Obtenu le 12 jan. 2024',
    category: 'Épargne',
    xp: 50,
  },
  {
    id: 'citoyen-verifie',
    emoji: '🛡️',
    name: 'Citoyen Vérifié',
    description: 'KYC complet et validé',
    detail: "Votre identité a été vérifiée avec succès. Vous accédez à toutes les fonctionnalités KAURI sans restriction.",
    color: TEAL,
    bg: `${TEAL}14`,
    unlocked: true,
    date: 'Obtenu le 15 jan. 2024',
    category: 'Identité',
    xp: 100,
  },
  {
    id: 'tontineur-actif',
    emoji: '🎯',
    name: 'Tontineur Actif',
    description: 'Membre de 3+ tontines simultanément',
    detail: 'Vous participez activement à au moins 3 tontines en même temps. Votre engagement communautaire est exemplaire.',
    color: TERRA,
    bg: `${TERRA}14`,
    unlocked: true,
    date: 'Obtenu le 3 mars 2024',
    category: 'Tontines',
    xp: 150,
  },
  {
    id: 'diaspora-connect',
    emoji: '🌍',
    name: 'Diaspora Connect',
    description: 'Profil social 100% complété',
    detail: 'Votre profil Hub Social est entièrement renseigné. Vous êtes visible et connecté à la communauté KAURI.',
    color: '#8B5CF6',
    bg: '#8B5CF614',
    unlocked: true,
    date: 'Obtenu le 20 mars 2024',
    category: 'Social',
    xp: 75,
  },
  {
    id: 'epargnant-regulier',
    emoji: '💎',
    name: 'Épargnant Régulier',
    description: '6 mois consécutifs sans interruption',
    detail: "Vous avez cotisé sans interruption pendant 6 mois consécutifs dans vos tontines. La régularité est la clé de la richesse.",
    color: '#0891B2',
    bg: '#0891B214',
    unlocked: true,
    date: 'Obtenu le 1 juil. 2024',
    category: 'Épargne',
    xp: 200,
  },
  {
    id: 'investisseur-avise',
    emoji: '📈',
    name: 'Investisseur Avisé',
    description: 'Premier investissement RWA validé',
    detail: 'Vous avez effectué votre premier investissement dans un actif réel (RWA). Bienvenue dans le monde de la finance impact.',
    color: '#059669',
    bg: '#05966914',
    unlocked: true,
    date: 'Obtenu le 15 août 2024',
    category: 'Investissement',
    xp: 250,
  },
  {
    id: 'reseau-solide',
    emoji: '🤝',
    name: 'Réseau Solide',
    description: '10 parrainages validés',
    detail: 'Vous avez parrainé 10 membres qui ont complété leur inscription. Votre réseau grandit et enrichit la communauté.',
    color: GOLD,
    bg: `${GOLD}18`,
    unlocked: true,
    date: 'Obtenu le 5 sept. 2024',
    category: 'Communauté',
    xp: 300,
  },
  {
    id: 'contributeur-or',
    emoji: '🥇',
    name: 'Contributeur Or',
    description: '1 000€+ cotisés en tontine',
    detail: "Vous avez cumulé plus de 1 000€ de cotisations en tontine depuis votre inscription. Un engagement financier remarquable.",
    color: GOLD,
    bg: `${GOLD}18`,
    unlocked: true,
    date: 'Obtenu le 12 oct. 2024',
    category: 'Épargne',
    xp: 350,
  },
  {
    id: 'ambassadeur',
    emoji: '🌟',
    name: 'Ambassadeur',
    description: 'Parrainage de 5 membres actifs',
    detail: 'Cinq membres parrainés par vous sont actifs sur KAURI depuis au moins 30 jours. Vous êtes un pilier de la diaspora.',
    color: TERRA,
    bg: `${TERRA}14`,
    unlocked: true,
    date: 'Obtenu le 20 oct. 2024',
    category: 'Communauté',
    xp: 200,
  },
  {
    id: 'multi-projets',
    emoji: '🚀',
    name: 'Multi-Projets',
    description: '3+ projets d\'impact financés',
    detail: "Vous avez participé au financement d'au moins 3 projets d'impact différents. Vous contribuez à l'économie de la diaspora.",
    color: '#7C3AED',
    bg: '#7C3AED14',
    unlocked: true,
    date: 'Obtenu le 8 nov. 2024',
    category: 'Investissement',
    xp: 400,
  },
  {
    id: 'fidele',
    emoji: '🏆',
    name: 'Membre Fidèle',
    description: '1 an sur KAURI',
    detail: "Cela fait exactement un an que vous avez rejoint KAURI. Votre fidélité est récompensée par des avantages exclusifs.",
    color: GOLD,
    bg: `${GOLD}18`,
    unlocked: true,
    date: 'Obtenu le 12 jan. 2025',
    category: 'Fidélité',
    xp: 500,
  },
  {
    id: 'grand-cercle',
    emoji: '👑',
    name: 'Grand Cercle',
    description: 'Tontine de 20+ membres complétée',
    detail: "Vous avez mené à terme une tontine avec plus de 20 participants. Un exploit de coordination et de confiance communautaire.",
    color: GOLD,
    bg: `${GOLD}18`,
    unlocked: true,
    date: 'Obtenu le 28 déc. 2024',
    category: 'Tontines',
    xp: 600,
  },
];

const CATEGORIES = ['Tous', 'Épargne', 'Tontines', 'Investissement', 'Communauté', 'Social', 'Identité', 'Fidélité'];

const totalXP = BADGES.filter(b => b.unlocked).reduce((sum, b) => sum + b.xp, 0);

export function BadgesScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Badge | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filtered = activeCategory === 'Tous'
    ? BADGES
    : BADGES.filter(b => b.category === activeCategory);

  const unlocked = BADGES.filter(b => b.unlocked).length;

  return (
    <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #004E57 100%)`, padding: '14px 16px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Motif */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
          <svg width="100%" height="100%" viewBox="0 0 430 180">
            {[40, 80, 120].map((r, i) => (
              <circle key={i} cx="215" cy="0" r={r} fill="none" stroke={GOLD} strokeWidth="1" />
            ))}
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 20 }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>

          <div style={{ textAlign: 'center', paddingBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🏅</div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Mes Badges</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 16px' }}>
              {unlocked} obtenus sur {BADGES.length}
            </p>

            {/* XP total */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 16px' }}>
              <span style={{ color: GOLD, fontSize: 14, fontWeight: 700 }}>⚡ {totalXP} XP</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Total accumulé</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 6, margin: '0 0 16px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(unlocked / BADGES.length) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, #F59E0B)`, borderRadius: 8, transition: 'width 0.8s ease' }} />
          </div>
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ padding: '12px 16px', background: CARD, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 20,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeCategory === cat ? TEAL : `${TEAL}12`,
                color: activeCategory === cat ? '#fff' : TEAL,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de badges */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filtered.map((badge, i) => (
            <motion.button
              key={badge.id}
              onClick={() => setSelected(badge)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                background: CARD,
                border: `1.5px solid ${badge.unlocked ? badge.color + '40' : BORDER}`,
                borderRadius: 16,
                padding: '14px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                opacity: badge.unlocked ? 1 : 0.5,
                boxShadow: badge.unlocked ? `0 2px 8px ${badge.color}20` : 'none',
              }}
            >
              {!badge.unlocked && (
                <div style={{ position: 'absolute', top: 6, right: 6 }}>
                  <Lock size={10} color={TEXT_S} />
                </div>
              )}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: badge.unlocked ? badge.bg : '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontSize: 22,
                  filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                }}
              >
                {badge.emoji}
              </div>
              <p style={{ color: badge.unlocked ? TEXT_P : TEXT_S, fontSize: 10, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                {badge.name}
              </p>
              {badge.unlocked && (
                <p style={{ color: badge.color, fontSize: 9, fontWeight: 700, marginTop: 3 }}>+{badge.xp} XP</p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal détail badge */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: 430,
                background: CARD,
                borderRadius: '24px 24px 0 0',
                zIndex: 101,
                padding: '0 24px 40px',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER }} />
              </div>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color={TEXT_S} />
              </button>

              {/* Contenu */}
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: selected.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 40,
                    boxShadow: `0 8px 24px ${selected.color}30`,
                  }}
                >
                  {selected.emoji}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${selected.color}14`, borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
                  <span style={{ color: selected.color, fontSize: 11, fontWeight: 700 }}>{selected.category}</span>
                </div>

                <h2 style={{ color: TEXT_P, fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{selected.name}</h2>
                <p style={{ color: TEXT_S, fontSize: 13, margin: '0 0 16px' }}>{selected.description}</p>

                <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 16, textAlign: 'left' }}>
                  <p style={{ color: TEXT_P, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{selected.detail}</p>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <div style={{ background: `${selected.color}14`, borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
                    <p style={{ color: selected.color, fontSize: 18, fontWeight: 800, margin: '0 0 2px' }}>+{selected.xp}</p>
                    <p style={{ color: TEXT_S, fontSize: 11, margin: 0 }}>XP gagné</p>
                  </div>
                  {selected.date && (
                    <div style={{ background: '#F1F5F9', borderRadius: 12, padding: '10px 20px', textAlign: 'center', flex: 1 }}>
                      <p style={{ color: TEXT_P, fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>{selected.date}</p>
                      <p style={{ color: TEXT_S, fontSize: 11, margin: 0 }}>Date d&#39;obtention</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
