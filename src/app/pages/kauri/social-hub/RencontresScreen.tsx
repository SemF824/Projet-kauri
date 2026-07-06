import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'motion/react';
import { X, Star, MapPin, Shield, MessageCircle, RotateCcw, ChevronDown } from 'lucide-react';

function HandshakeIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" style={style} aria-hidden="true">
      {/* Left arm */}
      <path d="M4 22 L16 22 L22 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right arm */}
      <path d="M44 22 L32 22 L26 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left hand fingers */}
      <path d="M22 16 L24 14 L26 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Clasped hands center */}
      <path d="M16 22 C16 28 20 32 24 32 C28 32 32 28 32 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M19 25 L29 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 29 L28 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Wrists connecting */}
      <path d="M4 26 L16 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 26 L32 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const TEAL = '#0A847E';
const GOLD = '#D4AF37';
const BG   = '#002E38';   // teal profond — fond principal
const BG2  = '#003A44';   // teal légèrement plus clair — header / boutons

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  initials: string;
  overlayGradient: string;
  trustScore: number;
  bio: string;
  tags: string[];
  profession: string;
  distance: string;
  interests: string[];
  lookingFor: string;
}

const PROFILES: Profile[] = [
  {
    id: '1', name: 'Sophie Laurent', age: 32, location: 'Paris, France',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop&auto=format',
    initials: 'SL',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)',
    trustScore: 94, distance: '2 km',
    bio: 'Entrepreneure passionnée par l\'innovation sociale et le développement durable. Je cherche des partenaires pour co-investir dans des projets à impact positif.',
    tags: ['Cherche Associé', 'Impact Social', 'Tech & Innovation'],
    profession: 'CEO @ GreenTech Solutions',
    interests: ['🌱 Impact écologique', '💡 Innovation', '🤝 Co-investissement', '🌍 Diaspora'],
    lookingFor: 'Un associé technique ou business pour développer une solution GreenTech en Afrique de l\'Ouest.',
  },
  {
    id: '2', name: 'Marcus Johnson', age: 28, location: 'Londres, UK',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&auto=format',
    initials: 'MJ',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)',
    trustScore: 88, distance: '12 km',
    bio: 'Développeur blockchain passionné par la DeFi et les solutions financières pour la diaspora. Toujours partant pour des projets ambitieux.',
    tags: ['Blockchain Expert', 'DeFi', 'Networking'],
    profession: 'Senior Blockchain Developer',
    interests: ['⛓️ Blockchain', '🏦 DeFi', '📊 Finance décentralisée', '🚀 Web3'],
    lookingFor: 'Des entrepreneurs avec une vision claire cherchant une expertise technique blockchain pour lever des fonds.',
  },
  {
    id: '3', name: 'Isabelle Moutoussamy', age: 35, location: 'Pointe-à-Pitre, Guadeloupe',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&fit=crop&auto=format',
    initials: 'IM',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)',
    trustScore: 97, distance: '8 245 km',
    bio: 'Investisseuse immobilière & mentor pour les entrepreneurs caribéens. Je crois en l\'autonomie financière collective et la transmission du savoir.',
    tags: ['Investissement', 'Mentorat', 'Immobilier'],
    profession: 'Investisseuse & Coach Business',
    interests: ['🏘️ Immobilier', '📈 Investissement', '🎓 Mentorat', '🌺 Antilles'],
    lookingFor: 'Des porteurs de projet sérieux aux Caraïbes cherchant un mentor ou un co-investisseur expérimenté.',
  },
  {
    id: '4', name: 'Jean-Baptiste Fond', age: 30, location: 'Fort-de-France, Martinique',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop&auto=format',
    initials: 'JF',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)',
    trustScore: 91, distance: '6 890 km',
    bio: 'Agriculteur urbain & défenseur de l\'agriculture biologique. Je cherche des partenaires pour développer des projets agricoles innovants aux Antilles.',
    tags: ['Agriculture Bio', 'Partenariat', 'Innovation'],
    profession: 'Fondateur @ BioCarib Farms',
    interests: ['🌾 Agriculture bio', '🌿 Développement durable', '🏝️ Antilles', '🤝 Partenariat'],
    lookingFor: 'Des partenaires investisseurs pour financer une ferme bio pilote à Fort-de-France.',
  },
  {
    id: '5', name: 'Amina Diallo', age: 29, location: 'Dakar, Sénégal',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&fit=crop&auto=format',
    initials: 'AD',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)',
    trustScore: 86, distance: '4 200 km',
    bio: 'Fondatrice d\'une coopérative féminine de microfinance. Je connecte les femmes entrepreneures africaines avec des investisseurs diaspora.',
    tags: ['Microfinance', 'Coopérative', 'Féminisme Éco.'],
    profession: 'Fondatrice @ FemCapital Dakar',
    interests: ['💰 Microfinance', '♀️ Empowerment féminin', '🌍 Afrique', '🤲 Solidarité'],
    lookingFor: 'Des investisseurs diaspora souhaitant soutenir des femmes entrepreneures africaines à fort potentiel.',
  },
];

const SWIPE_THRESHOLD = 90;
const MATCH_PROBABILITY = 0.55;
const STAR_GOLD = '#D4AF37';

// ── Super Like Stamp ──────────────────────────────────────────────────────────
function SuperLikeStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
      animate={{ opacity: 1, scale: 1, rotate: -12 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 25, pointerEvents: 'none',
        border: `3.5px solid ${STAR_GOLD}`,
        borderRadius: 10, padding: '5px 18px',
        display: 'flex', alignItems: 'center', gap: 7,
      }}
    >
      <Star style={{ width: 18, height: 18, color: STAR_GOLD, fill: STAR_GOLD }} />
      <span style={{ color: STAR_GOLD, fontSize: 22, fontWeight: 900, letterSpacing: '0.1em' }}>SUPER</span>
    </motion.div>
  );
}

// ── Match Overlay ─────────────────────────────────────────────────────────────
function MatchOverlay({ profile, onClose, onMessage, isSuperLike = false }: { profile: Profile; onClose: () => void; onMessage: () => void; isSuperLike?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: isSuperLike
          ? 'linear-gradient(160deg, rgba(80,60,0,0.97) 0%, rgba(30,20,0,0.99) 100%)'
          : 'linear-gradient(160deg, rgba(10,132,126,0.96) 0%, rgba(4,60,58,0.98) 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 32px',
      }}
    >
      {/* Particle burst */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: i % 3 === 0 ? 8 : 5,
            height: i % 3 === 0 ? 8 : 5,
            borderRadius: '50%',
            background: i % 2 === 0 ? GOLD : '#fff',
            left: '50%', top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(i * 18 * (Math.PI / 180)) * (80 + (i % 3) * 60),
            y: Math.sin(i * 18 * (Math.PI / 180)) * (80 + (i % 3) * 60),
            opacity: 0, scale: 0,
          }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        />
      ))}

      {/* Avatars */}
      <motion.div
        className="flex items-center gap-6 mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
      >
        {/* Own avatar */}
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
          border: '3px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>JD</span>
        </div>

        {/* Handshake pulse */}
        <motion.div
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.1, repeat: 3 }}
        >
          <HandshakeIcon style={{ width: 40, height: 40, color: GOLD }} />
        </motion.div>

        {/* Match avatar */}
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          border: '3px solid white',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}>
          <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </motion.div>

      {/* Match text */}
      <motion.div
        className="text-center mb-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {isSuperLike && (
          <motion.div
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            {[0, 1, 2].map(i => (
              <Star key={i} style={{
                width: 22, height: 22, color: GOLD, fill: GOLD,
                margin: '0 2px',
                filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.7))',
              }} />
            ))}
          </motion.div>
        )}
        <p style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
          {isSuperLike ? 'Super Connexion ✦' : 'Opportunité de connexion'}
        </p>
        <h2 style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
          {isSuperLike ? 'Super Alliance !' : 'Nouvelle Alliance !'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>
          {isSuperLike
            ? <><strong style={{ color: GOLD }}>{profile.name}</strong> a été impressionné(e) — votre Super Connexion a retenu toute son attention !</>
            : <>Vous et <strong style={{ color: '#fff' }}>{profile.name}</strong> souhaitez collaborer — mentorat, partenariat ou co-investissement.</>
          }
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <button
          onClick={onMessage}
          style={{
            width: '100%', padding: '16px', borderRadius: 18,
            background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
            color: '#fff', fontSize: 15, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: `0 6px 20px rgba(212,175,55,0.45)`,
            border: 'none', cursor: 'pointer',
          }}
        >
          <MessageCircle style={{ width: 20, height: 20 }} />
          Initier la collaboration
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px', borderRadius: 18,
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Continuer à découvrir
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Swipeable Card ────────────────────────────────────────────────────────────
function SwipeCard({
  profile, onSwipe, isTop, stackIndex, showSuperLike,
}: {
  profile: Profile;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
  stackIndex: number;
  showSuperLike?: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (!isTop || sheetOpen) return;
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe('right'), 280);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe('left'), 280);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 14;

  // Section label helper
  const SectionLabel = ({ children }: { children: string }) => (
    <p style={{
      color: GOLD, fontSize: 9.5, fontWeight: 800,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      margin: '0 0 8px',
    }}>{children}</p>
  );

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        x: isTop ? x : 0,
        rotate: isTop && !sheetOpen ? rotate : 0,
        scale, y: translateY,
        zIndex: 10 - stackIndex,
        cursor: isTop && !sheetOpen ? 'grab' : 'default',
        touchAction: 'none',
      }}
      drag={isTop && !sheetOpen ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isTop && !sheetOpen ? { cursor: 'grabbing' } : undefined}
    >
      <div style={{
        width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 ${10 + stackIndex * 2}px ${28 + stackIndex * 4}px rgba(0,0,0,${0.45 - stackIndex * 0.07})`,
      }}>
        {/* ── PHOTO ── */}
        <img
          src={profile.photo}
          alt={profile.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
          }}
          draggable={false}
        />

        {/* Grand gradient qui monte haut — photo quasi cachée sauf tout en haut */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top,
            rgba(0,42,52,1.00) 0%,
            rgba(0,42,52,0.97) 28%,
            rgba(0,52,64,0.88) 45%,
            rgba(0,62,76,0.65) 62%,
            rgba(0,72,88,0.28) 80%,
            rgba(0,82,100,0.04) 100%
          )`,
        }} />

        {/* ── LIKE / NOPE stamps ── */}
        {isTop && !sheetOpen && (
          <>
            <motion.div style={{
              position: 'absolute', top: 28, left: 22, zIndex: 20,
              border: '3px solid #4ADE80', borderRadius: 8,
              padding: '4px 14px', opacity: likeOpacity, rotate: '-14deg',
            }}>
              <span style={{ color: '#4ADE80', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em' }}>CONNECT</span>
            </motion.div>
            <motion.div style={{
              position: 'absolute', top: 28, right: 22, zIndex: 20,
              border: '3px solid #F87171', borderRadius: 8,
              padding: '4px 14px', opacity: nopeOpacity, rotate: '14deg',
            }}>
              <span style={{ color: '#F87171', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em' }}>NOPE</span>
            </motion.div>
          </>
        )}

        {/* ── SUPER LIKE stamp ── */}
        <AnimatePresence>
          {isTop && showSuperLike && !sheetOpen && <SuperLikeStamp />}
        </AnimatePresence>

        {/* Badges distance + trust — haut de carte */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 15 }}>
          <div style={{
            background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(12px)',
            borderRadius: 30, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            border: '1px solid rgba(255,255,255,0.14)',
          }}>
            <MapPin style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.75)' }} />
            <span style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12, fontWeight: 600 }}>{profile.distance}</span>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(12px)',
            borderRadius: 30, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            border: '1px solid rgba(255,255,255,0.14)',
          }}>
            <Shield style={{ width: 11, height: 11, color: GOLD }} />
            <span style={{ color: '#FFE57A', fontSize: 12, fontWeight: 700 }}>{profile.trustScore}</span>
          </div>
        </div>

        {/* ── OVERLAY INFO (fondu, sans box) ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          padding: '0 22px 20px',
        }}>
          {/* Nom + âge + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{
              color: '#fff', fontSize: 26, fontWeight: 900, margin: 0,
              letterSpacing: '-0.025em', lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              {profile.name}, {profile.age}
            </h2>
            {profile.trustScore >= 90 && (
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(59,130,246,0.55)',
              }}>
                <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                  <path d="M2 6l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          {/* Métier */}
          <p style={{
            color: 'rgba(255,255,255,0.58)', fontSize: 13.5, fontWeight: 500,
            margin: '0 0 16px', lineHeight: 1.3,
          }}>
            {profile.profession}
          </p>

          {/* Label À propos */}
          <p style={{
            color: GOLD, fontSize: 9, fontWeight: 800,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            margin: '0 0 6px',
          }}>
            À propos de moi
          </p>

          {/* Bio — 2 lignes + fondu bas */}
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <p style={{
              color: 'rgba(255,255,255,0.85)', fontSize: 13.5, lineHeight: 1.65,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {profile.bio}
            </p>
            {/* Fondu progressif sur le texte */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,42,52,0.95) 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Bouton Voir plus */}
          <div onPointerDown={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setSheetOpen(true)}
              style={{
                background: `linear-gradient(135deg, ${TEAL} 0%, #0D9488 100%)`,
                border: 'none', borderRadius: 50,
                color: '#fff', fontSize: 14, fontWeight: 700,
                padding: '11px 32px',
                cursor: 'pointer',
                boxShadow: `0 6px 20px rgba(10,132,126,0.50)`,
                letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              Voir plus
              <ChevronDown style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>

        {/* ── SHEET PROFIL COMPLET ── */}
        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              onPointerDown={e => e.stopPropagation()}
              style={{
                position: 'absolute', inset: 0, zIndex: 30,
                background: 'rgba(0,38,48,0.97)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* En-tête fixe */}
              <div style={{
                padding: '18px 20px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}>
                {/* Miniature + identité */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    border: `2px solid ${TEAL}`,
                  }}>
                    <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                        {profile.name}, {profile.age}
                      </h3>
                      {profile.trustScore >= 90 && (
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                            <path d="M2 6l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 12.5, margin: '2px 0 0', fontWeight: 500 }}>
                      {profile.profession}
                    </p>
                  </div>
                  {/* Bouton fermer */}
                  <button
                    onClick={() => setSheetOpen(false)}
                    style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: 1,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
                {/* Infos rapides */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  {[
                    { icon: '📍', text: profile.location },
                    { icon: '📏', text: profile.distance },
                    { icon: '🛡️', text: `Trust ${profile.trustScore}/100` },
                  ].map(({ icon, text }) => (
                    <span key={text} style={{
                      background: 'rgba(255,255,255,0.08)', borderRadius: 20,
                      padding: '4px 10px', fontSize: 11.5, color: 'rgba(255,255,255,0.70)', fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {icon} {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contenu scrollable */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>

                {/* Tags professionnels */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {profile.tags.map(tag => (
                      <span key={tag} style={{
                        background: `${GOLD}22`, border: `1px solid ${GOLD}55`,
                        color: '#FFE57A', fontSize: 12, fontWeight: 600,
                        borderRadius: 20, padding: '5px 13px',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* À propos */}
                <div style={{ marginBottom: 22 }}>
                  <SectionLabel>À propos de moi</SectionLabel>
                  <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {profile.bio}
                  </p>
                </div>

                {/* Centres d'intérêt */}
                <div style={{ marginBottom: 22 }}>
                  <SectionLabel>Centres d'intérêt</SectionLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {profile.interests.map(interest => (
                      <span key={interest} style={{
                        background: 'rgba(255,255,255,0.09)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500,
                        borderRadius: 20, padding: '6px 14px',
                      }}>{interest}</span>
                    ))}
                  </div>
                </div>

                {/* Ce que je recherche */}
                <div style={{ marginBottom: 22 }}>
                  <SectionLabel>Ce que je recherche</SectionLabel>
                  <div style={{
                    background: `${TEAL}18`, borderRadius: 14,
                    padding: '14px 16px',
                    border: `1px solid ${TEAL}40`,
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>
                      {profile.lookingFor}
                    </p>
                  </div>
                </div>

                {/* Mon profil financier */}
                <div style={{ marginBottom: 22 }}>
                  <SectionLabel>Profil financier</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Rôle', value: profile.tags[0] },
                      { label: 'Trust Score', value: `${profile.trustScore} / 100` },
                      { label: 'Localisation', value: profile.location },
                      { label: 'Distance', value: profile.distance },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        background: 'rgba(255,255,255,0.06)', borderRadius: 12,
                        padding: '10px 12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 3px' }}>{label}</p>
                        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer fixe — actions */}
              <div style={{
                padding: '14px 20px 20px', flexShrink: 0,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', gap: 10,
              }}>
                <button
                  onClick={() => { setSheetOpen(false); onSwipe('left'); }}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 50,
                    background: 'rgba(248,113,113,0.15)', border: '1.5px solid rgba(248,113,113,0.40)',
                    color: '#F87171', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
                <button
                  onClick={() => { setSheetOpen(false); onSwipe('right'); }}
                  style={{
                    flex: 3, padding: '13px', borderRadius: 50,
                    background: `linear-gradient(135deg, ${TEAL}, #0D9488)`,
                    border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 4px 16px rgba(10,132,126,0.45)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Star style={{ width: 16, height: 16 }} /> Connecter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function RencontresScreen() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<Profile[]>(PROFILES);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isSuperLikeMatch, setIsSuperLikeMatch] = useState(false);
  const [lastSwiped, setLastSwiped] = useState<Profile | null>(null);
  const [superLikeActive, setSuperLikeActive] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    const swiped = queue[0];
    setLastSwiped(swiped);
    setQueue(prev => prev.slice(1));

    if (direction === 'right' && Math.random() < MATCH_PROBABILITY) {
      setTimeout(() => { setIsSuperLikeMatch(false); setMatchedProfile(swiped); }, 350);
    }
  };

  const handleSuperLike = () => {
    if (queue.length === 0 || superLikeActive) return;
    const swiped = queue[0];
    setSuperLikeActive(true);
    setTimeout(() => {
      setSuperLikeActive(false);
      setLastSwiped(swiped);
      setQueue(prev => prev.slice(1));
      setIsSuperLikeMatch(true);
      setMatchedProfile(swiped);
    }, 700);
  };

  const handleUndo = () => {
    if (!lastSwiped) return;
    setQueue(prev => [lastSwiped, ...prev]);
    setLastSwiped(null);
  };

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: BG,
      display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '10px 16px', flexShrink: 0, zIndex: 30,
        background: BG2,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Left — back button */}
        <button
          onClick={() => navigate('/kauri/social-hub-gateway')}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)', fontSize: 16,
            cursor: 'pointer', justifyContent: 'center', flexShrink: 0,
          }}
        >
          ←
        </button>

        {/* Center — title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ color: GOLD, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI</span>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>Rencontres</span>
        </div>

        {/* Right — undo button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleUndo}
            disabled={!lastSwiped}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: lastSwiped ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${lastSwiped ? `${GOLD}50` : 'rgba(255,255,255,0.12)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: lastSwiped ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
            }}
          >
            <RotateCcw style={{ width: 15, height: 15, color: lastSwiped ? GOLD : 'rgba(255,255,255,0.28)' }} />
          </button>
        </div>
      </div>

      {/* ── CARD STACK ── */}
      <div style={{ flex: 1, padding: '16px 16px 8px', position: 'relative', minHeight: 0 }}>
        {queue.length === 0 ? (
          /* Empty state */
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 52 }}>🌿</div>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Vous avez tout vu !</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center', maxWidth: 260 }}>
              Revenez bientôt — de nouveaux profils rejoignent la communauté chaque jour.
            </p>
            <button
              onClick={() => { setQueue(PROFILES); setLastSwiped(null); }}
              style={{
                padding: '12px 28px', borderRadius: 20,
                background: `linear-gradient(135deg, ${TEAL}, #0D9488)`,
                color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: `0 6px 20px ${TEAL}55`,
              }}
            >
              Recommencer
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative', height: '100%', minHeight: 480 }}>
            <AnimatePresence>
              {queue.slice(0, 3).reverse().map((profile, reversedIdx) => {
                const stackIndex = Math.min(2, queue.slice(0, 3).length - 1) - reversedIdx;
                return (
                  <SwipeCard
                    key={profile.id}
                    profile={profile}
                    isTop={stackIndex === 0}
                    stackIndex={stackIndex}
                    onSwipe={handleSwipe}
                    showSuperLike={stackIndex === 0 && superLikeActive}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── ACTION BUTTONS ── */}
      {queue.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          padding: '12px 24px 28px', flexShrink: 0,
        }}>
          {/* NOPE */}
          <button
            onClick={() => {
              const swiped = queue[0];
              setLastSwiped(swiped);
              setQueue(prev => prev.slice(1));
            }}
            style={{
              width: 62, height: 62, borderRadius: '50%',
              background: BG2, border: '2px solid #F87171',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(248,113,113,0.25)',
              transition: 'transform 0.15s', flexShrink: 0,
            }}
          >
            <X style={{ width: 26, height: 26, color: '#F87171' }} strokeWidth={2.5} />
          </button>

          {/* SUPER LIKE */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <AnimatePresence>
              {superLikeActive && (
                <motion.div
                  key="flying-star"
                  initial={{ y: 0, x: '-50%', opacity: 1, scale: 1 }}
                  animate={{ y: -220, x: '-50%', opacity: 0, scale: 1.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', bottom: '100%', left: '50%',
                    pointerEvents: 'none', zIndex: 50,
                  }}
                >
                  <Star style={{ width: 28, height: 28, color: GOLD, fill: GOLD, filter: `drop-shadow(0 0 10px ${GOLD})` }} />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleSuperLike}
              animate={superLikeActive ? { scale: [1, 1.35, 0.9, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.45 }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: superLikeActive ? `${GOLD}30` : BG2,
                border: `2px solid ${GOLD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: superLikeActive
                  ? `0 0 28px ${GOLD}80, 0 4px 16px ${GOLD}50`
                  : `0 4px 16px ${GOLD}30`,
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              <Star style={{ width: 20, height: 20, color: GOLD, fill: GOLD }} />
            </motion.button>
          </div>

          {/* CONNECT */}
          <button
            onClick={() => handleSwipe('right')}
            style={{
              width: 62, height: 62, borderRadius: '50%',
              background: `linear-gradient(135deg, #4ADE80, #16A34A)`,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(74,222,128,0.40)',
              flexShrink: 0,
            }}
          >
            <HandshakeIcon style={{ width: 28, height: 28, color: '#fff' }} />
          </button>
        </div>
      )}

      {/* ── MATCH OVERLAY ── */}
      <AnimatePresence>
        {matchedProfile && (
          <MatchOverlay
            profile={matchedProfile}
            isSuperLike={isSuperLikeMatch}
            onClose={() => { setMatchedProfile(null); setIsSuperLikeMatch(false); }}
            onMessage={() => {
              const p = matchedProfile;
              setMatchedProfile(null);
              navigate(`/kauri/social-hub/conversation/match-${p.id}`, {
                state: {
                  isNewMatch: true,
                  matchProfile: {
                    name: p.name,
                    photo: p.photo,
                    profession: p.profession,
                    trustScore: p.trustScore,
                    tags: p.tags,
                    lookingFor: p.lookingFor,
                  },
                },
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
