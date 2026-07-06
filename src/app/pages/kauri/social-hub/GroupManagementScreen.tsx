import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Crown, Shield, User, UserPlus, UserMinus,
  Bell, BellOff, Link2, Copy, Check, LogOut, Trash2,
  ChevronDown, ChevronRight, Lock, Search, X, Edit3,
  CheckCircle, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Tokens ────────────────────────────────────────────────────────────────────
const TERRA = '#B05B3B';
const TEAL  = '#006D77';
const GOLD  = '#D4AF37';
const BG    = '#F4F1EE';

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = 'admin' | 'moderateur' | 'membre';

interface Member {
  id: string; name: string; initials: string; color: string;
  role: Role; online: boolean; joinedAt: string; isMe?: boolean;
}

interface GroupData {
  id: string; name: string; emoji: string; color: string;
  description: string; memberCount: number;
  whoCanInvite: 'admins' | 'tous';
  whoCanPost: 'tous' | 'admins';
  notifMode: 'tous' | 'mentions' | 'sourdine';
  inviteLinkActive: boolean;
  members: Member[];
}

// ── Mock connections to invite ────────────────────────────────────────────────
const CONNECTIONS_POOL = [
  { id: 'x1', name: 'Sophie Laurent',     initials: 'SL', color: TEAL,    online: true  },
  { id: 'x2', name: 'Amina Diallo',       initials: 'AD', color: '#EC4899', online: false },
  { id: 'x3', name: 'Jean-Baptiste Fond', initials: 'JF', color: '#7C3AED', online: false },
  { id: 'x4', name: 'Isabelle Moutoussamy', initials: 'IM', color: GOLD,  online: true  },
  { id: 'x5', name: 'Rodrigue Kambou',    initials: 'RK', color: '#059669', online: true },
];

const GROUP_EMOJIS = ['🤝','💼','🌱','🏠','💰','🌍','🎯','⚡','🔐','🌺','🚀','🎓','🛡️','🔑'];
const GROUP_COLORS = [TERRA, TEAL, GOLD, '#7C3AED', '#059669', '#0EA5E9', '#EC4899', '#F59E0B'];
const STORED_KEY = 'kauri_private_groups';

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleLabel(r: Role) {
  if (r === 'admin')     return { text: 'Admin',        icon: Crown,  color: GOLD };
  if (r === 'moderateur') return { text: 'Modérateur', icon: Shield, color: TEAL };
  return                         { text: 'Membre',      icon: User,   color: '#9CA3AF' };
}

function buildDefaultGroup(id: string, saved: Record<string, string> | null): GroupData {
  return {
    id,
    name: saved?.name ?? 'Groupe privé',
    emoji: saved?.emoji ?? '🤝',
    color: saved?.color ?? TERRA,
    description: saved?.description ?? '',
    memberCount: 3,
    whoCanInvite: 'tous',
    whoCanPost: 'tous',
    notifMode: 'tous',
    inviteLinkActive: false,
    members: [
      { id: 'me',  name: 'Vous',           initials: 'JD', color: TERRA,    role: 'admin',     online: true,  joinedAt: "Aujourd'hui", isMe: true },
      { id: 'm1',  name: 'Marie-Claire D.', initials: 'MC', color: '#8B5CF6', role: 'membre',   online: true,  joinedAt: 'Il y a 2h' },
      { id: 'm2',  name: 'Marcus Johnson',  initials: 'MJ', color: '#059669', role: 'membre',   online: false, joinedAt: 'Il y a 2h' },
    ],
  };
}

// ── Inline confirm modal ──────────────────────────────────────────────────────
function ConfirmModal({ title, body, confirmLabel, danger, onConfirm, onCancel }: {
  title: string; body: string; confirmLabel: string;
  danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        style={{ width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 36px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: danger ? '#FEF2F2' : `${TEAL}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {danger ? <AlertTriangle size={20} color="#EF4444" /> : <CheckCircle size={20} color={TEAL} />}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#1E293B' }}>{title}</p>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{body}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '13px', borderRadius: 14, background: '#F4F6F8', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onConfirm} style={{ flex: 1.5, padding: '13px', borderRadius: 14, border: 'none', background: danger ? '#EF4444' : TERRA, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Section header (collapsible) ──────────────────────────────────────────────
function SectionHeader({ emoji, title, subtitle, open, onToggle }: {
  emoji: string; title: string; subtitle?: string; open: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{title}</p>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{subtitle}</p>}
      </div>
      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown size={18} color="#9CA3AF" />
      </motion.div>
    </button>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, on, onChange, accent = TERRA }: {
  label: string; sub?: string; on: boolean; onChange: (v: boolean) => void; accent?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{label}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{sub}</p>}
      </div>
      <button onClick={() => onChange(!on)} style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: on ? accent : '#E5E7EB', border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.25s',
      }}>
        <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

// ── Radio row ─────────────────────────────────────────────────────────────────
function RadioRow({ label, sub, selected, onSelect }: {
  label: string; sub?: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <button onClick={onSelect} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      borderTop: '1px solid #F1F5F9',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: selected ? 700 : 500, color: selected ? '#1E293B' : '#374151' }}>{label}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{sub}</p>}
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? TERRA : '#D1D5DB'}`, background: selected ? TERRA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </div>
    </button>
  );
}

// ── Invite Sheet ──────────────────────────────────────────────────────────────
function InviteSheet({ existingIds, onInvite, onClose }: {
  existingIds: string[]; onInvite: (ids: string[]) => void; onClose: () => void;
}) {
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<string[]>([]);

  const available = CONNECTIONS_POOL.filter(c => !existingIds.includes(c.id));
  const filtered  = available.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }}
        onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 160, maxHeight: '75dvh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 10px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#1E293B' }}>Inviter des membres</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Parmi vos connexions KAURI</p>
          </div>
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="#64748B" />
          </button>
        </div>
        {/* Search */}
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              style={{ width: '100%', padding: '9px 14px 9px 34px', borderRadius: 20, background: '#F4F6F8', border: '1px solid #E5E7EB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '20px 0' }}>Aucune connexion disponible</p>
          ) : filtered.map((c, i) => (
            <motion.div key={c.id} whileTap={{ scale: 0.98 }} onClick={() => toggle(c.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', cursor: 'pointer', borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{c.initials}</div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: c.online ? '#22c55e' : '#D1D5DB', border: '2px solid #fff' }} />
              </div>
              <p style={{ flex: 1, margin: 0, fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{c.name}</p>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected.includes(c.id) ? TERRA : '#E5E7EB'}`, background: selected.includes(c.id) ? TERRA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {selected.includes(c.id) && <Check size={11} color="#fff" />}
              </div>
            </motion.div>
          ))}
        </div>
        {/* CTA */}
        <div style={{ padding: '12px 16px 28px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={() => { onInvite(selected); onClose(); }} disabled={selected.length === 0}
            style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: selected.length > 0 ? `linear-gradient(135deg, ${TERRA}, #8B3E24)` : '#E5E7EB', color: selected.length > 0 ? '#fff' : '#9CA3AF', fontSize: 14, fontWeight: 700, cursor: selected.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <UserPlus size={16} />
            {selected.length > 0 ? `Inviter ${selected.length} membre${selected.length > 1 ? 's' : ''}` : 'Sélectionner des membres'}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GroupManagementScreen() {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const location = useLocation();
  const isFirst  = (location.state as { isFirstTime?: boolean } | null)?.isFirstTime === true;

  // Load group from localStorage if available
  const [group, setGroup] = useState<GroupData>(() => {
    try {
      const stored = localStorage.getItem(STORED_KEY);
      if (stored) {
        const groups = JSON.parse(stored) as Record<string, string>[];
        const found  = groups.find((g: Record<string, string>) => g.id === id);
        if (found) return buildDefaultGroup(id ?? 'g1', found as Record<string, string>);
      }
    } catch { /* noop */ }
    return buildDefaultGroup(id ?? 'g1', null);
  });

  // Section open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identite: isFirst, membres: isFirst, roles: false, notifications: false, lien: false, danger: false,
  });
  const toggleSection = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }));

  // Editing states
  const [editingName, setEditingName]     = useState(false);
  const [nameVal, setNameVal]             = useState(group.name);
  const [descVal, setDescVal]             = useState(group.description);
  const [editingEmoji, setEditingEmoji]   = useState(false);

  // UI states
  const [showInvite, setShowInvite]       = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | { title: string; body: string; label: string; danger?: boolean; onConfirm: () => void }>(null);
  const [memberMenuId, setMemberMenuId]   = useState<string | null>(null);
  // Role picker sheet
  const [rolePicker, setRolePicker]       = useState<Member | null>(null);
  const [linkCopied, setLinkCopied]       = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editingName) nameInputRef.current?.focus(); }, [editingName]);

  const isAdmin = group.members.find(m => m.isMe)?.role === 'admin';

  // ── Persist changes ────────────────────────────────────────────────────────
  const persist = (updated: GroupData) => {
    try {
      const stored = localStorage.getItem(STORED_KEY);
      const groups = stored ? JSON.parse(stored) : [];
      const idx    = groups.findIndex((g: Record<string, string>) => g.id === updated.id);
      const entry  = { id: updated.id, name: updated.name, emoji: updated.emoji, color: updated.color, description: updated.description };
      if (idx >= 0) groups[idx] = { ...groups[idx], ...entry };
      else groups.unshift(entry);
      localStorage.setItem(STORED_KEY, JSON.stringify(groups));
    } catch { /* noop */ }
  };

  const update = (partial: Partial<GroupData>) => {
    setGroup(g => { const next = { ...g, ...partial }; persist(next); return next; });
  };

  // ── Member actions ─────────────────────────────────────────────────────────
  const changeRole = (memberId: string, role: Role) => {
    update({ members: group.members.map(m => m.id === memberId ? { ...m, role } : m) });
    toast.success(`Rôle mis à jour`);
    setMemberMenuId(null);
  };

  const removeMember = (member: Member) => {
    setConfirmAction({
      title: `Exclure ${member.name.split(' ')[0]} ?`,
      body: `${member.name.split(' ')[0]} sera retiré(e) du groupe. Il/Elle pourra être réinvité(e) plus tard.`,
      label: 'Exclure',
      danger: true,
      onConfirm: () => {
        update({ members: group.members.filter(m => m.id !== member.id), memberCount: group.memberCount - 1 });
        toast.success(`${member.name.split(' ')[0]} a été exclu(e)`);
        setConfirmAction(null);
      },
    });
    setMemberMenuId(null);
  };

  const inviteMembers = (ids: string[]) => {
    const newMembers: Member[] = ids.map(id => {
      const c = CONNECTIONS_POOL.find(x => x.id === id)!;
      return { id, name: c.name, initials: c.initials, color: c.color, role: 'membre', online: c.online, joinedAt: "À l'instant" };
    });
    update({ members: [...group.members, ...newMembers], memberCount: group.memberCount + newMembers.length });
    toast.success(`${newMembers.length} membre${newMembers.length > 1 ? 's' : ''} invité${newMembers.length > 1 ? 's' : ''} !`);
  };

  const copyInviteLink = () => {
    const link = `https://kauri.app/rejoindre/${group.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    setLinkCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // ── Card background gradient ───────────────────────────────────────────────
  const headerGrad = `linear-gradient(135deg, ${group.color}EE 0%, ${group.color}AA 100%)`;

  return (
    <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <div style={{ background: group.color, paddingBottom: 0, flexShrink: 0, position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Groupe privé</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Gérer · {group.name}</h1>
          </div>
          {isAdmin && (
            <div style={{ background: `${GOLD}30`, borderRadius: 20, padding: '4px 10px', border: `1px solid ${GOLD}50` }}>
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700 }}>👑 Admin</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* ── First time banner ── */}
        {isFirst && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ margin: '16px 14px 0', background: `linear-gradient(135deg, ${group.color}18, ${group.color}08)`, borderRadius: 16, padding: '14px 16px', border: `1px solid ${group.color}30`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🎉</span>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1E293B' }}>Votre cercle est créé !</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Personnalisez-le et invitez vos premiers membres pour commencer à échanger.</p>
            </div>
          </motion.div>
        )}

        {/* ── Group identity card ── */}
        <div style={{ margin: '16px 14px 0', background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
          {/* Color band + avatar */}
          <div style={{ height: 60, background: headerGrad, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -24, left: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => isAdmin && setEditingEmoji(v => !v)}
                style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, ${group.color}CC, ${group.color}88)`,
                  border: '3px solid #fff', fontSize: 22, cursor: isAdmin ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}>
                {group.emoji}
              </button>
            </div>
          </div>

          {/* Emoji picker (admin only) */}
          <AnimatePresence>
            {editingEmoji && isAdmin && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', padding: '0 14px', marginTop: 8, background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ padding: '10px 0' }}>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Choisir une icône</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 12 }}>
                    {GROUP_EMOJIS.map(e => (
                      <button key={e} onClick={() => { update({ emoji: e }); setEditingEmoji(false); }}
                        style={{ aspectRatio: '1', borderRadius: 10, fontSize: 18, background: group.emoji === e ? `${group.color}20` : '#F3F4F6', border: `2px solid ${group.emoji === e ? group.color : 'transparent'}`, cursor: 'pointer' }}>
                        {e}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Couleur</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {GROUP_COLORS.map(c => (
                      <button key={c} onClick={() => update({ color: c })}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `3px solid ${group.color === c ? '#1A1A1A' : 'transparent'}`, cursor: 'pointer', boxShadow: group.color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none', transition: 'all 0.15s' }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + member count */}
          <div style={{ padding: '34px 18px 14px' }}>
            {editingName && isAdmin ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input ref={nameInputRef} value={nameVal} onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { update({ name: nameVal }); setEditingName(false); } if (e.key === 'Escape') { setNameVal(group.name); setEditingName(false); } }}
                  maxLength={40}
                  style={{ flex: 1, fontSize: 18, fontWeight: 800, color: '#1E293B', border: 'none', borderBottom: `2px solid ${group.color}`, outline: 'none', padding: '4px 0', background: 'transparent', fontFamily: 'inherit' }} />
                <button onClick={() => { update({ name: nameVal }); setEditingName(false); toast.success('Nom mis à jour'); }}
                  style={{ background: group.color, border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>OK</button>
                <button onClick={() => { setNameVal(group.name); setEditingName(false); }}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}><X size={14} color="#9CA3AF" /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>{group.name}</p>
                {isAdmin && (
                  <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Edit3 size={14} color="#9CA3AF" />
                  </button>
                )}
              </div>
            )}

            {/* Description */}
            <textarea value={descVal}
              onChange={e => setDescVal(e.target.value)}
              onBlur={() => { if (descVal !== group.description) { update({ description: descVal }); toast.success('Description mise à jour'); } }}
              disabled={!isAdmin}
              placeholder={isAdmin ? "Ajoutez une description de votre groupe..." : "Aucune description"}
              rows={2}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#64748B', resize: 'none', fontFamily: 'inherit', lineHeight: 1.55, boxSizing: 'border-box', cursor: isAdmin ? 'text' : 'default', padding: 0 }} />

            {/* Stats */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lock size={10} /> Groupe privé
              </span>
              <span style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                · {group.memberCount} membre{group.memberCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ── SECTION: Membres ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="👥" title="Les membres" subtitle={`${group.members.length} personne${group.members.length > 1 ? 's' : ''} dans ce cercle`} open={openSections.membres} onToggle={() => toggleSection('membres')} />

          <AnimatePresence>
            {openSections.membres && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                {/* Invite button */}
                {isAdmin && (
                  <button onClick={() => setShowInvite(true)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: `${group.color}08`, border: 'none', borderTop: '1px solid #F1F5F9', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${group.color}20`, border: `1.5px dashed ${group.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <UserPlus size={15} color={group.color} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: group.color }}>Inviter des membres</p>
                  </button>
                )}

                {/* Member list */}
                {group.members.map((member) => {
                  const rl = roleLabel(member.role);
                  const RoleIcon = rl.icon;
                  return (
                    <div key={member.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: 42, height: 42, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{member.initials}</div>
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: member.online ? '#22c55e' : '#D1D5DB', border: '2px solid #fff' }} />
                        </div>

                        {/* Name + joined */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</p>
                            {member.isMe && <span style={{ fontSize: 10, color: '#9CA3AF', background: '#F3F4F6', borderRadius: 10, padding: '1px 6px', flexShrink: 0 }}>Vous</span>}
                          </div>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>rejoint {member.joinedAt}</span>
                        </div>

                        {/* ── Role badge — cliquable si admin ── */}
                        <button
                          onClick={() => isAdmin && !member.isMe && setRolePicker(member)}
                          disabled={!isAdmin || !!member.isMe}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 10px', borderRadius: 20, flexShrink: 0,
                            background: `${rl.color}15`,
                            border: `1.5px solid ${rl.color}40`,
                            cursor: isAdmin && !member.isMe ? 'pointer' : 'default',
                            transition: 'all 0.15s',
                          }}
                        >
                          <RoleIcon size={11} color={rl.color} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: rl.color }}>{rl.text}</span>
                          {isAdmin && !member.isMe && (
                            <span style={{ fontSize: 10, color: rl.color, opacity: 0.7 }}>▾</span>
                          )}
                        </button>

                        {/* Exclure — icône séparée */}
                        {isAdmin && !member.isMe && (
                          <button onClick={() => removeMember(member)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, opacity: 0.45, transition: 'opacity 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
                            title="Exclure">
                            <UserMinus size={15} color="#EF4444" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Rôles & permissions ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="🔑" title="Règles de vie" subtitle="Permissions & accès au groupe" open={openSections.roles} onToggle={() => toggleSection('roles')} />
          <AnimatePresence>
            {openSections.roles && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, padding: '4px 18px 8px', fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: '1px solid #F1F5F9' }}>
                  Qui peut inviter ?
                </p>
                <RadioRow label="Tous les membres" sub="Chacun peut inviter ses connexions" selected={group.whoCanInvite === 'tous'} onSelect={() => isAdmin && update({ whoCanInvite: 'tous' })} />
                <RadioRow label="Admins uniquement" sub="Seuls les admins gèrent les invitations" selected={group.whoCanInvite === 'admins'} onSelect={() => isAdmin && update({ whoCanInvite: 'admins' })} />

                <p style={{ margin: 0, padding: '10px 18px 8px', fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: '1px solid #F1F5F9' }}>
                  Qui peut écrire ?
                </p>
                <RadioRow label="Tout le monde" sub="Tous les membres peuvent envoyer des messages" selected={group.whoCanPost === 'tous'} onSelect={() => isAdmin && update({ whoCanPost: 'tous' })} />
                <RadioRow label="Admins seulement" sub="Mode lecture pour les autres membres" selected={group.whoCanPost === 'admins'} onSelect={() => isAdmin && update({ whoCanPost: 'admins' })} />

                {!isAdmin && <p style={{ margin: 0, padding: '10px 18px', fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', borderTop: '1px solid #F1F5F9' }}>Seuls les admins peuvent modifier ces règles.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Notifications ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="🔔" title="Notifications" subtitle={group.notifMode === 'sourdine' ? 'Sourdine activée' : group.notifMode === 'mentions' ? 'Mentions uniquement' : 'Toutes les notifs'} open={openSections.notifications} onToggle={() => toggleSection('notifications')} />
          <AnimatePresence>
            {openSections.notifications && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                {[
                  { value: 'tous',     label: 'Tous les messages',  sub: 'Chaque message vous notifie',        icon: '🔔' },
                  { value: 'mentions', label: 'Mentions seulement', sub: 'Seulement quand on vous cite',      icon: '🏷️' },
                  { value: 'sourdine', label: 'Sourdine',           sub: 'Aucune notification pour ce groupe', icon: '🔕' },
                ].map((opt, i) => (
                  <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid #F1F5F9', cursor: 'pointer' }}
                    onClick={() => update({ notifMode: opt.value as GroupData['notifMode'] })}>
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: group.notifMode === opt.value ? 700 : 500, color: '#1E293B' }}>{opt.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{opt.sub}</p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${group.notifMode === opt.value ? TERRA : '#D1D5DB'}`, background: group.notifMode === opt.value ? TERRA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {group.notifMode === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Lien d'invitation ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="🔗" title="Lien d'invitation" subtitle={group.inviteLinkActive ? 'Lien actif' : 'Lien désactivé'} open={openSections.lien} onToggle={() => toggleSection('lien')} />
          <AnimatePresence>
            {openSections.lien && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', borderTop: '1px solid #F1F5F9' }}>
                <ToggleRow label="Lien d'invitation actif" sub="Toute personne avec le lien peut rejoindre" on={group.inviteLinkActive} onChange={v => update({ inviteLinkActive: v })} />
                {group.inviteLinkActive && (
                  <div style={{ padding: '10px 18px 14px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#F4F6F8', borderRadius: 12, padding: '10px 14px' }}>
                      <Link2 size={14} color="#9CA3AF" />
                      <p style={{ flex: 1, margin: 0, fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        kauri.app/rejoindre/{group.id}
                      </p>
                      <button onClick={copyInviteLink}
                        style={{ background: linkCopied ? '#ECFDF5' : group.color, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        {linkCopied ? <><CheckCircle size={13} color="#059669" /><span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>Copié !</span></> : <><Copy size={13} color="#fff" /><span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Copier</span></>}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Zone de danger ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #FECACA', overflow: 'hidden' }}>
          <SectionHeader emoji="⚠️" title="Zone de danger" subtitle="Actions irréversibles" open={openSections.danger} onToggle={() => toggleSection('danger')} />
          <AnimatePresence>
            {openSections.danger && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setConfirmAction({ title: 'Quitter le groupe ?', body: `Vous quitterez "${group.name}". Vous pourrez être réinvité(e) plus tard.`, label: 'Quitter', danger: true, onConfirm: () => navigate('/kauri/social-hub/forums') })}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FEF2F2', border: 'none', borderTop: '1px solid #FEE2E2', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LogOut size={16} color="#EF4444" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#EF4444' }}>Quitter le groupe</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#F87171' }}>Vous perdrez l'accès aux messages</p>
                  </div>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setConfirmAction({ title: `Supprimer "${group.name}" ?`, body: 'Cette action est irréversible. Tous les messages seront perdus et les membres perdront l\'accès.', label: 'Supprimer définitivement', danger: true, onConfirm: () => { toast.success('Groupe supprimé'); navigate('/kauri/social-hub/forums'); } })}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFF5F5', border: 'none', borderTop: '1px solid #FEE2E2', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Trash2 size={16} color="#DC2626" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Supprimer le groupe</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#F87171' }}>Action irréversible — tous les messages seront perdus</p>
                    </div>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* ── OVERLAYS ── */}
      {showInvite && (
        <InviteSheet
          existingIds={group.members.map(m => m.id)}
          onInvite={inviteMembers}
          onClose={() => setShowInvite(false)}
        />
      )}

      <AnimatePresence>
        {confirmAction && (
          <ConfirmModal
            title={confirmAction.title}
            body={confirmAction.body}
            confirmLabel={confirmAction.label}
            danger={confirmAction.danger}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Role picker sheet ── */}
      <AnimatePresence>
        {rolePicker && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }}
              onClick={() => setRolePicker(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 160, overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}>

              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>

              {/* Who */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: rolePicker.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {rolePicker.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#1E293B' }}>{rolePicker.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Choisir son rôle dans le groupe</p>
                </div>
              </div>

              {/* Role options */}
              <div style={{ padding: '8px 16px 12px' }}>
                {([
                  { role: 'admin' as Role,
                    title: '👑 Admin',
                    desc: 'Gère le groupe, les membres et tous les paramètres. Rôle de confiance.',
                  },
                  { role: 'moderateur' as Role,
                    title: '🛡️ Modérateur',
                    desc: 'Peut exclure des membres et modérer les messages. Pas de gestion complète.',
                  },
                  { role: 'membre' as Role,
                    title: '👤 Membre',
                    desc: 'Participe aux échanges. Aucun droit de gestion.',
                  },
                ]).map(opt => {
                  const isCurrentRole = rolePicker.role === opt.role;
                  const rl = roleLabel(opt.role);
                  return (
                    <motion.button
                      key={opt.role}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { changeRole(rolePicker.id, opt.role); setRolePicker(null); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', marginBottom: 8, borderRadius: 16,
                        background: isCurrentRole ? `${rl.color}12` : '#F9FAFB',
                        border: `1.5px solid ${isCurrentRole ? rl.color : '#E5E7EB'}`,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: isCurrentRole ? `${rl.color}20` : '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <rl.icon size={18} color={isCurrentRole ? rl.color : '#9CA3AF'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isCurrentRole ? rl.color : '#1E293B' }}>{opt.title}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{opt.desc}</p>
                      </div>
                      {isCurrentRole && (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: rl.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Exclure */}
              <div style={{ padding: '0 16px 32px' }}>
                <button onClick={() => { setRolePicker(null); removeMember(rolePicker); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, background: '#FEF2F2', border: '1px solid #FECACA', cursor: 'pointer' }}>
                  <UserMinus size={15} color="#EF4444" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Exclure {rolePicker.name.split(' ')[0]} du groupe</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
