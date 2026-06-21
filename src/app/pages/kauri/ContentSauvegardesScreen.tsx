import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Bookmark, Heart, Play, MoreVertical,
  MessageCircle, Share2, BookmarkX, HeartOff,
  TrendingUp, Leaf, Lightbulb, GraduationCap,
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const TERRACOTTA = '#B05B3B';
const TEAL = '#006D77';

interface SavedPost {
  id: string;
  author: string;
  avatar: string;
  caption: string;
  category: string;
  categoryColor: string;
  CategoryIcon: React.ElementType;
  likes: number;
  comments: number;
  duration: string;
  savedAt: string;
}

const SAVED_VIDEOS: SavedPost[] = [
  {
    id: 's1',
    author: '@laura_invest',
    avatar: 'LI',
    caption: 'Comment financer son projet agricole au pays sans passer par les banques classiques 🌱',
    category: 'Finance',
    categoryColor: TERRACOTTA,
    CategoryIcon: TrendingUp,
    likes: 12400,
    comments: 342,
    duration: '2:15',
    savedAt: 'Il y a 2h',
  },
  {
    id: 's2',
    author: '@diaspora_pro',
    avatar: 'DP',
    caption: 'Les 5 erreurs à éviter quand on investit dans une tontine communautaire 💡',
    category: 'Investissement',
    categoryColor: TEAL,
    CategoryIcon: Lightbulb,
    likes: 8900,
    comments: 217,
    duration: '3:42',
    savedAt: 'Hier',
  },
  {
    id: 's3',
    author: '@kauri_academy',
    avatar: 'KA',
    caption: 'Formation gratuite : Comprendre le smart contract KAURI en 4 minutes ⚡',
    category: 'Éducation',
    categoryColor: '#7C3AED',
    CategoryIcon: GraduationCap,
    likes: 5200,
    comments: 98,
    duration: '4:07',
    savedAt: 'Il y a 3j',
  },
];

const LIKED_VIDEOS: SavedPost[] = [
  {
    id: 'l1',
    author: '@marie_c',
    avatar: 'MC',
    caption: 'Nouvelle levée de fonds pour notre Lolo Moderne 🎉 Merci à toute la communauté KAURI',
    category: 'Business',
    categoryColor: '#D97706',
    CategoryIcon: TrendingUp,
    likes: 23400,
    comments: 451,
    duration: '1:58',
    savedAt: 'Il y a 1h',
  },
  {
    id: 'l2',
    author: '@agro_caraibe',
    avatar: 'AC',
    caption: 'Mon projet maraîcher financé à 100% grâce à la communauté — témoignage sincère 🌿',
    category: 'Agriculture',
    categoryColor: '#16A34A',
    CategoryIcon: Leaf,
    likes: 19100,
    comments: 334,
    duration: '5:20',
    savedAt: 'Hier',
  },
  {
    id: 'l3',
    author: '@invest_martinique',
    avatar: 'IM',
    caption: 'Rendement locatif en Martinique : tout ce que vous devez savoir avant d\'investir 🏡',
    category: 'Immobilier',
    categoryColor: '#0891B2',
    CategoryIcon: TrendingUp,
    likes: 14700,
    comments: 289,
    duration: '6:15',
    savedAt: 'Il y a 5j',
  },
];

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function VideoCard({
  post,
  onRemove,
  isDarkMode,
}: {
  post: SavedPost;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}) {
  const { CategoryIcon } = post;
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border ${
        isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-[#E8ECF0]'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-[#0F172A] to-[#1E3A3A]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold"
          style={{ background: post.categoryColor + 'CC' }}
        >
          <CategoryIcon className="w-3 h-3" />
          {post.category}
        </div>
        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded-md">
          <span className="text-white text-xs font-medium">{post.duration}</span>
        </div>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${post.categoryColor}, ${post.categoryColor}88)` }}
            >
              {post.avatar}
            </div>
            <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
              {post.author}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{post.savedAt}</span>
            <button
              onClick={() => onRemove(post.id)}
              className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-[#F1F5F9]'}`}
            >
              <MoreVertical className={`w-4 h-4 ${isDarkMode ? 'text-[#475569]' : 'text-[#CBD5E1]'}`} />
            </button>
          </div>
        </div>

        <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'} line-clamp-2`}>
          {post.caption}
        </p>

        <div className={`flex items-center gap-4 pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-[#F1F5F9]'}`}>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-[#B05B3B] fill-[#B05B3B]" />
            <span className={`text-xs font-medium ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {formatCount(post.likes)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className={`w-4 h-4 ${isDarkMode ? 'text-[#475569]' : 'text-[#CBD5E1]'}`} />
            <span className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {formatCount(post.comments)}
            </span>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => onRemove(post.id)}
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                isDarkMode
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-red-50 text-red-400 hover:bg-red-100'
              }`}
            >
              Retirer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type, isDarkMode }: { type: 'saved' | 'liked'; isDarkMode: boolean }) {
  const Icon = type === 'saved' ? Bookmark : Heart;
  const label = type === 'saved' ? 'aucune vidéo enregistrée' : 'aucune vidéo aimée';
  const hint = type === 'saved'
    ? "Appuie sur l'icône 🔖 pour enregistrer des vidéos"
    : "Appuie sur le ❤️ pour aimer des vidéos";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: isDarkMode ? 'rgba(176,91,59,0.12)' : 'rgba(176,91,59,0.08)' }}
      >
        <Icon className="w-7 h-7" style={{ color: TERRACOTTA + '80' }} />
      </div>
      <p className={`text-sm font-semibold mb-1 capitalize ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
        {label}
      </p>
      <p className={`text-xs ${isDarkMode ? 'text-[#475569]' : 'text-[#CBD5E1]'}`}>{hint}</p>
    </div>
  );
}

export function ContentSauvegardesScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [tab, setTab] = useState<'saved' | 'liked'>('saved');
  const [saved, setSaved] = useState(SAVED_VIDEOS);
  const [liked, setLiked] = useState(LIKED_VIDEOS);

  const removeSaved = (id: string) => setSaved(prev => prev.filter(p => p.id !== id));
  const removeLiked = (id: string) => setLiked(prev => prev.filter(p => p.id !== id));

  const bg = isDarkMode ? '#0F172A' : '#F4F6F8';
  const headerBg = isDarkMode
    ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
    : `linear-gradient(135deg, ${TERRACOTTA} 0%, #8B3A22 100%)`;

  return (
    <div
      style={{ minHeight: '100dvh', background: bg, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ background: headerBg, padding: '48px 20px 20px', position: 'relative' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 52, left: 20,
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>

        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
            HUB SOCIAL
          </p>
          <h1 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 800 }}>
            Mes Contenus
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
            Vidéos enregistrées & aimées
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{saved.length}</p>
            <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Enregistrées</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{liked.length}</p>
            <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Aimées</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: isDarkMode ? '#1E293B' : '#fff',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#E8ECF0'}`,
          display: 'flex',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        {[
          { key: 'saved', label: 'Enregistrés', Icon: Bookmark, count: saved.length },
          { key: 'liked', label: 'Aimés', Icon: Heart, count: liked.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'saved' | 'liked')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '14px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: `2.5px solid ${tab === t.key ? TERRACOTTA : 'transparent'}`,
              color: tab === t.key ? TERRACOTTA : isDarkMode ? '#475569' : '#94A3B8',
              fontWeight: 700, fontSize: 14, transition: 'color 0.2s',
            }}
          >
            <t.Icon
              size={15}
              style={tab === t.key && t.key === 'liked' ? { fill: TERRACOTTA } : undefined}
            />
            {t.label}
            <span
              style={{
                background: tab === t.key ? TERRACOTTA : isDarkMode ? 'rgba(255,255,255,0.06)' : '#E8ECF0',
                color: tab === t.key ? '#fff' : isDarkMode ? '#475569' : '#94A3B8',
                borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>
        {tab === 'saved' && (
          saved.length === 0 ? (
            <EmptyState type="saved" isDarkMode={isDarkMode} />
          ) : (
            <div className="flex flex-col gap-3">
              {saved.map(post => (
                <VideoCard key={post.id} post={post} onRemove={removeSaved} isDarkMode={isDarkMode} />
              ))}
            </div>
          )
        )}

        {tab === 'liked' && (
          liked.length === 0 ? (
            <EmptyState type="liked" isDarkMode={isDarkMode} />
          ) : (
            <div className="flex flex-col gap-3">
              {liked.map(post => (
                <VideoCard key={post.id} post={post} onRemove={removeLiked} isDarkMode={isDarkMode} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
