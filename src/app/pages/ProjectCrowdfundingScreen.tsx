import { ArrowLeft, TrendingUp, Users, MapPin, FileText, Star, Globe, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ProjectCrowdfundingScreen() {
  const navigate = useNavigate();

  const project = {
    name: 'Modern Lolo Restaurant Chain',
    category: 'Hospitality',
    location: 'Martinique & Guadeloupe',
    fundingGoal: 100000,
    currentFunding: 45000,
    roi: '18%',
    timeline: 'Q4 2026 - Q2 2027',
    minInvestment: 500,
    backers: 87,
    leaderName: 'Jean-Pierre Louis',
    leaderAvatar: 'JP',
    leaderRating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    description:
      'A chain of modern "Lolo" (traditional Caribbean street food) restaurants bringing authentic island flavors to urban centers across the French Caribbean. Combining tradition with contemporary dining experiences.',
  };

  const diasporaBackers = [
    { region: 'France', count: 42, amount: 21000, flag: '🇫🇷', percentage: 47 },
    { region: 'Canada', count: 28, amount: 14000, flag: '🇨🇦', percentage: 31 },
    { region: 'Caribbean', count: 17, amount: 10000, flag: '🌴', percentage: 22 },
  ];

  const milestones = [
    { title: 'Initial Funding Secured', date: 'Aug 2026', status: 'completed' },
    { title: 'First Location Lease Signed', date: 'Oct 2026', status: 'in-progress' },
    { title: 'Kitchen Equipment & Setup', date: 'Nov 2026', status: 'upcoming' },
    { title: 'Grand Opening', date: 'Jan 2027', status: 'upcoming' },
    { title: 'Second Location Launch', date: 'Apr 2027', status: 'upcoming' },
  ];

  const fundingPercentage = Math.round((project.currentFunding / project.fundingGoal) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="relative h-[300px]">
        <ImageWithFallback
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#D4AF37]/90 backdrop-blur-sm text-white text-xs rounded-full">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.location}
            </span>
          </div>
          <h1 className="text-white text-2xl">{project.name}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Funding Progress</p>
              <h2 className="text-white text-3xl">{fundingPercentage}%</h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-500"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white">€{project.currentFunding.toLocaleString()}</span>
            <span className="text-white/80">of €{project.fundingGoal.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <DollarSign className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
            <p className="text-[#0F172A] mb-1">{project.roi}</p>
            <p className="text-[#64748B] text-xs">Expected ROI</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <Users className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-[#0F172A] mb-1">{project.backers}</p>
            <p className="text-[#64748B] text-xs">Backers</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <TrendingUp className="w-6 h-6 text-[#475569] mx-auto mb-2" />
            <p className="text-[#0F172A] mb-1">€{project.minInvestment}</p>
            <p className="text-[#64748B] text-xs">Min. Amount</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#0A5C7A]" />
            <h3 className="text-[#0F172A]">Diaspora Backers</h3>
          </div>

          <div className="space-y-4">
            {diasporaBackers.map((region, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{region.flag}</span>
                    <div>
                      <p className="text-[#0F172A] text-sm">{region.region}</p>
                      <p className="text-[#64748B] text-xs">{region.count} investors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0F172A] text-sm">€{region.amount.toLocaleString()}</p>
                    <p className="text-[#0D9488] text-xs">{region.percentage}%</p>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A5C7A] to-[#0D9488]"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <p className="text-[#64748B] text-sm text-center">
              Building unity through investment across the diaspora
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-3">About This Project</h3>
          <p className="text-[#64748B] text-sm leading-relaxed mb-4">{project.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-[#64748B] text-xs mb-1">Timeline</p>
              <p className="text-[#0F172A]">{project.timeline}</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-[#64748B] text-xs mb-1">Category</p>
              <p className="text-[#0F172A]">{project.category}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0A5C7A]" />
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      milestone.status === 'completed'
                        ? 'bg-[#D1FAE5] text-[#0D9488]'
                        : milestone.status === 'in-progress'
                        ? 'bg-[#FEF3C7] text-[#D4AF37]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[#0F172A] text-sm mb-1">{milestone.title}</p>
                    <p className="text-[#64748B] text-xs">{milestone.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4">Project Leader</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A5C7A] to-[#0D9488] flex items-center justify-center text-white text-xl shadow-lg">
                {project.leaderAvatar}
              </div>
              <div>
                <p className="text-[#0F172A] mb-1">{project.leaderName}</p>
                <p className="text-[#64748B] text-sm">Hospitality Expert</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < project.leaderRating
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0A5C7A] py-3 rounded-xl flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">View Contract Terms</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-[#0A5C7A] text-[#0A5C7A] py-4 rounded-xl">
            Save Project
          </button>
          <button className="bg-gradient-to-r from-[#0A5C7A] to-[#0D9488] text-white py-4 rounded-xl shadow-lg">
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
}
