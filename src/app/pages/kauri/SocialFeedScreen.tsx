import { Heart, MessageCircle, Share2, Bookmark, Play, Pause, Grid, TrendingUp, Gift, Info, BadgeCheck, X, Music } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { addComment, getComments, setFollowPro } from '../../../utils/supabase';

// ── Lecteur 30s pour la barre musicale ────────────────────────────────────────
function PostMusicBar({ music }: { music: { title: string; artist: string; artwork: string; previewUrl?: string } }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!music.previewUrl) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(music.previewUrl);
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 w-fit max-w-full overflow-hidden">
      <img src={music.artwork} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
      <Music className="w-2.5 h-2.5 text-[#D4AF37] flex-shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-[10px] font-medium truncate leading-none">{music.title}</p>
        <p className="text-white/40 text-[9px] truncate leading-none mt-0.5">{music.artist}</p>
      </div>
      {music.previewUrl && (
        <button
          onClick={toggle}
          className="flex-shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center"
        >
          {playing
            ? <Pause className="w-2.5 h-2.5 text-[#D4AF37]" />
            : <Play className="w-2.5 h-2.5 text-[#D4AF37] ml-0.5" />
          }
        </button>
      )}
    </div>
  );
}

// ── Publications simulées des comptes pro ─────────────────────────────────────
const PRO_PUBLICATIONS = [
  {
    id: '1',
    pro: { name: 'Lolo Moderne', initials: 'LM', verified: true, category: 'Restauration', followers: 284 },
    type: 'image',
    media: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    caption: "Notre Lolo Moderne ouvre ses portes à Fort-de-France ! 🎉 87 investisseurs KAURI ont cru en nous. Ce restaurant, c'est votre restaurant. Venez goûter la cuisine créole d'excellence qu'on a mise 3 ans à perfectionner.",
    hashtags: ['#diaspora', '#martinique', '#kauri', '#restauration'],
    category: 'Restauration',
    cta: { type: 'decouvrir' as const, label: 'Découvrir le projet', color: '#006D77', bg: 'bg-[#006D77]' },
    project: { name: 'Lolo Moderne', raised: 45000, goal: 100000 },
    stats: { likes: 342, comments: 28, shares: 14, saved: false, liked: false, isFollowing: false },
    timeAgo: '2h',
    music: { title: 'Sere Kole', artist: 'Kassav', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80' },
  },
  {
    id: '2',
    pro: { name: 'Coopérative Manioc', initials: 'CM', verified: true, category: 'Agriculture', followers: 156 },
    type: 'image',
    media: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
    caption: "Première récolte historique 🌾 50 familles de Guadeloupe nourries grâce à notre coopérative. On part de zéro — une parcelle, une tontine, une communauté. Aujourd'hui, on cherche des partenaires pour doubler notre surface cultivable.",
    hashtags: ['#agriculture', '#guadeloupe', '#coopérative', '#terroir', '#souveraineté'],
    category: 'Agriculture',
    cta: { type: 'don' as const, label: 'Faire un don', color: '#B05B3B', bg: 'bg-[#B05B3B]' },
    project: { name: 'Coopérative Manioc', raised: 32000, goal: 50000 },
    stats: { likes: 215, comments: 19, shares: 8, saved: false, liked: false, isFollowing: false },
    timeAgo: '5h',
  },
  {
    id: '3',
    pro: { name: 'TechAfrika Hub', initials: 'TA', verified: true, category: 'Tech', followers: 512 },
    type: 'video',
    media: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    caption: "200 jeunes développeurs formés cette année à Dakar 🚀 Notre incubateur est le seul en Afrique de l'Ouest 100% financé par la diaspora via KAURI. On ne cherche pas des philanthropes — on cherche des associés qui croient que la prochaine révolution tech vient d'Afrique.",
    hashtags: ['#tech', '#afrique', '#dakar', '#startup', '#ia'],
    category: 'Tech',
    cta: { type: 'decouvrir' as const, label: 'Découvrir le projet', color: '#006D77', bg: 'bg-[#006D77]' },
    project: { name: 'TechAfrika Hub', raised: 78000, goal: 150000 },
    stats: { likes: 891, comments: 63, shares: 42, saved: false, liked: false, isFollowing: false },
    timeAgo: '1j',
    music: { title: 'Ye', artist: 'Burna Boy', artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=60&q=80' },
  },
  {
    id: '4',
    pro: { name: 'Maison Créole', initials: 'MC', verified: false, category: 'Immobilier', followers: 98 },
    type: 'image',
    media: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    caption: "30 appartements livrés. 70 en construction. 🏠 Notre programme de logements abordables pour la diaspora haïtienne avance malgré tout. Chaque investisseur KAURI est propriétaire d'une part de ce projet. Rejoignez les 140 familles qui font confiance à Maison Créole.",
    hashtags: ['#immobilier', '#haiti', '#logement', '#diaspora', '#patrimoine'],
    category: 'Immobilier',
    cta: { type: 'decouvrir' as const, label: 'En savoir plus', color: '#D4AF37', bg: 'bg-[#D4AF37]' },
    project: { name: 'Maison Créole', raised: 120000, goal: 300000 },
    stats: { likes: 127, comments: 11, shares: 5, saved: false, liked: false, isFollowing: false },
    timeAgo: '2j',
  },
  {
    id: '5',
    pro: { name: 'Bijoux Kréyol', initials: 'BK', verified: true, category: 'Artisanat', followers: 203 },
    type: 'image',
    media: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    caption: "L'artisanat créole rencontre le commerce digital 🧡 Nos bijoux en or antillais font maintenant le tour du monde grâce à KAURI et à notre boutique en ligne. 12 artisans de Martinique et Guadeloupe impliqués. Investissez dans leur savoir-faire.",
    hashtags: ['#artisanat', '#bijoux', '#créole', '#antilles', '#madeincaraïbes'],
    category: 'Artisanat',
    cta: { type: 'decouvrir' as const, label: 'Découvrir le projet', color: '#006D77', bg: 'bg-[#006D77]' },
    project: { name: 'Bijoux Kréyol', raised: 18500, goal: 40000 },
    stats: { likes: 456, comments: 37, shares: 22, saved: false, liked: false, isFollowing: false },
    timeAgo: '3j',
    music: { title: 'Zouk is the best remedy', artist: 'Kassav', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&q=80' },
  },
];

type ViewMode = 'decouverte' | 'grille';

// ── Commentaires simulés ──────────────────────────────────────────────────────
const MOCK_COMMENTS = [
  { id: 1, user: 'Sophie B.', avatar: 'SB', text: 'Bravo ! On croit en votre projet 💪🏾', time: '1h' },
  { id: 2, user: 'André C.',  avatar: 'AC', text: 'Combien rapporte l\'investissement ? C\'est quel palier ?', time: '3h' },
  { id: 3, user: 'Lucia M.',  avatar: 'LM', text: 'J\'ai partagé à toute ma famille 🙌', time: '5h' },
];

type PostComment = { id: string; user: string; avatar: string; text: string; time: string };

export function SocialFeedScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('decouverte');
  const [posts, setPosts] = useState(PRO_PUBLICATIONS);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [commentPost, setCommentPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostComment[]>>({});
  const [sendingComment, setSendingComment] = useState(false);

  const categories = ['Tout', 'Restauration', 'Agriculture', 'Tech', 'Immobilier', 'Finance', 'Artisanat'];

  const filteredPosts = activeCategory === 'Tout'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const toggleLike = (id: string) => {
    setPosts(ps => ps.map(p =>
      p.id === id
        ? { ...p, stats: { ...p.stats, liked: !p.stats.liked, likes: p.stats.liked ? p.stats.likes - 1 : p.stats.likes + 1 } }
        : p
    ));
  };

  const toggleSave = (id: string) => {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, stats: { ...p.stats, saved: !p.stats.saved } } : p));
  };

  const toggleFollowPost = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const nowFollowing = !post.stats.isFollowing;
    setPosts(ps => ps.map(p => p.id === id ? { ...p, stats: { ...p.stats, isFollowing: nowFollowing } } : p));
    await setFollowPro(`feed_${id}_${post.pro.name}`, nowFollowing).catch(() => {
      // rollback on error
      setPosts(ps => ps.map(p => p.id === id ? { ...p, stats: { ...p.stats, isFollowing: !nowFollowing } } : p));
    });
  };

  const openComments = useCallback(async (postId: string) => {
    if (commentPost === postId) { setCommentPost(null); return; }
    setCommentPost(postId);
    if (!commentsByPost[postId]) {
      const { data } = await getComments(postId);
      if (data && data.length > 0) {
        setCommentsByPost(prev => ({
          ...prev,
          [postId]: data.map(r => ({
            id: r.id,
            user: r.author,
            avatar: r.initials || r.author.slice(0, 2).toUpperCase(),
            text: r.text,
            time: new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          })),
        }));
      } else {
        setCommentsByPost(prev => ({ ...prev, [postId]: [...MOCK_COMMENTS.map(c => ({...c, id: String(c.id)}))] }));
      }
    }
  }, [commentPost, commentsByPost]);

  const submitComment = async (postId: string) => {
    const trimmed = newComment.trim();
    if (!trimmed || sendingComment) return;
    setSendingComment(true);
    const optimistic: PostComment = {
      id: 'tmp_' + Date.now(),
      user: 'Moi',
      avatar: 'JD',
      text: trimmed,
      time: "À l'instant",
    };
    setCommentsByPost(prev => ({ ...prev, [postId]: [...(prev[postId] ?? []), optimistic] }));
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, stats: { ...p.stats, comments: p.stats.comments + 1 } } : p));
    setNewComment('');
    await addComment(postId, trimmed, 'Moi', 'JD').catch(() => null);
    setSendingComment(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-20">
      {/* Header fixe */}
      <div className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/10">
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-white text-xl font-bold">Découverte</h1>
              <p className="text-white/40 text-xs">Publications des pros KAURI</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('decouverte')}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewMode === 'decouverte' ? 'bg-white/20' : 'bg-transparent'}`}
              >
                <Play className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setViewMode('grille')}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grille' ? 'bg-white/20' : 'bg-transparent'}`}
              >
                <Grid className="w-4 h-4 text-white" />
              </button>
              <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center ml-1">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Filtres catégories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODE DÉCOUVERTE : cartes pleine largeur ── */}
      {viewMode === 'decouverte' && (
        <div className="px-4 py-4 space-y-5">
          {filteredPosts.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune publication dans cette catégorie</p>
            </div>
          )}

          {filteredPosts.map(post => (
            <div key={post.id} className="bg-[#1E293B] rounded-2xl overflow-hidden border border-white/8">
              {/* En-tête pro */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {post.pro.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-sm font-semibold truncate">{post.pro.name}</p>
                    {post.pro.verified && <BadgeCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full font-medium">{post.pro.category}</span>
                    <span className="text-white/40 text-[10px]">· {post.timeAgo}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollowPost(post.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex-shrink-0 transition-all ${
                    post.stats.isFollowing
                      ? 'bg-white/15 text-white/60 border border-white/10'
                      : 'bg-[#B05B3B] text-white border border-[#B05B3B]'
                  }`}
                >
                  {post.stats.isFollowing ? 'Abonné ✓' : 'Suivre'}
                </button>
              </div>

              {/* Média */}
              <div className="relative aspect-[4/3] bg-[#0F172A]">
                <img
                  src={post.media}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                {post.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                )}
                {/* Badge PRO flottant */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-white text-[10px] font-bold">PRO</span>
                </div>
              </div>

              {/* Corps */}
              <div className="px-4 pt-3 pb-4 space-y-3">
                {/* Caption */}
                <p className="text-white/85 text-sm leading-relaxed">{post.caption}</p>
                <p className="text-[#D4AF37] text-xs">{post.hashtags.join(' ')}</p>

                {/* Barre musicale */}
                {'music' in post && post.music && (
                  <PostMusicBar music={post.music as { title: string; artist: string; artwork: string; previewUrl?: string }} />
                )}

                {/* Barre d'interactions */}
                <div className="flex items-center gap-5 py-1">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 transition-colors">
                    <Heart className={`w-5 h-5 transition-all ${post.stats.liked ? 'fill-[#B05B3B] text-[#B05B3B] scale-110' : 'text-white/50'}`} />
                    <span className={`text-sm ${post.stats.liked ? 'text-[#B05B3B]' : 'text-white/50'}`}>{post.stats.likes}</span>
                  </button>
                  <button onClick={() => openComments(post.id)} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.stats.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">{post.stats.shares}</span>
                  </button>
                  <button onClick={() => toggleSave(post.id)} className="ml-auto">
                    <Bookmark className={`w-5 h-5 transition-all ${post.stats.saved ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/50'}`} />
                  </button>
                </div>

                {/* Progression projet */}
                {post.project && (
                  <div className="bg-[#0F172A] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-white/70 text-xs font-medium">{post.project.name}</p>
                      <p className="text-[#D4AF37] text-xs font-bold">
                        {Math.round(post.project.raised / post.project.goal * 100)}%
                      </p>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488] rounded-full transition-all"
                        style={{ width: `${Math.round(post.project.raised / post.project.goal * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>{post.project.raised.toLocaleString()} € levés</span>
                      <span>sur {post.project.goal.toLocaleString()} €</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => navigate('/kauri/projets-impacts')}
                  className={`w-full py-3 rounded-xl text-white text-sm font-bold transition-opacity active:opacity-80 flex items-center justify-center gap-2 ${post.cta.bg}`}
                >
                  {post.cta.type === 'investir' && <TrendingUp className="w-4 h-4" />}
                  {post.cta.type === 'don' && <Gift className="w-4 h-4" />}
                  {post.cta.type === 'decouvrir' && <Info className="w-4 h-4" />}
                  {post.cta.label}
                </button>
              </div>

              {/* Section commentaires inline */}
              {commentPost === post.id && (
                <div className="border-t border-white/10 px-4 py-3 bg-[#0F172A]/50">
                  <p className="text-white/50 text-xs mb-3 font-medium">Commentaires</p>
                  <div className="space-y-3 mb-3">
                    {(commentsByPost[post.id] ?? MOCK_COMMENTS.map(c => ({...c, id: String(c.id)}))).map(c => (
                      <div key={c.id} className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {c.avatar}
                        </div>
                        <div className="flex-1 bg-[#1E293B] rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white text-xs font-semibold">{c.user}</span>
                            <span className="text-white/30 text-[10px]">{c.time}</span>
                          </div>
                          <p className="text-white/70 text-xs">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                      placeholder="Ajouter un commentaire…"
                      className="flex-1 bg-[#1E293B] border border-white/10 rounded-full px-4 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                    <button
                      disabled={!newComment.trim() || sendingComment}
                      onClick={() => submitComment(post.id)}
                      className="px-4 py-2 bg-[#B05B3B] text-white text-xs rounded-full font-medium disabled:opacity-30 transition-opacity"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── MODE GRILLE ── */}
      {viewMode === 'grille' && (
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredPosts.map(post => (
              <button
                key={post.id}
                onClick={() => setViewMode('decouverte')}
                className="relative aspect-square rounded-2xl overflow-hidden bg-[#1E293B]"
              >
                <img src={post.media} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {post.type === 'video' && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white ml-0.5" />
                  </div>
                )}
                {post.pro.verified && (
                  <div className="absolute top-2 left-2">
                    <BadgeCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold truncate">{post.pro.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Heart className="w-3 h-3 text-white/70" />
                    <span className="text-white/70 text-[10px]">{post.stats.likes}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
