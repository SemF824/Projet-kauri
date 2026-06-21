import { ArrowLeft, TrendingUp, Wallet, Users, Compass, Crown, Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface RWAProject {
  id: string;
  title: string;
  category: string;
  location: string;
  grossReturn: number;
  netReturn: number;
  fundingProgress: number;
  currentAmount: number;
  targetAmount: number;
  minInvestment: number;
  imageGradient: string;
}

export function InvestmentHubScreen() {
  const navigate = useNavigate();
  const availableBalance = 140;
  const bonusAmount = 40;

  const projects: RWAProject[] = [
    {
      id: '1',
      title: 'Modernisation Exploitation Bananière',
      category: 'Agriculture Durable',
      location: 'Antilles',
      grossReturn: 9,
      netReturn: 8,
      fundingProgress: 75,
      currentAmount: 37500,
      targetAmount: 50000,
      minInvestment: 10,
      imageGradient: 'from-green-600/80 to-emerald-900/80',
    },
    {
      id: '2',
      title: 'Commerce de Proximité Bio',
      category: 'Commerce Local',
      location: 'Martinique',
      grossReturn: 7.5,
      netReturn: 6.5,
      fundingProgress: 42,
      currentAmount: 21000,
      targetAmount: 50000,
      minInvestment: 10,
      imageGradient: 'from-orange-600/80 to-red-900/80',
    },
  ];

  return (
    <div className="flex justify-center items-stretch min-h-screen bg-[#D6D6D6]">
      <div className="w-full max-w-[430px] h-screen flex flex-col overflow-hidden shadow-2xl bg-[#F9F9F9]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/kauri/normal-dashboard')} className="text-white flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white mb-2">Investir au Pays</h1>
            <p className="text-sm text-white/80 leading-relaxed">
              Fractionnez vos investissements dans l'économie réelle à partir de 10 €
            </p>
          </div>

          {/* Widget Solde Disponible */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl p-5 border-2 border-white/30 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90 text-sm">Solde disponible</p>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">{availableBalance.toFixed(2)} €</h2>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <p className="text-white text-xs font-medium">
                  +{bonusAmount} € bonus d'assiduité
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Projets RWA */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 pb-24">
          <div>
            <h3 className="text-[#0F172A] font-bold text-base mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#D4AF37] rounded-full"></div>
              Projets en Financement
            </h3>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Image Header avec Gradient Overlay */}
                  <div className={`relative h-48 bg-gradient-to-br ${project.imageGradient} flex items-end p-5`}>
                    {/* Pattern overlay pour simuler une image */}
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    }}></div>

                    <div className="relative z-10 w-full">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white/90 text-xs mb-1">{project.category}</p>
                          <h3 className="text-white font-bold text-lg leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-white/80 text-sm mt-1">{project.location}</p>
                        </div>

                        {/* Badge Rendement */}
                        <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg border border-white/30 ml-3">
                          <p className="text-white text-xs font-bold leading-none mb-0.5">
                            {project.grossReturn}% Brut
                          </p>
                          <p className="text-white/90 text-[10px] leading-none">
                            {project.netReturn}% Net
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Barre de Progression */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#64748B]">Progression</p>
                        <p className="text-sm font-bold text-[#006D77]">{project.fundingProgress}%</p>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488] rounded-full transition-all duration-500"
                          style={{ width: `${project.fundingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-2">
                        {project.currentAmount.toLocaleString('fr-FR')} € / {project.targetAmount.toLocaleString('fr-FR')} €
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B05B3B] to-[#DC2626] hover:from-[#8F4830] hover:to-[#B91C1C] text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Acheter des Tokens (Dès {project.minInvestment}€)
                    </button>

                    <p className="text-center text-xs text-[#94A3B8] mt-3">
                      Investissement minimum : {project.minInvestment} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-[#F0FDFA] to-[#E0F2FE] rounded-2xl p-4 border border-[#006D77]/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#006D77]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#006D77]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#006D77] text-sm mb-1">
                  Investissement Responsable
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Tous nos projets sont vérifiés et soutiennent l'économie locale. Vos tokens représentent une part réelle des actifs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto shadow-lg">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigate('/kauri/normal-dashboard')}
              className="flex flex-col items-center gap-1"
            >
              <Wallet className="w-6 h-6 text-[#006D77]" />
              <span className="text-xs text-[#006D77] font-medium">FinTech</span>
            </button>
            <button
              onClick={() => navigate('/kauri/social-hub-gateway')}
              className="flex flex-col items-center gap-1"
            >
              <Heart className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-xs text-[#94A3B8]">Social</span>
            </button>
            <button
              onClick={() => navigate('/kauri/profil-particulier')}
              className="flex flex-col items-center gap-1"
            >
              <User className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-xs text-[#94A3B8]">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
