import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, ExternalLink, Users, TrendingUp, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';
const GOLD = '#D4AF37';

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

// ─── Creator data (keyed by post id) ──────────────────────────────────────────

const CREATORS: Record<string, {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  grad: [string, string];
  isVerified: boolean;
  accountType: 'pro' | 'association' | 'porteur';
  typeLabel: string;
  typeColor: string;
  bio: string;
  location: string;
  website?: string;
  followers: number;
  totalLikes: number;
  totalContent: number;
  trustScore: number;
  specialties: string[];
  bgType: 'finance' | 'agriculture' | 'tontine' | 'tech' | 'immo';
  contents: { id: string; category: string; caption: string; likes: number; comments: number; bgColor: string; emoji: string }[];
}> = {
  '1': {
    id: '1',
    handle: '@laura_invest',
    displayName: 'Laura Invest',
    initials: 'LI',
    grad: ['#006D77', '#D4AF37'],
    isVerified: true,
    accountType: 'pro',
    typeLabel: 'Conseillère financière agréée',
    typeColor: TEAL,
    bio: "Conseillère financière spécialisée en investissement pour la diaspora caribéenne. J'aide les entrepreneurs à financer leurs projets au pays.",
    location: 'Martinique · Paris',
    website: 'laurainvest.kauri.app',
    followers: 48200,
    totalLikes: 312000,
    totalContent: 87,
    trustScore: 4.9,
    specialties: ['Investissement', 'Financement', 'Diaspora', 'PME'],
    bgType: 'finance',
    contents: [
      { id: 'c1', category: 'Finance', caption: 'Comment financer son projet sans banque classique', likes: 12400, comments: 342, bgColor: '#001824', emoji: '💰' },
      { id: 'c2', category: 'Finance', caption: 'Les 5 erreurs des investisseurs diaspora à éviter', likes: 8900, comments: 213, bgColor: '#003A4F', emoji: '📊' },
      { id: 'c3', category: 'Tontine', caption: 'Tontine vs épargne bancaire : le grand comparatif', likes: 15600, comments: 567, bgColor: '#1A0B35', emoji: '🐚' },
    ],
  },
  '2': {
    id: '2',
    handle: '@pierre_agri',
    displayName: 'Pierre Dubois',
    initials: 'PD',
    grad: ['#1A5C33', '#D4AF37'],
    isVerified: false,
    accountType: 'porteur',
    typeLabel: 'Porteur de projet · Agri-entrepreneur',
    typeColor: '#059669',
    bio: "De Paris à la Martinique, j'ai créé ma ferme bio grâce à la communauté KAURI. Porteur de projet depuis 2022, je partage mon parcours en transparence.",
    location: 'Martinique',
    followers: 22800,
    totalLikes: 145000,
    totalContent: 34,
    trustScore: 4.6,
    specialties: ['Agriculture bio', 'Tontine', 'Reconversion', 'Antilles'],
    bgType: 'agriculture',
    contents: [
      { id: 'c1', category: 'Agriculture', caption: '2000€ → ferme bio : mon parcours complet', likes: 8920, comments: 671, bgColor: '#0A1A0A', emoji: '🌱' },
      { id: 'c2', category: 'Finance', caption: 'Comment j\'ai utilisé une tontine pour lancer ma ferme', likes: 6200, comments: 234, bgColor: '#163B16', emoji: '🤝' },
      { id: 'c3', category: 'Agriculture', caption: 'Permaculture aux Antilles : mes 3 premières récoltes', likes: 4800, comments: 189, bgColor: '#2E6B2E', emoji: '🥬' },
    ],
  },
  '3': {
    id: '3',
    handle: '@aminata_tontine',
    displayName: 'Aminata Koné',
    initials: 'AK',
    grad: ['#3D1F66', '#D4AF37'],
    isVerified: true,
    accountType: 'association',
    typeLabel: 'Association · Héritage & Finance',
    typeColor: '#8B5CF6',
    bio: "Association dédiée à la préservation et modernisation des pratiques financières ancestrales africaines et caribéennes. Ensemble, on va plus loin.",
    location: 'Paris · Abidjan · Martinique',
    website: 'aminata-tontine.org',
    followers: 134500,
    totalLikes: 1200000,
    totalContent: 215,
    trustScore: 5.0,
    specialties: ['Tontine', 'Héritage', 'Fintech', 'Culture africaine', 'Diaspora'],
    bgType: 'tontine',
    contents: [
      { id: 'c1', category: 'Héritage', caption: 'La tontine : l\'ancêtre des fintechs', likes: 22100, comments: 1203, bgColor: '#0D0619', emoji: '🐚' },
      { id: 'c2', category: 'Culture', caption: 'Histoire de la finance solidaire africaine', likes: 18700, comments: 892, bgColor: '#1A0B35', emoji: '📜' },
      { id: 'c3', category: 'Finance', caption: 'Digitaliser la tontine en 2024 : guide complet', likes: 25400, comments: 1456, bgColor: '#2E1060', emoji: '💡' },
    ],
  },
  '4': {
    id: '4',
    handle: '@marcus_tech',
    displayName: 'Marcus Johnson',
    initials: 'MJ',
    grad: ['#0A1628', '#006D77'],
    isVerified: true,
    accountType: 'porteur',
    typeLabel: 'Porteur de projet · Startup Tech',
    typeColor: TEAL,
    bio: "Co-fondateur d'une startup tech caribéenne. J'ai levé 50k€ via KAURI en 30 jours. Je partage mon playbook pour les entrepreneurs de la diaspora.",
    location: 'Guadeloupe · Londres',
    website: 'marcustech.dev',
    followers: 67300,
    totalLikes: 456000,
    totalContent: 58,
    trustScore: 4.8,
    specialties: ['Startup', 'Tech', 'Levée de fonds', 'Entrepreneuriat'],
    bgType: 'tech',
    contents: [
      { id: 'c1', category: 'Tech', caption: '50k€ levés en 30 jours : mon playbook', likes: 15600, comments: 892, bgColor: '#020810', emoji: '🚀' },
      { id: 'c2', category: 'Entrepreneuriat', caption: 'Créer sa startup en étant dans la diaspora', likes: 11200, comments: 534, bgColor: '#04102A', emoji: '💻' },
      { id: 'c3', category: 'Tech', caption: 'Les outils tech indispensables pour la diaspora', likes: 9800, comments: 312, bgColor: '#061A40', emoji: '⚡' },
    ],
  },
  '5': {
    id: '5',
    handle: '@sophie_immo',
    displayName: 'Sophie Laurent',
    initials: 'SL',
    grad: ['#B05B3B', '#D4AF37'],
    isVerified: true,
    accountType: 'pro',
    typeLabel: 'Agente immobilière · Antilles',
    typeColor: TERRACOTTA,
    bio: "Agente immobilière spécialisée dans l'accompagnement des membres de la diaspora pour leurs projets immobiliers aux Antilles. 200+ clients satisfaits.",
    location: 'Fort-de-France, Martinique',
    followers: 89600,
    totalLikes: 780000,
    totalContent: 143,
    trustScore: 4.7,
    specialties: ['Immobilier', 'Antilles', 'Diaspora', 'Investissement', 'Défiscalisation'],
    bgType: 'immo',
    contents: [
      { id: 'c1', category: 'Immobilier', caption: 'Mon 1er appart à Fort-de-France à 28 ans', likes: 31200, comments: 2890, bgColor: '#1A0700', emoji: '🏠' },
      { id: 'c2', category: 'Immobilier', caption: 'Pinel Outre-mer : le guide complet 2024', likes: 22800, comments: 1234, bgColor: '#4A1A08', emoji: '📋' },
      { id: 'c3', category: 'Finance', caption: 'Obtenir un crédit immo en Martinique depuis Paris', likes: 18400, comments: 987, bgColor: '#B05B3B', emoji: '🏦' },
    ],
  },
};

function AccountTypeBadge({ type, label, color }: { type: string; label: string; color: string }) {
  const icons: Record<string, string> = { pro: '🏢', association: '🤝', porteur: '🌱' };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: color + '18', border: `1px solid ${color}30`,
      borderRadius: 20, padding: '4px 12px',
    }}>
      <span style={{ fontSize: 13 }}>{icons[type]}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

function TrustScoreBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#E8ECF0', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${TERRACOTTA})`, borderRadius: 3 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Star size={12} color={GOLD} fill={GOLD} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{score.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function CreateurProfileScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const creator = CREATORS[id ?? '3'] ?? CREATORS['3'];
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(creator.followers);

  function toggleFollow() {
    setIsFollowing(f => !f);
    setFollowCount(c => isFollowing ? c - 1 : c + 1);
  }

  // bg gradients per type
  const headerBg: Record<string, string> = {
    finance: 'linear-gradient(135deg, #001824 0%, #006D77 100%)',
    agriculture: 'linear-gradient(135deg, #0A1A0A 0%, #2E6B2E 100%)',
    tontine: 'linear-gradient(135deg, #0D0619 0%, #2E1060 100%)',
    tech: 'linear-gradient(135deg, #020810 0%, #061A40 100%)',
    immo: 'linear-gradient(135deg, #1A0700 0%, #B05B3B 100%)',
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#F4F6F8', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER COVER ── */}
      <div style={{ position: 'relative', background: headerBg[creator.bgType], paddingBottom: 60 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          <svg width="100%" height="100%" viewBox="0 0 430 200">
            {[60, 100, 140, 180].map((r, i) => (
              <circle key={i} cx="215" cy="100" r={r} fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* Back */}
        <div style={{ position: 'relative', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>
          <button
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Share2 size={16} color="#fff" />
          </button>
        </div>

        {/* Avatar */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, ${creator.grad[0]}, ${creator.grad[1]})`,
            border: '3px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>{creator.initials}</span>
          </div>
          {creator.isVerified && (
            <div style={{ position: 'absolute', bottom: 2, right: 2 }}>
              <CheckCircle size={20} color={TEAL} fill="#fff" />
            </div>
          )}
        </div>
      </div>

      {/* ── PROFILE INFO ── */}
      <div style={{ padding: '52px 20px 20px', background: '#fff', borderBottom: '1px solid #E8ECF0' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h1 style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 900, color: '#1E293B' }}>{creator.displayName}</h1>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#64748B' }}>{creator.handle} · {creator.location}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <AccountTypeBadge type={creator.accountType} label={creator.typeLabel} color={creator.typeColor} />
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#475569', lineHeight: 1.6, textAlign: 'center' }}>{creator.bio}</p>
          {creator.website && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, color: TEAL, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <ExternalLink size={13} />
                {creator.website}
              </a>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16, padding: '12px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
          {[
            { value: fmt(followCount), label: 'Abonnés' },
            { value: fmt(creator.totalLikes), label: 'Likes' },
            { value: String(creator.totalContent), label: 'Contenus' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#1E293B' }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust score */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score de confiance KAURI</span>
            <span style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>{creator.trustScore}/5</span>
          </div>
          <TrustScoreBar score={creator.trustScore} />
        </div>

        {/* Specialties */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {creator.specialties.map(s => (
            <span key={s} style={{ background: '#F4F6F8', border: '1px solid #E8ECF0', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#64748B', fontWeight: 600 }}>{s}</span>
          ))}
        </div>

        {/* CTA — read-only view: can only follow */}
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleFollow}
            style={{
              flex: 1, background: isFollowing ? '#F4F6F8' : TERRACOTTA,
              color: isFollowing ? '#64748B' : '#fff',
              border: `1.5px solid ${isFollowing ? '#E8ECF0' : TERRACOTTA}`,
              borderRadius: 14, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isFollowing ? 'Abonné ✓' : "S'abonner"}
          </motion.button>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: '#F4F6F8',
            border: '1.5px solid #E8ECF0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={18} color="#64748B" />
          </div>
        </div>

        {/* Read-only notice */}
        <div style={{ marginTop: 10, background: '#F4F6F8', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 15 }}>👁️</span>
          <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>
            Mode lecture — vous pouvez visionner, liker, commenter et partager les contenus.
          </p>
        </div>
      </div>

      {/* ── CONTENT GRID ── */}
      <div style={{ flex: 1, padding: '16px 16px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            Contenus récents
          </p>
          <span style={{ fontSize: 12, color: TERRACOTTA, fontWeight: 600 }}>{creator.totalContent} publications</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {creator.contents.map((content) => (
            <button
              key={content.id}
              onClick={() => navigate('/kauri/social-hub/decouverte')}
              style={{
                background: content.bgColor, borderRadius: 14, border: 'none',
                overflow: 'hidden', cursor: 'pointer', textAlign: 'left',
                aspectRatio: '9/16', position: 'relative', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', padding: '12px',
              }}
            >
              {/* Background pattern */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 40, opacity: 0.3, filter: 'blur(1px)' }}>{content.emoji}</span>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  display: 'inline-block', background: 'rgba(176,91,59,0.85)',
                  color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 8,
                  padding: '2px 7px', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {content.category}
                </span>
                <p style={{ margin: '0 0 6px', color: '#fff', fontSize: 11, fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {content.caption}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
                    <Heart size={10} fill="rgba(255,255,255,0.7)" color="rgba(255,255,255,0.7)" />{fmt(content.likes)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
                    <MessageCircle size={10} color="rgba(255,255,255,0.7)" />{fmt(content.comments)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* View all */}
        <button
          onClick={() => navigate('/kauri/social-hub/decouverte')}
          style={{
            width: '100%', marginTop: 12, background: '#fff', border: '1px solid #E8ECF0',
            borderRadius: 14, padding: '13px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}
        >
          <TrendingUp size={16} color={TERRACOTTA} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Voir tous les contenus</span>
          <ChevronRight size={16} color="#CBD5E1" />
        </button>
      </div>
    </div>
  );
}
