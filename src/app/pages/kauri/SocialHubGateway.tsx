import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, LogOut, ChevronRight, Shield, UserCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KauriBottomNav } from '../../layouts/MainLayout';

function IconDecouverte({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      <rect x="12" y="3" width="20" height="34" rx="4" stroke="#D4AF37" strokeWidth="1.6" fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'} />
      <rect x="14.5" y="7" width="15" height="22" rx="2" fill={active ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.1)'} />
      <polygon points="19,13 19,24 30,18.5" fill="#D4AF37" />
      <line x1="18" y1="33" x2="26" y2="33" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="9" r="1.5" fill="#D4AF37" opacity={active ? 0.9 : 0.5} />
      <circle cx="37" cy="20" r="1" fill="#D4AF37" opacity={active ? 0.7 : 0.35} />
      <circle cx="7" cy="29" r="0.9" fill="#D4AF37" opacity={active ? 0.5 : 0.25} />
    </svg>
  );
}

function IconRencontres({ active }: { active: boolean }) {
  const fill = active ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.09)';
  const stroke = '#D4AF37';
  const hw = 1.5;
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      <rect x="4" y="18" width="15" height="11" rx="2.5" fill={fill} stroke={stroke} strokeWidth={hw} />
      <path d="M8.5 18v-2.5a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3V18" stroke={stroke} strokeWidth={hw} strokeLinecap="round" fill="none" />
      <line x1="4" y1="24" x2="19" y2="24" stroke={stroke} strokeWidth={hw - 0.3} strokeLinecap="round" opacity="0.5" />
      <rect x="9.5" y="22.5" width="4" height="2.8" rx="1" fill={stroke} opacity={active ? 0.8 : 0.5} />
      <rect x="25" y="18" width="15" height="11" rx="2.5" fill={fill} stroke={stroke} strokeWidth={hw} />
      <path d="M28.5 18v-2.5a3 3 0 0 1 3-3H33a3 3 0 0 1 3 3V18" stroke={stroke} strokeWidth={hw} strokeLinecap="round" fill="none" />
      <line x1="25" y1="24" x2="40" y2="24" stroke={stroke} strokeWidth={hw - 0.3} strokeLinecap="round" opacity="0.5" />
      <rect x="30.5" y="22.5" width="4" height="2.8" rx="1" fill={stroke} opacity={active ? 0.8 : 0.5} />
      <path d="M19 23.5 L22 23.5 M22 23.5 L25 23.5" stroke={stroke} strokeWidth={hw} strokeLinecap="round" />
      <circle cx="22" cy="23.5" r="2" fill={stroke} opacity={active ? 0.9 : 0.6} />
    </svg>
  );
}

function IconDiscussions({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" aria-hidden="true">
      <rect x="12" y="14" width="26" height="19" rx="6" fill={active ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.12)'} stroke="#D4AF37" strokeWidth="1.4" />
      <path d="M34 33 L38 39 L31 36" fill={active ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.12)'} stroke="#D4AF37" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="5" y="5" width="26" height="19" rx="6" fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'} stroke="#D4AF37" strokeWidth="1.4" />
      <path d="M10 24 L6 30 L13 27" fill={active ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.08)'} stroke="#D4AF37" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="13" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.9 : 0.7} />
      <circle cx="18" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.75 : 0.55} />
      <circle cx="23" cy="14.5" r="1.8" fill="#D4AF37" opacity={active ? 0.55 : 0.35} />
    </svg>
  );
}

const PILLARS = [
  {
    id: 'decouverte', label: 'Découverte', tagline: 'Tendances & viral',
    desc: 'Vidéos virales, tendances & actualités de la communauté.',
    path: '/kauri/social-hub/decouverte', accentHex: '#006D77', badge: null, Icon: IconDecouverte,
  },
  {
    id: 'rencontres', label: 'Rencontres', tagline: 'Mentors & partenaires',
    desc: 'Connectez avec des mentors, partenaires & la communauté.',
    path: '/kauri/social-hub/rencontres', accentHex: '#B05B3B', badge: 'Score de Confiance', Icon: IconRencontres,
  },
  {
    id: 'discussions', label: 'Discussions', tagline: 'Forums & salons',
    desc: 'Forums communautaires, salons de chat & débats.',
    path: '/kauri/social-hub/forums', accentHex: '#4A4A4A', badge: null, Icon: IconDiscussions,
  },
] as const;

function KauriLogo() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(212,175,55,0.55)' }}>
        <svg viewBox="0 0 100 100" style={{ width: 52, height: 52, color: '#ffffff' }}>
          <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function SocialHubGateway() {
  const navigate = useNavigate();
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [socialProfile, setSocialProfile] = useState<{
    pseudo?: string; useRealName?: boolean;
    tagline?: string; invisibleRencontres?: boolean; invisibleDiscussions?: boolean;
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    const setupDone = localStorage.getItem('kauri_social_profile_setup_done');
    if (!setupDone) {
      navigate('/kauri/social-hub/profil-setup');
      return;
    }
    try {
      const saved = localStorage.getItem('kauri_social_profile');
      if (saved) setSocialProfile(JSON.parse(saved));
    } catch { /* noop */ }
    return () => clearTimeout(t);
  }, [navigate]);

  const accountType = typeof window !== 'undefined' ? (localStorage.getItem('kauri_account_type') || 'normal') : 'normal';
  const isPro = accountType === 'pro' || accountType === 'professionnel';
  const handleBack = () => navigate(isPro ? '/kauri/pro-dashboard' : '/kauri/normal-dashboard');

  const handleLogout = () => {
    localStorage.removeItem('kauri_account_type');
    navigate('/kauri/login');
  };

  return (
    <div
      style={{
        minHeight: '100dvh', width: '100%', overflowX: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'radial-gradient(ellipse at 48% 28%, #D4724A 0%, #B05B3B 28%, #9A4530 55%, #6B2811 100%)', position: 'relative',
      }}
    >
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5, height: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
              borderRadius: '50%', background: '#D4AF37', left: `${4 + (i * 5.4) % 92}%`, top: `${3 + (i * 7.1) % 94}%`,
            }}
            animate={{ y: [-16, 16], opacity: [0, 0.65, 0] }}
            transition={{ duration: 2.8 + (i % 4) * 0.7, repeat: Infinity, delay: (i * 0.37) % 4, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <header style={{ width: '100%', maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px', flexShrink: 0, position: 'relative', zIndex: 30 }}>
        <motion.button
          onClick={handleBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px 8px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)', color: '#F9F9F9', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.01em' }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={15} />
          <span>Tableau</span>
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#FFE57A', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', margin: 0, opacity: 1 }}>KAURI</p>
          <h1 style={{ color: '#ffffff', fontSize: 17, fontWeight: 800, margin: '2px 0 0', letterSpacing: '0.03em' }}>Hub Social</h1>
        </div>
        <motion.button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px 8px 10px', borderRadius: 12, background: 'rgba(176,91,59,0.28)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(176,91,59,0.5)', color: '#FFCBA4', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.01em' }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} title="Déconnexion"
        >
          <LogOut size={15} />
          <span>Sortir</span>
        </motion.button>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 520, padding: '4px 18px 20px', position: 'relative', zIndex: 10, gap: 0 }}>
        <motion.p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 20px', textAlign: 'center' }} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>Le Portail de la Communauté Kauri</motion.p>

        <motion.div style={{ position: 'relative', marginBottom: 8 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
          {[0, 0.75, 1.5].map((delay) => (
            <motion.div key={delay} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(212,175,55,0.45)' }} initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.4], opacity: [0.45, 0] }} transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeOut' }} />
          ))}
          <motion.div style={{ position: 'absolute', inset: -28, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.42) 0%, rgba(212,175,55,0.14) 55%, transparent 72%)', filter: 'blur(22px)' }} animate={{ scale: [1, 1.28, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,0.55) 14%, transparent 28%)', filter: 'blur(10px)' }} animate={{ rotate: [0, 360] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }} />
          <motion.div style={{ position: 'relative', zIndex: 2 }} animate={{ y: [0, -7, 0], scale: [1, 1.04, 1] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
            <KauriLogo />
          </motion.div>
        </motion.div>

        <motion.div style={{ textAlign: 'center', marginBottom: 4 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <p style={{ color: '#FFE57A', fontSize: 15, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>Le Kauri</p>
          <p style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12, margin: '3px 0 0' }}>Symbole de connexion · Kauri</p>
        </motion.div>

        <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <div style={{ position: 'relative', width: '100%', height: 22, flexShrink: 0 }}>
            <motion.div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, rgba(212,175,55,0.9), rgba(212,175,55,0.4))', borderRadius: 1, transformOrigin: 'top center' }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.1, duration: 0.45 }} />
          </div>
          <div style={{ width: '100%', height: 28, position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 12%, rgba(212,175,55,0.75) 30%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.75) 70%, rgba(212,175,55,0.25) 88%, transparent 100%)', borderRadius: 1 }} />
            <motion.div style={{ position: 'absolute', top: 'calc(50% - 3px)', width: '35%', height: 7, background: 'linear-gradient(90deg, transparent, rgba(255,220,80,0.95), transparent)', borderRadius: 4, filter: 'blur(2px)' }} animate={{ left: ['-35%', '100%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }} />
            {[16.7, 50, 83.3].map((pos, i) => (
              <motion.div key={i} style={{ position: 'absolute', left: `${pos}%`, top: '50%', width: 8, height: 8, borderRadius: '50%', background: '#D4AF37', transform: 'translate(-50%, -50%)', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} animate={{ scale: [1, 1.4, 1], boxShadow: ['0 0 6px rgba(212,175,55,0.7)', '0 0 14px rgba(212,175,55,1)', '0 0 6px rgba(212,175,55,0.7)'] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }} />
            ))}
            <div style={{ position: 'absolute', top: 'calc(50% - 6px)', left: '8%', right: '8%', height: 12, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.18), rgba(212,175,55,0.12), transparent)', filter: 'blur(6px)', borderRadius: 6 }} />
          </div>
          <p style={{ color: 'rgba(212,175,55,0.85)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '2px 0 16px', textAlign: 'center' }}>Connexion Kauri</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {PILLARS.map((pillar, index) => {
            const isActive = activePillar === pillar.id;
            const { Icon } = pillar;
            return (
              <motion.button
                key={pillar.id}
                style={{ width: '100%', background: isActive ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: `1px solid ${isActive ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.18)'}`, borderRadius: 18, padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, textAlign: 'left', position: 'relative', overflow: 'hidden', boxShadow: isActive ? '0 8px 28px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,255,255,0.12)' : '0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)', transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 1.2 + index * 0.14, ease: [0.16, 1, 0.3, 1] }} whileTap={{ scale: 0.98 }} onClick={() => navigate(pillar.path)} onMouseEnter={() => setActivePillar(pillar.id)} onMouseLeave={() => setActivePillar(null)} onTouchStart={() => setActivePillar(pillar.id)} onTouchEnd={() => setTimeout(() => setActivePillar(null), 550)}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at left center, rgba(212,175,55,0.18), transparent 70%)`, borderRadius: 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
                  )}
                </AnimatePresence>
                <div style={{ width: 52, height: 52, borderRadius: 15, flexShrink: 0, background: isActive ? 'linear-gradient(135deg, rgba(212,175,55,0.32), rgba(212,175,55,0.1))' : 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))', border: `1px solid ${isActive ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                  <Icon active={isActive} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ color: '#FFE57A', fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '0.01em', lineHeight: 1 }}>{pillar.label}</p>
                    {pillar.badge && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(0,109,119,0.35)', borderRadius: 20, padding: '2px 7px', border: '1px solid rgba(0,109,119,0.55)', flexShrink: 0 }}>
                        <Shield size={8} color="#7DD3DA" />
                        <span style={{ color: '#7DD3DA', fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confiance</span>
                      </div>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: 12.5, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>{pillar.desc}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 2, color: isActive ? '#FFE57A' : 'rgba(212,175,55,0.65)', transition: 'color 0.3s ease' }}>
                  <ChevronRight size={20} strokeWidth={2.5} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      <footer style={{ width: '100%', maxWidth: 520, padding: '8px 18px 100px', flexShrink: 0, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <motion.button
          onClick={() => navigate('/kauri/social-hub/profil-setup', { state: { isEditing: true } })}
          style={{ width: '100%', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: 16, padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} whileTap={{ scale: 0.98 }}
        >
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #B05B3B, #8B3E24)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserCircle style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0 }}>
              {socialProfile?.useRealName === false && socialProfile?.pseudo ? `@${socialProfile.pseudo}` : 'Mon profil social'}
            </p>
            {socialProfile?.tagline ? (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, margin: '1px 0 0' }}>{socialProfile.tagline}</p>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11.5, margin: '1px 0 0', fontStyle: 'italic' }}>Modifier mon profil</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            {socialProfile?.invisibleRencontres && (
              <div style={{ background: 'rgba(176,91,59,0.25)', borderRadius: 20, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(176,91,59,0.4)' }}>
                <EyeOff style={{ width: 9, height: 9, color: '#FDA07A' }} />
                <span style={{ color: '#FDA07A', fontSize: 9, fontWeight: 700 }}>R</span>
              </div>
            )}
            {socialProfile?.invisibleDiscussions && (
              <div style={{ background: 'rgba(0,109,119,0.25)', borderRadius: 20, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(0,109,119,0.4)' }}>
                <EyeOff style={{ width: 9, height: 9, color: '#7DD3DA' }} />
                <span style={{ color: '#7DD3DA', fontSize: 9, fontWeight: 700 }}>D</span>
              </div>
            )}
            {!socialProfile?.invisibleRencontres && !socialProfile?.invisibleDiscussions && (
              <div style={{ background: 'rgba(52,211,153,0.15)', borderRadius: 20, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(52,211,153,0.3)' }}>
                <Eye style={{ width: 9, height: 9, color: '#34d399' }} />
                <span style={{ color: '#34d399', fontSize: 9, fontWeight: 700 }}>Visible</span>
              </div>
            )}
          </div>
        </motion.button>
        <motion.div style={{ width: '100%' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', borderRadius: 16, padding: '11px 20px', border: '1px solid rgba(255,255,255,0.11)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
            {[
              { value: '2.4k', label: 'En ligne' },
              { value: '156',  label: 'Connexions' },
              { value: '89',   label: 'Messages' },
            ].map(({ value, label }, i) => (
              <div key={label}>
                <motion.div style={{ color: '#D4AF37', fontSize: 20, fontWeight: 700 }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.32 }}>
                  {value}
                </motion.div>
                <div style={{ color: 'rgba(255,255,255,0.80)', fontSize: 11, marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div style={{ textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontStyle: 'italic', margin: 0, letterSpacing: '0.01em' }}>« Choisis ta voie, la communauté t'attend »</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
            <motion.div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.75)' }} animate={{ scale: [1, 1.55, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12 }}>Réseau actif · {(2418).toLocaleString('fr-FR')} membres en ligne</span>
          </div>
        </motion.div>
      </footer>
      <KauriBottomNav />
    </div>
  );
}

export default SocialHubGateway;
