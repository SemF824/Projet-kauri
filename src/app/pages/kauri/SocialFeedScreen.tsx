import { Heart, MessageCircle, Share2, Play, Grid, Users, Briefcase, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function SocialFeedScreen() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<'videos' | 'threads' | 'gallery' | 'network'>('videos');

  const videos = [
    {
      user: 'Marie Laurent',
      avatar: 'ML',
      video: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      caption: 'Ouverture de notre Lolo Moderne à Fort-de-France ! 🎉 Merci à tous nos investisseurs KAURI',
      likes: 342,
      comments: 28,
    },
    {
      user: 'Jean-Pierre Louis',
      avatar: 'JP',
      video: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      caption: 'Notre coopérative manioc vient de livrer sa première récolte ! 🌾',
      likes: 215,
      comments: 19,
    },
  ];

  const threads = [
    {
      user: 'Sophie Bernard',
      avatar: 'SB',
      time: '2h',
      text: 'Incroyable succès de notre campagne de levée de fonds ! 100% atteint en seulement 3 semaines. La diaspora est une force ! 💪🏾',
      likes: 156,
      replies: 12,
    },
    {
      user: 'André Charles',
      avatar: 'AC',
      time: '5h',
      text: 'Besoin de conseils : quelqu\'un a déjà lancé une levée de fonds pour un projet immobilier en Martinique ? 🏠',
      likes: 45,
      replies: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-20">
      <div className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl">KAURI Social</h1>
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCurrentTab('videos')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                currentTab === 'videos'
                  ? 'bg-[#006D77] text-white'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <Play className="w-4 h-4 inline mr-1" />
              Vidéos
            </button>
            <button
              onClick={() => setCurrentTab('threads')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                currentTab === 'threads'
                  ? 'bg-[#006D77] text-white'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Discussions
            </button>
            <button
              onClick={() => setCurrentTab('gallery')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                currentTab === 'gallery'
                  ? 'bg-[#006D77] text-white'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <Grid className="w-4 h-4 inline mr-1" />
              Galerie
            </button>
            <button
              onClick={() => setCurrentTab('network')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                currentTab === 'network'
                  ? 'bg-[#006D77] text-white'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-1" />
              Réseau Pro
            </button>
          </div>
        </div>
      </div>

      {currentTab === 'videos' && (
        <div className="snap-y snap-mandatory h-[calc(100vh-200px)] overflow-y-scroll">
          {videos.map((video, index) => (
            <div key={index} className="snap-start h-[calc(100vh-200px)] relative">
              <ImageWithFallback
                src={video.video}
                alt={video.caption}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

              {/* Live Indicator */}
              <div className="absolute top-6 left-6">
                <div className="px-3 py-1 bg-[#B05B3B] rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-xs uppercase tracking-wide">Live</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 flex flex-col gap-4">
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                  <span className="text-white text-xs mt-1">{video.likes}</span>
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex flex-col items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                  <span className="text-white text-xs mt-1">{video.comments}</span>
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white">
                    {video.avatar}
                  </div>
                  <div>
                    <p className="text-white">{video.user}</p>
                    <button className="text-[#D4AF37] text-sm">Suivre</button>
                  </div>
                </div>
                <p className="text-white text-sm">{video.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTab === 'threads' && (
        <div className="px-6 py-4 space-y-4">
          {threads.map((thread, index) => (
            <div key={index} className="bg-[#1E293B] rounded-2xl p-5 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white">
                  {thread.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white">{thread.user}</p>
                    <span className="text-white/60 text-xs">• {thread.time}</span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">{thread.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-white/10">
                <button className="flex items-center gap-2 text-white/60 hover:text-white">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{thread.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-white/60 hover:text-white">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{thread.replies}</span>
                </button>
                <button className="flex items-center gap-2 text-white/60 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTab === 'gallery' && (
        <div className="px-2 py-4">
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="aspect-square bg-[#1E293B] rounded-lg"></div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'network' && (
        <div className="px-6 py-4 space-y-3">
          {['Marie Laurent - Restauratrice', 'Jean-Pierre - Agriculteur', 'Sophie - Investisseuse'].map(
            (person, index) => (
              <div
                key={index}
                className="bg-[#1E293B] rounded-xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white">
                    {person.split(' ')[0][0]}
                  </div>
                  <div>
                    <p className="text-white mb-1">{person}</p>
                    <span className="text-xs text-white/60">2 connexions communes</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#006D77] text-white rounded-lg text-sm">
                  Connecter
                </button>
              </div>
            )
          )}
        </div>
      )}

      <button
        onClick={() => navigate('/kauri/community-matching')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl"
      >
        <Users className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
