import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Crown, Shield, User, Users, Bell, BellOff,
  Pin, Trash2, LogOut, Flag, Hash, Globe, Lock,
  ChevronDown, Edit3, X, Check, AlertTriangle,
  CheckCircle, MessageSquare, UserMinus, Settings,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Tokens ────────────────────────────────────────────────────────────────────
const TERRA = '#B05B3B';
const TEAL  = '#006D77';
const GOLD  = '#D4AF37';

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = 'admin' | 'moderateur' | 'membre';

interface SalonMember {
  id: string; name: string; initials: string; color: string;
  role: Role; online: boolean; joinedAt: string; isMe?: boolean;
  messageCount: number;
}

interface PinnedMessage {
  id: string; author: string; text: string; pinnedAt: string;
}

interface SalonData {
  id: string; name: string; emoji: string; color: string;
  description: string; category: string; isPublic: boolean;
  memberCount: number; messageCount: number;
  whoCanPost: 'tous' | 'admins';
  notifMode: 'tous' | 'mentions' | 'sourdine';
  slowMode: boolean; slowDelaySecs: number;
  members: SalonMember[];
  pinnedMessages: PinnedMessage[];
}

// ── Static salon data ─────────────────────────────────────────────────────────
const SALONS_DATA: Record<string, SalonData> = {
  's1': {
    id: 's1', name: 'Immobilier Antilles', emoji: '🏘️', color: TEAL,
    description: 'Investissement, location & tendances du marché immobilier caribéen',
    category: 'Immobilier', isPublic: true,
    memberCount: 234, messageCount: 1847,
    whoCanPost: 'tous', notifMode: 'tous', slowMode: false, slowDelaySecs: 30,
    pinnedMessages: [
      { id: 'p1', author: 'Sophie Laurent', text: '📌 Webinaire investissement – Vendredi 19h (lien en bio)', pinnedAt: 'Il y a 2j' },
    ],
    members: [
      { id: 'me',  name: 'Vous',             initials: 'JD', color: TERRA,    role: 'admin',     online: true,  joinedAt: 'Il y a 3 mois', isMe: true, messageCount: 42 },
      { id: 'm1',  name: 'Sophie Laurent',   initials: 'SL', color: TEAL,     role: 'moderateur',online: true,  joinedAt: 'Il y a 3 mois', messageCount: 156 },
      { id: 'm2',  name: 'Isabelle M.',      initials: 'IM', color: GOLD,     role: 'membre',    online: true,  joinedAt: 'Il y a 2 mois', messageCount: 89 },
      { id: 'm3',  name: 'Jean-Baptiste F.', initials: 'JF', color: '#8B5CF6',role: 'membre',    online: false, joinedAt: 'Il y a 1 mois', messageCount: 34 },
      { id: 'm4',  name: 'Marcus Johnson',   initials: 'MJ', color: '#059669',role: 'membre',    online: true,  joinedAt: 'Il y a 3 sem.', messageCount: 67 },
    ],
  },
  's2': {
    id: 's2', name: 'Tech Diaspora', emoji: '⚡', color: GOLD,
    description: 'Startups, IA, blockchain & innovation technologique de la diaspora',
    category: 'Tech', isPublic: true,
    memberCount: 189, messageCount: 923,
    whoCanPost: 'tous', notifMode: 'mentions', slowMode: false, slowDelaySecs: 15,
    pinnedMessages: [],
    members: [
      { id: 'me',  name: 'Vous',           initials: 'JD', color: TERRA,    role: 'membre', online: true,  joinedAt: 'Il y a 1 mois', isMe: true, messageCount: 12 },
      { id: 'm1',  name: 'Marcus Johnson', initials: 'MJ', color: '#059669',role: 'admin',  online: true,  joinedAt: 'Il y a 5 mois', messageCount: 312 },
      { id: 'm2',  name: 'Amina Diallo',   initials: 'AD', color: TERRA,    role: 'membre', online: false, joinedAt: 'Il y a 4 mois', messageCount: 78 },
      { id: 'm3',  name: 'Sophie Laurent', initials: 'SL', color: TEAL,     role: 'membre', online: true,  joinedAt: 'Il y a 2 mois', messageCount: 45 },
    ],
  },
  's3': {
    id: 's3', name: 'Bons Plans Vie Chère', emoji: '💡', color: TERRA,
    description: 'Astuces, deals & économies du quotidien pour la communauté',
    category: 'Quotidien', isPublic: true,
    memberCount: 412, messageCount: 4210,
    whoCanPost: 'tous', notifMode: 'sourdine', slowMode: true, slowDelaySecs: 60,
    pinnedMessages: [
      { id: 'p1', author: 'Marie-Claire D.', text: '🛒 Liste des marchés bio à tarif réduit — mise à jour hebdo', pinnedAt: 'Il y a 5j' },
      { id: 'p2', author: 'Jean-Baptiste F.', text: '💡 Astuce assurance : -15% avec le code KAURI2025', pinnedAt: 'Il y a 2 sem.' },
    ],
    members: [
      { id: 'me',  name: 'Vous',              initials: 'JD', color: TERRA,    role: 'membre', online: true,  joinedAt: 'Il y a 6 mois', isMe: true, messageCount: 23 },
      { id: 'm1',  name: 'Marie-Claire D.',   initials: 'MC', color: '#8B5CF6',role: 'admin',  online: true,  joinedAt: 'Il y a 1 an',   messageCount: 891 },
      { id: 'm2',  name: 'Isabelle M.',       initials: 'IM', color: GOLD,     role: 'moderateur', online: false, joinedAt: 'Il y a 8 mois', messageCount: 234 },
      { id: 'm3',  name: 'Jean-Baptiste F.',  initials: 'JF', color: '#8B5CF6',role: 'membre', online: false, joinedAt: 'Il y a 5 mois', messageCount: 112 },
      { id: 'm4',  name: 'Amina Diallo',      initials: 'AD', color: TEAL,     role: 'membre', online: true,  joinedAt: 'Il y a 3 mois', messageCount: 67 },
    ],
  },
  's4': {
    id: 's4', name: 'Entrepreneuriat', emoji: '🚀', color: TEAL,
    description: 'Business, levée de fonds & développement de projets communautaires',
    category: 'Business', isPublic: true,
    memberCount: 156, messageCount: 687,
    whoCanPost: 'tous', notifMode: 'tous', slowMode: false, slowDelaySecs: 30,
    pinnedMessages: [],
    members: [
      { id: 'me',  name: 'Vous',             initials: 'JD', color: TERRA,    role: 'admin', online: true,  joinedAt: 'Il y a 2 mois', isMe: true, messageCount: 34 },
      { id: 'm1',  name: 'Sophie Laurent',   initials: 'SL', color: TEAL,     role: 'membre',online: true,  joinedAt: 'Il y a 2 mois', messageCount: 89 },
      { id: 'm2',  name: 'Isabelle M.',      initials: 'IM', color: GOLD,     role: 'membre',online: true,  joinedAt: 'Il y a 1 mois', messageCount: 56 },
      { id: 'm3',  name: 'Jean-Baptiste F.', initials: 'JF', color: '#8B5CF6',role: 'membre',online: false, joinedAt: 'Il y a 3 sem.', messageCount: 23 },
    ],
  },
};

function buildFallbackSalon(id: string): SalonData {
  return {
    id, name: `Salon #${id}`, emoji: '💬', color: TERRA,
    description: 'Salon de discussion', category: 'Général', isPublic: true,
    memberCount: 5, messageCount: 12,
    whoCanPost: 'tous', notifMode: 'tous', slowMode: false, slowDelaySecs: 30,
    pinnedMessages: [],
    members: [
      { id: 'me', name: 'Vous', initials: 'JD', color: TERRA, role: 'admin', online: true, joinedAt: "Aujourd'hui", isMe: true, messageCount: 0 },
    ],
  };
}

function roleLabel(r: Role) {
  if (r === 'admin')      return { text: 'Admin',       icon: Crown,  color: GOLD };
  if (r === 'moderateur') return { text: 'Modérateur',  icon: Shield, color: TEAL };
  return                         { text: 'Membre',       icon: User,   color: '#9CA3AF' };
}

// ── Reusable atoms ────────────────────────────────────────────────────────────
function SectionHeader({ emoji, title, subtitle, open, onToggle }: {
  emoji: string; title: string; subtitle?: string; open: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
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

function ToggleRow({ label, sub, on, onChange, accent = TERRA }: {
  label: string; sub?: string; on: boolean; onChange: (v: boolean) => void; accent?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{label}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{sub}</p>}
      </div>
      <button onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, flexShrink: 0, background: on ? accent : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s' }}>
        <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

function RadioRow({ label, sub, selected, onSelect }: { label: string; sub?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'none', border: 'none', borderTop: '1px solid #F1F5F9', cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: selected ? 700 : 500, color: '#1E293B' }}>{label}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{sub}</p>}
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? TERRA : '#D1D5DB'}`, background: selected ? TERRA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </div>
    </button>
  );
}

function ConfirmModal({ title, body, confirmLabel, danger, onConfirm, onCancel }: {
  title: string; body: string; confirmLabel: string; danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        style={{ width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 36px' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: danger ? '#FEF2F2' : `${TEAL}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {danger ? <AlertTriangle size={20} color="#EF4444" /> : <CheckCircle size={20} color={TEAL} />}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#1E293B' }}>{title}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{body}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '13px', borderRadius: 14, background: '#F4F6F8', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
          <button onClick={onConfirm} style={{ flex: 1.5, padding: '13px', borderRadius: 14, border: 'none', background: danger ? '#EF4444' : TERRA, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{confirmLabel}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SalonManagementScreen() {
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const location  = useLocation();
  const isFirst   = (location.state as { isFirstTime?: boolean } | null)?.isFirstTime === true;
  const salonId   = id ?? 's1';

  const [salon, setSalon]   = useState<SalonData>(() => SALONS_DATA[salonId] ?? buildFallbackSalon(salonId));
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    infos: isFirst, communaute: isFirst, moderation: false,
    epingles: false, notifications: false, danger: false,
  });
  const toggleSection = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }));

  const [editingName, setEditingName]   = useState(false);
  const [nameVal, setNameVal]           = useState(salon.name);
  const [descVal, setDescVal]           = useState(salon.description);
  const [memberMenuId, setMemberMenuId] = useState<string | null>(null);
  const [rolePicker, setRolePicker]     = useState<SalonMember | null>(null);
  const [confirm, setConfirm]           = useState<null | { title: string; body: string; label: string; danger?: boolean; onConfirm: () => void }>(null);
  const [reportMemberId, setReportMemberId] = useState<string | null>(null);

  const isAdmin = salon.members.find(m => m.isMe)?.role === 'admin';
  const isMod   = salon.members.find(m => m.isMe)?.role === 'moderateur';
  const canManage = isAdmin || isMod;

  const update = (partial: Partial<SalonData>) => setSalon(s => ({ ...s, ...partial }));

  const changeRole = (memberId: string, role: Role) => {
    update({ members: salon.members.map(m => m.id === memberId ? { ...m, role } : m) });
    toast.success('Rôle mis à jour');
    setMemberMenuId(null);
  };

  const removeMember = (member: SalonMember) => {
    setConfirm({
      title: `Exclure ${member.name.split(' ')[0]} ?`,
      body: `${member.name.split(' ')[0]} sera retiré(e) du salon. Il/Elle pourra rejoindre à nouveau si le salon est public.`,
      label: 'Exclure',
      danger: true,
      onConfirm: () => {
        update({ members: salon.members.filter(m => m.id !== member.id), memberCount: salon.memberCount - 1 });
        toast.success(`${member.name.split(' ')[0]} a été exclu(e)`);
        setConfirm(null);
      },
    });
    setMemberMenuId(null);
  };

  const unpinMessage = (pinId: string) => {
    update({ pinnedMessages: salon.pinnedMessages.filter(p => p.id !== pinId) });
    toast.success('Message désépinglé');
  };

  const onlineCount = salon.members.filter(m => m.online).length;

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F1EE', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ── */}
      <div style={{ background: salon.color, flexShrink: 0, position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Salon public</p>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Gérer · {salon.name}</h1>
          </div>
          {canManage && (
            <div style={{ background: isAdmin ? `${GOLD}30` : 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px', border: `1px solid ${isAdmin ? `${GOLD}50` : 'rgba(255,255,255,0.3)'}` }}>
              <span style={{ color: isAdmin ? GOLD : '#fff', fontSize: 11, fontWeight: 700 }}>
                {isAdmin ? '👑 Admin' : '🛡️ Modo'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>

        {/* First-time banner */}
        {isFirst && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ margin: '16px 14px 0', background: `${salon.color}12`, borderRadius: 16, padding: '14px 16px', border: `1px solid ${salon.color}30`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🎊</span>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1E293B' }}>Salon #{salon.name} créé !</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>Configurez les règles de votre salon et invitez la communauté à rejoindre.</p>
            </div>
          </motion.div>
        )}

        {/* ── Identity card ── */}
        <div style={{ margin: '16px 14px 0', background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
          {/* Color band */}
          <div style={{ height: 56, background: `linear-gradient(135deg, ${salon.color}EE, ${salon.color}AA)`, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -20, left: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${salon.color}DD, ${salon.color}88)`, border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
                {salon.emoji}
              </div>
            </div>
          </div>

          <div style={{ padding: '28px 18px 16px' }}>
            {/* Name */}
            {editingName && isAdmin ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Hash size={14} color={salon.color} style={{ flexShrink: 0 }} />
                <input value={nameVal} onChange={e => setNameVal(e.target.value)} autoFocus maxLength={40}
                  onKeyDown={e => { if (e.key === 'Enter') { update({ name: nameVal }); setEditingName(false); toast.success('Nom mis à jour'); } if (e.key === 'Escape') { setNameVal(salon.name); setEditingName(false); } }}
                  style={{ flex: 1, fontSize: 17, fontWeight: 800, color: '#1E293B', border: 'none', borderBottom: `2px solid ${salon.color}`, outline: 'none', padding: '4px 0', background: 'transparent', fontFamily: 'inherit' }} />
                <button onClick={() => { update({ name: nameVal }); setEditingName(false); toast.success('Nom mis à jour'); }} style={{ background: salon.color, border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>OK</button>
                <button onClick={() => { setNameVal(salon.name); setEditingName(false); }} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}><X size={14} color="#9CA3AF" /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1E293B' }}>#{salon.name}</p>
                {isAdmin && <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Edit3 size={13} color="#9CA3AF" /></button>}
              </div>
            )}

            {/* Description */}
            <textarea value={descVal} onChange={e => setDescVal(e.target.value)}
              onBlur={() => { if (descVal !== salon.description) { update({ description: descVal }); toast.success('Description mise à jour'); } }}
              disabled={!isAdmin} placeholder={isAdmin ? "Décrivez votre salon..." : "Aucune description"}
              rows={2}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#64748B', resize: 'none', fontFamily: 'inherit', lineHeight: 1.55, boxSizing: 'border-box', cursor: isAdmin ? 'text' : 'default', padding: 0 }} />

            {/* Stats chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {[
                { icon: <Users size={10} />, label: `${salon.memberCount} membres` },
                { icon: <Globe size={10} />, label: 'Public' },
                { icon: <MessageSquare size={10} />, label: `${salon.messageCount.toLocaleString('fr-FR')} messages` },
                { icon: <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />, label: `${onlineCount} en ligne` },
              ].map((c, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F4F6F8', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#64748B' }}>
                  {c.icon}{c.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION: Communauté ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="👥" title="La communauté" subtitle={`${salon.members.length} membres affichés · ${onlineCount} en ligne`} open={openSections.communaute} onToggle={() => toggleSection('communaute')} />
          <AnimatePresence>
            {openSections.communaute && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                {salon.members.map((member, i) => {
                  const rl = roleLabel(member.role);
                  const RoleIcon = rl.icon;
                  return (
                    <div key={member.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{member.initials}</div>
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: member.online ? '#22c55e' : '#D1D5DB', border: '2px solid #fff' }} />
                        </div>

                        {/* Name + msgs */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</p>
                            {member.isMe && <span style={{ fontSize: 10, color: '#9CA3AF', background: '#F3F4F6', borderRadius: 10, padding: '1px 6px', flexShrink: 0 }}>Vous</span>}
                          </div>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{member.messageCount} msgs · {member.joinedAt}</span>
                        </div>

                        {/* Role badge — cliquable si admin */}
                        <button
                          onClick={() => isAdmin && !member.isMe && setRolePicker(member)}
                          disabled={!isAdmin || !!member.isMe}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 10px', borderRadius: 20, flexShrink: 0,
                            background: `${rl.color}15`,
                            border: `1.5px solid ${rl.color}40`,
                            cursor: isAdmin && !member.isMe ? 'pointer' : 'default',
                          }}
                        >
                          <RoleIcon size={11} color={rl.color} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: rl.color }}>{rl.text}</span>
                          {isAdmin && !member.isMe && <span style={{ fontSize: 10, color: rl.color, opacity: 0.7 }}>▾</span>}
                        </button>

                        {/* Signaler + Exclure */}
                        {canManage && !member.isMe && (
                          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                            <button onClick={() => setReportMemberId(member.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.4 }}
                              title="Signaler">
                              <Flag size={14} color="#D97706" />
                            </button>
                            <button onClick={() => removeMember(member)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.4 }}
                              title="Exclure">
                              <UserMinus size={14} color="#EF4444" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Modération ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="🛡️" title="Modération" subtitle="Règles & contrôle du salon" open={openSections.moderation} onToggle={() => toggleSection('moderation')} />
          <AnimatePresence>
            {openSections.moderation && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, padding: '6px 18px 6px', fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderTop: '1px solid #F1F5F9' }}>Qui peut écrire ?</p>
                <RadioRow label="Tout le monde" sub="Tous les membres peuvent poster" selected={salon.whoCanPost === 'tous'} onSelect={() => canManage && update({ whoCanPost: 'tous' })} />
                <RadioRow label="Admins & Modérateurs" sub="Les membres sont en lecture seule" selected={salon.whoCanPost === 'admins'} onSelect={() => canManage && update({ whoCanPost: 'admins' })} />

                <ToggleRow label="Mode lent" sub={salon.slowMode ? `1 message toutes les ${salon.slowDelaySecs}s par membre` : 'Désactivé — messages libres'} on={salon.slowMode} onChange={v => canManage && update({ slowMode: v })} accent={TEAL} />

                {salon.slowMode && canManage && (
                  <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>Délai entre les messages</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[15, 30, 60, 120].map(secs => (
                        <button key={secs} onClick={() => update({ slowDelaySecs: secs })}
                          style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: `1.5px solid ${salon.slowDelaySecs === secs ? TEAL : '#E5E7EB'}`, background: salon.slowDelaySecs === secs ? `${TEAL}12` : '#F9FAFB', cursor: 'pointer', fontSize: 12, fontWeight: salon.slowDelaySecs === secs ? 700 : 400, color: salon.slowDelaySecs === secs ? TEAL : '#64748B' }}>
                          {secs}s
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!canManage && (
                  <p style={{ margin: 0, padding: '10px 18px', fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', borderTop: '1px solid #F1F5F9' }}>Seuls les admins et modérateurs peuvent modifier ces paramètres.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Messages épinglés ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="📌" title="Messages épinglés" subtitle={salon.pinnedMessages.length > 0 ? `${salon.pinnedMessages.length} message${salon.pinnedMessages.length > 1 ? 's' : ''} épinglé${salon.pinnedMessages.length > 1 ? 's' : ''}` : 'Aucun message épinglé'} open={openSections.epingles} onToggle={() => toggleSection('epingles')} />
          <AnimatePresence>
            {openSections.epingles && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', borderTop: '1px solid #F1F5F9' }}>
                {salon.pinnedMessages.length === 0 ? (
                  <div style={{ padding: '20px 18px', textAlign: 'center' }}>
                    <span style={{ fontSize: 28 }}>📌</span>
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9CA3AF' }}>Aucun message épinglé.<br />Épinglez un message depuis le chat.</p>
                  </div>
                ) : (
                  salon.pinnedMessages.map((pin, i) => (
                    <div key={pin.id} style={{ display: 'flex', gap: 12, padding: '13px 18px', borderTop: i > 0 ? '1px solid #F8FAFC' : 'none', alignItems: 'flex-start' }}>
                      <Pin size={14} color={salon.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 700, color: salon.color }}>{pin.author}</p>
                        <p style={{ margin: '0 0 4px', fontSize: 13, color: '#1E293B', lineHeight: 1.4 }}>{pin.text}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Épinglé {pin.pinnedAt}</p>
                      </div>
                      {canManage && (
                        <button onClick={() => unpinMessage(pin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                          <X size={14} color="#9CA3AF" />
                        </button>
                      )}
                    </div>
                  ))
                )}
                {canManage && (
                  <div style={{ padding: '10px 18px 14px', borderTop: '1px solid #F8FAFC' }}>
                    <button onClick={() => { navigate(`/kauri/social-hub/salon/${salonId}`); }}
                      style={{ width: '100%', padding: '11px', borderRadius: 12, border: `1.5px dashed ${salon.color}50`, background: `${salon.color}08`, cursor: 'pointer', color: salon.color, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Pin size={14} /> Aller épingler un message
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Notifications ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          <SectionHeader emoji="🔔" title="Mes notifications" subtitle={salon.notifMode === 'sourdine' ? 'Sourdine' : salon.notifMode === 'mentions' ? 'Mentions uniquement' : 'Toutes les notifs'} open={openSections.notifications} onToggle={() => toggleSection('notifications')} />
          <AnimatePresence>
            {openSections.notifications && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                {[
                  { value: 'tous',     label: 'Tout',           sub: 'Chaque nouveau message vous notifie',  emoji: '🔔' },
                  { value: 'mentions', label: 'Mentions',       sub: 'Seulement si quelqu\'un vous cite',    emoji: '🏷️' },
                  { value: 'sourdine', label: 'Sourdine',       sub: 'Aucune notification pour ce salon',    emoji: '🔕' },
                ].map((opt, i) => (
                  <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid #F1F5F9', cursor: 'pointer' }}
                    onClick={() => update({ notifMode: opt.value as SalonData['notifMode'] })}>
                    <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: salon.notifMode === opt.value ? 700 : 500, color: '#1E293B' }}>{opt.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9CA3AF' }}>{opt.sub}</p>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${salon.notifMode === opt.value ? TERRA : '#D1D5DB'}`, background: salon.notifMode === opt.value ? TERRA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {salon.notifMode === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SECTION: Danger ── */}
        <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 18, border: '1px solid #FECACA', overflow: 'hidden' }}>
          <SectionHeader emoji="⚠️" title="Zone de danger" subtitle="Actions irréversibles" open={openSections.danger} onToggle={() => toggleSection('danger')} />
          <AnimatePresence>
            {openSections.danger && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => navigate('/kauri/social-hub/signaler-abus')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFFBEB', border: 'none', borderTop: '1px solid #FEE2E2', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Flag size={16} color="#D97706" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#92400E' }}>Signaler le salon</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#B45309' }}>Signaler un abus à la modération KAURI</p>
                  </div>
                </button>

                <button
                  onClick={() => setConfirm({ title: 'Quitter ce salon ?', body: `Vous quitterez "${salon.name}". Vous pourrez le rejoindre à nouveau librement.`, label: 'Quitter le salon', danger: true, onConfirm: () => navigate('/kauri/social-hub/forums') })}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FEF2F2', border: 'none', borderTop: '1px solid #FEE2E2', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LogOut size={16} color="#EF4444" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#EF4444' }}>Quitter le salon</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#F87171' }}>Vous perdrez l'accès aux messages</p>
                  </div>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setConfirm({ title: `Supprimer #${salon.name} ?`, body: 'Le salon et tous ses messages seront définitivement supprimés. Les membres perdront l\'accès immédiatement.', label: 'Supprimer définitivement', danger: true, onConfirm: () => { toast.success('Salon supprimé'); navigate('/kauri/social-hub/forums'); } })}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFF5F5', border: 'none', borderTop: '1px solid #FEE2E2', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Trash2 size={16} color="#DC2626" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Supprimer le salon</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#F87171' }}>Action irréversible pour tous les membres</p>
                    </div>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* ── Overlays ── */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            title={confirm.title} body={confirm.body}
            confirmLabel={confirm.label} danger={confirm.danger}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reportMemberId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              style={{ width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 36px' }}
              onClick={e => e.stopPropagation()}>
              <p style={{ fontWeight: 800, fontSize: 16, color: '#1E293B', margin: '0 0 6px' }}>Signaler ce membre</p>
              <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>Choisissez la raison du signalement. La modération KAURI examinera votre demande.</p>
              {['Spam ou publicité', 'Contenu inapproprié', 'Harcèlement', 'Usurpation d\'identité', 'Autre'].map((reason, i) => (
                <button key={i} onClick={() => { toast.success('Signalement envoyé à la modération'); setReportMemberId(null); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 14px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}>
                  <span style={{ fontSize: 14, color: '#374151' }}>{reason}</span>
                  <ChevronDown size={14} color="#9CA3AF" style={{ transform: 'rotate(-90deg)' }} />
                </button>
              ))}
              <button onClick={() => setReportMemberId(null)} style={{ width: '100%', padding: '13px', borderRadius: 14, background: '#F4F6F8', border: 'none', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>Annuler</button>
            </motion.div>
          </motion.div>
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
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: rolePicker.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {rolePicker.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#1E293B' }}>{rolePicker.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Choisir son rôle dans le salon</p>
                </div>
              </div>
              <div style={{ padding: '8px 16px 12px' }}>
                {([
                  { role: 'admin' as Role, title: '👑 Admin', desc: 'Gère le salon, les membres et tous les paramètres.' },
                  { role: 'moderateur' as Role, title: '🛡️ Modérateur', desc: 'Peut modérer les messages et exclure des membres.' },
                  { role: 'membre' as Role, title: '👤 Membre', desc: 'Participe aux discussions. Aucun droit de gestion.' },
                ]).map(opt => {
                  const isCurrentRole = rolePicker.role === opt.role;
                  const rl2 = roleLabel(opt.role);
                  return (
                    <motion.button
                      key={opt.role}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { changeRole(rolePicker.id, opt.role); setRolePicker(null); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', marginBottom: 8, borderRadius: 16,
                        background: isCurrentRole ? `${rl2.color}12` : '#F9FAFB',
                        border: `1.5px solid ${isCurrentRole ? rl2.color : '#E5E7EB'}`,
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: isCurrentRole ? `${rl2.color}20` : '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <rl2.icon size={18} color={isCurrentRole ? rl2.color : '#9CA3AF'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isCurrentRole ? rl2.color : '#1E293B' }}>{opt.title}</p>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{opt.desc}</p>
                      </div>
                      {isCurrentRole && (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: rl2.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div style={{ padding: '0 16px 32px' }}>
                <button onClick={() => { setRolePicker(null); removeMember(rolePicker); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, background: '#FEF2F2', border: '1px solid #FECACA', cursor: 'pointer' }}>
                  <UserMinus size={15} color="#EF4444" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Exclure {rolePicker.name.split(' ')[0]} du salon</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {memberMenuId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setMemberMenuId(null)} />
      )}
    </div>
  );
}
