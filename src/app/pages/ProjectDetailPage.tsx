import { ArrowLeft, MapPin, TrendingUp, Users, Star, Calendar, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const project = {
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
    description:
      'An innovative agricultural cooperative focusing on sustainable manioc (cassava) cultivation in rural Haiti. This project will provide jobs to 50+ local farmers and supply fresh manioc to regional markets.',
    timeline: 'Q3 2026 - Q2 2027',
    minInvestment: 500,
    expectedReturns: '14% annually over 3 years',
  };

  const fundingPercentage = Math.round((project.currentFunding / project.fundingGoal) * 100);

  const milestones = [
    { title: 'Land Acquisition', status: 'completed', date: 'Jun 2026' },
    { title: 'Infrastructure Setup', status: 'in-progress', date: 'Aug 2026' },
    { title: 'First Planting Season', status: 'upcoming', date: 'Oct 2026' },
    { title: 'First Harvest & Revenue', status: 'upcoming', date: 'Mar 2027' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="relative">
        <ImageWithFallback
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.location}
            </span>
          </div>
          <h1 className="text-white text-2xl">{project.name}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-[#64748B]">Funding Progress</span>
            <span className="text-[#0D9488]">{fundingPercentage}%</span>
          </div>
          <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#0F172A] text-lg">
              €{project.currentFunding.toLocaleString()}
            </span>
            <span className="text-[#64748B] text-sm">
              of €{project.fundingGoal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <TrendingUp className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm mb-1">{project.roi}</p>
            <p className="text-[#64748B] text-xs">Expected ROI</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Users className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm mb-1">{project.backers}</p>
            <p className="text-[#64748B] text-xs">Backers</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <DollarSign className="w-6 h-6 text-[#14B8A6] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm mb-1">€{project.minInvestment}</p>
            <p className="text-[#64748B] text-xs">Min. Investment</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-[#0F172A] mb-3">About This Project</h3>
          <p className="text-[#64748B] text-sm leading-relaxed">{project.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0D9488]" />
            <h3 className="text-[#0F172A]">Project Milestones</h3>
          </div>

          <div className="space-y-0">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                {index !== milestones.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#E2E8F0]"></div>
                )}

                <div className="flex items-start gap-3 pb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      milestone.status === 'completed'
                        ? 'bg-[#D1FAE5] text-[#0D9488]'
                        : milestone.status === 'in-progress'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[#0F172A] text-sm">{milestone.title}</p>
                    <p className="text-[#64748B] text-xs mt-1">{milestone.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-[#0F172A] mb-4">Project Leader</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white">
                {project.leaderAvatar}
              </div>
              <div>
                <p className="text-[#0F172A]">{project.leaderName}</p>
                <p className="text-[#64748B] text-sm">Agricultural Expert</p>
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-[#0D9488] text-[#0D9488] py-4 rounded-xl">
            Save Project
          </button>
          <button className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white py-4 rounded-xl">
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
}
