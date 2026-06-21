import { ArrowLeft, AlertCircle, RefreshCcw, ThumbsUp, ThumbsDown, Users, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export function EmergencySwapScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [reason, setReason] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const members = [
    { id: '1', name: 'Marie C.', avatar: 'MC', turnDate: '15 juin 2026' },
    { id: '2', name: 'Pierre D.', avatar: 'PD', turnDate: '22 juin 2026' },
    { id: '3', name: 'Sophie L.', avatar: 'SL', turnDate: '29 juin 2026' },
  ];

  const [votes] = useState({
    for: 5,
    against: 1,
    required: 6,
    members: [
      { name: 'Thomas K.', vote: 'for', time: 'Il y a 2h' },
      { name: 'Marie C.', vote: 'for', time: 'Il y a 3h' },
      { name: 'Sophie L.', vote: 'for', time: 'Il y a 5h' },
      { name: 'Jean B.', vote: 'for', time: 'Il y a 1 jour' },
      { name: 'Claire R.', vote: 'for', time: 'Il y a 1 jour' },
      { name: 'Luc M.', vote: 'against', time: 'Il y a 1 jour' },
    ],
  });

  const handleSubmitSwap = () => {
    if (reason && selectedMember) {
      setHasSubmitted(true);
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <RefreshCcw className="w-8 h-8 text-white" />
          <h1 className="text-white text-2xl">Échange d'urgence</h1>
        </div>
        <p className="text-white/90 text-sm">Demande de swap avec vote multi-signatures</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {!hasSubmitted ? (
          <>
            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#B05B3B]/10 border-[#B05B3B]/30' : 'bg-[#FEF3C7] border-[#D4AF37]/30'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-[#F59E0B]' : 'text-[#D4AF37]'}`} />
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-[#FDE68A]' : 'text-[#92400E]'}`}>
                    Importante : Vote requis
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#FEF3C7]' : 'text-[#92400E]'}`}>
                    Cette demande nécessitera l'approbation de 6 membres minimum du cercle avant validation.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Détails du swap</h3>

              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Tontine
                </label>
                <div className={`py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'}`}>
                  Cercle Familial • 500,00 € • Votre tour : 8 mai 2026
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Échanger avec
                </label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member.id)}
                      className={`w-full rounded-xl p-4 flex items-center justify-between border transition-all ${
                        selectedMember === member.id
                          ? 'bg-gradient-to-r from-[#006D77]/10 to-[#0D9488]/10 border-[#006D77]'
                          : isDarkMode
                          ? 'bg-[#334155] border-[#475569]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white text-sm">
                          {member.avatar}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{member.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Tour : {member.turnDate}</p>
                        </div>
                      </div>
                      {selectedMember === member.id && (
                        <div className="w-5 h-5 rounded-full bg-[#006D77] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Motif d'urgence <span className="text-[#B05B3B]">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous avez besoin d'échanger votre tour..."
                  rows={4}
                  className={`w-full py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'} focus:outline-none focus:border-[#006D77] resize-none`}
                ></textarea>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                  {reason.length} / 500 caractères
                </p>
              </div>

              <button
                onClick={handleSubmitSwap}
                disabled={!reason || !selectedMember}
                className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                  reason && selectedMember
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white'
                    : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>Soumettre au vote</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Vote en cours</h3>

              <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-[#FEF3C7]/10 border border-[#D4AF37]/30' : 'bg-[#FEF3C7] border border-[#D4AF37]/30'}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-sm ${isDarkMode ? 'text-[#FDE68A]' : 'text-[#92400E]'}`}>Progression</p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                    {votes.for + votes.against} / {votes.required} votes
                  </p>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#475569]' : 'bg-[#E2E8F0]'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#006D77] to-[#0D9488]"
                    style={{ width: `${((votes.for + votes.against) / votes.required) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#006D77]/10 border-[#006D77]/30' : 'bg-[#D1FAE5] border-[#006D77]/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsUp className="w-4 h-4 text-[#006D77]" />
                    <p className="text-xs text-[#006D77]">Pour</p>
                  </div>
                  <p className="text-2xl font-bold text-[#006D77]">{votes.for}</p>
                </div>

                <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#B05B3B]/10 border-[#B05B3B]/30' : 'bg-[#FECACA] border-[#B05B3B]/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsDown className="w-4 h-4 text-[#B05B3B]" />
                    <p className="text-xs text-[#B05B3B]">Contre</p>
                  </div>
                  <p className="text-2xl font-bold text-[#B05B3B]">{votes.against}</p>
                </div>
              </div>

              <div>
                <h4 className={`text-sm mb-3 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Membres ayant voté</h4>
                <div className="space-y-2">
                  {votes.members.map((member, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          member.vote === 'for'
                            ? 'bg-[#D1FAE5]'
                            : 'bg-[#FECACA]'
                        }`}>
                          {member.vote === 'for' ? (
                            <ThumbsUp className="w-4 h-4 text-[#006D77]" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-[#B05B3B]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{member.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{member.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#006D77]/10 border border-[#006D77]/30' : 'bg-[#E0F2FE] border border-[#006D77]/30'}`}>
              <p className={`text-xs ${isDarkMode ? 'text-[#A7F3D0]' : 'text-[#075985]'}`}>
                ✓ Encore 1 vote nécessaire pour valider votre demande de swap.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
