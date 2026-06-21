import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MoreVertical, Paperclip, Smile, Send, Phone, Video, BellOff, Bell, Trash2, UserX, Check, CheckCheck } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';
const GOLD = '#D4AF37';

const CONVERSATIONS: Record<string, {
  name: string;
  initials: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  role: string;
  messages: { id: string; text: string; time: string; isMine: boolean; read: boolean }[];
}> = {
  '1': {
    name: 'Marie-Claire Dubois',
    initials: 'MC',
    avatar: '👩🏾',
    color: '#8B5CF6',
    isOnline: true,
    role: 'Mentor & Investisseuse',
    messages: [
      { id: 'm1', text: 'Bonjour ! J\'ai vu ton profil sur KAURI, tes projets en immobilier caribéen sont très intéressants.', time: '09:42', isMine: false, read: true },
      { id: 'm2', text: 'Merci Marie-Claire ! Je cherche justement des conseils pour mon premier investissement en Martinique.', time: '09:45', isMine: true, read: true },
      { id: 'm3', text: 'Je peux t\'aider ! J\'ai 10 ans d\'expérience dans l\'immobilier antillais. Tu vises quel budget ?', time: '09:48', isMine: false, read: true },
      { id: 'm4', text: 'Entre 80 et 120K€. Je voudrais du locatif dans un quartier en développement.', time: '09:51', isMine: true, read: true },
      { id: 'm5', text: 'Parfait. Dillon et Cluny à Fort-de-France sont tes cibles. J\'envoie une étude de marché ce soir.', time: '09:54', isMine: false, read: true },
      { id: 'm6', text: 'Super l\'idée du pot commun pour la tontine ! On pourrait mutualiser les achats aussi ?', time: 'Il y a 5 min', isMine: false, read: false },
    ],
  },
  '2': {
    name: 'Jean-Baptiste Laurent',
    initials: 'JL',
    avatar: '👨🏾',
    color: TEAL,
    isOnline: true,
    role: 'Agriculteur & Fondateur BioCarib',
    messages: [
      { id: 'm1', text: 'Salut ! Tu as regardé le nouveau projet immobilier dans le salon ?', time: '10:12', isMine: false, read: true },
      { id: 'm2', text: 'Pas encore, je vais regarder ça. C\'est quoi le concept ?', time: '10:16', isMine: true, read: true },
      { id: 'm3', text: 'Un immeuble collectif où chaque membre d\'une tontine prend une part. Modèle coopératif.', time: '10:19', isMine: false, read: true },
      { id: 'm4', text: 'Intéressant ! Ça rejoint ce que KAURI fait avec les investissements RWA. Tu as le lien du projet ?', time: '10:23', isMine: true, read: true },
      { id: 'm5', text: 'Tu as vu le nouveau projet immobilier ?', time: 'Il y a 15 min', isMine: false, read: false },
    ],
  },
  '3': {
    name: 'Isabelle Moutoussamy',
    initials: 'IM',
    avatar: '👩🏽',
    color: GOLD,
    isOnline: false,
    role: 'Coach Business & Investisseuse',
    messages: [
      { id: 'm1', text: 'Bonjour, j\'avais une question sur les dispositifs de défiscalisation pour investisseurs caribéens.', time: 'Hier 14:30', isMine: true, read: true },
      { id: 'm2', text: 'Bien sûr ! La loi Girardin industrie et Pinel Outre-mer sont vos meilleures options. Réductions de 25 à 48% selon les cas.', time: 'Hier 15:02', isMine: false, read: true },
      { id: 'm3', text: 'Incroyable ! Et est-ce que c\'est cumulable avec les avantages d\'une tontine KAURI ?', time: 'Hier 15:10', isMine: true, read: true },
      { id: 'm4', text: 'Oui, sous certaines conditions. Je te prépare une fiche comparative. Laisse-moi quelques jours.', time: 'Hier 15:18', isMine: false, read: true },
      { id: 'm5', text: 'Merci pour les conseils investissement', time: 'Il y a 2h', isMine: false, read: true },
    ],
  },
  '4': {
    name: 'Groupe Tontine Famille',
    initials: 'TF',
    avatar: '👥',
    color: TERRACOTTA,
    isOnline: false,
    role: 'Groupe · 8 membres',
    messages: [
      { id: 'm1', text: 'Rappel : cotisation du mois à effectuer avant le 25 via KAURI.', time: 'Lundi 09:00', isMine: false, read: true },
      { id: 'm2', text: 'Fait ! J\'ai validé ce matin.', time: 'Lundi 09:14', isMine: true, read: true },
      { id: 'm3', text: 'Maman a confirmé aussi. Il reste Papa et Tonton Gilles.', time: 'Lundi 10:02', isMine: false, read: true },
      { id: 'm4', text: 'Tonton Gilles sera OK d\'ici jeudi il m\'a dit.', time: 'Mardi 11:30', isMine: false, read: true },
      { id: 'm5', text: 'Parfait. N\'oubliez pas : prochaine réunion vendredi 18h.', time: 'Hier 20:15', isMine: false, read: true },
      { id: 'm6', text: 'Je serai là. On discute du prochain cycle ?', time: 'Hier 20:22', isMine: true, read: true },
      { id: 'm7', text: 'Prochaine réunion vendredi 18h', time: 'Hier', isMine: false, read: false },
    ],
  },
  '5': {
    name: 'Marcus Johnson',
    initials: 'MJ',
    avatar: '👨🏿',
    color: '#059669',
    isOnline: true,
    role: 'Senior Blockchain Developer',
    messages: [
      { id: 'm1', text: 'Hey ! J\'ai partagé un article sur l\'adoption de la blockchain en Afrique de l\'Ouest. Tu l\'as vu ?', time: 'Il y a 3j', isMine: false, read: true },
      { id: 'm2', text: 'Pas encore ! Tu peux me le passer ?', time: 'Il y a 3j', isMine: true, read: true },
      { id: 'm3', text: 'Excellent article sur la diaspora et les transferts d\'argent via DeFi. Game changer.', time: 'Il y a 3j', isMine: false, read: true },
    ],
  },
};

export default function PrivateConversationScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const conv = CONVERSATIONS[id ?? '1'] ?? CONVERSATIONS['1'];

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conv.messages.map(m => ({ ...m, read: true })));
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const txt = message.trim();
    if (!txt) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      text: txt,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      read: false,
    }]);
    setMessage('');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#EEF2F5', maxWidth: 430, margin: '0 auto', position: 'relative' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E8ECF0',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, zIndex: 20,
        boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4, flexShrink: 0 }}>
          <ArrowLeft size={22} />
        </button>

        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: conv.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: `2px solid ${conv.color}30` }}>
            {conv.avatar}
          </div>
          {conv.isOnline && (
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</p>
          <p style={{ margin: 0, fontSize: 11, color: conv.isOnline ? '#22C55E' : '#94A3B8' }}>
            {conv.isOnline ? 'En ligne' : conv.role}
          </p>
        </div>

        <button style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
          <Phone size={16} />
        </button>
        <button style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
          <Video size={16} />
        </button>
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{ background: menuOpen ? '#F4F6F8' : 'none', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* ── DROPDOWN MENU ── */}
      {menuOpen && (
        <div style={{ position: 'absolute', top: 68, right: 14, zIndex: 50, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden', minWidth: 220 }}>
          {[
            { icon: muted ? <Bell size={16} /> : <BellOff size={16} />, label: muted ? 'Réactiver les notifs' : 'Mettre en sourdine', action: () => { setMuted(v => !v); setMenuOpen(false); } },
            { icon: <Trash2 size={16} color="#EF4444" />, label: 'Supprimer la conversation', action: () => navigate(-1), danger: true },
            { icon: <UserX size={16} color="#EF4444" />, label: 'Bloquer cet utilisateur', action: () => setMenuOpen(false), danger: true },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer', color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, textAlign: 'left', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }} onClick={() => setMenuOpen(false)}>

        {/* Profile card top */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 12px', gap: 8 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: conv.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: `2px solid ${conv.color}40` }}>
            {conv.avatar}
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1E293B' }}>{conv.name}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{conv.role}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 11, background: conv.color + '18', color: conv.color, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>Connexion KAURI</span>
          </div>
        </div>

        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>Début de la conversation</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
        </div>

        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}>
            {!msg.isMine && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: conv.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                {conv.avatar}
              </div>
            )}
            <div style={{ maxWidth: '74%', display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                background: msg.isMine ? TERRACOTTA : '#fff',
                color: msg.isMine ? '#fff' : '#1E293B',
                borderRadius: msg.isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: 13.5,
                lineHeight: 1.55,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                {msg.text}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, marginLeft: 4, marginRight: 4 }}>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{msg.time}</span>
                {msg.isMine && (
                  msg.read
                    ? <CheckCheck size={12} color={TEAL} />
                    : <Check size={12} color="#94A3B8" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E8ECF0', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 6 }}>
          <Paperclip size={20} />
        </button>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Message à ${conv.name.split(' ')[0]}...`}
          style={{ flex: 1, background: '#F4F6F8', border: 'none', borderRadius: 22, padding: '10px 16px', fontSize: 14, color: '#1E293B', outline: 'none' }}
        />
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 6 }}>
          <Smile size={20} />
        </button>
        <button
          onClick={send}
          style={{ width: 40, height: 40, borderRadius: '50%', background: message.trim() ? TERRACOTTA : '#E2E8F0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}
        >
          <Send size={17} color={message.trim() ? '#fff' : '#94A3B8'} />
        </button>
      </div>
    </div>
  );
}
