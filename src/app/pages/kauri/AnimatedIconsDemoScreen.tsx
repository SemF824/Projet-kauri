import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  YourTurnIcon,
  SwipeTransferIcon,
  TontineEndIcon,
  RecurrenceSelector,
} from '../../components/kauri/AnimatedIcons';

export function AnimatedIconsDemoScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Icônes Animées</h1>
        <p className="text-[#E0F2FE] text-sm">Démonstration des animations KAURI</p>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* C'est votre tour */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-6 text-center">C'est votre tour</h3>
          <div className="flex justify-center">
            <YourTurnIcon />
          </div>
        </div>

        {/* Swipe de transfert */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4 text-center">Swipe de transfert</h3>
          <SwipeTransferIcon />
        </div>

        {/* Fin de Tontine */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-6 text-center">Fin de Tontine</h3>
          <TontineEndIcon />
        </div>

        {/* Sélecteur de récurrence */}
        <RecurrenceSelector />
      </div>

      <style>{`
        @keyframes slideRight {
          0%, 100% { transform: translateX(-100px); opacity: 0; }
          20%, 80% { opacity: 1; }
          50% { transform: translateX(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(720deg) translateY(var(--distance));
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-slideRight { animation: slideRight 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-confetti {
          animation: confetti 1.5s ease-out forwards;
          transform-origin: center;
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}
