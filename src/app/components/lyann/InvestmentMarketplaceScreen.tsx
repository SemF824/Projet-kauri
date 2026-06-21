import { ArrowLeft, Star, TrendingUp, MapPin, Users } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function InvestmentMarketplaceScreen() {
  const navigate = useNavigate();
  const projects = [
    {
      name: 'Manioc Cooperative Farm',
      category: 'Agriculture',
      location: 'Haiti',
      fundingGoal: 50000,
      currentFunding: 32500,
      roi: '14%',
      leaderName: 'Marie Joseph',
      leaderRating: 5,
      leaderAvatar: 'MJ',
      backers: 24,
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    },
    {
      name: 'Modern Lolo Restaurant',
      category: 'Hospitality',
      location: 'Martinique',
      fundingGoal: 75000,
      currentFunding: 56250,
      roi: '18%',
      leaderName: 'Jean-Pierre Louis',
      leaderRating: 5,
      leaderAvatar: 'JP',
      backers: 42,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    },
    {
      name: 'Caribbean Arts & Crafts Hub',
      category: 'Retail',
      location: 'Guadeloupe',
      fundingGoal: 40000,
      currentFunding: 18000,
      roi: '12%',
      leaderName: 'Sophie Bernard',
      leaderRating: 4,
      leaderAvatar: 'SB',
      backers: 15,
      imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    },
    {
      name: 'Eco-Tourism Rental Villa',
      category: 'Real Estate',
      location: 'Dominica',
      fundingGoal: 120000,
      currentFunding: 84000,
      roi: '22%',
      leaderName: 'André Charles',
      leaderRating: 5,
      leaderAvatar: 'AC',
      backers: 58,
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-6">
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Community Projects</h1>
        <p className="text-white/90 text-sm mb-6">
          Invest in diaspora-led businesses & ventures
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {['All', 'Agriculture', 'Hospitality', 'Real Estate', 'Retail'].map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                index === 0
                  ? 'bg-white text-[#D97706]'
                  : 'bg-white/20 text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {projects.map((project, index) => {
          const fundingPercentage = Math.round(
            (project.currentFunding / project.fundingGoal) * 100
          );

          return (
            <button
              key={index}
              onClick={() => navigate(`/project-crowdfunding/${index + 1}`)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-lg text-left"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                  {project.category}
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                  <MapPin className="w-3 h-3" />
                  <span>{project.location}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-[#0F172A] mb-3">{project.name}</h3>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#64748B]">Funding Progress</span>
                    <span className="text-[#0D9488]">{fundingPercentage}%</span>
                  </div>
                  <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
                      style={{ width: `${fundingPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    €{project.currentFunding.toLocaleString()} of €
                    {project.fundingGoal.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#0D9488]" />
                    <div>
                      <p className="text-xs text-[#64748B]">Expected ROI</p>
                      <p className="text-sm text-[#0D9488]">{project.roi} annually</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#64748B]" />
                    <div>
                      <p className="text-xs text-[#64748B]">Backers</p>
                      <p className="text-sm text-[#0F172A]">{project.backers}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white text-sm">
                      {project.leaderAvatar}
                    </div>
                    <div>
                      <p className="text-sm text-[#0F172A]">{project.leaderName}</p>
                      <p className="text-xs text-[#64748B]">Project Leader</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < project.leaderRating
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-[#E2E8F0]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white py-3 rounded-xl text-center">
                  View Details
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
