import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MoreVertical, Paperclip, Smile, Send, Phone, Video,
  BellOff, Bell, Trash2, UserX, Check, CheckCheck, Edit3, Sparkles,
  X, Reply, Copy, Flag, Pin, Mic, Users, Info, LogOut, ChevronRight,
  Lock, UserPlus, Settings,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Tokens ────────────────────────────────────────────────────────────────────
const TERRA  = '#B05B3B';
const TEAL   = '#006D77';
const GOLD   = '#D4AF37';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Reaction { emoji: string; count: number; mine: boolean }
interface Message {
  id: string; text: string; time: string; isMine: boolean; read: boolean;
  isSystem?: boolean; author?: string; authorColor?: string; authorInitials?: string;
  reactions?: Reaction[];
  replyTo?: { id: string; text: string; author: string };
  isVoice?: boolean; voiceDuration?: string;
}

const QUICK_REACTIONS = ['👍','❤️','😂','🔥','👏','💯'];
const EMOJIS = [
  '😀','😂','🥰','😍','🤩','😎','🥳','😭','😱','🤯',
  '👍','👏','🙌','🤝','💪','🫶','❤️','🔥','✨','💫',
  '🎉','🎊','🏆','💰','💡','🚀','🌍','🌺','🌿','🏝️',
  '📈','📊','💼','🏠','🤲','🌱','⚡','🔐','💬','📢',
];

// ── Static conversations (1-to-1) ─────────────────────────────────────────────
const DM_CONVS: Record<string, {
  name: string; initials: string; avatar: string; color: string;
  isOnline: boolean; role: string;
  messages: Message[];
}> = {
  'd1': {
    name: 'Marie-Claire Dubois', initials: 'MC', avatar: '👩🏾',
    color: '#8B5CF6', isOnline: true, role: 'Mentor & Investisseuse',
    messages: [
      { id: 'm1', text: "Bonjour ! J'ai vu ton profil sur KAURI, tes projets en immobilier caribéen sont très intéressants.", time: '09:42', isMine: false, read: true },
      { id: 'm2', text: "Merci Marie-Claire ! Je cherche justement des conseils pour mon premier investissement en Martinique.", time: '09:45', isMine: true, read: true },
      { id: 'm3', text: "Je peux t'aider ! J'ai 10 ans d'expérience dans l'immobilier antillais. Tu vises quel budget ?", time: '09:48', isMine: false, read: true },
      { id: 'm4', text: "Entre 80 et 120K€. Je voudrais du locatif dans un quartier en développement.", time: '09:51', isMine: true, read: true },
      { id: 'm5', text: "Parfait. Dillon et Cluny à Fort-de-France sont tes cibles. J'envoie une étude de marché ce soir.", time: '09:54', isMine: false, read: true },
      { id: 'm6', text: "Super l'idée du pot commun pour la tontine ! On pourrait mutualiser les achats aussi ?", time: 'Il y a 5 min', isMine: false, read: false },
    ],
  },
  'd2': {
    name: 'Jean-Baptiste Laurent', initials: 'JL', avatar: '👨🏾',
    color: TEAL, isOnline: true, role: 'Agriculteur & Fondateur BioCarib',
    messages: [
      { id: 'm1', text: "Salut ! Tu as regardé le nouveau projet immobilier dans le salon ?", time: '10:12', isMine: false, read: true },
      { id: 'm2', text: "Pas encore, je vais regarder ça. C'est quoi le concept ?", time: '10:16', isMine: true, read: true },
      { id: 'm3', text: "Un immeuble collectif où chaque membre d'une tontine prend une part. Modèle coopératif.", time: '10:19', isMine: false, read: true },
      { id: 'm5', text: "Tu as vu le nouveau projet immobilier ?", time: 'Il y a 15 min', isMine: false, read: false },
    ],
  },
  'd3': {
    name: 'Isabelle Moutoussamy', initials: 'IM', avatar: '👩🏽',
    color: GOLD, isOnline: false, role: 'Coach Business & Investisseuse',
    messages: [
      { id: 'm1', text: "Bonjour, j'avais une question sur les dispositifs de défiscalisation pour investisseurs caribéens.", time: 'Hier 14:30', isMine: true, read: true },
      { id: 'm2', text: "Bien sûr ! La loi Girardin industrie et Pinel Outre-mer sont vos meilleures options. Réductions de 25 à 48%.", time: 'Hier 15:02', isMine: false, read: true },
      { id: 'm5', text: "Merci pour les conseils investissement", time: 'Il y a 2h', isMine: false, read: true },
    ],
  },
  'd4': {
    name: 'Marcus Johnson', initials: 'MJ', avatar: '👨🏿',
    color: '#059669', isOnline: true, role: 'Senior Blockchain Developer',
    messages: [
      { id: 'm1', text: "Hey ! J'ai partagé un article sur l'adoption de la blockchain en Afrique de l'Ouest. Tu l'as vu ?", time: 'Il y a 3j', isMine: false, read: true },
      { id: 'm2', text: "Pas encore ! Tu peux me le passer ?", time: 'Il y a 3j', isMine: true, read: true },
      { id: 'm3', text: "Excellent article sur la diaspora et les transferts d'argent via DeFi. Game changer.", time: 'Il y a 3j', isMine: false, read: true },
    ],
  },
};

// ── Group conversation builder ────────────────────────────────────────────────
function buildGroupConv(groupName: string, isNew: boolean): {
  name: string; initials: string; avatar: string; color: string;
  isOnline: boolean; role: string; isGroup: boolean;
  members: { name: string; initials: string; color: string }[];
  messages: Message[];
} {
  const initials = groupName.slice(0, 2).toUpperCase();
  return {
    name: groupName,
    initials,
    avatar: '🤝',
    color: TERRA,
    isOnline: false,
    role: 'Groupe privé · 3 membres',
    isGroup: true,
    members: [
      { name: 'Vous',           initials: 'JD', color: TERRA },
      { name: 'Marie-Claire',   initials: 'MC', color: '#8B5CF6' },
      { name: 'Marcus Johnson', initials: 'MJ', color: '#059669' },
    ],
    messages: isNew ? [] : [
      { id: 'g1', text: 'Prochaine réunion vendredi 18h', time: 'Hier', isMine: false, read: true, author: 'Marie-Claire', authorColor: '#8B5CF6', authorInitials: 'MC' },
      { id: 'g2', text: "J'ai envoyé le doc de synthèse", time: 'Il y a 2h', isMine: false, read: true, author: 'Marcus', authorColor: '#059669', authorInitials: 'MJ' },
    ],
  };
}

function buildDefaultMessage(name: string, profession: string, tags: string[]): string {
  const firstName = name.split(' ')[0];
  const tag = tags[0] ?? 'collaboration';
  return `Bonjour ${firstName} ! 👋\n\nJ'ai découvert votre profil dans KAURI Rencontres et je suis vraiment impressionné(e) par votre parcours en tant que ${profession}.\n\nJe pense que nos expertises pourraient se compléter, notamment autour de ${tag}. Je serais ravi(e) d'échanger avec vous.\n\nSeriez-vous disponible cette semaine ?\n\nBien à vous 🌿`;
}

// ── Emoji picker ──────────────────────────────────────────────────────────────
function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
      style={{
        position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 60,
        background: '#fff', borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.14)', padding: '16px 14px 10px',
      }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => onPick(e)} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '4px 0' }}>{e}</button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Context menu ──────────────────────────────────────────────────────────────
function MessageMenu({
  msg, isMine, pos, isGroup,
  onReact, onReply, onCopy, onDelete, onReport, onClose,
}: {
  msg: Message; isMine: boolean; isGroup: boolean;
  pos: { top: number; left?: number; right?: number };
  onReact: (e: string) => void; onReply: () => void;
  onCopy: () => void; onDelete: () => void; onReport: () => void; onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
      style={{ position: 'fixed', top: pos.top, left: pos.left, right: pos.right, zIndex: 80, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', overflow: 'hidden', minWidth: 200 }}
      onClick={e => e.stopPropagation()}>
      {/* Quick reactions */}
      <div style={{ display: 'flex', padding: '10px 12px', gap: 6, borderBottom: '1px solid #F3F4F6' }}>
        {QUICK_REACTIONS.map(e => (
          <button key={e} onClick={() => { onReact(e); onClose(); }}
            style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 4 }}>{e}</button>
        ))}
      </div>
      {[
        { icon: Reply, label: 'Répondre',  action: () => { onReply();  onClose(); } },
        { icon: Copy,  label: 'Copier',    action: () => { onCopy();   onClose(); } },
        ...(isMine ? [{ icon: Trash2, label: 'Supprimer', action: () => { onDelete(); onClose(); }, danger: true }] : []),
        ...(!isMine ? [{ icon: Flag, label: 'Signaler', action: () => { onReport(); onClose(); }, danger: true }] : []),
      ].map((item, i) => (
        <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, textAlign: 'left', borderTop: '1px solid #F8FAFC' }}>
          <item.icon size={15} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

// ── Call overlay ──────────────────────────────────────────────────────────────
function CallOverlay({ type, name, onEnd }: { type: 'audio' | 'video'; name: string; onEnd: () => void }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const dur = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: type === 'video'
          ? 'linear-gradient(160deg, #0D2A30 0%, #051820 100%)'
          : 'linear-gradient(160deg, #1E293B 0%, #0F172A 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        maxWidth: 430, margin: '0 auto',
      }}>
      {/* Avatar */}
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 24, boxShadow: `0 0 40px ${TERRA}60` }}>
        {type === 'video' ? '📹' : '📞'}
      </motion.div>

      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>
        {type === 'video' ? 'Appel vidéo' : 'Appel audio'}
      </p>
      <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>{name}</h2>
      <p style={{ color: '#22c55e', fontSize: 16, fontWeight: 600, margin: '0 0 60px' }}>{dur}</p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {[
          { icon: '🔇', label: 'Muet',   color: 'rgba(255,255,255,0.15)' },
          { icon: '🔊', label: 'HP',     color: 'rgba(255,255,255,0.15)' },
          ...(type === 'video' ? [{ icon: '📷', label: 'Caméra', color: 'rgba(255,255,255,0.15)' }] : []),
        ].map(c => (
          <div key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button style={{ width: 56, height: 56, borderRadius: '50%', background: c.color, border: 'none', fontSize: 22, cursor: 'pointer' }}>{c.icon}</button>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{c.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button onClick={onEnd} style={{ width: 64, height: 64, borderRadius: '50%', background: '#EF4444', border: 'none', fontSize: 26, cursor: 'pointer', boxShadow: '0 6px 20px rgba(239,68,68,0.5)' }}>📵</button>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Raccrocher</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 30, photo }: { initials: string; color: string; size?: number; photo?: string }) {
  if (photo) return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color: '#fff' }}>
      {initials}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PrivateConversationScreen() {
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const location  = useLocation();
  const state     = location.state as {
    isNewMatch?: boolean;
    isGroup?: boolean;
    groupName?: string;
    isNew?: boolean;
    matchProfile?: { name: string; photo: string; profession: string; trustScore: number; tags: string[]; lookingFor: string };
  } | null;

  const isNewMatch = state?.isNewMatch === true;
  const isGroup    = state?.isGroup === true || (id ?? '').startsWith('group-');
  const groupName  = state?.groupName ?? 'Groupe privé';
  const isNew      = state?.isNew === true;
  const matchProfile = state?.matchProfile;

  // Build conversation data
  const baseConv = (() => {
    if (isNewMatch && matchProfile) return {
      name: matchProfile.name,
      initials: matchProfile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      photo: matchProfile.photo, avatar: '', color: TEAL,
      isOnline: true, role: matchProfile.profession,
      isGroup: false, members: [],
      messages: [] as Message[],
    };
    if (isGroup) return buildGroupConv(groupName, isNew);
    return { ...(DM_CONVS[id ?? 'd1'] ?? DM_CONVS['d1']), isGroup: false, members: [] };
  })();

  const defaultMsg = isNewMatch && matchProfile
    ? buildDefaultMessage(matchProfile.name, matchProfile.profession, matchProfile.tags)
    : '';

  const [messages,      setMessages]      = useState<Message[]>(baseConv.messages.map(m => ({ ...m, read: true })));
  const [message,       setMessage]       = useState('');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [showEmoji,     setShowEmoji]     = useState(false);
  const [muted,         setMuted]         = useState(false);
  const [blocked,       setBlocked]       = useState(false);
  const [replyTo,       setReplyTo]       = useState<Message | null>(null);
  const [contextMsg,    setContextMsg]    = useState<{ msg: Message; pos: { top: number; left?: number; right?: number } } | null>(null);
  const [callType,      setCallType]      = useState<'audio' | 'video' | null>(null);
  const [showInfo,      setShowInfo]      = useState(false);
  const [messageSent,   setMessageSent]   = useState(false);
  const [recording,     setRecording]     = useState(false);
  const [recordSecs,    setRecordSecs]    = useState(0);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef      = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const longTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send ────────────────────────────────────────────────────────────────
  const send = (txt?: string) => {
    const text = (txt ?? message).trim();
    if (!text || blocked) return;
    const newMsg: Message = {
      id: `m${Date.now()}`, text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true, read: false,
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, author: replyTo.author ?? 'Eux' } : undefined,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage(''); setReplyTo(null); setShowEmoji(false); setMessageSent(true);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);

    // Simulate reply for demo (DM only)
    if (!isGroup && !isNewMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `r${Date.now()}`, text: '👍 Reçu ! Je te réponds dès que possible.',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isMine: false, read: true,
        }]);
      }, 1800 + Math.random() * 1200);
    }
  };

  // ── Reactions ──────────────────────────────────────────────────────────
  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = (m.reactions ?? []).find(r => r.emoji === emoji);
      if (existing) {
        return { ...m, reactions: m.reactions!.map(r => r.emoji === emoji ? { ...r, count: r.mine ? r.count - 1 : r.count + 1, mine: !r.mine } : r).filter(r => r.count > 0) };
      }
      return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, mine: true }] };
    }));
  };

  // ── Long press ─────────────────────────────────────────────────────────
  const handlePressStart = (msg: Message, e: React.MouseEvent | React.TouchEvent) => {
    longTimer.current = setTimeout(() => {
      const rect = (e.target as HTMLElement).closest('[data-msg]')?.getBoundingClientRect();
      const top  = Math.min((rect?.top ?? 200) - 10, window.innerHeight - 300);
      setContextMsg({ msg, pos: msg.isMine ? { top, right: 16 } : { top, left: 16 } });
    }, 450);
  };
  const handlePressEnd = () => { if (longTimer.current) clearTimeout(longTimer.current); };

  // ── Voice ───────────────────────────────────────────────────────────────
  const startRec = () => { setRecording(true); setRecordSecs(0); recordInterval.current = setInterval(() => setRecordSecs(s => s + 1), 1000); };
  const stopRec  = () => {
    setRecording(false);
    if (recordInterval.current) clearInterval(recordInterval.current);
    if (recordSecs > 0) {
      const dur = `${String(Math.floor(recordSecs / 60)).padStart(2, '0')}:${String(recordSecs % 60).padStart(2, '0')}`;
      send(`🎤 Message vocal (${dur})`);
    }
    setRecordSecs(0);
  };

  // ── Attachment ──────────────────────────────────────────────────────────
  const handleAttach = () => {
    toast('Pièce jointe', {
      description: 'Choisissez une source',
      action: { label: '📷 Galerie', onClick: () => send('📷 Photo partagée') },
    });
  };

  const conv = baseConv;

  return (
    <div
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#EEF2F5', maxWidth: 430, margin: '0 auto', position: 'relative' }}
      onClick={() => { setMenuOpen(false); setContextMsg(null); setShowEmoji(false); }}
    >
      {/* ── CALL OVERLAY ── */}
      <AnimatePresence>
        {callType && <CallOverlay type={callType} name={conv.name} onEnd={() => setCallType(null)} />}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8ECF0', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4, flexShrink: 0 }}>
          <ArrowLeft size={22} />
        </button>

        {/* Contact info — click → info panel */}
        <button onClick={() => setShowInfo(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {isGroup ? (
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `2px solid ${TERRA}30` }}>🤝</div>
            ) : (conv as { photo?: string }).photo ? (
              <Avatar initials={conv.initials} color={conv.color} size={42} photo={(conv as { photo?: string }).photo} />
            ) : (
              <Avatar initials={conv.initials} color={conv.color} size={42} />
            )}
            {!isGroup && conv.isOnline && (
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
            )}
            {isGroup && (
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: TERRA, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={8} color="#fff" />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: (!isGroup && conv.isOnline) ? '#22C55E' : '#94A3B8' }}>
              {isGroup ? conv.role : (conv.isOnline ? 'En ligne' : conv.role)}
            </p>
          </div>
        </button>

        {/* Actions */}
        {!isGroup && (
          <>
            <button onClick={() => setCallType('audio')} style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEAL }}>
              <Phone size={16} />
            </button>
            <button onClick={() => setCallType('video')} style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEAL }}>
              <Video size={16} />
            </button>
          </>
        )}
        <button onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          style={{ background: menuOpen ? '#F4F6F8' : 'none', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
          <MoreVertical size={18} />
        </button>
      </div>

      {/* ── DROPDOWN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 62, right: 12, zIndex: 50, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden', minWidth: 230 }}>
            {[
              { icon: Info,    label: 'Infos',                   action: () => { setShowInfo(true); setMenuOpen(false); } },
              { icon: muted ? Bell : BellOff, label: muted ? 'Réactiver notifs' : 'Mettre en sourdine', action: () => { setMuted(v => !v); setMenuOpen(false); toast.success(muted ? 'Notifs réactivées' : 'Sourdine activée'); } },
              ...(isGroup ? [
                { icon: Settings, label: 'Gérer le groupe',    action: () => { setMenuOpen(false); navigate(`/kauri/social-hub/groupe/${(id ?? '').replace('group-', '')}/gerer`); } },
                { icon: UserPlus, label: 'Ajouter un membre',  action: () => { setMenuOpen(false); toast.info('Invitez par lien ou depuis vos connexions'); } },
                { icon: LogOut,   label: 'Quitter le groupe',  action: () => navigate(-1), danger: true },
              ] : [
                { icon: Trash2, label: 'Supprimer la conv.',   action: () => navigate(-1), danger: true },
                { icon: UserX,  label: 'Bloquer',              action: () => { setBlocked(true); setMenuOpen(false); toast.error(`${conv.name.split(' ')[0]} bloqué(e)`); }, danger: true },
              ]),
            ].map((item, i) => (
              <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer', color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, textAlign: 'left', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCKED BANNER ── */}
      {blocked && (
        <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>Vous avez bloqué {conv.name.split(' ')[0]}</p>
          <button onClick={() => setBlocked(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Débloquer</button>
        </div>
      )}

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }} onClick={() => setMenuOpen(false)}>

        {/* Top profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 12px', gap: 8 }}>
          {isGroup ? (
            <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🤝</div>
          ) : (conv as { photo?: string }).photo ? (
            <Avatar initials={conv.initials} color={conv.color} size={64} photo={(conv as { photo?: string }).photo} />
          ) : (
            <Avatar initials={conv.initials} color={conv.color} size={64} />
          )}
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#1E293B' }}>{conv.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{conv.role}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {isGroup ? (
              <span style={{ fontSize: 11, background: `${TERRA}18`, color: TERRA, padding: '4px 10px', borderRadius: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lock size={9} /> Groupe privé · KAURI
              </span>
            ) : isNewMatch ? (
              <span style={{ fontSize: 11, background: `${TEAL}18`, color: TEAL, padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>🤝 Nouvelle Alliance KAURI</span>
            ) : (
              <span style={{ fontSize: 11, background: conv.color + '18', color: conv.color, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Connexion KAURI</span>
            )}
          </div>
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
          <span style={{ fontSize: 11, color: '#94A3B8', background: '#EEF2F5', padding: '0 8px' }}>Début de la conversation</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
        </div>

        {/* New match card */}
        {isNewMatch && !messageSent && (
          <div style={{ background: `linear-gradient(135deg, ${TEAL}18, ${TEAL}08)`, border: `1px solid ${TEAL}35`, borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${TEAL}, #0D9488)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                🤝 Nouvelle connexion avec <strong>{conv.name}</strong> — envoyez votre premier message pour démarrer !
              </p>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: '1px solid #E2E8F0', fontSize: 13, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line', maxHeight: 130, overflow: 'hidden', position: 'relative' }}>
              {defaultMsg}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: 'linear-gradient(to bottom, transparent, #fff)', borderRadius: '0 0 12px 12px' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setMessage(defaultMsg); inputRef.current?.focus(); }}
                style={{ flex: 1, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.85)', border: `1.5px solid ${TEAL}50`, color: TEAL, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Edit3 size={14} /> Personnaliser
              </button>
              <button onClick={() => send(defaultMsg)}
                style={{ flex: 1.4, padding: '10px 12px', borderRadius: 12, background: `linear-gradient(135deg, ${TEAL}, #0D9488)`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${TEAL}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Send size={14} /> Envoyer
              </button>
            </div>
          </div>
        )}

        {/* New group intro */}
        {isGroup && isNew && messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
            <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              <strong>{conv.name}</strong> a été créé.<br />
              Vos échanges sont privés et chiffrés.<br />
              Dites bonjour !
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map(msg => (
          <div key={msg.id} data-msg={msg.id}
            onMouseDown={e => handlePressStart(msg, e)}
            onMouseUp={handlePressEnd}
            onTouchStart={e => handlePressStart(msg, e as unknown as React.MouseEvent)}
            onTouchEnd={handlePressEnd}
            style={{ display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}
          >
            {!msg.isMine && (
              <Avatar
                initials={msg.authorInitials ?? conv.initials}
                color={msg.authorColor ?? conv.color}
                size={28}
                photo={!isGroup && !msg.authorInitials ? (conv as { photo?: string }).photo : undefined}
              />
            )}
            <div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
              {/* Author in group */}
              {isGroup && !msg.isMine && msg.author && (
                <span style={{ fontSize: 11, color: msg.authorColor ?? TERRA, fontWeight: 700, marginBottom: 3, marginLeft: 4 }}>{msg.author}</span>
              )}

              {/* Reply quote */}
              {msg.replyTo && (
                <div style={{ background: msg.isMine ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)', borderLeft: `3px solid ${msg.isMine ? 'rgba(255,255,255,0.7)' : TERRA}`, borderRadius: '8px 8px 0 0', padding: '5px 10px', marginBottom: -4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: msg.isMine ? 'rgba(255,255,255,0.8)' : TERRA }}>{msg.replyTo.author}</span>
                  <p style={{ fontSize: 11.5, color: msg.isMine ? 'rgba(255,255,255,0.7)' : '#64748B', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.replyTo.text}</p>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                background: msg.isMine ? TERRA : '#fff',
                color: msg.isMine ? '#fff' : '#1E293B',
                borderRadius: msg.isMine ? (msg.replyTo ? '18px 4px 4px 18px' : '18px 18px 4px 18px') : (msg.replyTo ? '4px 18px 18px 4px' : '18px 18px 18px 4px'),
                padding: msg.isVoice ? '10px 14px' : '10px 14px',
                fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-line',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                {msg.isVoice ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mic size={14} />
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: msg.isMine ? 'rgba(255,255,255,0.4)' : '#E5E7EB' }} />
                    <span style={{ fontSize: 11 }}>{msg.voiceDuration}</span>
                  </div>
                ) : msg.text}
              </div>

              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap', justifyContent: msg.isMine ? 'flex-end' : 'flex-start' }}>
                  {msg.reactions.map(r => (
                    <button key={r.emoji} onClick={() => toggleReaction(msg.id, r.emoji)}
                      style={{ display: 'flex', alignItems: 'center', gap: 3, background: r.mine ? `${TERRA}20` : '#fff', border: `1px solid ${r.mine ? TERRA : '#E5E7EB'}`, borderRadius: 20, padding: '2px 7px', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: r.mine ? TERRA : '#374151' }}>
                      {r.emoji} <span style={{ fontSize: 11 }}>{r.count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Time + read */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, marginLeft: 4, marginRight: 4 }}>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{msg.time}</span>
                {msg.isMine && (msg.read ? <CheckCheck size={12} color={TEAL} /> : <Check size={12} color="#94A3B8" />)}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── REPLY BANNER ── */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: '#fff', borderTop: `1px solid ${TERRA}30`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 32, borderRadius: 2, background: TERRA, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: TERRA, margin: 0 }}>{replyTo.author ?? conv.name.split(' ')[0]}</p>
              <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyTo.text}</p>
            </div>
            <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INPUT BAR ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E8ECF0', padding: '10px 12px', position: 'relative' }}>
        <AnimatePresence>
          {showEmoji && <EmojiPicker onPick={e => setMessage(m => m + e)} />}
        </AnimatePresence>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <button onClick={handleAttach} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '6px 4px 8px', flexShrink: 0 }}>
            <Paperclip size={20} />
          </button>
          <textarea
            ref={inputRef}
            value={message}
            onChange={e => { setMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={blocked ? 'Vous avez bloqué cet utilisateur' : `Message à ${conv.name.split(' ')[0]}...`}
            disabled={blocked}
            rows={1}
            style={{ flex: 1, background: '#F4F6F8', border: 'none', borderRadius: 18, padding: '10px 16px', fontSize: 14, color: '#1E293B', outline: 'none', resize: 'none', maxHeight: 120, lineHeight: 1.5, overflowY: 'auto', fontFamily: 'inherit' }}
          />
          <button onClick={e => { e.stopPropagation(); setShowEmoji(v => !v); }}
            style={{ background: showEmoji ? `${TERRA}20` : 'none', border: 'none', cursor: 'pointer', color: showEmoji ? TERRA : '#94A3B8', padding: '6px 4px 8px', borderRadius: 8, flexShrink: 0 }}>
            <Smile size={20} />
          </button>
          {message.trim() ? (
            <button onClick={() => send()}
              style={{ width: 40, height: 40, borderRadius: '50%', background: TERRA, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${TERRA}50` }}>
              <Send size={17} color="#fff" />
            </button>
          ) : (
            <button
              onMouseDown={startRec} onMouseUp={stopRec}
              onTouchStart={startRec} onTouchEnd={stopRec}
              style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: recording ? '#EF4444' : '#F4F6F8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              <Mic size={18} color={recording ? '#fff' : '#94A3B8'} />
            </button>
          )}
        </div>

        {recording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0 0 8px' }}>
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
              {String(Math.floor(recordSecs / 60)).padStart(2, '0')}:{String(recordSecs % 60).padStart(2, '0')} — Relâchez pour envoyer
            </span>
          </div>
        )}
      </div>

      {/* ── CONTEXT MENU ── */}
      <AnimatePresence>
        {contextMsg && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 70 }} onClick={() => setContextMsg(null)} />
            <MessageMenu
              msg={contextMsg.msg}
              isMine={contextMsg.msg.isMine}
              isGroup={isGroup}
              pos={contextMsg.pos}
              onReact={e => toggleReaction(contextMsg.msg.id, e)}
              onReply={() => setReplyTo(contextMsg.msg)}
              onCopy={() => { navigator.clipboard?.writeText(contextMsg.msg.text); toast.success('Copié !'); }}
              onDelete={() => { setMessages(prev => prev.filter(m => m.id !== contextMsg.msg.id)); toast.success('Message supprimé'); }}
              onReport={() => toast.error('Message signalé')}
              onClose={() => setContextMsg(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── INFO SHEET ── */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90 }}
              onClick={() => setShowInfo(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 95, maxHeight: '78dvh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>

              {/* Header */}
              <div style={{ padding: '8px 20px 20px', textAlign: 'center' }}>
                {isGroup ? (
                  <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 12px', background: `linear-gradient(135deg, ${TERRA}, #8B3E24)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🤝</div>
                ) : (conv as { photo?: string }).photo ? (
                  <Avatar initials={conv.initials} color={conv.color} size={64} photo={(conv as { photo?: string }).photo} />
                ) : (
                  <div style={{ margin: '0 auto 12px', display: 'flex', justifyContent: 'center' }}>
                    <Avatar initials={conv.initials} color={conv.color} size={64} />
                  </div>
                )}
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1E293B', margin: '8px 0 4px' }}>{conv.name}</h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{conv.role}</p>

                {/* Group members */}
                {isGroup && (conv as { members?: { name: string; initials: string; color: string }[] }).members && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: -8 }}>
                    {(conv as { members: { name: string; initials: string; color: string }[] }).members.slice(0, 5).map((m, i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: m.color, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', marginLeft: i > 0 ? -10 : 0 }}>
                        {m.initials}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: '0 14px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ...(!isGroup && !blocked ? [{ label: `Appel audio`, icon: Phone, action: () => { setShowInfo(false); setCallType('audio'); } }] : []),
                  ...(!isGroup && !blocked ? [{ label: `Appel vidéo`, icon: Video, action: () => { setShowInfo(false); setCallType('video'); } }] : []),
                  ...(isGroup ? [
                    { label: 'Membres du groupe', icon: Users,    action: () => { setShowInfo(false); } },
                    { label: 'Gérer le groupe',   icon: Settings, action: () => { setShowInfo(false); navigate(`/kauri/social-hub/groupe/${(id ?? '').replace('group-', '')}/gerer`); } },
                  ] : []),
                  { label: muted ? 'Réactiver les notifs' : 'Mettre en sourdine', icon: muted ? Bell : BellOff, action: () => { setMuted(v => !v); setShowInfo(false); toast.success(muted ? 'Notifs réactivées' : 'Sourdine activée'); } },
                  ...(isGroup ? [
                    { label: 'Quitter le groupe', icon: LogOut, action: () => navigate(-1), danger: true },
                  ] : [
                    { label: blocked ? 'Débloquer' : 'Bloquer', icon: UserX, action: () => { setBlocked(v => !v); setShowInfo(false); toast.success(blocked ? 'Utilisateur débloqué' : `${conv.name.split(' ')[0]} bloqué(e)`); }, danger: !blocked },
                    { label: 'Supprimer la conversation', icon: Trash2, action: () => navigate(-1), danger: true },
                  ]),
                ].map((a, i) => (
                  <button key={i} onClick={a.action} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 14,
                    background: (a as { danger?: boolean }).danger ? '#FEF2F2' : '#F9FAFB',
                    border: `1px solid ${(a as { danger?: boolean }).danger ? '#FECACA' : '#F3F4F6'}`,
                    cursor: 'pointer', color: (a as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, fontWeight: 500,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <a.icon size={16} /> {a.label}
                    </div>
                    <ChevronRight size={16} color="#D1D5DB" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
