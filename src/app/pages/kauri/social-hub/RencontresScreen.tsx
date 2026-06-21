import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'motion/react';
import { X, Star, MapPin, Briefcase, Shield, MessageCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

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
}

const PROFILES: Profile[] = [
  {
    id: '1', name: 'Sophie Laurent', age: 32, location: 'Paris, France',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop&auto=format',
    initials: 'SL',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)',
    trustScore: 94, distance: '2 km',
    bio: 'Entrepreneure passionnée par l\'innovation sociale et le développement durable. Je cherche des partenaires pour co-investir dans des projets à impact positif.',
    tags: ['Cherche Associé', 'Impact Social', 'Tech & Innovation'],
    profession: 'CEO @ GreenTech Solutions',
  },
  {
    id: '2', name: 'Marcus Johnson', age: 28, location: 'Londres, UK',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&auto=format',
    initials: 'MJ',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)',
    trustScore: 88, distance: '12 km',
    bio: 'Développeur blockchain passionné par la DeFi et les solutions financières pour la diaspora. Toujours partant pour des projets ambitieux.',
    tags: ['Blockchain Expert', 'DeFi', 'Networking'],
    profession: 'Senior Blockchain Developer',
  },
  {
    id: '3', name: 'Isabelle Moutoussamy', age: 35, location: 'Pointe-à-Pitre, Guadeloupe',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&fit=crop&auto=format',
    initials: 'IM',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)',
    trustScore: 97, distance: '8 245 km',
    bio: 'Investisseuse immobilière & mentor pour les entrepreneurs caribéens. Je crois en l\'autonomie financière collective et la transmission du savoir.',
    tags: ['Investissement', 'Mentorat', 'Immobilier'],
    profession: 'Investisseuse & Coach Business',
  },
  {
    id: '4', name: 'Jean-Baptiste Fond', age: 30, location: 'Fort-de-France, Martinique',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop&auto=format',
    initials: 'JF',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)',
    trustScore: 91, distance: '6 890 km',
    bio: 'Agriculteur urbain & défenseur de l\'agriculture biologique. Je cherche des partenaires pour développer des projets agricoles innovants aux Antilles.',
    tags: ['Agriculture Bio', 'Partenariat', 'Innovation'],
    profession: 'Fondateur @ BioCarib Farms',
  },
  {
    id: '5', name: 'Amina Diallo', age: 29, location: 'Dakar, Sénégal',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&fit=crop&auto=format',
    initials: 'AD',
    overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)',
    trustScore: 86, distance: '4 200 km',
    bio: 'Fondatrice d\'une coopérative féminine de microfinance. Je connecte les femmes entrepreneures africaines avec des investisseurs diaspora.',
    tags: ['Microfinance', 'Coopérative', 'Féminisme Éco.'],
    profession: 'Fondatrice @ FemCapital Dakar',
  },
];

const SWIPE_THRESHOLD = 90;
const MATCH_PROBABILITY = 0.55;

// ── Match Overlay ─────────────────────────────────────────────────────────────
function MatchOverlay({ profile, onClose, onMessage }: { profile: Profile; onClose: () => void; onMessage: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'linear-gradient(160deg, rgba(10,132,126,0.96) 0%, rgba(4,60,58,0.98) 100%)',
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
        <p style={{ color: GOLD, fontSize: 13, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
          Opportunité de connexion
        </p>
        <h2 style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
          Nouvelle Alliance !
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>
          Vous et <strong style={{ color: '#fff' }}>{profile.name}</strong> souhaitez collaborer — mentorat, partenariat ou co-investissement.
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
  profile, onSwipe, isTop, stackIndex,
}: {
  profile: Profile;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
  stackIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const [expanded, setExpanded] = useState(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (!isTop) return;
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

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: translateY,
        zIndex: 10 - stackIndex,
        cursor: isTop ? 'grab' : 'default',
        touchAction: 'none',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
    >
      {/* Card = photo plein fond */}
      <div style={{
        width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 ${10 + stackIndex * 2}px ${28 + stackIndex * 4}px rgba(0,0,0,${0.38 - stackIndex * 0.07})`,
      }}>
        {/* Photo pleine carte */}
        <img
          src={profile.photo}
          alt={profile.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          draggable={false}
        />

        {/* Gradient overlay bas */}
        <div style={{ position: 'absolute', inset: 0, background: profile.overlayGradient }} />

        {/* ── LIKE / NOPE stamps ── */}
        {isTop && (
          <>
            <motion.div style={{
              position: 'absolute', top: 28, left: 22, zIndex: 20,
              border: '3px solid #4ADE80', borderRadius: 8,
              padding: '4px 14px', opacity: likeOpacity,
              rotate: '-14deg',
            }}>
              <span style={{ color: '#4ADE80', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em' }}>CONNECT</span>
            </motion.div>
            <motion.div style={{
              position: 'absolute', top: 28, right: 22, zIndex: 20,
              border: '3px solid #F87171', borderRadius: 8,
              padding: '4px 14px', opacity: nopeOpacity,
              rotate: '14deg',
            }}>
              <span style={{ color: '#F87171', fontSize: 22, fontWeight: 900, letterSpacing: '0.1em' }}>NOPE</span>
            </motion.div>
          </>
        )}

        {/* Badges haut */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{
            background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(14px)',
            borderRadius: 30, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            border: '1px solid rgba(255,255,255,0.16)',
          }}>
            <MapPin style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.80)' }} />
            <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: 600 }}>{profile.distance}</span>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(14px)',
            borderRadius: 30, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 5,
            border: '1px solid rgba(255,255,255,0.16)',
          }}>
            <Shield style={{ width: 12, height: 12, color: GOLD }} />
            <span style={{ color: '#FFE57A', fontSize: 12, fontWeight: 700 }}>{profile.trustScore}</span>
          </div>
        </div>

        {/* Info bas (sur le gradient) */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          padding: '0 20px',
        }}>
          {/* Nom + âge */}
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 4px', textShadow: '0 2px 10px rgba(0,0,0,0.60)', letterSpacing: '-0.02em' }}>
            {profile.name}, {profile.age}
          </h2>

          {/* Localisation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <MapPin style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.70)' }} />
            <span style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13 }}>{profile.location}</span>
          </div>

          {/* Profession */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.22)',
          }}>
            <Briefcase style={{ width: 12, height: 12, color: GOLD }} />
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{profile.profession}</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {profile.tags.map(tag => (
              <span key={tag} style={{
                background: `${GOLD}30`, border: `1px solid ${GOLD}60`,
                color: '#FFE57A', fontSize: 11, fontWeight: 600,
                borderRadius: 20, padding: '4px 11px',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Bio expandable */}
          <div style={{
            background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(16px)',
            borderRadius: 16, padding: expanded ? '12px 16px 14px' : '10px 16px',
            marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.12)',
            transition: 'padding 0.2s ease',
          }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={() => setExpanded(v => !v)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: 600 }}>À propos</span>
              {expanded
                ? <ChevronDown style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.55)' }} />
                : <ChevronUp style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.55)' }} />
              }
            </button>
            {expanded && (
              <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: 12.5, lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function RencontresScreen() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<Profile[]>(PROFILES);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [lastSwiped, setLastSwiped] = useState<Profile | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    const swiped = queue[0];
    setLastSwiped(swiped);
    setQueue(prev => prev.slice(1));

    if (direction === 'right' && Math.random() < MATCH_PROBABILITY) {
      setTimeout(() => setMatchedProfile(swiped), 350);
    }
  };

  const handleUndo = () => {
    if (!lastSwiped) return;
    setQueue(prev => [lastSwiped, ...prev]);
    setLastSwiped(null);
  };

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: '#0F172A',
      display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '10px 16px', flexShrink: 0, zIndex: 30,
        background: '#0F172A',
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
              background: '#1E293B', border: '2px solid #F87171',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(248,113,113,0.25)',
              transition: 'transform 0.15s', flexShrink: 0,
            }}
          >
            <X style={{ width: 26, height: 26, color: '#F87171' }} strokeWidth={2.5} />
          </button>

          {/* SUPER LIKE */}
          <button
            style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#1E293B', border: `2px solid ${GOLD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: `0 4px 16px ${GOLD}30`,
              flexShrink: 0,
            }}
          >
            <Star style={{ width: 20, height: 20, color: GOLD, fill: GOLD }} />
          </button>

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
            onClose={() => setMatchedProfile(null)}
            onMessage={() => {
              setMatchedProfile(null);
              navigate('/kauri/community-chat');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
