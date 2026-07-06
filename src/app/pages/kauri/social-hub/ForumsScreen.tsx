import { useState } from 'react';
import { MessageCircle, Users, TrendingUp, Search, MoreVertical, ArrowLeft, Plus, Lock, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const TERRA  = '#B05B3B';
const TEAL   = '#006D77';
const GOLD   = '#D4AF37';
const BG     = '#F4F1EE';

// ── Mock data ─────────────────────────────────────────────────────────────────
const PUBLIC_SALONS = [
  { id: 's1', name: 'Immobilier Antilles', icon: TrendingUp, color: TEAL,    members: 234, unread: 12 },
  { id: 's2', name: 'Tech Diaspora',       icon: MessageCircle, color: GOLD, members: 189, unread: 8  },
  { id: 's3', name: 'Bons Plans',          icon: Users, color: TERRA,        members: 412, unread: 24 },
  { id: 's4', name: 'Entrepreneuriat',     icon: TrendingUp, color: '#7C3AED', members: 156, unread: 5 },
];

interface Conversation {
  id: string;
  name: string;
  emoji: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  memberCount?: number;
  isGroup: boolean;
  color?: string;
  members?: string[];
}

const STORED_KEY = 'kauri_private_groups';

function loadGroups(): Conversation[] {
  try {
    const saved = localStorage.getItem(STORED_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* noop */ }
  return [
    { id: 'g1', name: 'Tontine Famille', emoji: '🏠', lastMessage: 'Prochaine réunion vendredi 18h', time: 'Hier', unread: 7, isGroup: true, color: TEAL, memberCount: 6, members: ['Marie-Claire', 'Jean-Baptiste', 'Isabelle', '+3'] },
    { id: 'g2', name: 'Projet AgriCarib', emoji: '🌱', lastMessage: 'J\'ai envoyé le doc de synthèse', time: 'Il y a 2h', unread: 3, isGroup: true, color: '#059669', memberCount: 4, members: ['Amina', 'Marcus', 'Sophie', '+1'] },
  ];
}

const DIRECT_MESSAGES: Conversation[] = [
  { id: 'd1', name: 'Marie-Claire Dubois', emoji: '👩🏾', lastMessage: 'Super l\'idée du pot commun !', time: 'Il y a 5 min', unread: 3, online: true, isGroup: false },
  { id: 'd2', name: 'Jean-Baptiste Laurent', emoji: '👨🏾', lastMessage: 'Tu as vu le nouveau projet ?', time: 'Il y a 15 min', unread: 1, online: true, isGroup: false },
  { id: 'd3', name: 'Isabelle Moutoussamy', emoji: '👩🏽', lastMessage: 'Merci pour les conseils', time: 'Il y a 2h', unread: 0, online: false, isGroup: false },
  { id: 'd4', name: 'Marcus Johnson', emoji: '👨🏿', lastMessage: 'Excellent article diaspora', time: 'Il y a 3j', unread: 0, online: true, isGroup: false },
];

// ── Tab bar ───────────────────────────────────────────────────────────────────
type Tab = 'messages' | 'salons';

// ── Row component ─────────────────────────────────────────────────────────────
function ConvRow({ conv, onClick }: { conv: Conversation; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        background: '#fff',
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: conv.isGroup ? 16 : '50%',
          background: conv.color
            ? `linear-gradient(135deg, ${conv.color}DD, ${conv.color}88)`
            : 'linear-gradient(135deg, #006D77, #B05B3B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          {conv.emoji}
        </div>
        {/* Online dot for DMs */}
        {!conv.isGroup && conv.online !== undefined && (
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 12, height: 12, borderRadius: '50%',
            background: conv.online ? '#22c55e' : '#9CA3AF',
            border: '2px solid #fff',
          }} />
        )}
        {/* Group lock badge */}
        {conv.isGroup && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: TERRA, border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock style={{ width: 8, height: 8, color: '#fff' }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{conv.name}</span>
            {conv.isGroup && conv.memberCount && (
              <span style={{
                fontSize: 10, color: 'rgba(0,0,0,0.35)', fontWeight: 500,
                background: 'rgba(0,0,0,0.06)', borderRadius: 10,
                padding: '1px 6px',
              }}>
                {conv.memberCount}
              </span>
            )}
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{conv.time}</span>
        </div>
        <p style={{
          fontSize: 13, color: '#6B7280', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {conv.lastMessage}
        </p>
        {/* Member chips for groups */}
        {conv.isGroup && conv.members && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {conv.members.map(m => (
              <span key={m} style={{
                fontSize: 10, color: 'rgba(0,0,0,0.45)',
                background: 'rgba(0,0,0,0.05)', borderRadius: 10, padding: '1px 6px',
              }}>{m}</span>
            ))}
          </div>
        )}
      </div>

      {/* Unread badge */}
      {conv.unread > 0 && (
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          background: TERRA, color: '#fff',
          fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {conv.unread}
        </div>
      )}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ForumsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('messages');
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<Conversation[]>(loadGroups);

  // Refresh groups from localStorage when navigating back
  const refreshGroups = () => setGroups(loadGroups());

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  const filteredDMs = DIRECT_MESSAGES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const filteredSalons = PUBLIC_SALONS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <div style={{ background: TERRA, paddingTop: 14, paddingBottom: 0, flexShrink: 0, position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 12px' }}>
          {/* Back */}
          <button
            onClick={() => navigate('/kauri/social-hub-gateway')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px 6px 8px',
              background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(12px)',
              borderRadius: 20, border: '1px solid rgba(212,175,55,0.4)',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 120 120">
              <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0DCA0" /><stop offset="100%" stopColor="#C5A028" /></linearGradient></defs>
              <ellipse cx="60" cy="60" rx="46" ry="34" fill="url(#cg)" />
              <ellipse cx="60" cy="60" rx="34" ry="8" fill="#000" opacity="0.22" />
            </svg>
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Hub Social</span>
          </button>

          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.6)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: 20,
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Menu */}
          <button onClick={() => navigate('/kauri/social-hub/forums-menu')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MoreVertical style={{ width: 18, height: 18, color: '#fff' }} />
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', padding: '0 16px' }}>
          {([
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'salons', label: 'Salons publics', icon: Globe },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: tab === t.id ? '2px solid #fff' : '2px solid transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
                transition: 'all 0.2s',
              }}
            >
              <t.icon style={{ width: 14, height: 14 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <AnimatePresence mode="wait">

          {/* ── MESSAGES TAB ── */}
          {tab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* ── Section groupes privés ── */}
              <div style={{ background: '#fff', marginBottom: 8 }}>
                {/* Section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px 10px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: `${TERRA}18`, border: `1px solid ${TERRA}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Lock style={{ width: 12, height: 12, color: TERRA }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>Groupes privés</span>
                    <span style={{
                      fontSize: 10, color: TERRA, fontWeight: 700,
                      background: `${TERRA}15`, borderRadius: 10, padding: '2px 7px',
                    }}>
                      {filteredGroups.length}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/kauri/social-hub/creer-groupe-prive')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: TERRA, borderRadius: 20,
                      padding: '6px 12px', border: 'none', cursor: 'pointer',
                      color: '#fff', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <Plus style={{ width: 13, height: 13 }} />
                    Nouveau
                  </button>
                </div>

                {filteredGroups.length === 0 ? (
                  <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
                    <p style={{ color: '#6B7280', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                      Aucun groupe privé.<br />Créez-en un pour échanger en toute confidentialité.
                    </p>
                    <button
                      onClick={() => navigate('/kauri/social-hub/creer-groupe-prive')}
                      style={{
                        marginTop: 14, padding: '10px 20px', borderRadius: 20,
                        background: TERRA, border: 'none', color: '#fff',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <Plus style={{ width: 14, height: 14 }} />
                      Créer un groupe
                    </button>
                  </div>
                ) : (
                  filteredGroups.map(g => (
                    <ConvRow
                      key={g.id}
                      conv={g}
                      onClick={() => navigate(`/kauri/social-hub/conversation/${g.id}`, { state: { groupName: g.name, isGroup: true } })}
                    />
                  ))
                )}
              </div>

              {/* ── Section messages directs ── */}
              <div style={{ background: '#fff' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px 10px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: `${TEAL}18`, border: `1px solid ${TEAL}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MessageCircle style={{ width: 12, height: 12, color: TEAL }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>Messages directs</span>
                    <span style={{
                      fontSize: 10, color: TEAL, fontWeight: 700,
                      background: `${TEAL}15`, borderRadius: 10, padding: '2px 7px',
                    }}>
                      {filteredDMs.length}
                    </span>
                  </div>
                </div>

                {filteredDMs.map(d => (
                  <ConvRow
                    key={d.id}
                    conv={d}
                    onClick={() => navigate(`/kauri/social-hub/conversation/${d.id}`)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SALONS TAB ── */}
          {tab === 'salons' && (
            <motion.div key="salons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Info banner */}
              <div style={{
                margin: '12px 14px',
                background: `${TEAL}12`, borderRadius: 14,
                padding: '10px 14px',
                border: `1px solid ${TEAL}25`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Globe style={{ width: 16, height: 16, color: TEAL, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#4A4A4A', margin: 0, lineHeight: 1.5 }}>
                  Les salons sont <strong>publics</strong> — toute la communauté KAURI peut les rejoindre.
                  Pour des échanges privés, utilisez les <strong>groupes privés</strong>.
                </p>
              </div>

              {/* Salons list */}
              <div style={{ background: '#fff', borderRadius: 16, margin: '0 14px', overflow: 'hidden' }}>
                {filteredSalons.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/kauri/social-hub/salon/${s.id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', cursor: 'pointer',
                        borderBottom: i < filteredSalons.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                        background: `${s.color}18`, border: `1px solid ${s.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon style={{ width: 18, height: 18, color: s.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{s.name}</span>
                          <span style={{
                            fontSize: 9, color: s.color, fontWeight: 700,
                            background: `${s.color}15`, borderRadius: 10, padding: '1px 6px',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}>PUBLIC</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Users style={{ width: 11, height: 11 }} />
                            {s.members.toLocaleString('fr-FR')} membres
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {s.unread > 0 && (
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            background: TERRA, color: '#fff',
                            fontSize: 11, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {s.unread}
                          </div>
                        )}
                        <ChevronRight style={{ width: 16, height: 16, color: '#D1D5DB' }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Découvrir + Créer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 14px' }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/kauri/social-hub/decouvrir-salons')}
                  style={{
                    padding: '12px', borderRadius: 14, cursor: 'pointer',
                    background: `${TEAL}12`, border: `1px solid ${TEAL}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    color: TEAL, fontSize: 13, fontWeight: 600,
                  }}
                >
                  <Search style={{ width: 14, height: 14 }} />
                  Découvrir
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/kauri/social-hub/creer-salon')}
                  style={{
                    padding: '12px', borderRadius: 14, cursor: 'pointer',
                    background: `${TERRA}12`, border: `1px solid ${TERRA}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    color: TERRA, fontSize: 13, fontWeight: 600,
                  }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                  Créer un salon
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FAB : nouveau groupe privé (visible sur onglet messages) ── */}
      {tab === 'messages' && (
        <motion.button
          onClick={() => navigate('/kauri/social-hub/creer-groupe-prive')}
          style={{
            position: 'fixed', bottom: 28, right: 20,
            width: 56, height: 56, borderRadius: '50%',
            background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${TERRA}60`,
            zIndex: 40,
          }}
          whileTap={{ scale: 0.93 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
          title="Nouveau groupe privé"
        >
          <Plus style={{ width: 24, height: 24, color: '#fff' }} />
        </motion.button>
      )}
    </div>
  );
}
