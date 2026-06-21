import { ArrowLeft, Plus, Trophy, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export function PotCommunScreen() {
  const navigate = useNavigate();
  const [currentAmount, setCurrentAmount] = useState(45000);
  const [targetAmount, setTargetAmount] = useState(100000);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fallingShells, setFallingShells] = useState<number[]>([]);

  const percentage = Math.round((currentAmount / targetAmount) * 100);

  const tiers = [
    { level: 30, label: 'Palier Bronze', reached: percentage >= 30, color: '#CD7F32' },
    { level: 60, label: 'Palier Argent', reached: percentage >= 60, color: '#C0C0C0' },
    { level: 100, label: 'Palier Or', reached: percentage >= 100, color: '#D4AF37' },
  ];

  useEffect(() => {
    if (percentage >= 100 && !showSuccess) {
      setShowSuccess(true);
      // Déclencher animation de coquillages
      const shells = Array.from({ length: 20 }, (_, i) => i);
      setFallingShells(shells);
      setTimeout(() => setFallingShells([]), 3000);
    }
  }, [percentage, showSuccess]);

  const Shell = ({ delay }: { delay: number }) => (
    <div
      className="absolute animate-fall"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay * 0.1}s`,
        top: '-20px',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#D4AF37]">
        <path
          d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F9F9] to-[#E2E8F0] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-white text-2xl mb-2">Pot Commun</h1>
          <p className="text-white/90 text-sm">Restaurant Lolo Moderne</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/90 text-sm">Objectif Actuel</span>
            <span className="text-white text-lg">{targetAmount.toLocaleString()} €</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/90">Levé</span>
            <span className="text-white">{currentAmount.toLocaleString()} € ({percentage}%)</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pot Commun Visuel avec Coquillages */}
        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#E2E8F0] overflow-hidden">
            <h3 className="text-[#0F172A] text-center mb-6 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              Pot Commun Visuel
            </h3>

            {/* Conteneur transparent du pot */}
            <div className="relative h-96 mx-auto max-w-xs">
              {/* Bordures du pot */}
              <div className="absolute inset-0 border-4 border-[#006D77] rounded-3xl bg-gradient-to-b from-transparent to-[#006D77]/5 shadow-lg"></div>

              {/* Niveau de remplissage avec dégradé */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#006D77] via-[#0D9488] to-[#14B8A6] rounded-b-3xl transition-all duration-1000 ease-out overflow-hidden"
                style={{ height: `${percentage > 100 ? 100 : percentage}%` }}
              >
                {/* Effet de vagues */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-white/10 animate-pulse"></div>

                {/* Coquillages flottants dans le pot */}
                {Array.from({ length: Math.floor(percentage / 10) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-float"
                    style={{
                      left: `${(i * 25) % 90}%`,
                      bottom: `${(i * 15) % 80}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#D4AF37]">
                      <path
                        d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Indicateurs de paliers */}
              {tiers.map((tier) => (
                <div
                  key={tier.level}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ bottom: `${tier.level}%` }}
                >
                  <div className="flex-1 h-0.5 bg-[#E2E8F0]"></div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs mx-2 transition-all ${
                      tier.reached
                        ? 'bg-[#D4AF37] text-white shadow-lg scale-110'
                        : 'bg-white border border-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {tier.label}
                  </div>
                  <div className="flex-1 h-0.5 bg-[#E2E8F0]"></div>
                </div>
              ))}

              {/* Coquillages qui tombent */}
              {fallingShells.map((shell) => (
                <Shell key={shell} delay={shell} />
              ))}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#006D77]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#006D77]" />
                </div>
                <p className="text-sm text-[#0F172A]">87</p>
                <p className="text-xs text-[#64748B]">Contributeurs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-sm text-[#0F172A]">{percentage}%</p>
                <p className="text-xs text-[#64748B]">Complété</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#0D9488]/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#0D9488]" />
                </div>
                <p className="text-sm text-[#0F172A]">
                  {tiers.filter((t) => t.reached).length}/3
                </p>
                <p className="text-xs text-[#64748B]">Paliers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton Augmenter les Paliers */}
        <button className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Augmenter les Paliers</span>
        </button>
      </div>

      {/* Notification de Réussite */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm shadow-2xl animate-scaleIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-[#0F172A] text-2xl text-center mb-3">Félicitations ! 🎉</h3>
            <p className="text-[#64748B] text-center mb-6">
              L'objectif de 100% a été atteint ! Le pot commun est complet.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fall { animation: fall 3s ease-in forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
