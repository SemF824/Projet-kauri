import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Lock, Search, X, Users, Bell, Image } from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const TERRA  = '#B05B3B';
const TEAL   = '#006D77';
const GOLD   = '#D4AF37';
const BG     = '#F4F1EE';
const CARD   = '#fff';

// ── Mock connections ──────────────────────────────────────────────────────────
const CONNECTIONS = [
  { id: 'c1', name: 'Marie-Claire Dubois',    emoji: '👩🏾', role: 'Investisseuse', online: true  },
  { id: 'c2', name: 'Jean-Baptiste Laurent',  emoji: '👨🏾', role: 'Entrepreneur',  online: true  },
  { id: 'c3', name: 'Isabelle Moutoussamy',   emoji: '👩🏽', role: 'Coach Business', online: false },
  { id: 'c4', name: 'Marcus Johnson',         emoji: '👨🏿', role: 'Dev Blockchain', online: true  },
  { id: 'c5', name: 'Amina Diallo',           emoji: '👩🏾', role: 'Microfinance',   online: false },
  { id: 'c6', name: 'Sophie Laurent',         emoji: '👩🏻', role: 'CEO GreenTech',  online: true  },
  { id: 'c7', name: 'Jean-Baptiste Fond',     emoji: '👨🏽', role: 'Agri Bio',       online: false },
];

const GROUP_EMOJIS = ['🤝', '💼', '🌱', '🏠', '💰', '🌍', '🎯', '⚡', '🔐', '🌺', '🚀', '🎓'];
const GROUP_COLORS = [TERRA, TEAL, GOLD, '#7C3AED', '#059669', '#0EA5E9', '#EC4899', '#F59E0B'];

const STEPS = ['Identité', 'Membres', 'Paramètres'];

// ── Stored key ────────────────────────────────────────────────────────────────
const STORED_KEY = 'kauri_private_groups';

function loadGroups(): unknown[] {
  try { const s = localStorage.getItem(STORED_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CreerGroupePriveScreen() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🤝');
  const [color, setColor] = useState(TERRA);
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [inviteLink, setInviteLink] = useState(false);

  const filteredConnections = CONNECTIONS.filter(c =>
    c.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return selectedMembers.length >= 1;
    return true;
  };

  const handleCreate = () => {
    const members = CONNECTIONS.filter(c => selectedMembers.includes(c.id));
    const memberNames = members.map(m => m.name.split(' ')[0]);
    if (memberNames.length > 3) memberNames.splice(3, memberNames.length - 3, `+${memberNames.length - 3}`);

    const newGroup = {
      id: `g_${Date.now()}`,
      name: name.trim(),
      emoji,
      lastMessage: 'Groupe créé • Commencez à discuter !',
      time: 'À l\'instant',
      unread: 0,
      isGroup: true,
      color,
      memberCount: selectedMembers.length + 1,
      members: memberNames,
    };

    const existing = loadGroups();
    localStorage.setItem(STORED_KEY, JSON.stringify([newGroup, ...existing]));
    navigate(`/kauri/social-hub/groupe/${newGroup.id}/gerer`, {
      state: { isFirstTime: true },
    });
  };

  // ── Step 0 : Identité ─────────────────────────────────────────────────────
  const StepIdentite = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Aperçu avatar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: `linear-gradient(135deg, ${color}EE, ${color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: `0 8px 28px ${color}50`,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {emoji}
        </motion.div>
      </div>

      {/* Emoji picker */}
      <div>
        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Icône du groupe
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {GROUP_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                aspectRatio: '1', borderRadius: 12, fontSize: 20,
                background: emoji === e ? `${color}20` : '#F9FAFB',
                border: `2px solid ${emoji === e ? color : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          Couleur
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {GROUP_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 32, height: 32, borderRadius: '50%', background: c,
                border: `3px solid ${c === color ? '#1A1A1A' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: c === color ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Nom */}
      <div>
        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Nom du groupe <span style={{ color: TERRA }}>*</span>
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: Projet AgriCarib, Tontine Famille…"
          maxLength={40}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: '#F9FAFB', border: `1.5px solid ${name.length >= 2 ? color : '#E5E7EB'}`,
            fontSize: 14, color: '#1A1A1A', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
          }}
        />
        <p style={{ color: '#9CA3AF', fontSize: 11, margin: '6px 0 0', textAlign: 'right' }}>{name.length}/40</p>
      </div>

      {/* Description */}
      <div>
        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Description (optionnel)
        </p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Quel est l'objet de ce groupe ?"
          maxLength={120}
          rows={3}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: '#F9FAFB', border: '1.5px solid #E5E7EB',
            fontSize: 13, color: '#1A1A1A', outline: 'none',
            boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit', lineHeight: 1.55,
          }}
        />
      </div>
    </div>
  );

  // ── Step 1 : Membres ──────────────────────────────────────────────────────
  const StepMembres = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Selected chips */}
      {selectedMembers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {selectedMembers.map(id => {
            const c = CONNECTIONS.find(c => c.id === id)!;
            return (
              <motion.div
                key={id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: `${color}18`, border: `1px solid ${color}40`,
                  borderRadius: 20, padding: '5px 10px 5px 7px',
                }}
              >
                <span style={{ fontSize: 16 }}>{c.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>
                  {c.name.split(' ')[0]}
                </span>
                <button
                  onClick={() => toggleMember(id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <X style={{ width: 13, height: 13, color: '#9CA3AF' }} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#9CA3AF' }} />
        <input
          value={memberSearch}
          onChange={e => setMemberSearch(e.target.value)}
          placeholder="Rechercher dans vos connexions…"
          style={{
            width: '100%', padding: '11px 14px 11px 36px', borderRadius: 14,
            background: '#F9FAFB', border: '1.5px solid #E5E7EB',
            fontSize: 13, color: '#1A1A1A', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Connections list */}
      <div style={{ background: CARD, borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
        {filteredConnections.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '20px 0' }}>
            Aucun résultat
          </p>
        ) : (
          filteredConnections.map((c, i) => {
            const selected = selectedMembers.includes(c.id);
            return (
              <motion.div
                key={c.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMember(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', cursor: 'pointer',
                  borderBottom: i < filteredConnections.length - 1 ? '1px solid #F3F4F6' : 'none',
                  background: selected ? `${color}08` : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>{c.emoji}</div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 12, height: 12, borderRadius: '50%',
                    background: c.online ? '#22c55e' : '#D1D5DB',
                    border: '2px solid #fff',
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', margin: '0 0 2px' }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{c.role}</p>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: selected ? color : '#F3F4F6',
                  border: `2px solid ${selected ? color : '#E5E7EB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {selected && <Check style={{ width: 12, height: 12, color: '#fff' }} />}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', margin: 0 }}>
        {selectedMembers.length} connexion{selectedMembers.length > 1 ? 's' : ''} sélectionnée{selectedMembers.length > 1 ? 's' : ''}
        {selectedMembers.length === 0 && ' — min. 1 requis'}
      </p>
    </div>
  );

  // ── Step 2 : Paramètres ───────────────────────────────────────────────────
  const StepParametres = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Privacy note */}
      <div style={{
        background: `${TERRA}10`, borderRadius: 14,
        padding: '12px 14px', border: `1px solid ${TERRA}25`,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Lock style={{ width: 16, height: 16, color: TERRA, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ color: TERRA, fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>Groupe 100% privé</p>
          <p style={{ color: '#6B7280', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            Seuls les membres invités peuvent voir les messages. Ce groupe n'apparaît pas dans les salons publics.
          </p>
        </div>
      </div>

      {/* Aperçu */}
      <div style={{ background: CARD, borderRadius: 16, padding: '14px', border: '1px solid #E5E7EB' }}>
        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
          Aperçu
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${color}EE, ${color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{emoji}</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 3px' }}>{name || 'Nom du groupe'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users style={{ width: 12, height: 12, color: '#9CA3AF' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                {selectedMembers.length + 1} membre{selectedMembers.length > 0 ? 's' : ''}
              </span>
              <span style={{ color: '#E5E7EB' }}>·</span>
              <Lock style={{ width: 11, height: 11, color: TERRA }} />
              <span style={{ fontSize: 12, color: TERRA, fontWeight: 600 }}>Privé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      {[
        {
          icon: Bell, label: 'Notifications actives',
          desc: 'Recevoir une alerte pour chaque nouveau message',
          value: notifications, set: setNotifications, color: '#22c55e',
        },
        {
          icon: Image, label: 'Lien d\'invitation',
          desc: 'Générer un lien pour inviter d\'autres membres facilement',
          value: inviteLink, set: setInviteLink, color: TEAL,
        },
      ].map(opt => (
        <div key={opt.label} style={{
          background: CARD, borderRadius: 16, padding: '14px',
          border: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: opt.value ? `${opt.color}18` : '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
            <opt.icon style={{ width: 16, height: 16, color: opt.value ? opt.color : '#9CA3AF' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: '0 0 2px' }}>{opt.label}</p>
            <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
          </div>
          <button
            onClick={() => opt.set(v => !v)}
            style={{
              width: 44, height: 24, borderRadius: 12, flexShrink: 0, border: 'none', cursor: 'pointer',
              background: opt.value ? opt.color : '#E5E7EB', position: 'relative', transition: 'background 0.25s',
            }}
          >
            <motion.div
              animate={{ x: opt.value ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute', top: 2, width: 20, height: 20,
                borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const stepContent = [StepIdentite, StepMembres, StepParametres];

  return (
    <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: TERRA, padding: '14px 16px 16px',
        flexShrink: 0, position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18, color: '#fff' }} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
              Groupe privé
            </p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>
              {STEPS[step]}
            </h1>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 120px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '14px 16px 32px',
        background: `linear-gradient(to top, ${BG} 70%, transparent)`,
      }}>
        <motion.button
          onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleCreate}
          disabled={!canProceed()}
          whileTap={canProceed() ? { scale: 0.97 } : undefined}
          style={{
            width: '100%', padding: '16px', borderRadius: 18,
            background: canProceed()
              ? `linear-gradient(135deg, ${TERRA}, #8B3E24)`
              : '#E5E7EB',
            border: 'none',
            color: canProceed() ? '#fff' : '#9CA3AF',
            fontSize: 15, fontWeight: 700,
            cursor: canProceed() ? 'pointer' : 'not-allowed',
            boxShadow: canProceed() ? `0 6px 20px ${TERRA}50` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
        >
          {step < STEPS.length - 1 ? (
            <>Continuer <ArrowRight style={{ width: 18, height: 18 }} /></>
          ) : (
            <>
              <Lock style={{ width: 18, height: 18 }} />
              Créer le groupe privé
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
