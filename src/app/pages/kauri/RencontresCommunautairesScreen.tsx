import { ArrowLeft, X, Heart, Star, Briefcase, Users, MapPin, Award, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  type: 'normal' | 'pro';
  title: string;
  bio: string;
  interests: string[];
  badges: string[];
}

export function RencontresCommunautairesScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const accountType = localStorage.getItem('kauri_account_type') || 'particulier';
  const isPro = accountType === 'professionnel';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles] = useState<Profile[]>(
    isPro
      ? [
          {
            id: '1',
            name: 'TechStart Ventures',
            avatar: 'TV',
            age: 0,
            location: 'Paris, France',
            type: 'pro',
            title: 'Investisseur en innovation tech',
            bio: 'Nous investissons dans les startups africaines et caribéennes à fort potentiel technologique.',
            interests: ['FinTech', 'AI', 'Blockchain'],
            badges: ['Investisseur vérifié', '500K+ investis'],
          },
          {
            id: '2',
            name: 'Diaspora Capital',
            avatar: 'DC',
            age: 0,
            location: 'Londres, UK',
            type: 'pro',
            title: 'Fonds d\'investissement diaspora',
            bio: 'Partenaire stratégique pour projets à impact social dans les Caraïbes.',
            interests: ['Impact Social', 'Agriculture', 'Éducation'],
            badges: ['KYB vérifié', '10+ projets financés'],
          },
        ]
      : [
          {
            id: '1',
            name: 'Sophie L.',
            avatar: 'SL',
            age: 28,
            location: 'Martinique, France',
            type: 'normal',
            title: 'Entrepreneure & Mentor',
            bio: 'Passionnée par l\'entrepreneuriat caribéen. Je cherche à partager mon expérience et rencontrer d\'autres créateurs.',
            interests: ['Business', 'Tontines', 'Networking'],
            badges: ['Mentor certifié', 'Top contributeur'],
          },
          {
            id: '2',
            name: 'Thomas K.',
            avatar: 'TK',
            age: 32,
            location: 'Guadeloupe, France',
            type: 'normal',
            title: 'Investisseur & Conseiller',
            bio: 'Expert en finance communautaire. Prêt à aider et conseiller sur les projets d\'investissement.',
            interests: ['Investissement', 'Conseil', 'Finance'],
            badges: ['Trust Score 95', '15 tontines'],
          },
        ]
  );

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentProfile) return null;

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F9F9F9]'}`}>
      <div className={`px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]' : 'bg-gradient-to-br from-[#B05B3B] to-[#DC2626]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-2">Rencontres</h1>
            <p className="text-white/90 text-sm">
              {isPro ? 'Trouvez vos partenaires B2B' : 'Trouvez vos mentors'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${
            isDarkMode ? 'border-[#B05B3B]/30 bg-[#1E293B]' : 'border-[#B05B3B]/20 bg-white'
          }`}>
            <div className="relative h-[500px] bg-gradient-to-br from-[#B05B3B]/20 to-[#DC2626]/20 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] flex items-center justify-center text-white text-5xl">
                {currentProfile.avatar}
              </div>

              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                {currentProfile.type === 'pro' ? (
                  <>
                    <Briefcase className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">Pro</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">Membre</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {currentProfile.name}
                  {!isPro && currentProfile.age > 0 && (
                    <span className={`text-xl ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>, {currentProfile.age}</span>
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{currentProfile.location}</p>
              </div>

              <div className={`rounded-xl p-3 mb-4 ${isDarkMode ? 'bg-[#B05B3B]/10 border border-[#B05B3B]/30' : 'bg-[#B05B3B]/10 border border-[#B05B3B]/20'}`}>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {currentProfile.title}
                </p>
              </div>

              <p className={`text-sm mb-4 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                {currentProfile.bio}
              </p>

              <div className="mb-4">
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Centres d'intérêt</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs ${
                        isDarkMode
                          ? 'bg-[#334155] text-white'
                          : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]'
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Badges</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#B05B3B]/20 to-[#DC2626]/20 border border-[#B05B3B]/30"
                    >
                      <Award className="w-3 h-3 text-[#B05B3B]" />
                      <span className="text-xs text-[#B05B3B]">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-[#E2E8F0] hover:scale-110 transition-transform"
            >
              <X className="w-8 h-8 text-[#B05B3B]" />
            </button>

            <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#E2E8F0] hover:scale-110 transition-transform">
              <Info className="w-6 h-6 text-[#006D77]" />
            </button>

            <button
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B05B3B] to-[#DC2626] shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart className="w-8 h-8 text-white" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {profiles.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-[#B05B3B]'
                    : 'w-2 bg-[#E2E8F0]'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
