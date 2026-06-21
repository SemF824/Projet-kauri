import { ArrowLeft, Users, TrendingUp, Calendar, ChevronRight, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface Tontine {
  id: string;
  name: string;
  members: number;
  amount: number;
  nextPayment: string;
  progress: number;
  status: 'active' | 'your-turn' | 'waiting';
}

function LockedPubliqueButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = () => {
    setShowTooltip(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: `translateX(-50%) scale(${showTooltip ? 1 : 0.9})`,
          transformOrigin: 'bottom center',
          backgroundColor: '#1E293B',
          color: '#F1F5F9',
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1.4,
          padding: '8px 12px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          opacity: showTooltip ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          zIndex: 10,
        }}
      >
        🔒 Réservé aux Membres Émérites (Trust Score ≥ 85)
        {/* Arrow */}
        <span style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #1E293B',
        }} />
      </div>

      {/* Disabled button */}
      <button
        onClick={handlePress}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(232,196,71,0.18))',
          border: '1.5px solid rgba(212,175,55,0.30)',
          color: 'rgba(180,140,30,0.65)',
          cursor: 'not-allowed',
          boxShadow: 'none',
        }}
      >
        <Lock style={{ width: 15, height: 15 }} />
        <span className="text-sm">+ Publique</span>
      </button>
    </div>
  );
}

export function TontinesActivesScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [tontines] = useState<Tontine[]>([
    {
      id: '1',
      name: 'Cercle Familial',
      members: 8,
      amount: 500,
      nextPayment: '8 mai 2026',
      progress: 80,
      status: 'your-turn',
    },
    {
      id: '2',
      name: 'Cercle Entrepreneurial',
      members: 12,
      amount: 1000,
      nextPayment: '15 mai 2026',
      progress: 45,
      status: 'active',
    },
    {
      id: '3',
      name: 'Investissement Diaspora',
      members: 20,
      amount: 750,
      nextPayment: '22 mai 2026',
      progress: 30,
      status: 'active',
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'your-turn':
        return {
          text: "C'est votre tour !",
          className: 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white animate-pulse',
        };
      case 'active':
        return {
          text: 'Actif',
          className: 'bg-[#D1FAE5] text-[#006D77]',
        };
      default:
        return {
          text: 'En attente',
          className: 'bg-[#F1F5F9] text-[#64748B]',
        };
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#006D77] to-[#0D9488]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Tontines Actives</h1>
        <p className="text-white/90 text-sm">{tontines.length} tontine{tontines.length > 1 ? 's' : ''} en cours</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {tontines.map((tontine) => {
          const badge = getStatusBadge(tontine.status);
          return (
            <div
              key={tontine.id}
              onClick={() => navigate(`/kauri/tontine/${tontine.id}`)}
              className={`rounded-2xl p-5 shadow-lg border cursor-pointer transform transition-all hover:scale-[1.02] ${
                tontine.status === 'your-turn'
                  ? 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-[#D4AF37] shadow-[#D4AF37]/20'
                  : isDarkMode
                  ? 'bg-[#1E293B] border-[#334155]'
                  : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium text-lg ${isDarkMode && tontine.status !== 'your-turn' ? 'text-white' : 'text-[#0F172A]'}`}>
                  {tontine.name}
                </h3>
                <span className={`px-3 py-1 text-xs rounded-full ${badge.className}`}>
                  {badge.text}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Users className={`w-4 h-4 ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                    <p className={`text-xs ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Membres</p>
                  </div>
                  <p className={`text-sm font-medium ${isDarkMode && tontine.status !== 'your-turn' ? 'text-white' : 'text-[#0F172A]'}`}>
                    {tontine.members}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className={`w-4 h-4 ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                    <p className={`text-xs ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Montant</p>
                  </div>
                  <p className={`text-sm font-medium ${isDarkMode && tontine.status !== 'your-turn' ? 'text-white' : 'text-[#0F172A]'}`}>
                    {tontine.amount} €
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className={`w-4 h-4 ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                    <p className={`text-xs ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Prochain</p>
                  </div>
                  <p className={`text-xs font-medium ${isDarkMode && tontine.status !== 'your-turn' ? 'text-white' : 'text-[#0F172A]'}`}>
                    {tontine.nextPayment.split(' ')[0]} {tontine.nextPayment.split(' ')[1]}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs ${isDarkMode && tontine.status !== 'your-turn' ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Progression du cycle
                  </p>
                  <p className={`text-xs font-medium ${isDarkMode && tontine.status !== 'your-turn' ? 'text-white' : 'text-[#0F172A]'}`}>
                    {tontine.progress}%
                  </p>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  tontine.status === 'your-turn'
                    ? 'bg-[#D4AF37]/20'
                    : isDarkMode
                    ? 'bg-[#334155]'
                    : 'bg-[#F1F5F9]'
                }`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488]"
                    style={{ width: `${tontine.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className={`text-sm ${
                  tontine.status === 'your-turn'
                    ? 'text-[#D4AF37]'
                    : 'text-[#006D77]'
                }`}>
                  Voir détails
                </button>
                <ChevronRight className={`w-5 h-5 ${
                  tontine.status === 'your-turn'
                    ? 'text-[#D4AF37]'
                    : isDarkMode
                    ? 'text-[#94A3B8]'
                    : 'text-[#64748B]'
                }`} />
              </div>
            </div>
          );
        })}

        <button
          onClick={() => navigate('/kauri/rejoindre-tontine')}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          <span>Rejoindre une nouvelle tontine</span>
        </button>

        {/* Créer une tontine */}
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
            <span className="w-1 h-4 rounded-full bg-[#006D77] inline-block" />
            Créer une tontine
          </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* + Privée — actif */}
          <button
            onClick={() => navigate('/kauri/creer-tontine-privee')}
            className="flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg font-medium text-white bg-gradient-to-r from-[#006D77] to-[#0D9488] active:opacity-90 transition-opacity"
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm">+ Privée</span>
          </button>

          {/* + Publique — désactivé (Membre Émérite requis) */}
          <LockedPubliqueButton />
        </div>
        </div>
      </div>
    </div>
  );
}
