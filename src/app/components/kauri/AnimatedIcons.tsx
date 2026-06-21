import { User, ArrowRight, Sparkles } from 'lucide-react';

export function YourTurnIcon() {
  return (
    <div className="relative inline-block">
      {/* Halo pulsant */}
      <div className="absolute inset-0 -m-4">
        <div className="w-full h-full rounded-full bg-[#D4AF37] opacity-30 animate-ping"></div>
      </div>
      <div className="absolute inset-0 -m-2">
        <div className="w-full h-full rounded-full bg-[#D4AF37] opacity-50 animate-pulse"></div>
      </div>

      {/* Avatar */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center shadow-2xl border-4 border-white">
        <User className="w-8 h-8 text-white" />
      </div>

      {/* Badge "C'est votre tour" */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-[#D4AF37] text-white text-xs rounded-full shadow-lg animate-bounce">
        C'est votre tour !
      </div>
    </div>
  );
}

export function SwipeTransferIcon() {
  return (
    <div className="relative w-full h-24 bg-gradient-to-r from-[#006D77]/10 to-[#0D9488]/10 rounded-2xl overflow-hidden border border-[#006D77]/30">
      {/* Flèche glissante */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-slideRight">
          <ArrowRight className="w-12 h-12 text-[#006D77]" />
        </div>
      </div>

      {/* Effet de traînée */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#006D77]/20 to-transparent animate-shimmer"></div>

      {/* Labels */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-[#006D77] flex items-center justify-center shadow-lg">
          <span className="text-xs text-[#006D77]">Vous</span>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-[#006D77] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg">
          <span className="text-xs text-white">M.L</span>
        </div>
      </div>
    </div>
  );
}

export function TontineEndIcon() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Confetti animés */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `50%`,
            top: `50%`,
            animationDelay: `${i * 0.05}s`,
            '--angle': `${(i * 360) / 30}deg`,
            '--distance': `${60 + Math.random() * 40}px`,
          } as any}
        >
          <div
            className={`w-2 h-2 rounded-full`}
            style={{
              backgroundColor: ['#D4AF37', '#B05B3B', '#D4AF37', '#B05B3B'][
                i % 4
              ],
            }}
          ></div>
        </div>
      ))}

      {/* Coquillage doré central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] flex items-center justify-center shadow-2xl animate-bounce">
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-white animate-spin-slow">
            <path
              d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Effet d'éclat */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-32 h-32 text-[#D4AF37] animate-pulse opacity-50" />
      </div>
    </div>
  );
}

export function RecurrenceSelector() {
  const options = ['1x', '2x', '3x', 'Personnalisé'];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
      <h3 className="text-[#0F172A] mb-4">Répétition de la Tontine</h3>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {options.map((option, index) => (
          <button
            key={option}
            className={`py-3 px-4 rounded-xl border-2 transition-all ${
              index === 0
                ? 'bg-[#006D77] border-[#006D77] text-white'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#006D77]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
        <p className="text-[#0369A1] text-sm">
          <strong>Sélectionné :</strong> La tontine se répétera 1 fois (cycle unique)
        </p>
      </div>
    </div>
  );
}
