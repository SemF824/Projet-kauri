import { ArrowLeft, Heart, MessageCircle, Share2, TrendingUp, Users, Plus, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function FeedScreen() {
  const navigate = useNavigate();
  const posts = [
    {
      user: 'Marie Laurent',
      avatar: 'ML',
      time: '2h ago',
      type: 'success',
      title: 'Just received my tontine pot! 🎉',
      content:
        "Thanks to our Family Circle tontine, I've received €2,500 to expand my bakery. Grateful for this amazing community support!",
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      likes: 124,
      comments: 18,
      trustScore: 5,
    },
    {
      user: 'KAURI Éducation',
      avatar: 'KE',
      time: '5h ago',
      type: 'education',
      title: 'Conseil Financier : Construire Votre Fonds d\'Urgence',
      content:
        'Les experts financiers recommandent d\'économiser 3 à 6 mois de dépenses. Commencez petit avec les tontines et construisez progressivement votre filet de sécurité. 💰',
      likes: 89,
      comments: 12,
      trustScore: null,
    },
    {
      user: 'André Charles',
      avatar: 'AC',
      time: '1d ago',
      type: 'project',
      title: 'New Project Launched: Eco-Tourism Villa',
      content:
        'Excited to announce my new eco-tourism project in Dominica! Looking for 50 investors to join this sustainable venture. Expected ROI: 22%',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      likes: 156,
      comments: 34,
      trustScore: 5,
    },
    {
      user: 'Sophie Bernard',
      avatar: 'SB',
      time: '2d ago',
      type: 'circle',
      title: 'Looking for 2 more members!',
      content:
        'Our "Young Professionals Circle" tontine needs 2 more trusted members. Monthly contribution: €200. Next pot rotation starts Oct 1st.',
      likes: 45,
      comments: 9,
      trustScore: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-6 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mb-4 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-1">Fil KAURI</h1>
            <p className="text-[#F1F5F9] text-sm">Histoires et réussites de la communauté</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <button className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Create / Join a New Circle</span>
        </button>

        {posts.map((post, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm ${
                      post.type === 'education'
                        ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'
                        : 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6]'
                    }`}
                  >
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[#0F172A] text-sm">{post.user}</p>
                      {post.trustScore && (
                        <div className="flex items-center gap-0.5">
                          {[...Array(post.trustScore)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]">{post.time}</p>
                  </div>
                </div>

                {post.type === 'success' && (
                  <span className="px-2 py-1 bg-[#D1FAE5] text-[#0D9488] text-xs rounded-full">
                    Success
                  </span>
                )}
                {post.type === 'project' && (
                  <span className="px-2 py-1 bg-[#FEF3C7] text-[#D97706] text-xs rounded-full">
                    Project
                  </span>
                )}
                {post.type === 'education' && (
                  <span className="px-2 py-1 bg-[#E0F2FE] text-[#0369A1] text-xs rounded-full">
                    Tip
                  </span>
                )}
              </div>

              <h4 className="text-[#0F172A] mb-2 text-sm">{post.title}</h4>
              <p className="text-[#64748B] text-sm mb-3">{post.content}</p>
            </div>

            {post.image && (
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-4 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-around">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#0D9488]">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#0D9488]">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#0D9488]">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
