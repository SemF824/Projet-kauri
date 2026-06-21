import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, MoreVertical, Play, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Post {
  id: string;
  author: string;
  avatar: string;
  type: 'video' | 'image' | 'text';
  content: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  category: string;
}

export function ViralFeedScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Marie C.',
      avatar: 'MC',
      type: 'video',
      content: '',
      caption: 'Nouvelle levée de fonds pour notre Lolo Moderne ! 🎉 Merci à toute la communauté KAURI 🙏',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      isSaved: false,
      category: 'Business',
    },
    {
      id: '2',
      author: 'Pierre D.',
      avatar: 'PD',
      type: 'image',
      content: '',
      caption: "Success story : Ma tontine m'a permis de financer mon projet agricole 🌱 #DiasporaPower",
      likes: 156,
      comments: 28,
      shares: 8,
      isLiked: true,
      isSaved: false,
      category: 'Success',
    },
    {
      id: '3',
      author: 'Sophie L.',
      avatar: 'SL',
      type: 'text',
      content: 'Astuce KAURI : Diversifiez vos investissements entre tontines et projets communautaires pour maximiser vos rendements ! 💡',
      caption: '',
      likes: 89,
      comments: 15,
      shares: 5,
      isLiked: false,
      isSaved: false,
      category: 'Tips',
    },
  ]);

  const toggleLike = (id: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== id) return post;
        const nowLiked = !post.isLiked;
        if (nowLiked) {
          toast('Contenu aimé', {
            description: 'Ajouté à vos vidéos aimées',
            duration: 3500,
            action: {
              label: 'Voir →',
              onClick: () => navigate('/kauri/content-sauvegardes?tab=liked'),
            },
            style: { background: '#1E293B', color: '#fff', border: '1px solid rgba(176,91,59,0.3)' },
          });
        }
        return { ...post, isLiked: nowLiked, likes: nowLiked ? post.likes + 1 : post.likes - 1 };
      })
    );
  };

  const toggleSave = (id: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== id) return post;
        const nowSaved = !post.isSaved;
        if (nowSaved) {
          toast('Contenu enregistré', {
            description: 'Ajouté à vos vidéos enregistrées',
            duration: 3500,
            action: {
              label: 'Voir →',
              onClick: () => navigate('/kauri/content-sauvegardes'),
            },
            style: { background: '#1E293B', color: '#fff', border: '1px solid rgba(176,91,59,0.3)' },
          });
        }
        return { ...post, isSaved: nowSaved };
      })
    );
  };

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className="px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-xl bg-gradient-to-br from-[#B05B3B] to-[#DC2626]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-2">KAURI Social</h1>
            <p className="text-white/90 text-sm">Feed communautaire</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/kauri/content-sauvegardes')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Bookmark className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`rounded-2xl overflow-hidden shadow-lg border-2 ${
              isDarkMode
                ? 'bg-[#1E293B] border-[#B05B3B]/30'
                : 'bg-white border-[#B05B3B]/20'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center text-white text-sm">
                    {post.avatar}
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{post.author}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{post.category}</p>
                  </div>
                </div>
                <button className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {post.type === 'video' && (
                <div className="relative mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#B05B3B]/10 to-[#DC2626]/10 aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#B05B3B] flex items-center justify-center shadow-xl">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-lg backdrop-blur-md ${
                    isDarkMode ? 'bg-black/50' : 'bg-white/80'
                  }`}>
                    <p className={`text-xs ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>2:15</p>
                  </div>
                </div>
              )}

              {post.type === 'image' && (
                <div className="mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#B05B3B]/10 to-[#DC2626]/10 aspect-square" />
              )}

              {(post.caption || post.content) && (
                <p className={`mb-3 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {post.caption || post.content}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#B05B3B]/20">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      post.isLiked
                        ? 'fill-[#B05B3B] text-[#B05B3B]'
                        : isDarkMode
                        ? 'text-[#94A3B8]'
                        : 'text-[#64748B]'
                    }`}
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{post.likes}</span>
                </button>

                <button className="flex items-center gap-2">
                  <MessageCircle className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{post.comments}</span>
                </button>

                <button className="flex items-center gap-2">
                  <Share2 className={`w-5 h-5 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{post.shares}</span>
                </button>

                <button
                  onClick={() => toggleSave(post.id)}
                  className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}
                >
                  <Bookmark
                    className={`w-5 h-5 transition-all ${
                      post.isSaved ? 'fill-[#B05B3B] text-[#B05B3B]' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="fixed bottom-32 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] shadow-2xl flex items-center justify-center text-white text-2xl">
        +
      </button>
    </div>
  );
}
