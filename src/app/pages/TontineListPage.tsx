import { ArrowLeft, Plus, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getSupabase } from '../../utils/supabase';

interface Tontine {
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
  const [tontines, setTontines] = useState<Tontine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTontines = async () => {
      try {
        const supabase = getSupabase();

        // Récupération de toutes les tontines avec comptage des participants
        const { data, error } = await supabase
          .from('tontines')
          .select(`
            *,
            tontine_members ( user_id )
          `)
          .eq('status', 'active');

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted: Tontine[] = data.map((t: any) => {
            const memberCount = t.tontine_members ? t.tontine_members.length : 0;
            return {
              id: t.id,
              name: t.name,
              members: memberCount,
              maxMembers: t.max_members,
              monthlyAmount: Number(t.monthly_amount),
              potValue: Number(t.monthly_amount) * memberCount,
              status: t.status,
              nextReceiver: 'En attente',
              nextDate: '1er du mois',
            };
          });
          setTontines(formatted);
        } else {
          // Fallback avec de superbes tontines par défaut pour les tests
          setTontines([
            {
              id: '1',
              name: 'Cercle Solidaire Diaspora',
              members: 5,
              maxMembers: 12,
              monthlyAmount: 500,
              potValue: 2500,
              status: 'active',
              nextReceiver: 'Marie Laurent',
              nextDate: '1 oct. 2026',
            },
            {
              id: '2',
              name: 'Professionnels du Digital',
              members: 8,
              maxMembers: 10,
              monthlyAmount: 300,
              potValue: 2400,
              status: 'active',
              nextReceiver: 'André Charles',
              nextDate: '10 oct. 2026',
            },
          ]);
        }
      } catch (err) {
        console.error('Erreur de récupération des tontines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTontines();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0D9488] to-[#14B8A6] px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2 border-none bg-transparent cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black mb-1">Tontines Actives</h1>
            <p className="text-[#F1F5F9] text-sm">{tontines.length} cercles disponibles</p>
          </div>
          <button
            onClick={() => navigate('/kauri/creer-tontine-publique')}
            className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer hover:scale-105 transition-transform"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* TONTINES LIST */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
          </div>
        ) : (
          tontines.map((tontine) => (
            <button
              key={tontine.id}
              onClick={() => navigate(`/kauri/tontine/${tontine.id}`)}
              className="w-full bg-white rounded-2xl p-5 shadow-lg text-left hover:shadow-xl transition-shadow border-none cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#0F172A] font-bold mb-1">{tontine.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <Users className="w-4 h-4" />
                    <span>
                      {tontine.members}/{tontine.maxMembers} membres
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#D1FAE5] text-[#0D9488] text-xs font-bold rounded-full">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1 font-medium">Cotisation mensuelle</p>
                  <p className="text-[#0F172A] font-bold">€{tontine.monthlyAmount}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3">
                  <p className="text-xs text-[#64748B] mb-1 font-medium">Cagnotte Globale</p>
                  <p className="text-[#0F172A] font-bold">€{tontine.potValue}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <div>
                  <p className="text-xs text-[#64748B] mb-1 font-medium">Bénéficiaire du tour</p>
                  <p className="text-[#0F172A] text-sm font-bold">{tontine.nextReceiver}</p>
                </div>
                <p className="text-xs text-[#64748B] font-medium">{tontine.nextDate}</p>
              </div>
            </button>
          ))
        )}

        <button
          onClick={() => navigate('/kauri/creer-tontine-publique')}
          className="w-full border-2 border-dashed border-[#CBD5E1] text-[#64748B] py-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors bg-transparent cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <Plus className="w-6 h-6 text-slate-500" />
          </div>
          <span className="font-bold">Créer une nouvelle tontine</span>
        </button>
      </div>
    </div>
  );
}