import { ArrowLeft, Play, Users, MessageSquare, Heart, MessageCircle, Share2, Bookmark, Grid3x3, List, Pause, Volume2, VolumeX, MoreVertical, X, Handshake, Star, MapPin, Briefcase, Award, Info, TrendingUp, Send, Search, Paperclip, Smile, Shield, Eye, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useDarkMode } from '../../contexts/DarkModeContext';

type TabId = 'decouverte' | 'rencontres' | 'discussions';
type ViewMode = 'vertical' | 'grid';
type DiscussionView = 'list' | 'chat';

interface Post {
  id: string;
  author: string;
  avatar: string;
  type: 'video' | 'image';
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  category: string;
  duration?: string;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  trustScore: number;
  bio: string;
  tags: string[];
  interests: string[];
  profession: string;
}

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

interface ChatMessage {
  author: string;
  avatar: string;
  message: string;
  time: string;
  isMine: boolean;
}

export function SocialHubScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const tab = searchParams.get('tab') as TabId;
    return tab && ['decouverte', 'rencontres', 'discussions'].includes(tab) ? tab : 'decouverte';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Rencontres state
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentor' | 'investisseur' | 'projet'>('all');
  const [pendingMatches] = useState(12); // Nombre de matchs en attente

  // Discussions state
  const [discussionView, setDiscussionView] = useState<DiscussionView>('list');
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'Marie Laurent',
      age: 34,
      location: 'Paris / Martinique',
      avatar: 'ML',
      trustScore: 4.9,
      bio: 'Accompagner la souveraineté alimentaire des Caraïbes grâce à l\'innovation technologique.',
      tags: ['🟢 Dispo pour Mentorat', '🔵 Cherche Partenaire', '🟠 Investisseur'],
      interests: ['Entrepreneuriat', 'Technologie', 'Finance'],
      profession: 'Fondatrice de GreenTech Solutions',
    },
    {
      id: '2',
      name: 'Thomas Dubois',
      age: 38,
      location: 'Montréal / Haïti',
      avatar: 'TD',
      trustScore: 5.0,
      bio: 'Investisseur et mentor pour startups caribéennes. 15 ans d\'expérience en finance.',
      tags: ['🟢 Dispo pour Mentorat', '🟠 Investisseur'],
      interests: ['Finance', 'Investissement', 'Mentorat'],
      profession: 'Directeur Investissements',
    },
    {
      id: '3',
      name: 'Marie-Claire Joseph',
      age: 29,
      location: 'Fort-de-France, Martinique',
      avatar: 'MJ',
      trustScore: 4.7,
      bio: 'Designer produit et UX. Je cherche des partenaires pour lancer une agence créative.',
      tags: ['🔵 Cherche Partenaire', '🟣 Projet en Cours'],
      interests: ['Design', 'UX/UI', 'Branding'],
      profession: 'Lead Designer',
    },
    {
      id: '4',
      name: 'Pierre-André Martin',
      age: 45,
      location: 'Pointe-à-Pitre, Guadeloupe',
      avatar: 'PM',
      trustScore: 5.0,
      bio: 'Expert en agriculture durable. Fondateur de 3 coopératives agricoles prospères.',
      tags: ['🟢 Dispo pour Mentorat', '🟣 Projet en Cours'],
      interests: ['Agriculture', 'Écologie', 'Commerce Équitable'],
      profession: 'Agronome & Consultant',
    },
    {
      id: '5',
      name: 'Isabelle Beaumont',
      age: 35,
      location: 'Lyon / Guadeloupe',
      avatar: 'IB',
      trustScore: 4.6,
      bio: 'Avocate spécialisée en droit des affaires. Passionnée par l\'accompagnement des entrepreneurs.',
      tags: ['🟢 Dispo pour Mentorat', '🔵 Cherche Partenaire'],
      interests: ['Droit', 'Business', 'Entrepreneuriat'],
      profession: 'Avocate d\'Affaires',
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Marie C.',
      avatar: 'MC',
      type: 'video',
      caption: '🎉 Notre projet Lolo Moderne vient d\'atteindre 100% de financement ! Merci à toute la communauté KAURI 🙏 #Success #Entrepreneuriat',
      likes: 1247,
      comments: 156,
      shares: 89,
      isLiked: false,
      isSaved: false,
      category: 'Business',
      duration: '0:45',
    },
    {
      id: '2',
      author: 'Pierre D.',
      avatar: 'PD',
      type: 'video',
      caption: '🌱 Comment j\'ai transformé mon terrain en ferme bio grâce aux tontines KAURI. Voici mon histoire... #Agriculture #DiasporaPower',
      likes: 892,
      comments: 67,
      shares: 34,
      isLiked: true,
      isSaved: false,
      category: 'Agriculture',
      duration: '1:12',
    },
    {
      id: '3',
      author: 'Sophie L.',
      avatar: 'SL',
      type: 'image',
      caption: '💡 5 conseils pour maximiser vos rendements dans les tontines KAURI ! Thread 👇',
      likes: 654,
      comments: 43,
      shares: 28,
      isLiked: false,
      isSaved: false,
      category: 'Finance',
    },
    {
      id: '4',
      author: 'Thomas K.',
      avatar: 'TK',
      type: 'video',
      caption: '🏠 Visite de ma première propriété achetée via l\'investissement KAURI ! Le rêve devient réalité 🔑 #Immobilier',
      likes: 2103,
      comments: 234,
      shares: 156,
      isLiked: true,
      isSaved: false,
      category: 'Immobilier',
      duration: '2:05',
    },
    {
      id: '5',
      author: 'Claire R.',
      avatar: 'CR',
      type: 'image',
      caption: '✨ Networking event KAURI à Paris ! Incroyable de rencontrer autant d\'entrepreneurs caribéens 🤝 #Community',
      likes: 432,
      comments: 52,
      shares: 19,
      isLiked: false,
      isSaved: false,
      category: 'Événement',
    },
  ]);

  // Données pour l'onglet Discussions
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

  const chatMessages: ChatMessage[] = [
    { author: 'Sophie L.', avatar: 'SL', message: 'Bonjour à tous ! Je cherche des conseils pour investir dans l\'immobilier en Martinique.', time: '10:32', isMine: false },
    { author: 'Pierre D.', avatar: 'PD', message: 'Salut Sophie ! J\'ai récemment investi là-bas. Les zones côtières sont très demandées.', time: '10:35', isMine: false },
    { author: 'Vous', avatar: 'JD', message: 'Je suis intéressé aussi ! Quels sont les meilleurs quartiers ?', time: '10:38', isMine: true },
    { author: 'Marie-Claire D.', avatar: 'MC', message: 'Super l\'idée du pot commun pour la tontine ! On devrait organiser ça bientôt.', time: '10:40', isMine: false },
  ];

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(post => {
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
        });
      }
      return { ...post, isLiked: nowLiked, likes: nowLiked ? post.likes + 1 : post.likes - 1 };
    }));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== id) return post;
      const nowSaved = !post.isSaved;
      if (nowSaved) {
        toast('Contenu enregistré', {
          description: 'Retrouve-le dans Mes Contenus',
          duration: 3500,
          action: {
            label: 'Voir →',
            onClick: () => navigate('/kauri/content-sauvegardes'),
          },
        });
      }
      return { ...post, isSaved: nowSaved };
    }));
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setSwipeDirection(direction);
    setIsAnimating(true);

    // Show "Glowing Roots" animation for right swipe (match)
    if (direction === 'right') {
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 1500);
    }

    setTimeout(() => {
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0);
      }
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const currentProfile = profiles[currentProfileIndex];

  const tabs = [
    { id: 'decouverte' as TabId, label: 'Découverte', icon: Play },
    { id: 'rencontres' as TabId, label: 'Rencontres', icon: Users },
    { id: 'discussions' as TabId, label: 'Discussions', icon: MessageSquare },
  ];

  // Cowrie shell animation for likes
  const CowrieShell = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 3.5 2.5 4.5C7 13.5 6 15.5 6 18c0 3.5 2.5 4 6 4s6-.5 6-4c0-2.5-1-4.5-2.5-5.5C17 11.5 18 10 18 8c0-3.5-2.5-6-6-6zm0 2c2.5 0 4 1.5 4 4s-1.5 4-4 4-4-1.5-4-4 1.5-4 4-4z"/>
    </svg>
  );

  const renderDiscussions = () => {
    // Vue détaillée de la discussion
    if (discussionView === 'chat' && selectedDiscussion) {
      const selectedChat = privateChats.find(chat => chat.id === selectedDiscussion);
      const selectedTopic = activeTopics.find(topic => topic.id === selectedDiscussion);
      const discussionTitle = selectedChat?.name || selectedTopic?.title || '';

      return (
        <div className={`h-full flex flex-col ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
          {/* Header de la discussion */}
          <div className="bg-[#B05B3B] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => {
                setDiscussionView('list');
                setSelectedDiscussion(null);
              }}
              className="p-2 hover:bg-[#8F4830] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <h3 className="text-white font-semibold">{discussionTitle}</h3>
              {selectedChat && (
                <p className="text-white/70 text-xs">
                  {selectedChat.isOnline ? 'En ligne' : 'Hors ligne'}
                </p>
              )}
              {selectedTopic && (
                <p className="text-white/70 text-xs">
                  {selectedTopic.participants} participants
                </p>
              )}
            </div>
            <button className="p-2 hover:bg-[#8F4830] rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.isMine ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                  msg.isMine
                    ? 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'
                    : 'bg-gradient-to-br from-[#B05B3B] to-[#8F4830]'
                }`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-[70%] ${msg.isMine ? 'items-end' : ''}`}>
                  {!msg.isMine && (
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {msg.author}
                    </p>
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.isMine
                      ? 'bg-[#B05B3B] text-white'
                      : isDarkMode
                      ? 'bg-[#1E293B] text-white border border-[#334155]'
                      : 'bg-white text-[#0F172A] border border-[#E2E8F0]'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'} ${
                    msg.isMine ? 'text-right' : ''
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de message */}
          <div className={`p-4 border-t flex-shrink-0 ${
            isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-center gap-2">
              <button className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className={`flex-1 py-2 px-4 rounded-xl ${
                  isDarkMode
                    ? 'bg-[#334155] text-white placeholder-[#64748B]'
                    : 'bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8]'
                } focus:outline-none`}
              />
              <button className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                <Smile className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#B05B3B] hover:bg-[#8F4830] flex items-center justify-center transition-colors">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Vue liste des discussions
    return (
      <div className={`h-full overflow-y-auto ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
        {/* Header avec recherche */}
        <div className="bg-[#B05B3B] px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                className="w-full pl-10 pr-4 py-2 bg-white/20 border-none rounded-full text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
              />
            </div>
            <button className="p-2 hover:bg-[#8F4830] rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Salons Actifs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#B05B3B]">Salons Actifs</h2>
              <span className="text-xs text-[#B05B3B]/70">{activeTopics.length} salons</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {activeTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedDiscussion(topic.id);
                    setDiscussionView('chat');
                  }}
                  className="flex-shrink-0 w-[160px] bg-white rounded-xl p-3 border border-gray-200 hover:border-[#B05B3B] hover:shadow-md transition-all group"
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
                </button>
              ))}
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-2 bg-gray-100 -mx-4" />

          {/* Messages Privés */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#B05B3B]">Messages Privés</h2>
              <button className="p-1.5 hover:bg-[#B05B3B]/10 rounded-full transition-colors">
                <Send className="w-4 h-4 text-[#B05B3B]" />
              </button>
            </div>

            <div className="space-y-2">
              {privateChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedDiscussion(chat.id);
                    setDiscussionView('chat');
                  }}
                  className="w-full bg-white rounded-xl p-3 border border-gray-200 hover:border-[#B05B3B] hover:shadow-sm transition-all group text-left"
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
                </button>
              ))}
            </div>
          </div>

          {/* Bouton Nouveau Message */}
          <div className="pt-4">
            <button className="w-full bg-[#B05B3B] hover:bg-[#8F4830] text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
              <MessageCircle className="w-5 h-5" />
              Nouvelle Discussion
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDecouverte = () => {
    if (viewMode === 'vertical') {
      const currentPost = posts[currentVideoIndex];

      return (
        <div className="relative h-full">
          {/* Full-screen vertical video scroll */}
          <div className="absolute inset-0 bg-black">
            {currentPost.type === 'video' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-[#B05B3B]/30 to-[#DC2626]/30 flex items-center justify-center">
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

                    {/* Play/Pause overlay */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center"
                        >
                          <Play className="w-10 h-10 text-white ml-1" />
                        </button>
                      </div>
                    )}

                    {/* Video info overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 pb-32">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center text-white text-sm border-2 border-white">
                          {currentPost.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{currentPost.author}</p>
                          <p className="text-white/80 text-xs">{currentPost.category}</p>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-[#B05B3B] text-white text-sm font-medium">
                          Suivre
                        </button>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        {currentPost.caption}
                      </p>
                    </div>

                    {/* Duration badge */}
                    {currentPost.duration && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs">
                        {currentPost.duration}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-[#B05B3B]/20 to-[#DC2626]/20"></div>
            )}
          </div>

          {/* Right sidebar with glassmorphism actions */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6">
            {/* Like with Cowrie shell */}
            <button
              onClick={() => toggleLike(currentPost.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all ${
                currentPost.isLiked
                  ? 'bg-[#B05B3B]/80 border-[#B05B3B] scale-110'
                  : 'bg-white/20 border-white/30'
              }`}>
                <CowrieShell className={`w-7 h-7 transition-all ${
                  currentPost.isLiked ? 'text-white animate-bounce' : 'text-white'
                }`} />
              </div>
              <span className="text-white text-xs font-medium">
                {currentPost.likes >= 1000 ? `${(currentPost.likes / 1000).toFixed(1)}k` : currentPost.likes}
              </span>
            </button>

            {/* Comment */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-xs font-medium">{currentPost.comments}</span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-xs font-medium">{currentPost.shares}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSave(currentPost.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-14 h-14 rounded-full backdrop-blur-xl border-2 flex items-center justify-center transition-all ${
                currentPost.isSaved
                  ? 'bg-[#B05B3B]/80 border-[#B05B3B] scale-110'
                  : 'bg-white/20 border-white/30'
              }`}>
                <Bookmark className={`w-7 h-7 transition-all ${
                  currentPost.isSaved ? 'text-white fill-white' : 'text-white'
                }`} />
              </div>
            </button>

            {/* More */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                <MoreVertical className="w-7 h-7 text-white" />
              </div>
            </button>
          </div>

          {/* Top controls */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Swipe indicators */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 flex items-center gap-2">
            {posts.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentVideoIndex
                    ? 'w-8 bg-white'
                    : 'w-1 bg-white/40'
                }`}
              ></div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
            {currentVideoIndex > 0 && (
              <button
                onClick={() => setCurrentVideoIndex(prev => Math.max(0, prev - 1))}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-1"></div>
            {currentVideoIndex < posts.length - 1 && (
              <button
                onClick={() => setCurrentVideoIndex(prev => Math.min(posts.length - 1, prev + 1))}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div className={`p-4 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => {
                setViewMode('vertical');
                setCurrentVideoIndex(posts.findIndex(p => p.id === post.id));
              }}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B05B3B]/30 to-[#DC2626]/30 flex items-center justify-center">
                {post.type === 'video' && (
                  <>
                    <Play className="w-8 h-8 text-white" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
                      {post.duration}
                    </div>
                  </>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-1 text-white text-xs">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className={`w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
        {/* Header */}
        <div className={`px-4 pt-10 pb-4 flex-shrink-0 ${isDarkMode ? 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]' : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'}`}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/kauri/social-hub-gateway')} className="text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>

            {activeTab === 'decouverte' && (
              <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/kauri/content-sauvegardes')}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                title="Mes contenus"
              >
                <Bookmark className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full p-1">
                <button
                  onClick={() => setViewMode('vertical')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    viewMode === 'vertical' ? 'bg-white text-[#B05B3B]' : 'text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    viewMode === 'grid' ? 'bg-white text-[#B05B3B]' : 'text-white'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-[#B05B3B] shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          {activeTab === 'decouverte' && renderDecouverte()}

          {activeTab === 'rencontres' && (
            <div className={`relative h-full flex flex-col ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
              {/* Badge "X profils restants" */}
              <div className="px-4 pt-3 pb-2 flex justify-center">
                <div className="px-4 py-2 rounded-full bg-white shadow-md border border-gray-200">
                  <span className="text-sm font-medium text-[#4A4A4A]">
                    {profiles.length - currentProfileIndex} profils restants
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 min-h-0 px-6 pb-4 relative">
                <div className="relative w-full h-full max-w-[400px] mx-auto">
                  {/* Stack of cards effect */}
                  {profiles.slice(currentProfileIndex, currentProfileIndex + 3).map((profile, index) => {
                    const isTop = index === 0;
                    const scale = 1 - (index * 0.03);
                    const yOffset = index * 10;
                    const opacity = 1 - (index * 0.2);

                    return (
                      <div
                        key={profile.id}
                        className={`absolute inset-0 transition-all duration-300 ${
                          isTop && swipeDirection ? 'pointer-events-none' : ''
                        }`}
                        style={{
                          transform: `scale(${scale}) translateY(${yOffset}px) ${
                            isTop && swipeDirection === 'left'
                              ? 'translateX(-400px) rotate(-20deg)'
                              : isTop && swipeDirection === 'right'
                              ? 'translateX(400px) rotate(20deg)'
                              : ''
                          }`,
                          opacity: isTop && swipeDirection ? 0 : opacity,
                          zIndex: 10 - index,
                        }}
                      >
                        <div className="rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col bg-white">
                          {/* Photo Section with gradient - 55% */}
                          <div className="relative bg-gradient-to-br from-[#E8C4C4] via-[#D4A5A5] to-[#8B6F6F] flex items-center justify-center overflow-hidden" style={{ flex: '0 0 55%' }}>
                            {/* Profile avatar */}
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#8F4830] flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white">
                              {profile.avatar}
                            </div>

                            {/* Location Badge (Top Left) */}
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-white" />
                              <span className="text-xs font-medium text-white">{profile.location.split(' / ')[0]}</span>
                            </div>

                            {/* Trust Score (Top Right) */}
                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white shadow-lg flex items-center gap-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(profile.trustScore) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-300 text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-[#4A4A4A]">{profile.trustScore}</span>
                            </div>
                          </div>

                          {/* Info Content - 45% */}
                          <div className="px-5 py-4 flex flex-col gap-3 overflow-hidden" style={{ flex: '0 0 45%' }}>
                            {/* Name & Age */}
                            <h2 className="text-xl font-bold text-[#0F172A]">
                              {profile.name}, {profile.age}
                            </h2>

                            {/* Professional Title */}
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                              <p className="text-sm text-[#64748B] truncate">
                                {profile.profession}
                              </p>
                            </div>

                            {/* Bio */}
                            <p className="text-sm leading-relaxed text-[#4A4A4A] line-clamp-2">
                              {profile.bio}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {profile.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FDE8E8] text-[#B05B3B]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar - 3 boutons */}
              <div className="flex-shrink-0 px-6 pb-6 pt-2">
                <div className="flex items-center justify-center gap-6">
                  {/* LEFT: Passer (X) */}
                  <button
                    onClick={() => handleSwipe('left')}
                    disabled={isAnimating}
                    className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-7 h-7 text-[#EF4444]" strokeWidth={2.5} />
                  </button>

                  {/* CENTER: Info (?) */}
                  <button
                    className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Info className="w-7 h-7 text-[#006D77]" strokeWidth={2} />
                  </button>

                  {/* RIGHT: Connecter (Handshake) */}
                  <button
                    onClick={() => handleSwipe('right')}
                    disabled={isAnimating}
                    className="w-16 h-16 rounded-full bg-[#B05B3B] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Handshake className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discussions' && renderDiscussions()}
        </div>
      </div>
    </div>
  );
}