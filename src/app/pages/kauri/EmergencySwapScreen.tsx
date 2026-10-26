import { ArrowLeft, AlertCircle, RefreshCcw, ThumbsUp, ThumbsDown, Users, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

interface TontineOption {
  id: string;
  name: string;
  monthly_amount: number;
  original_turn: number;
}

interface MemberOption {
  id: string;
  name: string;
  avatar: string;
  turn_position: number;
}

export function EmergencySwapScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  const [tontines, setTontines] = useState<TontineOption[]>([]);
  const [selectedTontineId, setSelectedTontineId] = useState<string>('');
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeSwap, setActiveSwap] = useState<any>(null);

  const [votes, setVotes] = useState({
    for: 0,
    against: 0,
    required: 3, // Exemple de quorum minimal
    members: [] as any[],
  });

  // 1. Charger les tontines actives de l'utilisateur
  useEffect(() => {
    const loadUserTontines = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();

        // On récupère toutes les tontines dont l'utilisateur est membre
        const { data, error } = await supabase
          .from('tontine_members')
          .select(`
            turn_position,
            tontines ( id, name, monthly_amount )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const list: TontineOption[] = data
            .filter((item: any) => item.tontines !== null)
            .map((item: any) => ({
              id: item.tontines.id,
              name: item.tontines.name,
              monthly_amount: item.tontines.monthly_amount,
              original_turn: item.turn_position,
            }));

          setTontines(list);
          if (list.length > 0) {
            setSelectedTontineId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur de chargement des tontines:', err);
      }
    };

    loadUserTontines();
  }, [user]);

  // 2. Charger les co-membres de la tontine sélectionnée
  useEffect(() => {
    if (!selectedTontineId || !user) return;

    const loadTontineMembers = async () => {
      try {
        const supabase = getSupabase();

        const { data, error } = await supabase
          .from('tontine_members')
          .select(`
            turn_position,
            user_id,
            profiles ( id, first_name, last_name )
          `)
          .eq('tontine_id', selectedTontineId)
          .neq('user_id', user.id); // Exclure l'utilisateur courant

        if (error) throw error;

        if (data) {
          const mapped: MemberOption[] = data.map((item: any) => {
            const firstName = item.profiles?.first_name || 'Inconnu';
            const lastName = item.profiles?.last_name || '';
            const initials = `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
            return {
              id: item.user_id,
              name: `${firstName} ${lastName}`.trim(),
              avatar: initials || 'U',
              turn_position: item.turn_position,
            };
          });

          setMembers(mapped);
          if (mapped.length > 0) {
            setSelectedMember(mapped[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur de chargement des membres:', err);
      }
    };

    loadTontineMembers();
  }, [selectedTontineId, user]);

  // 3. Soumettre le swap à Supabase
  const handleSubmitSwap = async () => {
    if (!selectedTontineId || !selectedMember || !reason || !user) return;

    setIsSubmitting(true);
    try {
      const supabase = getSupabase();

      // Trouver le tour d'origine de l'utilisateur
      const myTontineMeta = tontines.find((t) => t.id === selectedTontineId);
      const targetMemberMeta = members.find((m) => m.id === selectedMember);

      if (!myTontineMeta || !targetMemberMeta) return;

      const { data: newSwap, error } = await supabase
        .from('tontine_swaps')
        .insert({
          tontine_id: selectedTontineId,
          requester_id: user.id,
          target_id: selectedMember,
          original_turn: myTontineMeta.original_turn,
          requested_turn: targetMemberMeta.turn_position,
          reason,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSwap(newSwap);
      setHasSubmitted(true);

      // Simulation initiale d'un vote automatique pour illustrer
      setVotes({
        for: 1,
        against: 0,
        required: 3,
        members: [{ name: 'Thomas K.', vote: 'for', time: 'À l\'instant' }],
      });
    } catch (err) {
      console.error('Erreur lors de la création du swap:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTontineMeta = tontines.find((t) => t.id === selectedTontineId);

  return (
    <div className={`min-h-screen pb-24 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0]'}`}>
      <div className={`px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-[#1E293B] to-[#334155]' : 'bg-gradient-to-br from-[#0A847E] to-[#0D9488]'}`}>
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <RefreshCcw className="w-8 h-8 text-white" />
          <h1 className="text-white text-2xl font-black">Échange de Tour</h1>
        </div>
        <p className="text-white/90 text-sm">Demande de swap sécurisée en base de données</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {!hasSubmitted ? (
          <>
            <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#B05B3B]/10 border-[#B05B3B]/30' : 'bg-[#FEF3C7] border-[#D4AF37]/30'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#0A847E]" />
                <div>
                  <p className={`text-xs font-bold mb-1 ${isDarkMode ? 'text-[#FDE68A]' : 'text-[#0A847E]'}`}>
                    Vote requis du cercle
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-[#FEF3C7]' : 'text-slate-600'}`}>
                    Votre demande de swap sera stockée de manière immuable. Les co-membres du cercle voteront pour valider l'échange.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Détails du swap</h3>

              {/* Sélection de la tontine */}
              <div className="mb-4">
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Choisir la Tontine
                </label>
                <select
                  value={selectedTontineId}
                  onChange={(e) => setSelectedTontineId(e.target.value)}
                  className={`w-full py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'}`}
                >
                  {tontines.length === 0 ? (
                    <option value="">Aucune tontine active trouvée</option>
                  ) : (
                    tontines.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Cotisation: {t.monthly_amount} €)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Échanger avec */}
              {selectedTontineId && (
                <div className="mb-4">
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    Échanger mon tour avec
                  </label>
                  <div className="space-y-2">
                    {members.length === 0 ? (
                      <p className="text-xs text-slate-400">Aucun autre participant trouvé pour ce cercle.</p>
                    ) : (
                      members.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedMember(member.id)}
                          className={`w-full rounded-xl p-4 flex items-center justify-between border cursor-pointer transition-all ${
                            selectedMember === member.id
                              ? 'bg-[#0A847E]/10 border-[#0A847E]'
                              : isDarkMode
                              ? 'bg-[#334155] border-[#475569]'
                              : 'bg-[#F8FAFC] border-[#E2E8F0]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A847E] to-[#0D9488] flex items-center justify-center text-white text-sm font-bold">
                              {member.avatar}
                            </div>
                            <div className="text-left">
                              <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{member.name}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>Rang/Position : {member.turn_position}</p>
                            </div>
                          </div>
                          {selectedMember === member.id && (
                            <div className="w-5 h-5 rounded-full bg-[#0A847E] flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Motif d'urgence <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous avez besoin d'échanger votre tour..."
                  rows={4}
                  className={`w-full py-3 px-4 rounded-xl border ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white placeholder-[#64748B]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8]'} focus:outline-none focus:border-[#0A847E] resize-none`}
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSubmitSwap}
                disabled={!reason || !selectedMember || isSubmitting}
                className={`w-full py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 border-none font-bold transition-all cursor-pointer ${
                  reason && selectedMember && !isSubmitting
                    ? 'bg-gradient-to-r from-[#0A847E] to-[#0D9488] text-white'
                    : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Soumettre le swap</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`rounded-2xl p-6 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}>
              <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>Vote en cours</h3>

              <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-[#FEF3C7]/10 border border-[#D4AF37]/30' : 'bg-[#FEF3C7] border border-[#D4AF37]/30'}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#0A847E]">Progression</p>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
                    {votes.for + votes.against} / {votes.required} votes
                  </p>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#475569]' : 'bg-[#E2E8F0]'}`}>
                  <div
                    className="h-full bg-[#0A847E]"
                    style={{ width: `${((votes.for + votes.against) / votes.required) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-4 border bg-emerald-50 border-emerald-300">
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-600">Pour</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{votes.for}</p>
                </div>

                <div className="rounded-xl p-4 border bg-rose-50 border-rose-300">
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsDown className="w-4 h-4 text-rose-600" />
                    <p className="text-xs font-bold text-rose-600">Contre</p>
                  </div>
                  <p className="text-2xl font-bold text-rose-600">{votes.against}</p>
                </div>
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Membres ayant voté</h4>
                <div className="space-y-2">
                  {votes.members.map((member, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-[#334155]' : 'bg-[#F8FAFC]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          member.vote === 'for'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-rose-100 text-rose-600'
                        }`}>
                          {member.vote === 'for' ? (
                            <ThumbsUp className="w-4 h-4" />
                          ) : (
                            <ThumbsDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{member.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{member.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#0a5c7a]/10 border border-[#0a5c7a]/30' : 'bg-emerald-50 border border-emerald-200'}`}>
              <p className="text-xs font-bold text-emerald-600">
                ✓ Votre demande de swap est en cours de traitement. Elle passera en statut 'approuvé' dès l'atteinte du quorum.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmergencySwapScreen;