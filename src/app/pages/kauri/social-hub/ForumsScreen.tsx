import React from 'react';
import { MessageCircle, Users, TrendingUp, Send, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ActiveTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  participants: number;
  newMessages: number;
  color: string;
}

interface PrivateChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount?: number;
}

export default function ForumsScreen() {
  const navigate = useNavigate();

  const activeTopics: ActiveTopic[] = [
    {
      id: '1',
      title: 'Immobilier Antilles',
      icon: <TrendingUp className="w-5 h-5" />,
      participants: 234,
      newMessages: 12,
      color: '#006D77'
    },
    {
      id: '2',
      title: 'Tech Diaspora',
      icon: <MessageCircle className="w-5 h-5" />,
      participants: 189,
      newMessages: 8,
      color: '#D4AF37'
    },
    {
      id: '3',
      title: 'Bons Plans Vie Chère',
      icon: <Users className="w-5 h-5" />,
      participants: 412,
      newMessages: 24,
      color: '#B05B3B'
    },
    {
      id: '4',
      title: 'Entrepreneuriat',
      icon: <TrendingUp className="w-5 h-5" />,
      participants: 156,
      newMessages: 5,
      color: '#006D77'
    }
  ];

  const privateChats: PrivateChat[] = [
    {
      id: '1',
      name: 'Marie-Claire Dubois',
      avatar: '👩🏾',
      lastMessage: 'Super l\'idée du pot commun pour la tontine !',
      timestamp: 'Il y a 5 min',
      isOnline: true,
      unreadCount: 3
    },
    {
      id: '2',
      name: 'Jean-Baptiste Laurent',
      avatar: '👨🏾',
      lastMessage: 'Tu as vu le nouveau projet immobilier ?',
      timestamp: 'Il y a 15 min',
      isOnline: true,
      unreadCount: 1
    },
    {
      id: '3',
      name: 'Isabelle Moutoussamy',
      avatar: '👩🏽',
      lastMessage: 'Merci pour les conseils investissement',
      timestamp: 'Il y a 2h',
      isOnline: false
    },
    {
      id: '4',
      name: 'Groupe Tontine Famille',
      avatar: '👥',
      lastMessage: 'Prochaine réunion vendredi 18h',
      timestamp: 'Hier',
      isOnline: false,
      unreadCount: 7
    },
    {
      id: '5',
      name: 'Marcus Johnson',
      avatar: '👨🏿',
      lastMessage: 'Excellent article sur la diaspora',
      timestamp: 'Il y a 3j',
      isOnline: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex justify-center">
      <div className="w-full max-w-[430px] flex flex-col">
        {/* Header avec recherche */}
        <div className="bg-[#B05B3B] px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Retour Hub Social — bouton Cauri premium */}
            <button
              onClick={() => navigate('/kauri/social-hub-gateway')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px 6px 8px',
                background: 'rgba(0,0,0,0.22)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 20,
                border: '1px solid rgba(212,175,55,0.4)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="cowrie-for" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0DCA0" />
                    <stop offset="100%" stopColor="#C5A028" />
                  </linearGradient>
                </defs>
                <ellipse cx="60" cy="60" rx="46" ry="34" fill="url(#cowrie-for)" />
                <ellipse cx="60" cy="60" rx="34" ry="8" fill="#000" opacity="0.22" />
                <ellipse cx="44" cy="50" rx="10" ry="5" fill="white" opacity="0.35" />
              </svg>
              <span style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Hub Social
              </span>
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                className="w-full pl-10 pr-4 py-2 bg-white/20 border-none rounded-full text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
              />
            </div>
            <button
              onClick={() => navigate('/kauri/social-hub/forums-menu')}
              className="p-2 hover:bg-[#8F4830] rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          {/* Salons Actifs */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#B05B3B]">Salons Actifs</h2>
              <span className="text-xs text-[#B05B3B]/70">{activeTopics.length} salons</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {activeTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => navigate(`/kauri/social-hub/salon/${topic.id}`)}
                  className="flex-shrink-0 w-[160px] bg-white rounded-xl p-3 border border-gray-200 hover:border-[#B05B3B] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: topic.color + '20', color: topic.color }}
                  >
                    {topic.icon}
                  </div>
                  <h3 className="font-medium text-sm text-[#4A4A4A] mb-2 line-clamp-2 leading-tight">
                    {topic.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {topic.participants}
                    </span>
                    {topic.newMessages > 0 && (
                      <span className="bg-[#B05B3B] text-white px-2 py-0.5 rounded-full font-medium">
                        {topic.newMessages}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-2 bg-gray-100 my-2" />

          {/* Messages Privés */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#B05B3B]">Messages Privés</h2>
              <button
                onClick={() => navigate('/kauri/social-hub/forums-menu')}
                className="p-1.5 hover:bg-[#B05B3B]/10 rounded-full transition-colors"
              >
                <Send className="w-4 h-4 text-[#B05B3B]" />
              </button>
            </div>

            <div className="space-y-2">
              {privateChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/kauri/social-hub/conversation/${chat.id}`)}
                  className="bg-white rounded-xl p-3 border border-gray-200 hover:border-[#B05B3B] hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar avec indicateur de statut */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#006D77] to-[#B05B3B] rounded-full flex items-center justify-center text-2xl">
                        {chat.avatar}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>

                    {/* Contenu du message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-[#4A4A4A] text-sm truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {chat.lastMessage}
                      </p>
                    </div>

                    {/* Badge non lus */}
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <div className="flex-shrink-0 bg-[#B05B3B] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton Nouveau Message */}
          <div className="px-4 pt-4">
            <button
              onClick={() => navigate('/kauri/social-hub/forums-menu')}
              className="w-full bg-[#B05B3B] hover:bg-[#8F4830] text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Nouvelle Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
