import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Heart, MessageCircle, Bookmark, Volume2, VolumeX, Music,
  X, Send, Copy, Flag, ExternalLink, ChevronRight, Users,
  CheckCircle, Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  avatarGrad: [string, string];
  isVerified: boolean;
  isFollowing: boolean;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  duration: string;
  audio: string;
  category: string;
  bgType: 'finance' | 'agriculture' | 'tontine' | 'tech' | 'immo';
  trustScore: number;
  accountType: 'pro' | 'association' | 'porteur';
  commentsList: Comment[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    handle: '@laura_invest',
    displayName: 'Laura Invest',
    initials: 'LI',
    avatarGrad: ['#006D77', '#D4AF37'],
    isVerified: true,
    isFollowing: false,
    caption:
      'Comment financer son projet agricole au pays sans passer par les banques classiques 🌴💸 #Kauri #Diaspora #Souverainete',
    likes: 12400,
    comments: 342,
    shares: 891,
    isLiked: false,
    isSaved: false,
    duration: '0:47',
    audio: 'Son original - KAURI Academy',
    category: 'Finance',
    bgType: 'finance',
    trustScore: 4.9,
    accountType: 'pro',
    commentsList: [
      { id: 'c1', author: 'Jean-Baptiste', initials: 'JB', color: '#006D77', text: 'Super contenu ! Merci pour ces conseils pratiques 🙏', time: '2h', likes: 24, isLiked: false },
      { id: 'c2', author: 'Marie Claire', initials: 'MC', color: '#B05B3B', text: 'Est-ce que vous proposez des formations pour aller plus loin ?', time: '1h', likes: 8, isLiked: false },
      { id: 'c3', author: 'Rodrigue K.', initials: 'RK', color: '#8B5CF6', text: 'J\'ai suivi ce conseil l\'an dernier et ça a vraiment marché pour moi à la Réunion !', time: '45min', likes: 41, isLiked: true },
      { id: 'c4', author: 'Sophie L.', initials: 'SL', color: '#059669', text: 'Partagé à toute ma famille ! Exactement ce qu\'il nous fallait.', time: '20min', likes: 15, isLiked: false },
    ],
  },
  {
    id: '2',
    handle: '@pierre_agri',
    displayName: 'Pierre Dubois',
    initials: 'PD',
    avatarGrad: ['#1A5C33', '#D4AF37'],
    isVerified: false,
    isFollowing: true,
    caption:
      "De Paris à mon village en Martinique — comment j'ai transformé 2 000€ en ferme bio grâce aux tontines 🌱 Le thread complet 👇",
    likes: 8920,
    comments: 671,
    shares: 345,
    isLiked: true,
    isSaved: true,
    duration: '1:12',
    audio: 'Diaspora Beats Vol.3 - DJ Kali',
    category: 'Agriculture',
    bgType: 'agriculture',
    trustScore: 4.6,
    accountType: 'porteur',
    commentsList: [
      { id: 'c1', author: 'Isabelle M.', initials: 'IM', color: '#D4AF37', text: 'Incroyable parcours ! Vous inspirez tellement de gens de la diaspora 🌱', time: '3h', likes: 56, isLiked: false },
      { id: 'c2', author: 'Marcus J.', initials: 'MJ', color: '#3B82F6', text: 'Combien de temps pour rentabiliser l\'investissement initial ?', time: '2h', likes: 12, isLiked: false },
      { id: 'c3', author: 'Fatou D.', initials: 'FD', color: '#EC4899', text: 'Je suis en train de planifier la même chose pour le Sénégal. On pourrait échanger ?', time: '1h', likes: 33, isLiked: false },
    ],
  },
  {
    id: '3',
    handle: '@aminata_tontine',
    displayName: 'Aminata Koné',
    initials: 'AK',
    avatarGrad: ['#3D1F66', '#D4AF37'],
    isVerified: true,
    isFollowing: false,
    caption:
      "La tontine : l'ancêtre des fintechs ? 🐚 Découvrez comment nos ancêtres ont inventé la finance solidaire bien avant Silicon Valley 🔥 #KauriPower",
    likes: 22100,
    comments: 1203,
    shares: 4500,
    isLiked: false,
    isSaved: false,
    duration: '2:34',
    audio: 'Son original - Aminata Koné',
    category: 'Héritage',
    bgType: 'tontine',
    trustScore: 5.0,
    accountType: 'association',
    commentsList: [
      { id: 'c1', author: 'David N.', initials: 'DN', color: '#006D77', text: "Cette vidéo devrait être enseignée dans toutes les écoles ! 🔥", time: '5h', likes: 412, isLiked: true },
      { id: 'c2', author: 'Aissatou B.', initials: 'AB', color: '#D4AF37', text: 'Ma grand-mère me parlait de ça ! Si fière de notre héritage financier.', time: '4h', likes: 287, isLiked: false },
      { id: 'c3', author: 'Thomas V.', initials: 'TV', color: '#8B5CF6', text: 'Incroyable perspective. On a tellement à apprendre de nos traditions.', time: '3h', likes: 156, isLiked: false },
      { id: 'c4', author: 'Nadia M.', initials: 'NM', color: '#EC4899', text: 'Partagé à mes 3 groupes WhatsApp 😂 tout le monde doit voir ça', time: '2h', likes: 98, isLiked: false },
      { id: 'c5', author: 'Yves K.', initials: 'YK', color: '#059669', text: "J'organise justement une tontine dans mon quartier depuis 2 ans. Très content que ça prenne de l'ampleur!", time: '1h', likes: 73, isLiked: false },
    ],
  },
  {
    id: '4',
    handle: '@marcus_tech',
    displayName: 'Marcus Johnson',
    initials: 'MJ',
    avatarGrad: ['#0A1628', '#006D77'],
    isVerified: true,
    isFollowing: false,
    caption:
      "J'ai levé 50k€ pour ma startup tech en 30 jours via la communauté KAURI. Voici mon playbook complet 🚀💡 #Tech #Diaspora #Entrepreneuriat",
    likes: 15600,
    comments: 892,
    shares: 2300,
    isLiked: false,
    isSaved: false,
    duration: '1:58',
    audio: 'Future Vibes - KAURI FM',
    category: 'Tech',
    bgType: 'tech',
    trustScore: 4.8,
    accountType: 'porteur',
    commentsList: [
      { id: 'c1', author: 'Kevin P.', initials: 'KP', color: '#006D77', text: 'Respect 🙌 La communauté KAURI est vraiment puissante', time: '6h', likes: 89, isLiked: false },
      { id: 'c2', author: 'Carla S.', initials: 'CS', color: '#EC4899', text: "C'est exactement ce dont on a besoin dans l'éco-système tech afro-caribéen !", time: '4h', likes: 134, isLiked: false },
      { id: 'c3', author: 'Léon T.', initials: 'LT', color: '#D4AF37', text: 'Quel est votre secteur ? App mobile ou SaaS ?', time: '2h', likes: 21, isLiked: false },
    ],
  },
  {
    id: '5',
    handle: '@sophie_immo',
    displayName: 'Sophie Laurent',
    initials: 'SL',
    avatarGrad: ['#B05B3B', '#D4AF37'],
    isVerified: true,
    isFollowing: false,
    caption:
      "Mon premier appartement à Fort-de-France à 28 ans 🏠✨ — voici comment KAURI m'a aidée à concrétiser ce rêve sans apport classique 🔑 #Immobilier #Patrimoine",
    likes: 31200,
    comments: 2890,
    shares: 7600,
    isLiked: true,
    isSaved: true,
    duration: '3:15',
    audio: 'Île de Rêves - Kalani',
    category: 'Immobilier',
    bgType: 'immo',
    trustScore: 4.7,
    accountType: 'pro',
    commentsList: [
      { id: 'c1', author: 'Amanda C.', initials: 'AC', color: '#B05B3B', text: 'Vous avez réalisé mon rêve en vidéo 😭 Merci pour ce contenu si inspirant', time: '8h', likes: 312, isLiked: false },
      { id: 'c2', author: 'Pierre B.', initials: 'PB', color: '#006D77', text: 'Quel taux de crédit avez-vous obtenu ? Banque locale ou métropole ?', time: '7h', likes: 54, isLiked: false },
      { id: 'c3', author: 'Nelly G.', initials: 'NG', color: '#8B5CF6', text: 'Moi aussi je veux mon chez-moi aux Antilles ! Vous proposez un accompagnement ?', time: '5h', likes: 78, isLiked: false },
    ],
  },
];

// ─── Video Background Scenes ──────────────────────────────────────────────────

function VideoBackground({ bgType }: { bgType: Post['bgType'] }) {
  const scenes: Record<Post['bgType'], React.ReactNode> = {
    finance: (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(185deg, #001824 0%, #003A4F 45%, #006D77 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          <polyline points="0,750 70,680 150,650 220,560 300,470 380,380 430,330"
            stroke="rgba(212,175,55,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0,750 L70,680 L150,650 L220,560 L300,470 L380,380 L430,330 L430,900 L0,900 Z"
            fill="rgba(212,175,55,0.08)" />
          {[250, 400, 550, 700].map((y) => (
            <line key={y} x1="0" y1={y} x2="430" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          <circle cx="215" cy="420" r="160" fill="none" stroke="rgba(0,109,119,0.18)" strokeWidth="1" />
          <circle cx="215" cy="420" r="220" fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="1" />
          {[[70,680],[150,650],[220,560],[300,470],[380,380]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#D4AF37" opacity="0.7" />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 8px 32px rgba(212,175,55,0.6))' }}>💰</div>
          <p style={{ color: 'rgba(212,175,55,0.8)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>Investissement</p>
        </div>
      </div>
    ),
    agriculture: (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(185deg, #0A1A0A 0%, #163B16 40%, #2E6B2E 80%, #8B4513 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          <path d="M0,820 Q215,790 430,820 L430,900 L0,900 Z" fill="rgba(101,60,20,0.6)" />
          <path d="M0,840 Q215,820 430,840 L430,900 L0,900 Z" fill="rgba(70,40,10,0.8)" />
          <path d="M0,680 Q100,600 200,640 Q280,590 350,620 Q390,600 430,620 L430,900 L0,900 Z" fill="rgba(22,59,22,0.7)" />
          {[60, 150, 320, 380].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${560 + (i % 2) * 30})`}>
              <rect x="-4" y="40" width="8" height="35" fill="rgba(80,50,20,0.8)" />
              <ellipse cx="0" cy="20" rx="22" ry="30" fill="rgba(30,80,30,0.75)" />
            </g>
          ))}
          <circle cx="215" cy="200" r="80" fill="rgba(212,175,55,0.12)" />
          <circle cx="215" cy="200" r="45" fill="rgba(212,175,55,0.18)" />
        </svg>
        <div style={{ position: 'absolute', top: '28%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 8px 32px rgba(0,100,0,0.5))' }}>🌱</div>
          <p style={{ color: 'rgba(212,175,55,0.75)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>Agriculture</p>
        </div>
      </div>
    ),
    tontine: (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(185deg, #0D0619 0%, #1A0B35 40%, #2E1060 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          {[220, 180, 140, 100].map((r, i) => (
            <circle key={i} cx="215" cy="420" r={r} fill="none" stroke={`rgba(212,175,55,${0.08 + i * 0.04})`} strokeWidth="1.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x = 215 + 180 * Math.cos(angle);
            const y = 420 + 180 * Math.sin(angle);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="14" fill={`rgba(212,175,55,${0.2 + (i % 3) * 0.1})`} stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
                <circle cx={x} cy={y - 5} r="5" fill="rgba(212,175,55,0.6)" />
              </g>
            );
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x = 215 + 180 * Math.cos(a);
            const y = 420 + 180 * Math.sin(a);
            return <line key={i} x1="215" y1="420" x2={x} y2={y} stroke="rgba(212,175,55,0.12)" strokeWidth="1" />;
          })}
        </svg>
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.7))' }}>🐚</div>
          <p style={{ color: 'rgba(212,175,55,0.8)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>Héritage & Finance</p>
        </div>
      </div>
    ),
    tech: (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(185deg, #020810 0%, #04102A 45%, #061A40 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 90} x2="430" y2={i * 90} stroke="rgba(0,109,119,0.12)" strokeWidth="1" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 72} y1="0" x2={i * 72} y2="900" stroke="rgba(0,109,119,0.12)" strokeWidth="1" />
          ))}
          {[[215,420],[120,300],[310,300],[100,520],[330,520],[215,180],[215,650]].map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill={`rgba(0,109,119,${0.3 + (i % 3) * 0.15})`} stroke="rgba(0,200,220,0.4)" strokeWidth="1.5" />
              {i > 0 && <line x1="215" y1="420" x2={x} y2={y} stroke="rgba(0,150,180,0.2)" strokeWidth="1" />}
            </g>
          ))}
          <circle cx="215" cy="420" r="40" fill="rgba(0,109,119,0.15)" />
          <circle cx="215" cy="420" r="20" fill="rgba(0,109,119,0.25)" />
        </svg>
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 0 40px rgba(0,109,119,0.8))' }}>🚀</div>
          <p style={{ color: 'rgba(0,200,220,0.8)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>Tech & Entrepreneuriat</p>
        </div>
      </div>
    ),
    immo: (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(185deg, #1A0700 0%, #4A1A08 40%, #B05B3B 80%, #D4884A 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="215" cy="350" rx="200" ry="150" fill="rgba(212,175,55,0.12)" />
          <path d="M125,600 L125,480 L215,410 L305,480 L305,600 Z" fill="rgba(20,10,5,0.75)" />
          <path d="M100,490 L215,400 L330,490 Z" fill="rgba(30,15,7,0.85)" />
          <rect x="150" y="510" width="35" height="45" rx="4" fill="rgba(212,175,55,0.5)" />
          <rect x="245" y="510" width="35" height="45" rx="4" fill="rgba(212,175,55,0.4)" />
          <path d="M198,600 L198,550 Q215,540 232,550 L232,600 Z" fill="rgba(212,175,55,0.2)" />
          {[60, 370].map((x, i) => (
            <g key={i}>
              <rect x={x - 4} y="550" width="8" height="80" fill="rgba(80,50,20,0.7)" />
              {[-40, -20, 0, 20, 40].map((dx, j) => (
                <ellipse key={j} cx={x + dx * (i === 0 ? 1 : -1)} cy={530 + j * 4}
                  rx="22" ry="7" fill="rgba(30,80,30,0.7)"
                  transform={`rotate(${(j - 2) * 20}, ${x}, 550)`} />
              ))}
            </g>
          ))}
          {[[80,150],[170,100],[330,80],[380,200],[50,280]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.6)" />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: '26%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 8px 32px rgba(176,91,59,0.7))' }}>🏠</div>
          <p style={{ color: 'rgba(212,175,55,0.8)', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>Immobilier</p>
        </div>
      </div>
    ),
  };
  return <>{scenes[bgType]}</>;
}

// ─── Cowrie Share Icon ────────────────────────────────────────────────────────

function CowrieShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0DCA0" />
          <stop offset="100%" stopColor="#C5A028" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="60" rx="46" ry="33" fill="url(#cs-grad)" />
      <ellipse cx="60" cy="60" rx="33" ry="7.5" fill="#000" opacity="0.22" />
      <ellipse cx="43" cy="50" rx="10" ry="5" fill="white" opacity="0.4" />
    </svg>
  );
}

// ─── Verified badge ───────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Vérifié">
      <circle cx="7" cy="7" r="7" fill="#006D77" />
      <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Share Sheet ─────────────────────────────────────────────────────────────

function ShareSheet({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [sharedToSalon, setSharedToSalon] = useState(false);

  function copyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const SHARE_OPTS = [
    {
      icon: copied ? <CheckCircle size={22} color="#059669" /> : <Copy size={22} color="#1E293B" />,
      label: copied ? 'Lien copié !' : 'Copier le lien',
      sub: 'kauri.app/decouverte/' + post.id,
      action: copyLink,
      color: '#F4F6F8',
    },
    {
      icon: <span style={{ fontSize: 22 }}>💬</span>,
      label: 'Partager sur WhatsApp',
      sub: 'Envoyer à vos contacts',
      action: () => {},
      color: '#F4F6F8',
    },
    {
      icon: <span style={{ fontSize: 22 }}>✈️</span>,
      label: 'Partager sur Telegram',
      sub: 'Envoyer à vos groupes',
      action: () => {},
      color: '#F4F6F8',
    },
    {
      icon: sharedToSalon ? <CheckCircle size={22} color="#059669" /> : <Users size={22} color="#006D77" />,
      label: sharedToSalon ? 'Partagé dans un salon ✓' : 'Partager dans un salon KAURI',
      sub: 'Choisir un de vos salons',
      action: () => { setSharedToSalon(true); setTimeout(() => setSharedToSalon(false), 2000); },
      color: '#F0FAFB',
    },
    {
      icon: <Send size={22} color="#B05B3B" />,
      label: 'Envoyer en message privé',
      sub: 'À un membre KAURI',
      action: () => { navigate('/kauri/social-hub/forums'); onClose(); },
      color: '#FDF5F2',
    },
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#fff', borderRadius: '24px 24px 0 0',
        maxHeight: '82vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E8ECF0' }} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: '#1E293B' }}>Partager</p>
          <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>
            {post.handle} · {fmt(post.shares)} partages
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: '50%', background: '#F4F6F8', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={16} color="#64748B" />
        </button>
      </div>

      {/* Preview card */}
      <div style={{ margin: '0 20px 16px', background: '#F4F6F8', borderRadius: 14, padding: '12px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${post.avatarGrad[0]}, ${post.avatarGrad[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{post.initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1E293B' }}>{post.handle}</p>
            {post.isVerified && <VerifiedBadge />}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.caption}
          </p>
        </div>
      </div>

      {/* Options */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
          {SHARE_OPTS.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: opt.color,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderTop: i > 0 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{opt.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{opt.sub}</p>
              </div>
              <ChevronRight size={16} color="#CBD5E1" />
            </button>
          ))}
        </div>

        {/* Report */}
        <button
          onClick={() => { navigate('/kauri/social-hub/signaler-abus'); onClose(); }}
          style={{ width: '100%', marginTop: 12, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
        >
          <Flag size={16} color="#EF4444" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>Signaler ce contenu</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Comments Sheet ───────────────────────────────────────────────────────────

function CommentsSheet({
  post,
  onClose,
  onUpdatePost,
}: {
  post: Post;
  onClose: () => void;
  onUpdatePost: (comments: Comment[]) => void;
}) {
  const [comments, setComments] = useState<Comment[]>(post.commentsList);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  function toggleCommentLike(id: string) {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
    ));
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newComment: Comment = {
      id: 'c' + Date.now(),
      author: 'Moi',
      initials: 'JD',
      color: '#B05B3B',
      text: trimmed,
      time: "À l'instant",
      likes: 0,
      isLiked: false,
    };
    const updated = [...comments, newComment];
    setComments(updated);
    onUpdatePost(updated);
    setText('');
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#0F0F1A', borderRadius: '24px 24px 0 0',
        height: '75vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#fff' }}>
          Commentaires · <span style={{ color: '#94A3B8', fontWeight: 500 }}>{fmt(comments.length)}</span>
        </p>
        <button
          onClick={onClose}
          style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={15} color="rgba(255,255,255,0.7)" />
        </button>
      </div>

      {/* Comments list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {comments.map((c) => (
          <div key={c.id} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: c.color + '30', border: `1.5px solid ${c.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: c.color, fontSize: 12, fontWeight: 800 }}>{c.initials}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{c.author}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{c.time}</span>
              </div>
              <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.5 }}>{c.text}</p>
              <button
                onClick={() => toggleCommentLike(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Heart
                  size={13}
                  fill={c.isLiked ? '#B05B3B' : 'none'}
                  color={c.isLiked ? '#B05B3B' : 'rgba(255,255,255,0.4)'}
                  strokeWidth={2}
                />
                <span style={{ color: c.isLiked ? '#B05B3B' : 'rgba(255,255,255,0.4)', fontSize: 12 }}>{c.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 28px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0F0F1A' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #B05B3B, #D4AF37)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>JD</span>
          </div>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.08)', borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.12)', padding: '0 14px',
          }}>
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Ajouter un commentaire..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 13, padding: '10px 0',
              }}
            />
            <button
              onClick={submit}
              disabled={!text.trim()}
              style={{
                background: 'none', border: 'none', cursor: text.trim() ? 'pointer' : 'default',
                padding: 0, display: 'flex', alignItems: 'center',
              }}
            >
              <Send size={18} color={text.trim() ? '#B05B3B' : 'rgba(255,255,255,0.25)'} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Backdrop overlay ─────────────────────────────────────────────────────────

function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 190 }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DecouverteScreen() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [tab, setTab] = useState<'abonnements' | 'pourvous'>('pourvous');
  const [floatingHeart, setFloatingHeart] = useState<{ x: number; y: number } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sheet state
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const currentPost = posts[currentIndex];

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, clientHeight } = scrollRef.current;
    const idx = Math.round(scrollTop / clientHeight);
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      setExpandedId(null);
      setShareOpen(false);
      setCommentsOpen(false);
    }
  }, [currentIndex]);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    );
  };

  const toggleSave = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p)));
  };

  const toggleFollow = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isFollowing: !p.isFollowing } : p)));
  };

  const updatePostComments = (postId: string, newComments: Comment[]) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, commentsList: newComments, comments: newComments.length } : p
    ));
  };

  const handleVideoTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shareOpen || commentsOpen) return;
      const now = Date.now();
      if (now - lastTapRef.current < 320) {
        setFloatingHeart({ x: e.clientX, y: e.clientY });
        if (!posts[currentIndex].isLiked) toggleLike(posts[currentIndex].id);
        setTimeout(() => setFloatingHeart(null), 900);
      }
      lastTapRef.current = now;
    },
    [currentIndex, posts, shareOpen, commentsOpen],
  );

  const openShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommentsOpen(false);
    setShareOpen(true);
  };

  const openComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareOpen(false);
    setCommentsOpen(true);
  };

  const goToCreator = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/kauri/social-hub/createur/${currentPost.id}`);
  };

  const closeSheets = () => {
    setShareOpen(false);
    setCommentsOpen(false);
  };

  return (
    <div style={{ width: '100%', height: '100dvh', background: '#000', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 430, height: '100%', position: 'relative', overflow: 'hidden' }}>

        {/* ── 1. SCROLLABLE VIDEO REEL ──────────────────────────── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            position: 'absolute', inset: 0,
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            zIndex: 0,
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={handleVideoTap}
              style={{ height: '100dvh', scrollSnapAlign: 'start', position: 'relative', flexShrink: 0, cursor: 'pointer' }}
            >
              <VideoBackground bgType={post.bgType} />
            </div>
          ))}
        </div>

        {/* ── 2. BOTTOM GRADIENT FADE ───────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
          pointerEvents: 'none', zIndex: 10,
        }} />

        {/* ── 3. TOP NAVIGATION ─────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
        }}>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <motion.div
              key={currentIndex}
              style={{ height: '100%', background: '#B05B3B', transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 18, ease: 'linear' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px' }}>
            <button
              onClick={() => navigate('/kauri/social-hub-gateway')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px 7px 9px',
                background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)', borderRadius: 22,
                border: '1px solid rgba(212,175,55,0.4)', cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="cn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0DCA0" />
                    <stop offset="100%" stopColor="#C5A028" />
                  </linearGradient>
                </defs>
                <ellipse cx="60" cy="60" rx="46" ry="33" fill="url(#cn-grad)" />
                <ellipse cx="60" cy="60" rx="33" ry="7" fill="#000" opacity="0.22" />
                <ellipse cx="43" cy="51" rx="10" ry="5" fill="white" opacity="0.38" />
              </svg>
              <span style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Hub Social
              </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {(['abonnements', 'pourvous'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: tab === t ? 700 : 400, transition: 'color 0.2s' }}>
                    {t === 'abonnements' ? 'Abonnements' : 'Pour Vous'}
                  </span>
                  {tab === t && (
                    <motion.div layoutId="tab-underline" style={{ width: '100%', height: 2, background: '#B05B3B', borderRadius: 1 }} />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMuted((m) => !m)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              {isMuted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
            </button>
          </div>
        </div>

        {/* ── 4. RIGHT ACTION SIDEBAR ───────────────────────────── */}
        <div style={{
          position: 'absolute', right: 12, bottom: 110,
          zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
        }}>
          {/* Avatar + Follow */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={goToCreator}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `linear-gradient(135deg, ${currentPost.avatarGrad[0]}, ${currentPost.avatarGrad[1]})`,
                border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: 'white', fontSize: 15, fontWeight: 800, letterSpacing: '0.02em' }}>
                {currentPost.initials}
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFollow(currentPost.id); }}
              style={{
                position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: currentPost.isFollowing ? '#4A4A4A' : '#B05B3B',
                border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1,
                transition: 'background 0.25s',
              }}
              aria-label={currentPost.isFollowing ? 'Ne plus suivre' : 'Suivre'}
            >
              {currentPost.isFollowing ? '✓' : '+'}
            </button>
          </div>

          {/* Like */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(currentPost.id); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: currentPost.isLiked ? 'rgba(176,91,59,0.25)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${currentPost.isLiked ? 'rgba(176,91,59,0.6)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: currentPost.isLiked ? '0 0 16px rgba(176,91,59,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.25s',
              }}
            >
              <Heart size={24} fill={currentPost.isLiked ? '#B05B3B' : 'none'} color={currentPost.isLiked ? '#B05B3B' : 'white'} strokeWidth={1.8} />
            </motion.div>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {fmt(currentPost.likes)}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={openComments}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <motion.div
              whileTap={{ scale: 1.15 }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: commentsOpen ? 'rgba(0,109,119,0.35)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${commentsOpen ? 'rgba(0,109,119,0.6)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.25s',
              }}
            >
              <MessageCircle size={24} color={commentsOpen ? '#006D77' : 'white'} strokeWidth={1.8} />
            </motion.div>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {fmt(currentPost.comments)}
            </span>
          </button>

          {/* Share — Cowrie shell icon */}
          <button
            onClick={openShare}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <motion.div
              whileTap={{ scale: 1.15 }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: shareOpen ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${shareOpen ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.25s',
              }}
            >
              <CowrieShareIcon />
            </motion.div>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              Partager
            </span>
          </button>

          {/* Save */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleSave(currentPost.id); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <motion.div
              whileTap={{ scale: 1.2 }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: currentPost.isSaved ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${currentPost.isSaved ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.25s',
              }}
            >
              <Bookmark size={22} fill={currentPost.isSaved ? '#D4AF37' : 'none'} color={currentPost.isSaved ? '#D4AF37' : 'white'} strokeWidth={1.8} />
            </motion.div>
          </button>
        </div>

        {/* ── 5. BOTTOM INFO AREA ───────────────────────────────── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 76, zIndex: 30, padding: '0 16px 24px' }}>
          {/* Category pill — clickable */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/kauri/social-hub/decouverte/categorie/${currentPost.category.toLowerCase()}`); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(176,91,59,0.8)', backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: '3px 10px 3px 8px', marginBottom: 10,
              border: '1px solid rgba(176,91,59,0.5)', cursor: 'pointer',
            }}
          >
            <span style={{ color: 'white', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {currentPost.category}
            </span>
          </button>

          {/* Username row — clickable → creator profile */}
          <button
            onClick={goToCreator}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <span style={{ color: 'white', fontSize: 15, fontWeight: 800, letterSpacing: '0.01em', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
              {currentPost.handle}
            </span>
            {currentPost.isVerified && <VerifiedBadge />}
          </button>

          {/* Caption */}
          <div style={{ marginBottom: 12 }}>
            <p style={{
              color: 'rgba(255,255,255,0.92)', fontSize: 13, lineHeight: 1.55, margin: 0,
              display: expandedId === currentPost.id ? 'block' : '-webkit-box',
              WebkitLineClamp: expandedId === currentPost.id ? undefined : 2,
              WebkitBoxOrient: 'vertical',
              overflow: expandedId === currentPost.id ? 'visible' : 'hidden',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              {currentPost.caption}
            </p>
            {expandedId !== currentPost.id && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedId(currentPost.id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}
              >
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}>Voir plus</span>
              </button>
            )}
          </div>

          {/* Audio track */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)', borderRadius: 20, padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.12)', maxWidth: 240, overflow: 'hidden',
          }}>
            <Music size={12} color="#D4AF37" strokeWidth={2} style={{ flexShrink: 0 }} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <motion.div
                key={currentPost.id}
                style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500 }}>{currentPost.audio}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500 }}>{currentPost.audio}</span>
              </motion.div>
            </div>
            <motion.div
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a1a1a, #333)',
                border: '2px solid rgba(212,175,55,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#D4AF37' }} />
            </motion.div>
          </div>
        </div>

        {/* ── 6. SWIPE DOTS INDICATOR ───────────────────────────── */}
        <div style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', gap: 5,
          pointerEvents: 'none', opacity: 0.5,
        }}>
          {posts.map((_, i) => (
            <div key={i} style={{
              width: 3, height: i === currentIndex ? 18 : 5, borderRadius: 2,
              background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'height 0.3s ease, background 0.3s ease',
            }} />
          ))}
        </div>

        {/* ── 7. FLOATING DOUBLE-TAP HEART ─────────────────────── */}
        <AnimatePresence>
          {floatingHeart && (
            <motion.div
              style={{ position: 'fixed', left: floatingHeart.x - 35, top: floatingHeart.y - 35, pointerEvents: 'none', zIndex: 100 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.6, 1.2], opacity: [0, 1, 1], y: -90 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart size={70} fill="#B05B3B" color="#B05B3B" style={{ filter: 'drop-shadow(0 0 20px rgba(176,91,59,0.8))' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 8. SHEETS (Share / Comments) ─────────────────────── */}
        <AnimatePresence>
          {(shareOpen || commentsOpen) && <Backdrop onClose={closeSheets} />}
        </AnimatePresence>

        <AnimatePresence>
          {shareOpen && (
            <ShareSheet
              key="share"
              post={currentPost}
              onClose={() => setShareOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {commentsOpen && (
            <CommentsSheet
              key="comments"
              post={currentPost}
              onClose={() => setCommentsOpen(false)}
              onUpdatePost={(comments) => updatePostComments(currentPost.id, comments)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
