import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Investment {
  id: string;
  projectName: string;
  amount: number;
  currentValue: number;
  roi: number;
  status: 'growing' | 'stable' | 'declining';
  investmentDate: string;
  category: string;
}

export function MesInvestissementsScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [investments] = useState<Investment[]>([
    {
      id: '1',
      projectName: 'Lolo Moderne',
      amount: 2500,
      currentValue: 2800,
      roi: 12,
      status: 'growing',
      investmentDate: '15 mars 2026',
      category: 'Restaurant',
    },
    {
      id: '2',
      projectName: 'Coopérative Agricole',
      amount: 1500,
      currentValue: 1650,
      roi: 10,
      status: 'growing',
      investmentDate: '1 avril 2026',
      category: 'Agriculture',
    },
    {
      id: '3',
      projectName: 'Tech Innovation Hub',
      amount: 3000,
      currentValue: 2940,
      roi: -2,
      status: 'declining',
      investmentDate: '20 avril 2026',
      category: 'Technologie',
    },
  ]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalRoi = ((totalCurrentValue - totalInvested) / totalInvested) * 100;

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#D4AF37] to-[#F59E0B]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Mes Investissements</h1>
        <p className="text-white/90 text-sm">Portfolio & rendements</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
          <h3 className={`text-sm mb-4 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Vue d'ensemble</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Investi total</p>
              <p className={`text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                {totalInvested.toLocaleString()} €
              </p>
            </div>
            <div>
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Valeur actuelle</p>
              <p className={`text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                {totalCurrentValue.toLocaleString()} €
              </p>
            </div>
          </div>

          <div className={`rounded-xl p-4 ${
            totalRoi >= 0
              ? 'bg-[#D1FAE5] border border-[#006D77]/30'
              : 'bg-[#FECACA] border border-[#B05B3B]/30'
          }`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${totalRoi >= 0 ? 'text-[#006D77]' : 'text-[#B05B3B]'}`}>
                ROI Global
              </p>
              <div className="flex items-center gap-2">
                {totalRoi >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-[#006D77]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#B05B3B]" />
                )}
                <p className={`text-2xl font-bold ${totalRoi >= 0 ? 'text-[#006D77]' : 'text-[#B05B3B]'}`}>
                  {totalRoi >= 0 ? '+' : ''}{totalRoi.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Projets investis</h3>
          <div className="space-y-3">
            {investments.map((investment) => (
              <div
                key={investment.id}
                onClick={() => navigate(`/kauri/investment/${investment.id}`)}
                className={`rounded-2xl p-5 shadow-md border cursor-pointer transform transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                      {investment.projectName}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                      {investment.category}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    investment.roi >= 0
                      ? 'bg-[#D1FAE5] text-[#006D77]'
                      : 'bg-[#FECACA] text-[#B05B3B]'
                  }`}>
                    {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Investi</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                      {investment.amount.toLocaleString()} €
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Valeur</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                      {investment.currentValue.toLocaleString()} €
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Gain</p>
                    <p className={`text-sm font-medium ${
                      investment.roi >= 0
                        ? 'text-[#006D77]'
                        : 'text-[#B05B3B]'
                    }`}>
                      {investment.roi >= 0 ? '+' : ''}
                      {investment.currentValue - investment.amount} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                      {investment.investmentDate}
                    </p>
                  </div>
                  <ChevronRight className={isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
          <DollarSign className="w-5 h-5" />
          <span>Découvrir de nouveaux projets</span>
        </button>
      </div>
    </div>
  );
}
