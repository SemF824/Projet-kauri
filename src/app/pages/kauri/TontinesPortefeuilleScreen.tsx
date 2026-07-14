import { ArrowLeft, ChevronRight, Lock, Globe, Users, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

const TEAL = '#0A847E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// Typage reflétant la base de données
interface TontineRecord {
  id: string;
  name: string;
  is_public: boolean;
  contribution_amount: number;
  frequency: string;
  start_date: string;
  status: string;
  members_count?: number; // Calculé via jointure ou agrégation
}

type Section = 'privees' | 'publiques';

export function TontinesPortefeuilleScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeSection, setActiveSection] = useState<Section>('privees');
  const [showAllPrivees, setShowAllPrivees] = useState(false);
  const [showAllPubliques, setShowAllPubliques] = useState(false);
  const [animated, setAnimated] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // ── DONNÉES DYNAMIQUES DU BACKEND ──
  const [privees, setPrivees] = useState<any[]>([]);
  const [publiques, setPubliques] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchTontinesData = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();
        
        // 1. Récupération des tontines auxquelles l'utilisateur appartient
        // Note: La structure exacte dépend de ton schéma. Ici, on suppose une table tontine_members liée à tontines.
        const { data, error } = await supabase
          .from('tontine_members')
          .select(`
            tontine_id,
            tontines (
              id,
              name,
              is_public,
              contribution_amount,
              frequency,
              start_date,
              status
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const allTontines = data?.map(d => d.tontines).filter(Boolean) || [];

        // 2. Traitement et enrichissement des données (Simulation de progression et membres pour UI)
        // Idéalement, la progression et le nb exact de membres viendraient de requêtes SQL groupées
        const enrichedTontines = allTontines.map((t: any) => ({
          id: t.id,
          name: t.name,
          is_public: t.is_public,
          members: Math.floor(Math.random() * 15) + 5, // À remplacer par COUNT réel des membres
          amount: t.contribution_amount * 12, // Ex: Pot total estimé
          monthly: t.contribution_amount,
          nextDate: new Date(t.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          progress: Math.floor(Math.random() * 80) + 10, // À remplacer par un calcul (tours payés / tours totaux)
        }));

        // 3. Répartition
        setPrivees(enrichedTontines.filter((t: any) => t.is_public === false));
        setPubliques(enrichedTontines.filter((t: any) => t.is_public === true));

      } catch (err) {
        console.error("Erreur de chargement des tontines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTontinesData();
  }, [user]);

  // ── CALCULS STATISTIQUES GLOBAUX ──
  const TOTAL_PRIVEES  = privees.reduce((s, t) => s + t.amount, 0); 
  const TOTAL_PUBLIQUES = publiques.reduce((s, t) => s + t.amount, 0); 
  const TOTAL = TOTAL_PRIVEES + TOTAL_PUBLIQUES; 

  const privPct  = TOTAL > 0 ? (TOTAL_PRIVEES / TOTAL) * 100 : 0;  
  const pubPct   = TOTAL > 0 ? (TOTAL_PUBLIQUES / TOTAL) * 100 : 0;  

  const priveesList  = showAllPrivees   ? privees   : privees.slice(0, 2);
  const publiquesList = showAllPubliques ? publiques : publiques.slice(0, 1);

  // ── COMPOSANT D'AFFICHAGE D'UNE TONTINE (RÉUTILISABLE) ──
  const TontineCard = ({ t, type }: { t: any; type: 'privee' | 'publique' }) => (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{
        backgroundColor: '#fff',
        border: '1.5px solid #EEF2F7',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users style={{ width: 12, height: 12, color: '#94A3B8' }} />
            <span className="text-[#94A3B8] text-xs font-medium">{t.members} membres</span>
            <span className="text-[#CBD5E1] text-xs">·</span>
            <Calendar style={{ width: 12, height: 12, color: '#94A3B8' }} />
            <span className="text-[#94A3B8] text-xs font-medium">{t.nextDate}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black text-[#0F172A]">{formatEur(t.amount)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#94A3B8] text-xs font-bold">Progression du cycle</span>
          <span className="text-[#64748B] text-xs font-black">{t.progress} %</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${t.progress}%`, 
              background: type === 'privee' ? `linear-gradient(90deg, ${TEAL}, #0D9488)` : 'linear-gradient(90deg, #D4A373, #E8C547)' 
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <span className="text-[#94A3B8] text-xs font-medium">Cotisation mensuelle</span>
        <span className="text-xs font-black text-[#0F172A]">{formatEur(t.monthly)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-10 bg-[#F8FAFC] font-sans select-none">

      {/* ── HEADER ── */}
      <div
        style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl relative z-10"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors bg-transparent border-none cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">Portefeuille</p>
            <h1 className="text-white text-2xl font-black tracking-tight">Mes Tontines</h1>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[10px] mb-0.5 font-bold uppercase tracking-wider">Solde total</p>
            <p className="text-white text-xl font-black">{formatEur(TOTAL)}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A847E]" />
          <p className="text-sm text-slate-500 font-medium">Synchronisation des registres...</p>
        </div>
      ) : (
        <div className="px-5 pt-5 space-y-5">

          {/* ── VISUAL SPLIT BAR (DYNAMIQUE) ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: '#fff',
              border: '1.5px solid #EEF2F7',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <p className="text-[#0F172A] text-sm font-black mb-4">Répartition</p>

            <div className="h-3 rounded-full overflow-hidden flex mb-4 bg-slate-100" style={{ gap: 3 }}>
              {privPct > 0 && (
                <div
                  className="rounded-full transition-all"
                  style={{ width: `${privPct}%`, background: `linear-gradient(90deg, ${TEAL}, #0D9488)`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
                />
              )}
              {pubPct > 0 && (
                <div
                  className="rounded-full"
                  style={{ flex: 1, background: 'linear-gradient(90deg, #D4A373, #E8C547)' }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Privées',   pct: privPct,  amount: TOTAL_PRIVEES,   color: TEAL,      icon: Lock },
                { label: 'Publiques', pct: pubPct,   amount: TOTAL_PUBLIQUES, color: '#D4A373', icon: Globe },
              ].map(({ label, pct, amount, color, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                  <div>
                    <p className="text-[#0F172A] text-[11px] font-black uppercase tracking-wider">{label}</p>
                    <p className="text-[#64748B] text-xs font-bold">{pct.toFixed(0)} % · {formatEur(amount)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
              {[
                { label: 'Cercles actifs', value: String(privees.length + publiques.length) },
                { label: 'Membres total',  value: String(privees.reduce((s, t) => s + t.members, 0) + publiques.reduce((s, t) => s + t.members, 0)) },
                { label: 'Cotisations/mois', value: formatEur(privees.reduce((s, t) => s + t.monthly, 0) + publiques.reduce((s, t) => s + t.monthly, 0)) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-[#0F172A] text-sm font-black">{value}</p>
                  <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider leading-tight mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="flex rounded-xl p-1 shadow-inner" style={{ backgroundColor: '#E2E8F0' }}>
            {([['privees', 'Privées', Lock], ['publiques', 'Publiques', Globe]] as [Section, string, any][]).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer"
                style={{
                  backgroundColor: activeSection === key ? '#fff' : 'transparent',
                  color: activeSection === key ? TEAL : '#64748B',
                  boxShadow: activeSection === key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon style={{ width: 14, height: 14 }} />
                {label}
              </button>
            ))}
          </div>

          {/* ── SECTION : PRIVÉES ── */}
          {activeSection === 'privees' && (
            <div style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[#0F172A] text-sm font-black">Tontines Privées</p>
                  <p className="text-[#64748B] text-xs font-bold">{privees.length} cercles · {formatEur(TOTAL_PRIVEES)}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${TEAL}12`, border: `1px solid ${TEAL}30` }}>
                  <Users style={{ width: 12, height: 12, color: TEAL }} />
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: TEAL }}>
                    {privees.reduce((s, t) => s + t.members, 0)} membres
                  </span>
                </div>
              </div>

              {privees.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Lock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500">Aucun cercle privé actif.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {priveesList.map(t => <TontineCard key={t.id} t={t} type="privee" />)}
                </div>
              )}

              {privees.length > 2 && (
                <button
                  onClick={() => setShowAllPrivees(v => !v)}
                  className="w-full mt-3 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  style={{ backgroundColor: `${TEAL}12`, color: TEAL, border: `1.5px solid ${TEAL}25` }}
                >
                  {showAllPrivees ? 'Réduire' : `Tout afficher (${privees.length})`}
                  <ChevronRight style={{ width: 16, height: 16, transform: showAllPrivees ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                </button>
              )}
            </div>
          )}

          {/* ── SECTION : PUBLIQUES ── */}
          {activeSection === 'publiques' && (
            <div style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[#0F172A] text-sm font-black">Tontines Publiques</p>
                  <p className="text-[#64748B] text-xs font-bold">{publiques.length} cercles · {formatEur(TOTAL_PUBLIQUES)}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#D4A37318', border: '1px solid #D4A37330' }}>
                  <Users style={{ width: 12, height: 12, color: '#D4A373' }} />
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#D4A373' }}>
                    {publiques.reduce((s, t) => s + t.members, 0)} membres
                  </span>
                </div>
              </div>

              {publiques.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500">Aucun cercle public actif.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {publiquesList.map(t => <TontineCard key={t.id} t={t} type="publique" />)}
                </div>
              )}

              {publiques.length > 1 && (
                <button
                  onClick={() => setShowAllPubliques(v => !v)}
                  className="w-full mt-3 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  style={{ backgroundColor: '#D4A37318', color: '#D4A373', border: '1.5px solid #D4A37325' }}
                >
                  {showAllPubliques ? 'Réduire' : `Tout afficher (${publiques.length})`}
                  <ChevronRight style={{ width: 16, height: 16, transform: showAllPubliques ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TontinesPortefeuilleScreen;
