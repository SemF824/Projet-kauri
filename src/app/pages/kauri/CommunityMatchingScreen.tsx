import { ArrowLeft, Video, Users, MessageCircle, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function CommunityMatchingScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const pillars = [
    {
      id: 'social-hub',
      title: 'Hub Social Complet',
      description: 'Découverte • Rencontres • Discussions',
      icon: Sparkles,
      route: '/kauri/social-hub-gateway',
      gradient: 'from-[#B05B3B] to-[#DC2626]',
      stats: 'Tout en un seul endroit',
    },
    {
      id: 'viral-feed',
      title: 'Feed Viral',
      description: 'Contenu communautaire • Posts & Vidéos',
      icon: Video,
      route: '/kauri/viral-feed',
      gradient: 'from-[#B05B3B] to-[#DC2626]',
      stats: '234 posts aujourd\'hui',
    },
    {
      id: 'rencontres',
      title: 'Rencontres',
      description: 'Networking • Mentors & Partenaires',
      icon: Heart,
      route: '/kauri/rencontres-communautaires',
      gradient: 'from-[#B05B3B] to-[#DC2626]',
      stats: '12 nouveaux profils',
    },
    {
      id: 'forums',
      title: 'Forums',
      description: 'Discussions • Topics & Échanges',
      icon: MessageCircle,
      route: '/kauri/community-chat',
      gradient: 'from-[#B05B3B] to-[#DC2626]',
      stats: '5 topics actifs',
    },
  ];

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]' : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-white" />
          <h1 className="text-white text-2xl">KAURI Social</h1>
        </div>
        <p className="text-white/90 text-sm">
          Découvrez les 3 piliers de notre écosystème social
        </p>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className={`rounded-2xl p-6 border-2 ${
          isDarkMode
            ? 'bg-[#B05B3B]/10 border-[#B05B3B]/30'
            : 'bg-[#B05B3B]/10 border-[#B05B3B]/20'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                Bienvenue sur KAURI Social
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#FDE68A]' : 'text-[#92400E]'}`}>
                Notre plateforme sociale unique combine contenu viral, networking professionnel et discussions communautaires.
              </p>
            </div>
          </div>
        </div>

        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <button
              key={pillar.id}
              onClick={() => navigate(pillar.route)}
              className={`w-full rounded-2xl overflow-hidden shadow-xl border-2 transition-all hover:scale-[1.02] ${
                isDarkMode
                  ? 'bg-[#1E293B] border-[#B05B3B]/30 hover:border-[#B05B3B]'
                  : 'bg-white border-[#B05B3B]/20 hover:border-[#B05B3B]'
              }`}
            >
              <div className={`h-32 bg-gradient-to-br ${pillar.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <Icon className="w-16 h-16 text-white relative z-10" />
              </div>

              <div className="p-5">
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {pillar.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#B05B3B]" />
                    <span className="text-xs text-[#B05B3B]">{pillar.stats}</span>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#B05B3B] to-[#DC2626] text-white text-sm">
                    Explorer →
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#006D77]/10 border border-[#006D77]/30' : 'bg-[#E0F2FE] border border-[#006D77]/30'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-[#A7F3D0]' : 'text-[#075985]'}`}>
            💡 <strong>Astuce :</strong> Explorez chaque pilier pour maximiser votre expérience KAURI Social et connecter avec la diaspora !
          </p>
        </div>
      </div>
    </div>
  );
}