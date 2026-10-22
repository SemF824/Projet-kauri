import {
  ArrowLeft,
  RefreshCcw,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  Plus,
  Loader2,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabase } from '../../utils/supabase';
import { toast } from 'sonner';

interface SwapItem {
  id: string;
  requester_id: string;
  requester_name: string;
  avatar: string;
  trust_score: number;
  original_turn: number;
  requested_turn: number;
  reason: string;
  urgency: 'high' | 'medium';
  tontine_name: string;
  pot_amount: number;
  created_at: string;
  status: string;
}

export function SwapMarketplaceScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const supabase = getSupabase();

  const [swaps, setSwaps] = useState<SwapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Charger les demandes de swap réelles depuis Supabase
  const fetchSwaps = async () => {
    setLoading(true);
    try {
      // 1. Récupérer les swaps en attente depuis la table PostgreSQL tontine_swaps
      const { data: dbSwaps, error: swapsErr } = await (supabase as any)
        .from('tontine_swaps')
        .select(`
          id,
          requester_id,
          target_id,
          original_turn,
          requested_turn,
          reason,
          status,
          created_at,
          tontine_id
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (swapsErr) throw swapsErr;

      if (dbSwaps && dbSwaps.length > 0) {
        // Enrichir avec les profils et les noms de tontine
        const enriched: SwapItem[] = await Promise.all(
          dbSwaps.map(async (s: any) => {
            const [profileRes, tontineRes] = await Promise.all([
              supabase.from('profiles').select('full_name, first_name, last_name, trust_score').eq('id', s.requester_id).maybeSingle(),
              supabase.from('tontines').select('name, contribution_amount, max_members').eq('id', s.tontine_id).maybeSingle(),
            ]);

            const pData = profileRes.data;
            const tData = tontineRes.data;
            const name = pData?.full_name || `${pData?.first_name || ''} ${pData?.last_name || ''}`.trim() || 'Membre KAUREE';
            const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'MK';

            return {
              id: s.id,
              requester_id: s.requester_id,
              requester_name: name,
              avatar: initials,
              trust_score: Math.min(5, Math.max(1, Math.round((Number(pData?.trust_score) || 40) / 20))),
              original_turn: s.original_turn,
              requested_turn: s.requested_turn,
              reason: s.reason || "Échange de tour d'urgence",
              urgency: s.reason?.toLowerCase().includes('urgence') || s.reason?.toLowerCase().includes('santé') ? 'high' : 'medium',
              tontine_name: tData?.name || 'Tontine Solidaire',
              pot_amount: (tData?.contribution_amount || 200) * (tData?.max_members || 10),
              created_at: new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
              status: s.status,
            };
          })
        );
        setSwaps(enriched);
      } else {
        // S'il n'y a pas encore de demandes en base, initialiser avec des exemples dynamiques
        setSwaps([]);
      }
    } catch (err: any) {
      console.error('Erreur chargement swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  // Accepter un swap (Mise à jour en base de données)
  const handleAgreeSwap = async (swap: SwapItem) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour accepter un échange.');
      return;
    }
    if (swap.requester_id === user.id) {
      toast.info('Vous ne pouvez pas accepter votre propre demande de swap.');
      return;
    }

    setProcessingId(swap.id);
    try {
      const { error } = await (supabase as any)
        .from('tontine_swaps')
        .update({
          status: 'approved',
          target_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', swap.id);

      if (error) throw error;

      toast.success(`Échange accepté avec ${swap.requester_name} !`, {
        description: `Les tours de rotation de la tontine "${swap.tontine_name}" ont été mis à jour.`,
      });

      // Mettre à jour l'affichage
      setSwaps((prev) => prev.filter((s) => s.id !== swap.id));
    } catch (err: any) {
      console.error('Erreur validation swap:', err);
      toast.error("Impossible de valider l'échange.");
    } finally {
      setProcessingId(null);
    }
  };

  const displayedSwaps = filterUrgent ? swaps.filter((s) => s.urgency === 'high') : swaps;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Swap Marketplace</h1>
            <p className="text-white/80 text-sm">Bourse d'échange de rotation de tontine</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <RefreshCcw className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs mb-1">Demandes actives</p>
              <p className="text-white text-2xl font-bold">{swaps.length}</p>
            </div>
            <button
              onClick={() => navigate('/kauri/emergency-swap')}
              className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md border-none cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Demander un swap</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0F172A] font-semibold flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full"></div>
            <span>Échanges disponibles ({displayedSwaps.length})</span>
          </h3>
          <button
            onClick={() => setFilterUrgent(!filterUrgent)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              filterUrgent
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-[#0A5C7A] border-[#E2E8F0]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterUrgent ? 'Urgences uniquement' : 'Tous les swaps'}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006D77] mb-2" />
            <p className="text-sm">Chargement des demandes de swap depuis la base...</p>
          </div>
        ) : displayedSwaps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] shadow-sm">
            <div className="w-16 h-16 bg-[#006D77]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="w-8 h-8 text-[#006D77]" />
            </div>
            <h4 className="font-bold text-[#0F172A] mb-1">Aucune demande en attente</h4>
            <p className="text-xs text-[#64748B] mb-4">
              Toutes les rotations de vos tontines sont synchronisées. Vous pouvez initier un échange d'urgence si besoin.
            </p>
            <button
              onClick={() => navigate('/kauri/emergency-swap')}
              className="bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md border-none cursor-pointer"
            >
              Créer une demande d'échange
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedSwaps.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden hover:border-[#006D77] transition-all"
              >
                <div
                  className={`h-1.5 ${
                    request.urgency === 'high'
                      ? 'bg-gradient-to-r from-[#EF4444] to-[#F59E0B]'
                      : 'bg-gradient-to-r from-[#F59E0B] to-[#D4AF37]'
                  }`}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {request.avatar}
                      </div>
                      <div>
                        <p className="text-[#0F172A] font-semibold text-sm mb-0.5">{request.requester_name}</p>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < request.trust_score
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : 'text-[#E2E8F0]'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#94A3B8]" />
                          <span className="text-xs text-[#94A3B8]">{request.created_at}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.urgency === 'high'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {request.urgency === 'high' ? 'Urgent' : 'Standard'}
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4 border border-[#E8ECF0]">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm border-2 border-[#006D77]">
                          <span className="text-sm font-bold text-[#006D77]">#{request.original_turn}</span>
                        </div>
                        <p className="text-xs text-[#64748B]">Position actuelle</p>
                      </div>

                      <RefreshCcw className="w-5 h-5 text-[#94A3B8]" />

                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm border-2 border-[#D4AF37]">
                          <span className="text-sm font-bold text-[#D4AF37]">#{request.requested_turn}</span>
                        </div>
                        <p className="text-xs text-[#64748B]">Position demandée</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-medium text-[#0F172A] mb-1 italic">"{request.reason}"</p>
                      <p className="text-xs text-[#64748B] font-semibold">{request.tontine_name} • Cagnotte : {request.pot_amount.toLocaleString()} €</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('/kauri/community-chat')}
                      className="bg-white border border-[#006D77] text-[#006D77] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-all cursor-pointer font-semibold text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Discuter</span>
                    </button>
                    <button
                      disabled={processingId === request.id}
                      onClick={() => handleAgreeSwap(request)}
                      className="bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border-none font-semibold text-xs disabled:opacity-50"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Accepter le swap</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#F59E0B]/10 rounded-2xl p-5 border border-[#D4AF37]/30">
          <h4 className="text-[#0F172A] mb-2 font-bold text-sm flex items-center gap-2">
            <div className="w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <RefreshCcw className="w-4 h-4 text-white" />
            </div>
            <span>Fonctionnement des échanges</span>
          </h4>
          <p className="text-[#64748B] text-xs leading-relaxed mb-3">
            Les swaps permettent d'échanger votre position de rotation de cagnotte en cas de besoin urgent. Les deux parties doivent convenir de l'accord et le protocole met à jour les dates automatiquement.
          </p>
          <button
            onClick={() => navigate('/kauri/emergency-swap')}
            className="text-[#006D77] text-xs font-bold underline bg-transparent border-none cursor-pointer p-0"
          >
            Initier une demande pour mon cercle →
          </button>
        </div>
      </div>
    </div>
  );
}
