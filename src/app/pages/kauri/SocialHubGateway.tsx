import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, LogOut, ChevronRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Custom Pillar Icons ──────────────────────────────────────────────────────

function IconDecouverte({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      {/* Phone body */}
      <rect x="12" y="3" width="20" height="34" rx="4"
        stroke="#D4AF37" strokeWidth="1.6"
        fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'} />
      {/* Screen area */}
      <rect x="14.5" y="7" width="15" height="22" rx="2"
        fill={active ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.1)'} />
      {/* Play triangle */}
      <polygon points="19,13 19,24 30,18.5" fill="#D4AF37" />
      {/* Home indicator */}
      <line x1="18" y1="33" x2="26" y2="33"
        stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
      {/* Floating sparkles */}
      <circle cx="8" cy="9" r="1.5" fill="#D4AF37" opacity={active ? 0.9 : 0.5} />
      <circle cx="37" cy="20" r="1" fill="#D4AF37" opacity={active ? 0.7 : 0.35} />
      <circle cx="7" cy="29" r="0.9" fill="#D4AF37" opacity={active ? 0.5 : 0.25} />
    </svg>
  );
}

function IconRencontres({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      {/* Left silhouette */}
      <circle cx="14" cy="13" r="5.5"
        stroke="#D4AF37" strokeWidth="1.5"
        fill={active ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.08)'} />
      <path d="M5 32c0-5.5 4-9 9-9h2"
        stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Right silhouette */}
      <circle cx="30" cy="13" r="5.5"
        stroke="#D4AF37" strokeWidth="1.5"
        fill={active ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.06)'} />
      <path d="M39 32c0-5.5-4-9-9-9h-2"
        stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Central connecting heart */}
      <path d="M22 38 L14 29 C12 26 13 22 16.5 21.5 C18.5 21 20 22.5 22 24 C24 22.5 25.5 21 27.5 21.5 C31 22 32 26 30 29 Z"
        fill="#D4AF37" opacity={active ? 0.9 : 0.65} />
    </svg>
  );
}

function IconDiscussions({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      {/* Back bubble */}
      <rect x="12" y="14" width="26" height="19" rx="6"
        fill={active ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.12)'}
        stroke="#D4AF37" strokeWidth="1.4" />
      <path d="M34 33 L38 39 L31 36"
        fill={active ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.12)'}
        stroke="#D4AF37" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Front bubble */}
      <rect x="5" y="5" width="26" height="19" rx="6"
        fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'}
        stroke="#D4AF37" strokeWidth="1.4" />
      <path d="M10 24 L6 30 L13 27"
        fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'}
        stroke="#D4AF37" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Dots in front bubble */}
      <circle cx="13" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.9 : 0.7} />
      <circle cx="18" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.75 : 0.55} />
      <circle cx="23" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.55 : 0.35} />
    </svg>
  );
}

// ─── Pillar Data ──────────────────────────────────────────────────────────────

const PILLARS = [
  {
    id: 'decouverte',
    label: 'Découverte',
    tagline: 'Tendances & viral',
    desc: 'Vidéos virales, tendances & actualités de la communauté.',
    path: '/kauri/social-hub/decouverte',
    accentHex: '#006D77',
    badge: null,
    Icon: IconDecouverte,
  },
  {
    id: 'rencontres',
    label: 'Rencontres',
    tagline: 'Mentors & partenaires',
    desc: 'Connectez avec des mentors, partenaires & la communauté.',
    path: '/kauri/social-hub/rencontres',
    accentHex: '#B05B3B',
    badge: 'Score de Confiance',
    Icon: IconRencontres,
  },
  {
    id: 'discussions',
    label: 'Discussions',
    tagline: 'Forums & salons',
    desc: 'Forums communautaires, salons de chat & débats.',
    path: '/kauri/social-hub/forums',
    accentHex: '#4A4A4A',
    badge: null,
    Icon: IconDiscussions,
  },
] as const;

// ─── Cowrie Shell SVG ─────────────────────────────────────────────────────────

function KauriLogo() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Golden circle — same as login screen */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4AF37, #F59E0B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(212,175,55,0.55)',
        }}
      >
        {/* Exact same SVG path as login screen */}
        <svg viewBox="0 0 100 100" style={{ width: 52, height: 52, color: '#ffffff' }}>
          <path
            d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Gateway Component ───────────────────────────────────────────────────

export function SocialHubGateway() {
  const navigate = useNavigate();
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Respect account type when navigating back / logging out
  const accountType = typeof window !== 'undefined'
    ? (localStorage.getItem('kauri_account_type') || 'normal')
    : 'normal';

  const handleBack = () =>
    navigate(accountType === 'pro' ? '/kauri/pro-dashboard' : '/kauri/normal-dashboard');

  const handleLogout = () => {
    localStorage.removeItem('kauri_account_type');
    navigate('/kauri/login');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background:
          'radial-gradient(ellipse at 48% 28%, #D4724A 0%, #B05B3B 28%, #9A4530 55%, #6B2811 100%)',
        position: 'relative',
      }}
    >

      {/* ── Ambient background particles ────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
              height: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
              borderRadius: '50%',
              background: '#D4AF37',
              left: `${4 + (i * 5.4) % 92}%`,
              top: `${3 + (i * 7.1) % 94}%`,
            }}
            animate={{ y: [-16, 16], opacity: [0, 0.65, 0] }}
            transition={{
              duration: 2.8 + (i % 4) * 0.7,
              repeat: Infinity,
              delay: (i * 0.37) % 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header
        style={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px 10px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 30,
        }}
      >
        {/* Back to dashboard */}
        <motion.button
          onClick={handleBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px 8px 10px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#F9F9F9',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={15} />
          <span>Tableau</span>
        </motion.button>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#FFE57A', fontSize: 11, letterSpacing: '0.28em',
            textTransform: 'uppercase', margin: 0, opacity: 1,
          }}>
            KAURI
          </p>
          <h1 style={{
            color: '#ffffff', fontSize: 17, fontWeight: 800,
            margin: '2px 0 0', letterSpacing: '0.03em',
          }}>
            Hub Social
          </h1>
        </div>

        {/* Déconnexion */}
        <motion.button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 12px 8px 10px',
            borderRadius: 12,
            background: 'rgba(176,91,59,0.28)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(176,91,59,0.5)',
            color: '#FFCBA4',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title="Déconnexion"
        >
          <LogOut size={15} />
          <span>Sortir</span>
        </motion.button>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 520,
          padding: '4px 18px 20px',
          position: 'relative',
          zIndex: 10,
          gap: 0,
        }}
      >
        {/* Sub-label */}
        <motion.p
          style={{
            color: 'rgba(255,255,255,0.82)', fontSize: 12,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            margin: '0 0 20px', textAlign: 'center',
          }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          Le Portail de la Communauté Kauri
        </motion.p>

        {/* ── THE KAURI PORTAL (Central Cowrie) ───────────────── */}
        <motion.div
          style={{ position: 'relative', marginBottom: 8 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Pulse rings */}
          {[0, 0.75, 1.5].map((delay) => (
            <motion.div
              key={delay}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1.5px solid rgba(212,175,55,0.45)',
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeOut' }}
            />
          ))}

          {/* Deep glow disc */}
          <motion.div
            style={{
              position: 'absolute', inset: -28, borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(212,175,55,0.42) 0%, rgba(212,175,55,0.14) 55%, transparent 72%)',
              filter: 'blur(22px)',
            }}
            animate={{ scale: [1, 1.28, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Rotating conic shimmer */}
          <motion.div
            style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,0.55) 14%, transparent 28%)',
              filter: 'blur(10px)',
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Shell — floating */}
          <motion.div
            style={{ position: 'relative', zIndex: 2 }}
            animate={{ y: [0, -7, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <KauriLogo />
          </motion.div>
        </motion.div>

        {/* Portal label */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p style={{
            color: '#FFE57A', fontSize: 15, fontWeight: 800,
            letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0,
          }}>
            Le Kauri
          </p>
          <p style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12, margin: '3px 0 0' }}>
            Symbole de connexion · Kauri
          </p>
        </motion.div>

        {/* ── KAURI CONNECTION — vertical stem + horizontal energy bar ── */}
        <motion.div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', marginBottom: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* Vertical stem — pinned to 50% so it aligns with the center dot */}
          <div style={{ position: 'relative', width: '100%', height: 22, flexShrink: 0 }}>
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 2,
                height: '100%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to bottom, rgba(212,175,55,0.9), rgba(212,175,55,0.4))',
                borderRadius: 1,
                transformOrigin: 'top center',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.1, duration: 0.45 }}
            />
          </div>

          {/* Horizontal energy bar */}
          <div style={{ width: '100%', height: 28, position: 'relative', flexShrink: 0 }}>
            {/* Base line */}
            <div style={{
              position: 'absolute',
              top: '50%', left: 0, right: 0, height: 1.5,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 12%, rgba(212,175,55,0.75) 30%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.75) 70%, rgba(212,175,55,0.25) 88%, transparent 100%)',
              borderRadius: 1,
            }} />

            {/* Animated energy pulse */}
            <motion.div
              style={{
                position: 'absolute',
                top: 'calc(50% - 3px)',
                width: '35%', height: 7,
                background: 'linear-gradient(90deg, transparent, rgba(255,220,80,0.95), transparent)',
                borderRadius: 4,
                filter: 'blur(2px)',
              }}
              animate={{ left: ['-35%', '100%'] }}
              transition={{
                duration: 2.8, repeat: Infinity,
                ease: 'easeInOut', repeatDelay: 0.8,
              }}
            />

            {/* Three connector dots at pillar positions */}
            {[16.7, 50, 83.3].map((pos, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pos}%`,
                  top: '50%',
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#D4AF37',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px rgba(212,175,55,0.8)',
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  boxShadow: [
                    '0 0 6px rgba(212,175,55,0.7)',
                    '0 0 14px rgba(212,175,55,1)',
                    '0 0 6px rgba(212,175,55,0.7)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
              />
            ))}

            {/* Glow bloom behind line */}
            <div style={{
              position: 'absolute',
              top: 'calc(50% - 6px)', left: '8%', right: '8%', height: 12,
              background:
                'linear-gradient(90deg, transparent, rgba(212,175,55,0.18), rgba(212,175,55,0.12), transparent)',
              filter: 'blur(6px)',
              borderRadius: 6,
            }} />
          </div>

          {/* Tiny label */}
          <p style={{
            color: 'rgba(212,175,55,0.85)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            margin: '2px 0 16px', textAlign: 'center',
          }}>
            Connexion Kauri
          </p>
        </motion.div>

        {/* ── THE KAURI PILLARS ─────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
          }}
        >
          {PILLARS.map((pillar, index) => {
            const isActive = activePillar === pillar.id;
            const { Icon } = pillar;

            return (
              <motion.button
                key={pillar.id}
                style={{
                  // Responsive pillar sizing — 3 cols on ≥375px, wraps below
                  flex: '1 1 0',
                  minWidth: 100,
                  maxWidth: 200,
                  background: isActive
                    ? 'rgba(212,175,55,0.14)'
                    : 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: `1px solid ${isActive ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.18)'}`,
                  borderRadius: 22,
                  padding: '18px 12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 9,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isActive
                    ? '0 8px 28px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : '0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)',
                  transition:
                    'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 1.2 + index * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(pillar.path)}
                onMouseEnter={() => setActivePillar(pillar.id)}
                onMouseLeave={() => setActivePillar(null)}
                onTouchStart={() => setActivePillar(pillar.id)}
                onTouchEnd={() => setTimeout(() => setActivePillar(null), 550)}
              >
                {/* Accent corner glow */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      style={{
                        position: 'absolute', top: 0, right: 0,
                        width: 70, height: 70, pointerEvents: 'none',
                        background: `radial-gradient(circle at top right, rgba(212,175,55,0.32), transparent)`,
                        borderRadius: '0 22px 0 0',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </AnimatePresence>

                {/* Trust-score badge (Rencontres only) */}
                {pillar.badge && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    display: 'flex', alignItems: 'center', gap: 3,
                    background: 'rgba(0,109,119,0.35)',
                    borderRadius: 20, padding: '2px 7px',
                    border: '1px solid rgba(0,109,119,0.55)',
                  }}>
                    <Shield size={8} color="#7DD3DA" />
                    <span style={{
                      color: '#7DD3DA', fontSize: 7.5,
                      fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      Confiance
                    </span>
                  </div>
                )}

                {/* Icon container */}
                <div style={{
                  width: 54, height: 54, borderRadius: 16,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.32), rgba(212,175,55,0.1))'
                    : 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))',
                  border: `1px solid ${isActive ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.22)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  flexShrink: 0,
                }}>
                  <Icon active={isActive} />
                </div>

                {/* Title */}
                <p style={{
                  color: '#FFE57A', fontSize: 14, fontWeight: 700,
                  margin: 0, letterSpacing: '0.02em', lineHeight: 1,
                }}>
                  {pillar.label}
                </p>

                {/* Description */}
                <p style={{
                  color: 'rgba(255,255,255,0.88)', fontSize: 11,
                  margin: 0, lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {pillar.desc}
                </p>

                {/* Entrer CTA */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  color: isActive ? '#FFE57A' : 'rgba(212,175,55,0.80)',
                  fontSize: 12, fontWeight: 600,
                  transition: 'color 0.3s ease',
                  marginTop: 2,
                }}>
                  <span>Entrer</span>
                  <ChevronRight size={12} strokeWidth={2.5} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer
        style={{
          width: '100%', maxWidth: 520,
          padding: '8px 18px 20px',
          flexShrink: 0,
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 10,
        }}
      >
        {/* Stats card */}
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
            borderRadius: 16, padding: '11px 20px',
            border: '1px solid rgba(255,255,255,0.11)',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8, textAlign: 'center',
          }}>
            {[
              { value: '2.4k', label: 'En ligne' },
              { value: '156',  label: 'Connexions' },
              { value: '89',   label: 'Messages' },
            ].map(({ value, label }, i) => (
              <div key={label}>
                <motion.div
                  style={{ color: '#D4AF37', fontSize: 20, fontWeight: 700 }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.32 }}
                >
                  {value}
                </motion.div>
                <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: 11, marginTop: 1 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
        >
          <p style={{
            color: 'rgba(255,255,255,0.95)', fontSize: 13,
            fontStyle: 'italic', margin: 0, letterSpacing: '0.01em',
          }}>
            « Choisis ta voie, la communauté t'attend »
          </p>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6, marginTop: 6,
          }}>
            <motion.div
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 8px rgba(52,211,153,0.75)',
              }}
              animate={{ scale: [1, 1.55, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12 }}>
              Réseau actif · {(2418).toLocaleString('fr-FR')} membres en ligne
            </span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
