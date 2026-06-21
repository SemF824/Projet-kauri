import { ArrowLeft, MessageCircle, Users, TrendingUp, Flame, ChevronRight, Send, Paperclip, Smile } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Topic {
  id: string;
  title: string;
  category: string;
  participants: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
  trending: boolean;
}

export function CommunityChatScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [topics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Investissement Immobilier Diaspora',
      category: 'Immobilier',
      participants: 234,
      lastMessage: 'Sophie L. : Je recommande vraiment d\'investir dans les zones en développement...',
      lastTime: 'Il y a 5 min',
      unread: 3,
      trending: true,
    },
    {
      id: '2',
      title: 'Technologie & Innovation Caraïbes',
      category: 'Tech',
      participants: 156,
      lastMessage: 'Pierre D. : Quelqu\'un connaît des incubateurs locaux ?',
      lastTime: 'Il y a 15 min',
      unread: 0,
      trending: true,
    },
    {
      id: '3',
      title: 'Agriculture Durable & Bio',
      category: 'Agriculture',
      participants: 89,
      lastMessage: 'Marie C. : Nos récoltes de cette saison sont prometteuses !',
      lastTime: 'Il y a 1h',
      unread: 1,
      trending: false,
    },
    {
      id: '4',
      title: 'Entrepreneuriat Féminin',
      category: 'Business',
      participants: 312,
      lastMessage: 'Claire R. : Super initiative ! Comment puis-je rejoindre ?',
      lastTime: 'Il y a 2h',
      unread: 0,
      trending: false,
    },
    {
      id: '5',
      title: 'Finance Communautaire',
      category: 'Finance',
      participants: 421,
      lastMessage: 'Jean B. : Les tontines sont vraiment un excellent outil...',
      lastTime: 'Il y a 3h',
      unread: 5,
      trending: false,
    },
  ]);

  const chatMessages = [
    { author: 'Sophie L.', avatar: 'SL', message: 'Bonjour à tous ! Je cherche des conseils pour investir dans l\'immobilier en Martinique.', time: '10:32', isMine: false },
    { author: 'Pierre D.', avatar: 'PD', message: 'Salut Sophie ! J\'ai récemment investi là-bas. Les zones côtières sont très demandées.', time: '10:35', isMine: false },
    { author: 'Vous', avatar: 'JD', message: 'Je suis intéressé aussi ! Quels sont les meilleurs quartiers ?', time: '10:38', isMine: true },
    { author: 'Sophie L.', avatar: 'SL', message: 'Je recommande vraiment d\'investir dans les zones en développement, le potentiel de croissance est énorme !', time: '10:40', isMine: false },
  ];

  if (selectedTopic) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
        <div className={`px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]' : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'}`}>
          <button onClick={() => setSelectedTopic(null)} className="mb-6 text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Retour aux topics</span>
          </button>

          <div>
            <h1 className="text-white text-xl mb-1">{topics.find(t => t.id === selectedTopic)?.title}</h1>
            <p className="text-white/90 text-sm">{topics.find(t => t.id === selectedTopic)?.participants} participants</p>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-250px)]">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.isMine ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                  msg.isMine
                    ? 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'
                    : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'
                }`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-[70%] ${msg.isMine ? 'items-end' : ''}`}>
                  {!msg.isMine && (
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{msg.author}</p>
                  )}
                  <div className={`rounded-2xl p-3 ${
                    msg.isMine
                      ? isDarkMode
                        ? 'bg-[#006D77] text-white'
                        : 'bg-[#006D77] text-white'
                      : isDarkMode
                      ? 'bg-[#1E293B] text-white border border-[#334155]'
                      : 'bg-white text-[#0F172A] border border-[#E2E8F0]'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'} ${msg.isMine ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 border-t ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
            <div className="flex items-center gap-2">
              <button className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}>
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className={`px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]' : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-2">Forums Communautaires</h1>
            <p className="text-white/90 text-sm">Discussions & échanges</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div>
          <h3 className={`text-sm mb-3 flex items-center gap-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            <Flame className="w-4 h-4 text-[#B05B3B]" />
            Tendances actuelles
          </h3>
          <div className="space-y-2">
            {topics.filter(t => t.trending).map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full rounded-xl p-4 border-2 ${
                  isDarkMode
                    ? 'bg-[#1E293B] border-[#B05B3B]/30'
                    : 'bg-white border-[#B05B3B]/20'
                } hover:border-[#B05B3B] transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-[#B05B3B]/20 text-[#B05B3B] text-xs">
                      {topic.category}
                    </div>
                    {topic.trending && <Flame className="w-4 h-4 text-[#B05B3B]" />}
                  </div>
                  {topic.unread > 0 && (
                    <div className="w-6 h-6 rounded-full bg-[#B05B3B] text-white text-xs flex items-center justify-center">
                      {topic.unread}
                    </div>
                  )}
                </div>
                <h4 className={`text-left mb-2 font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {topic.title}
                </h4>
                <p className={`text-xs text-left mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {topic.lastMessage}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Users className={`w-3 h-3 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                    <span className={isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}>{topic.participants}</span>
                  </div>
                  <span className={isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}>{topic.lastTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-sm mb-3 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Tous les topics</h3>
          <div className="space-y-2">
            {topics.filter(t => !t.trending).map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full rounded-xl p-4 border ${
                  isDarkMode
                    ? 'bg-[#1E293B] border-[#334155]'
                    : 'bg-white border-[#E2E8F0]'
                } hover:border-[#B05B3B] transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="px-2 py-1 rounded-full bg-[#E2E8F0] text-[#64748B] text-xs">
                    {topic.category}
                  </div>
                  {topic.unread > 0 && (
                    <div className="w-6 h-6 rounded-full bg-[#B05B3B] text-white text-xs flex items-center justify-center">
                      {topic.unread}
                    </div>
                  )}
                </div>
                <h4 className={`text-left mb-2 font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {topic.title}
                </h4>
                <p className={`text-xs text-left mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {topic.lastMessage}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Users className={`w-3 h-3 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                    <span className={isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}>{topic.participants}</span>
                  </div>
                  <span className={isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}>{topic.lastTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="fixed bottom-32 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] shadow-2xl flex items-center justify-center text-white">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
