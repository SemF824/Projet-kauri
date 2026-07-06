import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Users, Search, MoreVertical, Paperclip, Smile,
  Send, Bell, BellOff, LogOut, Info, X, Reply, Copy,
  Flag, Pin, Image as ImageIcon, Mic, Hash, ChevronRight, Settings,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Tokens ────────────────────────────────────────────────────────────────────
const TERRA = '#B05B3B';
const GOLD  = '#D4AF37';
const TEAL  = '#006D77';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Reaction { emoji: string; count: number; mine: boolean }
interface Message {
  id: string; author: string; initials: string; authorColor: string;
  text: string; time: string; isMine: boolean;
  reactions?: Reaction[];
  replyTo?: { id: string; text: string; author: string };
  pinned?: boolean;
  image?: string;
}
interface Salon {
  title: string; description: string; participants: number;
  color: string; emoji: string;
  pinnedMessage?: string;
  members: { name: string; initials: string; color: string; role: string; online: boolean }[];
  messages: Message[];
}

const QUICK_REACTIONS = ['👍','❤️','😂','🔥','👏','💯'];

const EMOJIS = [
  '😀','😂','🥰','😍','🤩','😎','🥳','😭','😱','🤯',
  '👍','👏','🙌','🤝','💪','🫶','❤️','🔥','✨','💫',
  '🎉','🎊','🏆','💰','💡','🚀','🌍','🌺','🌿','🏝️',
  '📈','📊','💼','🏠','🤲','🌱','⚡','🔐','💬','📢',
];

// ── Static data ───────────────────────────────────────────────────────────────
const SALONS: Record<string, Salon> = {
  's1': {
    title: 'Immobilier Antilles', emoji: '🏘️',
    description: 'Investissement, location & tendances du marché immobilier caribéen',
    participants: 234, color: TEAL,
    pinnedMessage: '📌 Webinaire investissement immobilier – Vendredi 19h (lien en bio)',
    members: [
      { name: 'Sophie Laurent',      initials: 'SL', color: TEAL,    role: 'CEO GreenTech',  online: true  },
      { name: 'Jean-Baptiste Fond',  initials: 'JF', color: '#8B5CF6', role: 'Agri Bio',     online: false },
      { name: 'Isabelle Moutoussamy',initials: 'IM', color: GOLD,    role: 'Coach Business', online: true  },
      { name: 'Marcus Johnson',      initials: 'MJ', color: '#059669',role: 'Dev Blockchain', online: true  },
      { name: 'Vous',                initials: 'JD', color: TERRA,   role: 'Membre',          online: true  },
    ],
    messages: [
      { id: 'm1', author: 'Sophie Laurent',       initials: 'SL', authorColor: TEAL,    text: 'Bonjour à tous ! Quelqu\'un connaît les nouvelles zones de développement à Fort-de-France ?', time: '09:14', isMine: false },
      { id: 'm2', author: 'Jean-Baptiste Fond',   initials: 'JF', authorColor: '#8B5CF6',text: 'Oui ! Le quartier Dillon est en plein essor. Beaucoup de projets résidentiels neufs.', time: '09:18', isMine: false },
      { id: 'm3', author: 'Vous',                 initials: 'JD', authorColor: TERRA,   text: 'J\'ai justement regardé des biens là-bas la semaine dernière. Les prix restent encore abordables.', time: '09:22', isMine: true, reactions: [{ emoji: '👍', count: 3, mine: false }] },
      { id: 'm4', author: 'Isabelle Moutoussamy', initials: 'IM', authorColor: GOLD,    text: 'La rentabilité locative en Martinique tourne autour de 5 à 7% selon les secteurs.', time: '09:31', isMine: false, reactions: [{ emoji: '🔥', count: 5, mine: true }, { emoji: '❤️', count: 2, mine: false }] },
      { id: 'm5', author: 'Sophie Laurent',       initials: 'SL', authorColor: TEAL,    text: 'Exactement Isabelle ! Et avec Pinel Outre-mer c\'est encore plus attractif.', time: '09:35', isMine: false },
      { id: 'm6', author: 'Marcus Johnson',       initials: 'MJ', authorColor: '#059669',text: 'Est-ce que quelqu\'un peut me recommander un notaire fiable en Guadeloupe ?', time: '09:52', isMine: false },
      { id: 'm7', author: 'Vous',                 initials: 'JD', authorColor: TERRA,   text: 'Je peux te mettre en contact avec maître Beaumont à Pointe-à-Pitre, très sérieux.', time: '09:55', isMine: true },
      { id: 'm8', author: 'Jean-Baptiste Fond',   initials: 'JF', authorColor: '#8B5CF6',text: 'Merci pour l\'info ! On devrait organiser un webinaire sur l\'investissement immobilier caribéen.', time: '10:04', isMine: false },
    ],
  },
  's2': {
    title: 'Tech Diaspora', emoji: '⚡',
    description: 'Startups, IA, blockchain & innovation technologique de la diaspora',
    participants: 189, color: GOLD,
    members: [
      { name: 'Marcus Johnson', initials: 'MJ', color: '#059669', role: 'Dev Blockchain', online: true },
      { name: 'Amina Diallo',   initials: 'AD', color: TERRA,    role: 'FinTech',         online: false },
      { name: 'Sophie Laurent', initials: 'SL', color: TEAL,     role: 'CEO GreenTech',   online: true },
      { name: 'Vous',           initials: 'JD', color: TERRA,    role: 'Membre',           online: true },
    ],
    messages: [
      { id: 'm1', author: 'Marcus Johnson', initials: 'MJ', authorColor: '#059669', text: 'La DeFi explose en Afrique de l\'Ouest. Des projets vraiment intéressants émergent à Dakar.', time: '10:02', isMine: false },
      { id: 'm2', author: 'Amina Diallo',   initials: 'AD', authorColor: TERRA,    text: 'Je confirme ! Notre incubateur FemTech a lancé 3 startups FinTech ce trimestre.', time: '10:07', isMine: false },
      { id: 'm3', author: 'Vous',           initials: 'JD', authorColor: TERRA,    text: 'Quelqu\'un a des retours sur Solana pour des applications de tontine ?', time: '10:12', isMine: true },
      { id: 'm4', author: 'Marcus Johnson', initials: 'MJ', authorColor: '#059669', text: 'Ethereum est trop cher en gas fees. Solana est bien plus adapté pour les micro-transactions.', time: '10:16', isMine: false, reactions: [{ emoji: '💯', count: 4, mine: true }] },
      { id: 'm5', author: 'Sophie Laurent', initials: 'SL', authorColor: TEAL,     text: 'GreenTech Solutions cherche des développeurs blockchain ! DM si intéressé.', time: '10:28', isMine: false },
      { id: 'm6', author: 'Vous',           initials: 'JD', authorColor: TERRA,    text: 'KAURI intègre justement des smart contracts pour automatiser les tontines.', time: '10:33', isMine: true },
    ],
  },
  's3': {
    title: 'Bons Plans Vie Chère', emoji: '💡',
    description: 'Astuces, deals & économies du quotidien pour la communauté',
    participants: 412, color: TERRA,
    members: [
      { name: 'Marie-Claire Dubois',  initials: 'MC', color: '#8B5CF6', role: 'Investisseuse', online: true },
      { name: 'Jean-Baptiste Fond',   initials: 'JF', color: '#8B5CF6', role: 'Agri Bio',     online: false },
      { name: 'Isabelle Moutoussamy', initials: 'IM', color: GOLD,     role: 'Coach',          online: true },
      { name: 'Amina Diallo',         initials: 'AD', color: TEAL,     role: 'Microfinance',   online: false },
      { name: 'Vous',                 initials: 'JD', color: TERRA,    role: 'Membre',          online: true },
    ],
    messages: [
      { id: 'm1', author: 'Marie-Claire Dubois',  initials: 'MC', authorColor: '#8B5CF6', text: 'Bonne nouvelle : le marché de Sainte-Anne propose des paniers bio à -30% le samedi avant 9h !', time: '08:11', isMine: false, reactions: [{ emoji: '🔥', count: 8, mine: true }] },
      { id: 'm2', author: 'Jean-Baptiste Fond',   initials: 'JF', authorColor: '#8B5CF6', text: 'Merci ! Je partage aussi : l\'assurance habitation Maif fait -15% pour les membres de coopératives.', time: '08:19', isMine: false },
      { id: 'm3', author: 'Isabelle Moutoussamy', initials: 'IM', authorColor: GOLD,     text: 'Le groupement d\'achats communautaire économise en moyenne 200€/an par foyer.', time: '08:45', isMine: false },
      { id: 'm4', author: 'Vous',                 initials: 'JD', authorColor: TERRA,    text: 'On pourrait créer une tontine "Bons plans" pour mutualiser nos achats groupés ?', time: '09:01', isMine: true, reactions: [{ emoji: '👏', count: 6, mine: false }, { emoji: '❤️', count: 3, mine: false }] },
      { id: 'm5', author: 'Marie-Claire Dubois',  initials: 'MC', authorColor: '#8B5CF6', text: 'Excellente idée ! Économie de 40% sur les achats groupés.', time: '09:08', isMine: false },
      { id: 'm6', author: 'Amina Diallo',         initials: 'AD', authorColor: TEAL,     text: 'Le modèle coopératif marche très bien en Afrique de l\'Ouest.', time: '09:22', isMine: false },
    ],
  },
  's4': {
    title: 'Entrepreneuriat', emoji: '🚀',
    description: 'Business, levée de fonds & développement de projets communautaires',
    participants: 156, color: TEAL,
    members: [
      { name: 'Sophie Laurent',      initials: 'SL', color: TEAL,    role: 'CEO GreenTech',  online: true  },
      { name: 'Isabelle Moutoussamy',initials: 'IM', color: GOLD,    role: 'Coach Business', online: true  },
      { name: 'Jean-Baptiste Fond',  initials: 'JF', color: '#8B5CF6',role: 'Fondateur',     online: false },
      { name: 'Vous',                initials: 'JD', color: TERRA,   role: 'Membre',          online: true  },
    ],
    messages: [
      { id: 'm1', author: 'Sophie Laurent',      initials: 'SL', authorColor: TEAL, text: 'On lance une levée de fonds pour notre projet solaire en Guadeloupe. 150K€ recherchés.', time: '11:05', isMine: false },
      { id: 'm2', author: 'Vous',                initials: 'JD', authorColor: TERRA, text: 'Intéressant ! Quel est le taux de rendement prévu et sur quelle durée ?', time: '11:09', isMine: true },
      { id: 'm3', author: 'Sophie Laurent',      initials: 'SL', authorColor: TEAL, text: '7% sur 5 ans avec option rachat. Le projet est validé par la région.', time: '11:14', isMine: false, reactions: [{ emoji: '🚀', count: 4, mine: true }] },
      { id: 'm4', author: 'Isabelle Moutoussamy',initials: 'IM', authorColor: GOLD, text: 'J\'ai un mentor pour les entrepreneurs caribéens cherchant des financements européens.', time: '11:28', isMine: false },
      { id: 'm5', author: 'Jean-Baptiste Fond',  initials: 'JF', authorColor: '#8B5CF6', text: 'Mon projet agricole cherche des financements FEADER. Un contact serait précieux.', time: '11:33', isMine: false },
      { id: 'm6', author: 'Vous',                initials: 'JD', authorColor: TERRA, text: 'On devrait créer un répertoire partagé des financements disponibles pour la diaspora.', time: '11:40', isMine: true },
    ],
  },
};

// Fallback for unknown ids (groups from ForumsScreen)
function buildFallbackSalon(id: string): Salon {
  return {
    title: `Salon #${id}`, emoji: '💬',
    description: 'Salon de discussion',
    participants: 5, color: TERRA,
    members: [{ name: 'Vous', initials: 'JD', color: TERRA, role: 'Membre', online: true }],
    messages: [],
  };
}

// ── Avatar pill ───────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 800, color: '#fff',
      boxShadow: `0 2px 6px ${color}50`,
    }}>
      {initials}
    </div>
  );
}

// ── Emoji picker ──────────────────────────────────────────────────────────────
function EmojiPicker({ onPick }: { onPick: (e: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      style={{
        position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 60,
        background: '#fff', borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.14)',
        padding: '16px 14px 10px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => onPick(e)} style={{
            fontSize: 22, background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, padding: '4px 0', transition: 'background 0.1s',
          }}
            onMouseEnter={ev => (ev.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
          >
            {e}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Context menu ─────────────────────────────────────────────────────────────
function MessageMenu({
  msg, position, onReact, onReply, onCopy, onPin, onReport, onClose,
}: {
  msg: Message; position: { top: number; left?: number; right?: number };
  onReact: (e: string) => void; onReply: () => void;
  onCopy: () => void; onPin: () => void; onReport: () => void; onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed', top: position.top, left: position.left, right: position.right,
        zIndex: 80, background: '#fff',
        borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        overflow: 'hidden', minWidth: 200,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Quick reactions */}
      <div style={{ display: 'flex', padding: '10px 12px', gap: 6, borderBottom: '1px solid #F3F4F6' }}>
        {QUICK_REACTIONS.map(e => (
          <button key={e} onClick={() => { onReact(e); onClose(); }}
            style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 4, transition: 'background 0.1s' }}
            onMouseEnter={ev => (ev.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={ev => (ev.currentTarget.style.background = 'none')}
          >{e}</button>
        ))}
      </div>
      {/* Actions */}
      {[
        { icon: Reply,  label: 'Répondre',         action: () => { onReply();  onClose(); } },
        { icon: Copy,   label: 'Copier',            action: () => { onCopy();   onClose(); } },
        { icon: Pin,    label: 'Épingler',          action: () => { onPin();    onClose(); } },
        { icon: Flag,   label: 'Signaler',          action: () => { onReport(); onClose(); }, danger: true },
      ].map((item, i) => (
        <button key={i} onClick={item.action} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
          color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B',
          fontSize: 14, textAlign: 'left',
          borderTop: '1px solid #F8FAFC',
        }}>
          <item.icon size={15} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SalonChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const salonId = id ?? 's1';
  const baseSalon = SALONS[salonId] ?? buildFallbackSalon(salonId);

  const [messages, setMessages]     = useState<Message[]>(baseSalon.messages);
  const [message, setMessage]       = useState('');
  const [muted, setMuted]           = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu]     = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showInfo, setShowInfo]     = useState(false);
  const [showEmoji, setShowEmoji]   = useState(false);
  const [replyTo, setReplyTo]       = useState<Message | null>(null);
  const [contextMsg, setContextMsg] = useState<{ msg: Message; pos: { top: number; left?: number; right?: number } } | null>(null);
  const [pinnedMsg, setPinnedMsg]   = useState<string | null>(baseSalon.pinnedMessage ?? null);
  const [recording, setRecording]   = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recordInterval              = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search filter
  const displayed = searchMode && searchQuery
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // ── Send ──────────────────────────────────────────────────────────────────
  const send = () => {
    const txt = message.trim();
    if (!txt) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      author: 'Vous', initials: 'JD', authorColor: TERRA,
      text: txt,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, author: replyTo.author } : undefined,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    setReplyTo(null);
    setShowEmoji(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  // ── Reactions ─────────────────────────────────────────────────────────────
  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = (m.reactions ?? []).find(r => r.emoji === emoji);
      if (existing) {
        const updated = m.reactions!.map(r =>
          r.emoji === emoji ? { ...r, count: r.mine ? r.count - 1 : r.count + 1, mine: !r.mine } : r
        ).filter(r => r.count > 0);
        return { ...m, reactions: updated };
      }
      return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, mine: true }] };
    }));
  };

  // ── Long press ────────────────────────────────────────────────────────────
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePressStart = (msg: Message, e: React.MouseEvent | React.TouchEvent) => {
    longPressTimer.current = setTimeout(() => {
      const rect = (e.target as HTMLElement).closest('[data-msg]')?.getBoundingClientRect();
      const top  = Math.min((rect?.top ?? 200) - 10, window.innerHeight - 320);
      const pos  = msg.isMine ? { top, right: 16 } : { top, left: 16 };
      setContextMsg({ msg, pos });
    }, 450);
  };
  const handlePressEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

  // ── Voice recording ───────────────────────────────────────────────────────
  const startRecording = () => {
    setRecording(true);
    setRecordSecs(0);
    recordInterval.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
  };
  const stopRecording = () => {
    setRecording(false);
    if (recordInterval.current) clearInterval(recordInterval.current);
    if (recordSecs > 0) {
      const dur = `${String(Math.floor(recordSecs / 60)).padStart(2, '0')}:${String(recordSecs % 60).padStart(2, '0')}`;
      setMessages(prev => [...prev, {
        id: `v${Date.now()}`,
        author: 'Vous', initials: 'JD', authorColor: TERRA,
        text: `🎤 Message vocal (${dur})`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
    setRecordSecs(0);
  };

  // ── Attachment ────────────────────────────────────────────────────────────
  const handleAttach = () => {
    toast('Pièce jointe', {
      description: 'Choisissez une source',
      action: {
        label: '📷 Photo',
        onClick: () => {
          setMessages(prev => [...prev, {
            id: `img${Date.now()}`,
            author: 'Vous', initials: 'JD', authorColor: TERRA,
            text: '📷 Photo partagée',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
          }]);
        },
      },
    });
  };

  const salon = baseSalon;
  const onlineCount = salon.members.filter(m => m.online).length;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F0EDE8', maxWidth: 430, margin: '0 auto', position: 'relative' }}
      onClick={() => { setShowMenu(false); setContextMsg(null); }}>

      {/* ── HEADER ── */}
      <div style={{ background: salon.color, padding: '12px 14px 0', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>

          {/* Salon info — click → info panel */}
          <button
            onClick={() => setShowInfo(true)}
            style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>{salon.emoji}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {salon.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
                <span style={{ color: 'rgba(255,255,255,0.80)', fontSize: 11 }}>{onlineCount} en ligne · {salon.participants} membres</span>
              </div>
            </div>
          </button>

          {/* Search */}
          <button
            onClick={() => { setSearchMode(v => !v); setSearchQuery(''); }}
            style={{ background: searchMode ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.14)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Search size={16} color="#fff" />
          </button>

          {/* Members */}
          <button
            onClick={() => setShowMembers(true)}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Users size={16} color="#fff" />
          </button>

          {/* More */}
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
            style={{ background: showMenu ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.14)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <MoreVertical size={16} color="#fff" />
          </button>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchMode && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', paddingBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans les messages..."
                  style={{ width: '100%', padding: '8px 14px 8px 32px', borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
                {searchQuery && (
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                    {displayed.length} résultat{displayed.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description */}
        {!searchMode && (
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: '0 0 10px', fontStyle: 'italic' }}>{salon.description}</p>
        )}
      </div>

      {/* ── PINNED MESSAGE ── */}
      <AnimatePresence>
        {pinnedMsg && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: `${salon.color}12`, borderBottom: `1px solid ${salon.color}25`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pin size={12} color={salon.color} />
            <p style={{ flex: 1, fontSize: 12, color: '#4A4A4A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pinnedMsg}</p>
            <button onClick={() => setPinnedMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 2 }}>
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DROPDOWN MENU ── */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: -8 }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 68, right: 14, zIndex: 50, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', minWidth: 220 }}>
            {[
              { icon: Info,    label: 'Infos du salon',       action: () => { setShowInfo(true);    setShowMenu(false); } },
              { icon: Users,   label: 'Voir les membres',     action: () => { setShowMembers(true); setShowMenu(false); } },
              { icon: Settings, label: 'Gérer le salon',      action: () => { setShowMenu(false); navigate(`/kauri/social-hub/salon/${salonId}/gerer`); } },
              { icon: muted ? Bell : BellOff, label: muted ? 'Réactiver les notifs' : 'Mettre en sourdine', action: () => { setMuted(v => !v); setShowMenu(false); toast.success(muted ? 'Notifications réactivées' : 'Salon mis en sourdine'); } },
              { icon: Hash,    label: 'Créer un salon',       action: () => { setShowMenu(false); navigate('/kauri/social-hub/creer-salon'); } },
              { icon: LogOut,  label: 'Quitter le salon',     action: () => navigate(-1), danger: true },
            ].map((item, i) => (
              <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer', color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, textAlign: 'left', borderTop: i > 0 ? '1px solid #F8FAFC' : 'none' }}>
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', background: '#F0EDE8', padding: '0 8px' }}>Aujourd'hui</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
        </div>

        {displayed.length === 0 && searchQuery && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF', fontSize: 13 }}>
            Aucun message contenant « {searchQuery} »
          </div>
        )}

        {displayed.map((msg) => (
          <div key={msg.id} data-msg={msg.id}
            onMouseDown={e => handlePressStart(msg, e)}
            onMouseUp={handlePressEnd}
            onTouchStart={e => handlePressStart(msg, e as unknown as React.MouseEvent)}
            onTouchEnd={handlePressEnd}
            style={{ display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}
          >
            {!msg.isMine && <Avatar initials={msg.initials} color={msg.authorColor} size={30} />}

            <div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
              {/* Author name */}
              {!msg.isMine && (
                <span style={{ fontSize: 11, color: msg.authorColor, fontWeight: 700, marginBottom: 3, marginLeft: 4 }}>{msg.author}</span>
              )}

              {/* Reply quote */}
              {msg.replyTo && (
                <div style={{
                  background: msg.isMine ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                  borderLeft: `3px solid ${msg.isMine ? 'rgba(255,255,255,0.7)' : salon.color}`,
                  borderRadius: '8px 8px 0 0',
                  padding: '5px 10px', marginBottom: -4,
                  maxWidth: '100%',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: msg.isMine ? 'rgba(255,255,255,0.8)' : salon.color }}>{msg.replyTo.author}</span>
                  <p style={{ fontSize: 11.5, color: msg.isMine ? 'rgba(255,255,255,0.7)' : '#64748B', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.replyTo.text}</p>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                background: msg.isMine ? salon.color : '#fff',
                color: msg.isMine ? '#fff' : '#1E293B',
                borderRadius: msg.isMine
                  ? (msg.replyTo ? '18px 4px 4px 18px' : '18px 18px 4px 18px')
                  : (msg.replyTo ? '4px 18px 18px 4px' : '18px 18px 18px 4px'),
                padding: '10px 14px', fontSize: 13.5, lineHeight: 1.55,
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                cursor: 'default',
                background: searchQuery && msg.text.toLowerCase().includes(searchQuery.toLowerCase())
                  ? (msg.isMine ? '#8B3E24' : '#FEF9C3')
                  : (msg.isMine ? salon.color : '#fff'),
              } as React.CSSProperties}>
                {msg.text}
              </div>

              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap', justifyContent: msg.isMine ? 'flex-end' : 'flex-start' }}>
                  {msg.reactions.map(r => (
                    <button key={r.emoji} onClick={() => toggleReaction(msg.id, r.emoji)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        background: r.mine ? `${salon.color}20` : '#fff',
                        border: `1px solid ${r.mine ? salon.color : '#E5E7EB'}`,
                        borderRadius: 20, padding: '2px 7px',
                        fontSize: 13, cursor: 'pointer', fontWeight: 600,
                        color: r.mine ? salon.color : '#374151',
                      }}>
                      {r.emoji} <span style={{ fontSize: 11 }}>{r.count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Time */}
              <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, marginLeft: 4, marginRight: 4 }}>{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── REPLY BANNER ── */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: '#fff', borderTop: `1px solid ${salon.color}30`, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 32, borderRadius: 2, background: salon.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: salon.color, margin: 0 }}>{replyTo.author}</p>
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
          {/* Attach */}
          <button onClick={handleAttach} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '6px 4px 8px', flexShrink: 0 }}>
            <Paperclip size={20} />
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Message au salon..."
            style={{ flex: 1, background: '#F4F6F8', border: 'none', borderRadius: 22, padding: '10px 16px', fontSize: 14, color: '#1E293B', outline: 'none', fontFamily: 'inherit' }}
          />

          {/* Emoji toggle */}
          <button
            onClick={e => { e.stopPropagation(); setShowEmoji(v => !v); }}
            style={{ background: showEmoji ? `${salon.color}20` : 'none', border: 'none', cursor: 'pointer', color: showEmoji ? salon.color : '#94A3B8', padding: '6px 4px 8px', borderRadius: 8, flexShrink: 0 }}
          >
            <Smile size={20} />
          </button>

          {/* Voice / Send */}
          {message.trim() ? (
            <button onClick={send}
              style={{ width: 40, height: 40, borderRadius: '50%', background: salon.color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${salon.color}50` }}>
              <Send size={17} color="#fff" />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: recording ? '#EF4444' : '#F4F6F8',
                border: recording ? '2px solid #EF4444' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
              <Mic size={18} color={recording ? '#fff' : '#94A3B8'} />
            </button>
          )}
        </div>

        {/* Recording indicator */}
        {recording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0 0 8px' }}>
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
              {String(Math.floor(recordSecs / 60)).padStart(2, '0')}:{String(recordSecs % 60).padStart(2, '0')} — Maintenez pour enregistrer
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
              position={contextMsg.pos}
              onReact={e => toggleReaction(contextMsg.msg.id, e)}
              onReply={() => setReplyTo(contextMsg.msg)}
              onCopy={() => { navigator.clipboard?.writeText(contextMsg.msg.text); toast.success('Copié !'); }}
              onPin={() => { setPinnedMsg(contextMsg.msg.text); toast.success('Message épinglé'); }}
              onReport={() => toast.error('Message signalé à la modération')}
              onClose={() => setContextMsg(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── MEMBERS SHEET ── */}
      <AnimatePresence>
        {showMembers && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90 }}
              onClick={() => setShowMembers(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', maxWidth: 430, background: '#fff',
                borderRadius: '24px 24px 0 0', zIndex: 95,
                maxHeight: '70dvh', display: 'flex', flexDirection: 'column',
              }}>
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>
              <div style={{ padding: '4px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', margin: 0 }}>Membres · {salon.members.length}</h3>
                <button onClick={() => setShowMembers(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} color="#64748B" />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 24px' }}>
                {salon.members.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', borderBottom: i < salon.members.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <div style={{ position: 'relative' }}>
                      <Avatar initials={m.initials} color={m.color} size={40} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: m.online ? '#22c55e' : '#D1D5DB', border: '2px solid #fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', margin: 0 }}>{m.name}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '1px 0 0' }}>{m.role}</p>
                    </div>
                    {m.name !== 'Vous' && (
                      <button onClick={() => { navigate(`/kauri/social-hub/conversation/${i + 1}`); setShowMembers(false); }}
                        style={{ background: `${salon.color}12`, border: `1px solid ${salon.color}30`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: salon.color, fontSize: 12, fontWeight: 600 }}>
                        Message
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SALON INFO SHEET ── */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90 }}
              onClick={() => setShowInfo(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', maxWidth: 430, background: '#fff',
                borderRadius: '24px 24px 0 0', zIndex: 95,
                maxHeight: '75dvh', overflowY: 'auto',
              }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
              </div>

              {/* Salon header */}
              <div style={{ padding: '8px 20px 20px', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, margin: '0 auto 12px',
                  background: `linear-gradient(135deg, ${salon.color}DD, ${salon.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>{salon.emoji}</div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>{salon.title}</h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>{salon.description}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{ background: '#F3F4F6', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Users size={12} />{salon.participants} membres
                  </span>
                  <span style={{ background: '#DCFCE7', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#166534', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />{onlineCount} en ligne
                  </span>
                  <span style={{ background: `${salon.color}15`, borderRadius: 20, padding: '5px 12px', fontSize: 12, color: salon.color, fontWeight: 700 }}>
                    🌍 Public
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '0 14px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Voir les membres', icon: Users,    action: () => { setShowInfo(false); setShowMembers(true); } },
                  { label: 'Gérer le salon',   icon: Settings, action: () => { setShowInfo(false); navigate(`/kauri/social-hub/salon/${salonId}/gerer`); } },
                  { label: muted ? 'Réactiver les notifs' : 'Mettre en sourdine', icon: muted ? Bell : BellOff, action: () => { setMuted(v => !v); setShowInfo(false); toast.success(muted ? 'Notifs réactivées' : 'Sourdine activée'); } },
                  { label: 'Signaler le salon', icon: Flag,   action: () => { setShowInfo(false); navigate('/kauri/social-hub/signaler-abus'); }, danger: true },
                  { label: 'Quitter le salon',  icon: LogOut, action: () => navigate(-1), danger: true },
                ].map((a, i) => (
                  <button key={i} onClick={a.action} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 14,
                    background: (a as { danger?: boolean }).danger ? '#FEF2F2' : '#F9FAFB',
                    border: `1px solid ${(a as { danger?: boolean }).danger ? '#FECACA' : '#F3F4F6'}`,
                    cursor: 'pointer', color: (a as { danger?: boolean }).danger ? '#EF4444' : '#1E293B',
                    fontSize: 14, fontWeight: 500,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <a.icon size={16} />
                      {a.label}
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
