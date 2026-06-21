import { ArrowLeft, RefreshCcw, CheckCircle2, Clock, XCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Swap {
  id: string;
  tontineName: string;
  requester: string;
  acceptor: string;
  amount: number;
  reason: string;
  status: 'completed' | 'pending' | 'rejected';
  date: string;
  votes?: { for: number; against: number; required: number };
}

export function HistoriqueSwapsScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [swaps] = useState<Swap[]>([
    {
      id: '1',
      tontineName: 'Cercle Familial',
      requester: 'Vous',
      acceptor: 'Sophie L.',
      amount: 500,
      reason: 'Urgence médicale',
      status: 'completed',
      date: '15 avril 2026',
    },
    {
      id: '2',
      tontineName: 'Cercle Entrepreneurial',
      requester: 'Pierre D.',
      acceptor: 'Vous',
      amount: 1000,
      reason: 'Opportunité d\'investissement',
      status: 'pending',
      date: '8 mai 2026',
      votes: { for: 7, against: 2, required: 8 },
    },
    {
      id: '3',
      tontineName: 'Investissement Diaspora',
      requester: 'Marie C.',
      acceptor: 'Jean B.',
      amount: 750,
      reason: 'Dépenses imprévues',
      status: 'rejected',
      date: '1 mai 2026',
      votes: { for: 4, against: 12, required: 10 },
    },
    {
      id: '4',
      tontineName: 'Cercle Familial',
      requester: 'Thomas K.',
      acceptor: 'Vous',
      amount: 500,
      reason: 'Réparation urgente',
      status: 'completed',
      date: '10 mars 2026',
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Validé',
          className: 'bg-[#D1FAE5] text-[#006D77]',
          iconColor: 'text-[#006D77]',
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'En cours',
          className: 'bg-[#FEF3C7] text-[#D4AF37]',
          iconColor: 'text-[#D4AF37]',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Refusé',
          className: 'bg-[#FECACA] text-[#B05B3B]',
          iconColor: 'text-[#B05B3B]',
        };
      default:
        return {
          icon: Clock,
          text: 'Inconnu',
          className: 'bg-[#F1F5F9] text-[#64748B]',
          iconColor: 'text-[#64748B]',
        };
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Historique des Swaps</h1>
        <p className="text-white/90 text-sm">{swaps.length} échange{swaps.length > 1 ? 's' : ''} de tour</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {swaps.map((swap) => {
          const badge = getStatusBadge(swap.status);
          const Icon = badge.icon;

          return (
            <div
              key={swap.id}
              className={`rounded-2xl p-5 shadow-md border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {swap.tontineName}
                </h4>
                <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${badge.className}`}>
                  <Icon className="w-3 h-3" />
                  {badge.text}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Demandeur</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{swap.requester}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-2">
                  <RefreshCcw className={`w-5 h-5 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Accepteur</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{swap.acceptor}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-3 mb-3 ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'}`}>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Motif</p>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{swap.reason}</p>
              </div>

              {swap.votes && swap.status === 'pending' && (
                <div className={`rounded-xl p-3 mb-3 border ${isDarkMode ? 'bg-[#334155]/50 border-[#475569]' : 'bg-[#FEF3C7]/30 border-[#D4AF37]/30'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Votes</p>
                    <p className={`text-xs ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                      {swap.votes.for + swap.votes.against} / {swap.votes.required}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#475569]' : 'bg-[#E2E8F0]'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488]"
                          style={{ width: `${(swap.votes.for / swap.votes.required) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-[#006D77]">{swap.votes.for} Pour</span>
                    <span className="text-xs text-[#B05B3B]">{swap.votes.against} Contre</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                  {swap.amount.toLocaleString()} €
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{swap.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
