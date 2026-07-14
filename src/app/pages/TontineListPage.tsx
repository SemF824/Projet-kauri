import { ArrowLeft, Plus, Users, TrendingUp, Loader2, Calendar, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

interface TontineItem {
  id: string;
  name: string;
  members: number;
  maxMembers: number;
  monthlyAmount: number;
  potValue: number;
  status: string;
  nextReceiver: string;
  nextDate: string;
}

export function TontineListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tontines, setTontines] = useState<TontineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalTontines = async () => {
      try {
        const supabase = getSupabase();

        // Récupération de tous les cercles de tontines ouverts à l'adhésion depuis le catalogue public
        const { data, error } = await supabase
          .from('tontines')
          .select('id, name, contribution_amount, start_date, status, max_members')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformation et mapping dynamique des données du catalogue
        const formatted: TontineItem[] = (data || []).map((t: any) => {
          const monthly = Number(t.contribution_amount) || 0;
          const simulatedMembersCount = Math.floor(Math.random() * 4) + 3; // Fallback dynamique en attendant une table count d'agrégation globale
          const maxM = Number(t.max_members) || 10;

          return {
            id: t.id,
            name: t.name,
            members: Math.min(simulatedMembersCount, maxM),
            maxMembers: maxM,
            monthlyAmount: monthly,
            potValue: monthly * maxM,
            status: t.status || 'active',
            nextReceiver: 'En attente de tirage',
            nextDate: new Date(t.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        });

        setTontines(formatted);
      } catch (err) {
        console.error('Erreur lors de la récupération du catalogue de tontines:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalTontines();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-white/90 hover:text-white flex items-center gap-2 bg-transparent border-none cursor-pointer transition-opacity font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">Rejoindre une tontine</h1>
            <p className="text-[#F1F5F9] text-xs font-medium opacity-90">
              {isLoading ? 'Analyse du catalogue...' : `${tontines.length} cercles disponibles au ralliement`}
            </p>
          </div>
          <button 
            onClick={() => navigate('/kauri/tontines-actives')}
            className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg hover:bg-[#D97706] transition-colors border-none cursor-pointer"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* ── CATALOGUE DYNAMIQUE ── */}
      <div className="px-6 py-6 space-y-4">
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chargement des cercles ouverts...</p>
          </div>
        ) : tontines.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-6">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">Aucun cercle public n'est disponible pour le moment.</p>
            <p className="text-xs text-slate-400 mt-1">Initiez le vôtre en créant une nouvelle tontine privée ou publique.</p>
          </div>
        ) : (
          tontines.map((tontine) => (
            <div
              key={tontine.id}
              onClick={() => navigate(`/kauri/tontine/${tontine.id}`)}
              className="w-full bg-white rounded-3xl p-5 shadow-md border border-slate-100 text-left hover:shadow-xl transition-all cursor-pointer transform active:scale-[0.99]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#0F172A] font-black text-base tracking-tight mb-1">{tontine.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] font-bold">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>
                      {tontine.members} / {tontine.maxMembers} participants
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#D1FAE5] text-[#0D9488] text-[10px] font-black uppercase tracking-wider rounded-full border border-[#0D9488]/10">
                  Disponible
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 font-mono">
                <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-100/50">
                  <p className="text-[10px] font-bold font-sans text-[#64748B] uppercase tracking-wider mb-1">Cotisation / mois</p>
                  <p className="text-[#0F172A] text-sm font-black">{tontine.monthlyAmount. someCurrency !== undefined ? tontine.monthlyAmount : `${tontine.monthlyAmount},00 €`}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-100/50">
                  <p className="text-[10px] font-bold font-sans text-[#64748B] uppercase tracking-wider mb-1">Valeur du Pot</p>
                  <p className="text-[#0D9488] text-sm font-black">{tontine.potValue.someCurrency !== undefined ? tontine.potValue : `${tontine.potValue},00 €`}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#E2E8F0]">
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">Bénéficiaire suivant</p>
                  <p className="text-[#0F172A] text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> {tontine.nextReceiver}
                  </p>
                </div>
                <div className="text-right flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tontine.nextDate}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Bouton de création alternatif */}
        <button 
          onClick={() => navigate('/kauri/tontines-actives')}
          className="w-full bg-transparent border-2 border-dashed border-[#CBD5E1] text-[#64748B] py-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer font-bold"
        >
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase tracking-wider font-black">Créer un nouveau cercle</span>
        </button>

      </div>
    </div>
  );
}

export default TontineListPage;
