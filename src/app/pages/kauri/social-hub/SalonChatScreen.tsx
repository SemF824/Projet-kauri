import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Users, Search, MoreVertical, Paperclip, Smile, Send, Bell, BellOff, LogOut, Info } from 'lucide-react';

const TERRACOTTA = '#B05B3B';
const GOLD = '#D4AF37';
const TEAL = '#006D77';

const SALONS: Record<string, {
  title: string;
  description: string;
  participants: number;
  color: string;
  messages: { id: string; author: string; initials: string; color: string; text: string; time: string; isMine: boolean }[];
}> = {
  '1': {
    title: 'Immobilier Antilles',
    description: 'Investissement, location & tendances du marché immobilier caribéen',
    participants: 234,
    color: TEAL,
    messages: [
      { id: 'm1', author: 'Sophie Laurent', initials: 'SL', color: TEAL, text: 'Bonjour à tous ! Quelqu\'un connaît les nouvelles zones de développement à Fort-de-France ?', time: '09:14', isMine: false },
      { id: 'm2', author: 'Jean-Baptiste Fond', initials: 'JF', color: '#8B5CF6', text: 'Oui ! Le quartier Dillon est en plein essor. Beaucoup de projets résidentiels neufs.', time: '09:18', isMine: false },
      { id: 'm3', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'J\'ai justement regardé des biens là-bas la semaine dernière. Les prix restent encore abordables comparé à Paris.', time: '09:22', isMine: true },
      { id: 'm4', author: 'Isabelle Moutoussamy', initials: 'IM', color: '#D4AF37', text: 'La rentabilité locative en Martinique tourne autour de 5 à 7% selon les secteurs. C\'est très intéressant pour les diaspora.', time: '09:31', isMine: false },
      { id: 'm5', author: 'Sophie Laurent', initials: 'SL', color: TEAL, text: 'Exactement Isabelle ! Et avec les dispositifs de défiscalisation Pinel Outre-mer, c\'est encore plus attractif.', time: '09:35', isMine: false },
      { id: 'm6', author: 'Marcus Johnson', initials: 'MJ', color: '#059669', text: 'Est-ce que quelqu\'un peut me recommander un notaire fiable en Guadeloupe ?', time: '09:52', isMine: false },
      { id: 'm7', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'Je peux te mettre en contact avec maître Beaumont à Pointe-à-Pitre, très sérieux.', time: '09:55', isMine: true },
      { id: 'm8', author: 'Jean-Baptiste Fond', initials: 'JF', color: '#8B5CF6', text: 'Merci pour l\'info ! On devrait organiser un webinaire sur l\'investissement immobilier caribéen. Des volontaires ?', time: '10:04', isMine: false },
    ],
  },
  '2': {
    title: 'Tech Diaspora',
    description: 'Startups, IA, blockchain & innovation technologique de la diaspora',
    participants: 189,
    color: GOLD,
    messages: [
      { id: 'm1', author: 'Marcus Johnson', initials: 'MJ', color: '#059669', text: 'La DeFi explose en Afrique de l\'Ouest. Des projets vraiment intéressants émergent à Dakar.', time: '10:02', isMine: false },
      { id: 'm2', author: 'Amina Diallo', initials: 'AD', color: TERRACOTTA, text: 'Je confirme ! Notre incubateur FemTech a lancé 3 startups FinTech ce trimestre.', time: '10:07', isMine: false },
      { id: 'm3', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'Quelqu\'un a des retours sur l\'utilisation de Solana pour des applications de tontine ?', time: '10:12', isMine: true },
      { id: 'm4', author: 'Marcus Johnson', initials: 'MJ', color: '#059669', text: 'On a testé sur Ethereum d\'abord mais les gas fees sont prohibitifs. Solana est bien plus adapté pour les micro-transactions.', time: '10:16', isMine: false },
      { id: 'm5', author: 'Sophie Laurent', initials: 'SL', color: TEAL, text: 'GreenTech Solutions cherche des développeurs blockchain ! DM si intéressé.', time: '10:28', isMine: false },
      { id: 'm6', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'Très bonne initiative Sophie. KAURI intègre justement des smart contracts pour automatiser les tontines.', time: '10:33', isMine: true },
    ],
  },
  '3': {
    title: 'Bons Plans Vie Chère',
    description: 'Astuces, deals & économies du quotidien pour la communauté',
    participants: 412,
    color: TERRACOTTA,
    messages: [
      { id: 'm1', author: 'Marie-Claire Dubois', initials: 'MC', color: '#8B5CF6', text: 'Bonne nouvelle : le marché de Sainte-Anne propose des paniers bio à -30% le samedi matin avant 9h !', time: '08:11', isMine: false },
      { id: 'm2', author: 'Jean-Baptiste Fond', initials: 'JF', color: '#8B5CF6', text: 'Merci Marie-Claire ! Je partage aussi : l\'assurance habitation Maif fait -15% pour les membres de coopératives.', time: '08:19', isMine: false },
      { id: 'm3', author: 'Isabelle Moutoussamy', initials: 'IM', color: GOLD, text: 'Pour l\'électricité, le groupement d\'achats communautaire qu\'on a monté économise en moyenne 200€/an par foyer.', time: '08:45', isMine: false },
      { id: 'm4', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'On pourrait créer une tontine "Bons plans" pour mutualiser nos achats groupés ? Idée à creuser via KAURI.', time: '09:01', isMine: true },
      { id: 'm5', author: 'Marie-Claire Dubois', initials: 'MC', color: '#8B5CF6', text: 'Excellente idée ! On a déjà fait ça pour les fournitures scolaires. Économie de 40% sur les achats.', time: '09:08', isMine: false },
      { id: 'm6', author: 'Amina Diallo', initials: 'AD', color: TEAL, text: 'Le modèle coopératif marche très bien en Afrique de l\'Ouest. Votre initiative m\'inspire pour Dakar aussi.', time: '09:22', isMine: false },
    ],
  },
  '4': {
    title: 'Entrepreneuriat',
    description: 'Business, levée de fonds & développement de projets communautaires',
    participants: 156,
    color: TEAL,
    messages: [
      { id: 'm1', author: 'Sophie Laurent', initials: 'SL', color: TEAL, text: 'On lance une nouvelle levée de fonds pour notre projet solaire en Guadeloupe. 150K€ recherchés.', time: '11:05', isMine: false },
      { id: 'm2', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'Intéressant ! Quel est le taux de rendement prévu et sur quelle durée ?', time: '11:09', isMine: true },
      { id: 'm3', author: 'Sophie Laurent', initials: 'SL', color: TEAL, text: '7% sur 5 ans avec un option rachat. Le projet est déjà validé par la région.', time: '11:14', isMine: false },
      { id: 'm4', author: 'Isabelle Moutoussamy', initials: 'IM', color: GOLD, text: 'J\'ai un mentor disponible pour les entrepreneurs caribéens cherchant des financements européens. Intéressés ?', time: '11:28', isMine: false },
      { id: 'm5', author: 'Jean-Baptiste Fond', initials: 'JF', color: '#8B5CF6', text: 'Oui ! Mon projet agricole cherche justement des financements FEADER. Un contact serait précieux.', time: '11:33', isMine: false },
      { id: 'm6', author: 'Vous', initials: 'JD', color: TERRACOTTA, text: 'On devrait créer un répertoire partagé des financements disponibles pour la diaspora. Je peux commencer la doc.', time: '11:40', isMine: true },
    ],
  },
};

type MenuAction = 'none' | 'menu';

export default function SalonChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const salon = SALONS[id ?? '1'] ?? SALONS['1'];

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(salon.messages);
  const [menuOpen, setMenuOpen] = useState<MenuAction>('none');
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
      author: 'Vous',
      initials: 'JD',
      color: TERRACOTTA,
      text: txt,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }]);
    setMessage('');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', position: 'relative' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: salon.color,
        padding: '12px 16px 14px',
        position: 'sticky', top: 0, zIndex: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{salon.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Users size={11} color="rgba(255,255,255,0.75)" />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{salon.participants} membres</span>
            </div>
          </div>

          <button onClick={() => setMenuOpen('none')} style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Search size={16} color="#fff" />
          </button>
          <button
            onClick={() => setMenuOpen(menuOpen === 'menu' ? 'none' : 'menu')}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <MoreVertical size={16} color="#fff" />
          </button>
        </div>

        {/* Description sous-titre */}
        <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 11, margin: '8px 0 0', fontStyle: 'italic' }}>{salon.description}</p>
      </div>

      {/* ── DROPDOWN MENU ── */}
      {menuOpen === 'menu' && (
        <div style={{ position: 'absolute', top: 70, right: 16, zIndex: 50, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', minWidth: 210 }}>
          {[
            { icon: <Info size={16} />, label: 'Infos du salon', action: () => setMenuOpen('none') },
            { icon: muted ? <Bell size={16} /> : <BellOff size={16} />, label: muted ? 'Réactiver les notifs' : 'Désactiver les notifs', action: () => { setMuted(v => !v); setMenuOpen('none'); } },
            { icon: <Users size={16} />, label: 'Voir les membres', action: () => setMenuOpen('none') },
            { icon: <LogOut size={16} color="#EF4444" />, label: 'Quitter le salon', action: () => navigate(-1), danger: true },
          ].map((item, i) => (
            <button key={i} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', background: 'none', border: 'none', cursor: 'pointer', color: (item as { danger?: boolean }).danger ? '#EF4444' : '#1E293B', fontSize: 14, textAlign: 'left', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }} onClick={() => setMenuOpen('none')}>
        {/* Date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>Aujourd'hui</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
        </div>

        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
            {!msg.isMine && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: '#fff' }}>
                {msg.initials}
              </div>
            )}
            <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: msg.isMine ? 'flex-end' : 'flex-start' }}>
              {!msg.isMine && (
                <span style={{ fontSize: 11, color: msg.color, fontWeight: 700, marginBottom: 3, marginLeft: 4 }}>{msg.author}</span>
              )}
              <div style={{
                background: msg.isMine ? TERRACOTTA : '#fff',
                color: msg.isMine ? '#fff' : '#1E293B',
                borderRadius: msg.isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: 13.5,
                lineHeight: 1.5,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, marginLeft: 4, marginRight: 4 }}>{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 6 }}>
          <Paperclip size={20} />
        </button>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message au salon..."
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
