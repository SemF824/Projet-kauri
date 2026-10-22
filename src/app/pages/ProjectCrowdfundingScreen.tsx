import { ArrowLeft, TrendingUp, Users, MapPin, FileText, Star, Globe, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabase } from '../../utils/supabase';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

export function ProjectCrowdfundingScreen() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [isInvesting, setIsInvesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const project = {
    id: 'lolo-modern-chain',
    name: 'Modern Lolo Restaurant Chain',
    category: 'Restauration',
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
      'Une chaîne moderne de restaurants de type "Lolo" (cuisine créole traditionnelle) apportant les saveurs caribéennes authentiques aux centres urbains des Antilles françaises. Alliant tradition et expériences contemporaines.',
  };

  const diasporaBackers = [
    { region: 'France (Diaspora)', count: 42, amount: 21000, flag: '🇫🇷', percentage: 47 },
    { region: 'Canada', count: 28, amount: 14000, flag: '🇨🇦', percentage: 31 },
    { region: 'Antilles', count: 17, amount: 10000, flag: '🌴', percentage: 22 },
  ];

  const milestones = [
    { title: 'Financement initial sécurisé', date: 'Août 2026', status: 'completed' },
    { title: 'Bail commercial signé (1er site)', date: 'Oct 2026', status: 'in-progress' },
    { title: 'Équipement de cuisine & Setup', date: 'Nov 2026', status: 'upcoming' },
    { title: 'Inauguration officielle', date: 'Jan 2027', status: 'upcoming' },
  ];

  const fundingPercentage = Math.round((project.currentFunding / project.fundingGoal) * 100);

  // MODULE D'INVESTISSEMENT SUSPENDU EN ATTENTE D'AGRÉMENT RÉGLEMENTAIRE
  const handleInvestNow = () => {
    toast.info("Fonctionnalité en attente d'agrément", {
      description: "Le module d'investissement financier est temporairement désactivé en attendant les autorisations réglementaires nécessaires.",
    });
  };

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
          className="absolute top-12 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border-none cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#D4A373]/90 backdrop-blur-sm text-white text-xs rounded-full">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.location}
            </span>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">{project.name}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4">
            <p className="text-emerald-700 text-sm font-bold">{successMsg}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-[#0A847E] to-[#0D9488] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Financement atteint</p>
              <h2 className="text-white text-3xl font-black">{fundingPercentage}%</h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#D4A373]" />
            </div>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#D4A373] to-[#F59E0B] transition-all duration-500"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-bold">€{project.currentFunding.toLocaleString()}</span>
            <span className="text-white/80 font-medium">sur €{project.fundingGoal.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-md border border-[#E2E8F0]">
            <DollarSign className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
            <p className="text-[#0F172A] font-bold mb-1">{project.roi}</p>
            <p className="text-[#64748B] text-xs font-medium">ROI attendu</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md border border-[#E2E8F0]">
            <Users className="w-6 h-6 text-[#D4A373] mx-auto mb-2" />
            <p className="text-[#0F172A] font-bold mb-1">{project.backers}</p>
            <p className="text-[#64748B] text-xs font-medium">Investisseurs</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md border border-[#E2E8F0]">
            <TrendingUp className="w-6 h-6 text-[#475569] mx-auto mb-2" />
            <p className="text-[#0F172A] font-bold mb-1">€{project.minInvestment}</p>
            <p className="text-[#64748B] text-xs font-medium">Montant Min.</p>
          </div>
        </div>

        {/* DIASPORA SECTOR */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#0A847E]" />
            <h3 className="text-[#0F172A] font-bold">Co-investisseurs de la Diaspora</h3>
          </div>

          <div className="space-y-4">
            {diasporaBackers.map((region, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{region.flag}</span>
                    <div>
                      <p className="text-[#0F172A] text-sm font-bold">{region.region}</p>
                      <p className="text-[#64748B] text-xs font-medium">{region.count} membres</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0F172A] text-sm font-bold">€{region.amount.toLocaleString()}</p>
                    <p className="text-[#0D9488] text-xs font-bold">{region.percentage}%</p>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A847E] to-[#0D9488]"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] font-bold mb-3">À propos de ce projet</h3>
          <p className="text-[#64748B] text-sm leading-relaxed mb-4">{project.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm font-bold">
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-[#64748B] text-xs mb-1">Timeline</p>
              <p className="text-[#0F172A]">{project.timeline}</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-[#64748B] text-xs mb-1">Catégorie</p>
              <p className="text-[#0F172A]">{project.category}</p>
            </div>
          </div>
        </div>

        {/* MILESTONES */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0A847E]" />
            <h3 className="text-[#0F172A] font-bold">Jalons & Road-map</h3>
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
                        ? 'bg-[#FEF3C7] text-[#D4A373]'
                        : 'bg-[#F1F5F9] text-[#94A3B8]'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[#0F172A] text-sm font-bold mb-1">{milestone.title}</p>
                    <p className="text-[#64748B] text-xs font-medium">{milestone.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] font-bold mb-4">Porteur de Projet</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A847E] to-[#0D9488] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {project.leaderAvatar}
              </div>
              <div>
                <p className="text-[#0F172A] font-bold mb-1">{project.leaderName}</p>
                <p className="text-[#64748B] text-sm">Expert en Restauration & Hôtellerie</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < project.leaderRating
                          ? 'fill-[#D4A373] text-[#D4A373]'
                          : 'text-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0A847E] py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Consulter le pacte d'associés</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-[#0A847E] text-[#0A847E] py-4 rounded-xl font-bold bg-transparent cursor-pointer">
            Sauvegarder
          </button>
          <button
            onClick={handleInvestNow}
            className="bg-slate-200 text-slate-500 py-4 rounded-xl border border-slate-300 font-bold cursor-pointer transition-opacity active:opacity-80 flex items-center justify-center text-sm"
          >
            Bientôt disponible
          </button>
        </div>
      </div>
    </div>
  );
}