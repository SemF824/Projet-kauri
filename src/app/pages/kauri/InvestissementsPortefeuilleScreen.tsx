import {
  ArrowLeft, Building2, Sprout, Zap, HeartPulse,
  Cpu, ShoppingBag, Globe, Landmark, Lock, Loader2, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

const GOLD = '#D4A373';
const TEAL = '#0A847E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Sector taxonomy ──────────────────────────────────────────────────────────
// Définit l'UI et les couleurs des secteurs (mais n'injecte plus les données)
const SECTORS = [
  { id: 'immobilier',  label: 'Immobilier',     icon: Building2,   color: GOLD,      active: true  },
  { id: 'agriculture', label: 'Agriculture',    icon: Sprout,      color: TEAL,      active: true  },
  { id: 'energie',     label: 'Énergie verte',  icon: Zap,        color: '#10B981', active: true  },
  { id: 'sante',       label: 'Santé',          icon: HeartPulse, color: '#EC4899', active: false },
  { id: 'tech',        label: 'Tech & Digital', icon: Cpu,        color: '#6366F1', active: false },
  { id: 'commerce',    label: 'Commerce',       icon: ShoppingBag,color: '#F59E0B', active: false },
  { id: 'infra',       label: 'Infrastructure', icon: Globe,      color: '#64748B', active: false },
  { id: 'microfinance',label: 'Microfinance',   icon: Landmark,    color: '#8B5CF6', active: false },
] as const;

type SectorId = typeof SECTORS[number]['id'];

// ── Types dynamiques de la base de données ──
interface RWAInvestmentRecord {
  id: string;
  name: string;
  sector_id: SectorId;
  sub_sector: string;
  amount: number;
  status: string;
}

// Stats agrégées calculées dynamiquement pour le Donut
interface SectorAllocation {
  id: SectorId;
  total: number;
  count: number;
  pct: number;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'En cours':         { bg: '#D1FAE5', text: '#16A34A' },
  'Bientôt clôturé':  { bg: '#FEF3C7', text: '#D97706' },
};

// ── Multi-segment donut (Géométrie statique) ───────────────────────────────────────────────────────
const SIZE = 200, CX = 100, CY = 100, R_OUT = 82, R_IN = 54, GAP_DEG = 5;

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(startDeg: number, endDeg: number) {
  const o1 = polarXY(CX, CY, R_OUT, startDeg), o2 = polarXY(CX, CY, R_OUT, endDeg);
  const i1 = polarXY(CX, CY, R_IN, endDeg),   i2 = polarXY(CX, CY, R_IN, startDeg);
  const la = endDeg - startDeg > 180 ? 1 : 0;
  return `M${o1.x} ${o1.y} A${R_OUT} ${R_OUT} 0 ${la} 1 ${o2.x} ${o2.y} L${i1.x} ${i1.y} A${R_IN} ${R_IN} 0 ${la} 0 ${i2.x} ${i2.y}Z`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function InvestissementsPortefeuilleScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selected, setSelected] = useState<SectorId | null>(null);
  const [animated, setAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── DONNÉES DYNAMIQUES DU BACKEND ──
  const [investments, setInvestments] = useState<RWAInvestmentRecord[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [allocations, setAllocations] = useState<SectorAllocation[]>([]);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);

  // 🎯 CÂBLAGE DYNAMIQUE AVEC SUPABASE
  useEffect(() => {
    const fetchInvestmentsData = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();
        
        // 1. Récupération des investissements réels rattachés à l'utilisateur
        const { data: invData, error: invError } = await supabase
          .from('rwa_investments')
          .select('id, name, sector_id, sub_sector, amount, status')
          .eq('user_id', user.id);

        if (invError) throw invError;

        const investments_list: RWAInvestmentRecord[] = invData || [];
        setInvestments(investments_list);

        // 2. Calculs agrégés dynamiques
        const calcTotal = investments_list.reduce((s, p) => s + (p.amount || 0), 0);
        setTotalInvested(calcTotal);

        // 3. Calcul de la répartition sectorielle dynamique pour le Donut
        if (calcTotal > 0) {
          const statsMap: Record<SectorId, { total: number, count: number }> = {} as any;
          
          investments_list.forEach(p => {
            if (!statsMap[p.sector_id]) statsMap[p.sector_id] = { total: 0, count: 0 };
            statsMap[p.sector_id].total += p.amount;
            statsMap[p.sector_id].count += 1;
          });

          const dynamicAllocations: SectorAllocation[] = SECTORS
            .filter(s => statsMap[s.id] && statsMap[s.id].total > 0)
            .map(s => ({
              id: s.id,
              total: statsMap[s.id].total,
              count: statsMap[s.id].count,
              pct: Math.round((statsMap[s.id].total / calcTotal) * 100)
            }));
          
          setAllocations(dynamicAllocations);
        } else {
          setAllocations([]);
        }

      } catch (err: any) {
        setErrorMessage("Synchronisation impossible. Veuillez réessayer ultérieurement.");
        console.error('Erreur API Investissements:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestmentsData();
  }, [user]);

  // 📐 Construction dynamique des tranches du Donut
  const slices = (() => {
    if (totalInvested === 0 || allocations.length === 0) return [];
    let cursor = 0;
    
    return allocations.map(alloc => {
      const sector = SECTORS.find(s => s.id === alloc.id)!;
      const sweep = (alloc.total / totalInvested) * 360 - GAP_DEG;
      const start = cursor + GAP_DEG / 2;
      const end = cursor + sweep + GAP_DEG / 2;
      cursor += (alloc.total / totalInvested) * 360;
      
      return { 
        id: sector.id, 
        color: sector.color, 
        path: sweep > 0 ? arcPath(start, end) : '', // Évite les erreurs SVG si le Sweep est nul
        pct: alloc.pct,
        total: alloc.total,
        count: alloc.count
      };
    }).filter(s => s.path !== ''); // Ne garde que les tranches avec un chemin
  })();

  const activeAllocation = selected ? allocations.find(a => a.id === selected) : null;
  const activeSectorDef = selected ? SECTORS.find(s => s.id === selected) : null;
  const visibleProjects = selected ? investments.filter(p => p.sector_id === selected) : investments;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 font-sans select-none">

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #BF8C10 100%)`, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl relative z-10"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors border-none bg-transparent cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs mb-1 uppercase tracking-widest font-bold">Portefeuille</p>
            <h1 className="text-white text-2xl font-black tracking-tight">Investissements RWA</h1>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-[10px] mb-0.5 font-bold uppercase tracking-wider">Solde investi</p>
            <p className="text-white text-xl font-black">{formatEur(totalInvested)}</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mx-5 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
          <p className="text-sm text-slate-500 font-medium">Actualisation des actifs réels...</p>
        </div>
      ) : (
        <div className="px-5 pt-6 space-y-6">

          {/* ── DONUT + SECTOR LEGEND (DYNAMIQUE) ── */}
          <div
            className="rounded-3xl p-5"
            style={{
              backgroundColor: '#fff', border: '1.5px solid #EEF2F7',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.45s ease, transform 0.45s ease',
            }}
          >
            
            {totalInvested === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                 <Building2 className="w-10 h-10 mx-auto text-slate-300" strokeWidth={1} />
                 <p className="text-sm font-bold text-slate-500">Aucun investissement actif détecté.</p>
                 <p className="text-xs text-slate-400">Vos participations RWA apparaîtront ici.</p>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* Donut dynamique */}
                <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
                  <svg width={SIZE} height={SIZE} style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.10))' }}>
                    {slices.map(sl => (
                      <path
                        key={sl.id}
                        d={sl.path}
                        fill={sl.color}
                        style={{
                          transform: selected === sl.id ? 'scale(1.06)' : 'scale(1)',
                          transformOrigin: `${CX}px ${CY}px`,
                          transition: 'transform 0.2s ease, opacity 0.2s ease',
                          opacity: selected && selected !== sl.id ? 0.3 : 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelected(s => s === sl.id ? null : sl.id as SectorId)}
                      />
                    ))}
                    {/* hole */}
                    <circle cx={CX} cy={CY} r={R_IN - 2} fill="#fff" />
                  </svg>

                  {/* Center label */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    {selected && activeSectorDef && activeAllocation ? (
                      <>
                        <span style={{ fontSize: 20, fontWeight: 900, color: activeSectorDef.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                          {activeAllocation.pct}%
                        </span>
                        <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, fontWeight: 600 }}>
                          {activeSectorDef.label}
                        </span>
                        <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 800, marginTop: 2 }}>
                          {formatEur(activeAllocation.total)}
                        </span>
                      </  >
                    ) : (
                      <>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Total</span>
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                          {formatEur(totalInvested)}
                        </span>
                        <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, fontStyle: 'italic' }}>
                          {investments.length} projets engagés
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Légende sectorielle dynamique — liste verticale */}
                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                  {slices.map(sl => {
                    const sectorDef = SECTORS.find(s => s.id === sl.id)!;
                    const Icon = sectorDef.icon;
                    const isSel = selected === sl.id;

                    return (
                      <button
                        key={sl.id}
                        onClick={() => setSelected(sel => sel === sl.id ? null : sl.id as SectorId)}
                        className="flex items-center gap-2.5 text-left w-full border-none bg-transparent cursor-pointer"
                        style={{ opacity: selected && !isSel ? 0.4 : 1, transition: 'opacity 0.2s' }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: isSel ? sl.color : `${sl.color}20` }}
                        >
                          <Icon style={{ width: 13, height: 13, color: isSel ? '#fff' : sl.color }} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-[#0F172A] truncate tracking-tight">{sectorDef.label}</span>
                            <span className="text-xs font-black ml-1 flex-shrink-0" style={{ color: sl.color }}>{sl.pct}%</span>
                          </div>
                          {/* Mini bar de progression */}
                          <div className="h-1 rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${sl.pct}%`, backgroundColor: sl.color, opacity: 0.7, transition: 'width 0.6s ease' }}
                            />
                          </div>
                          <span className="text-[10px] text-[#94A3B8] font-medium leading-tight">
                            {formatEur(sl.total)} · {sl.count} projet{sl.count > 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tous les 8 secteurs (Mini bar de statut d'activité) */}
            <div className="mt-5 pt-4 flex gap-2 flex-wrap" style={{ borderTop: '1px solid #F1F5F9' }}>
              {SECTORS.map(s => {
                const Icon = s.icon;
                const isCurrentlyActiveInProfile = allocations.some(a => a.id === s.id);
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all"
                    style={{
                      backgroundColor: isCurrentlyActiveInProfile ? `${s.color}14` : '#F1F5F9',
                      border: `1px solid ${isCurrentlyActiveInProfile ? s.color + '30' : '#E2E8F0'}`,
                    }}
                  >
                    <Icon style={{ width: 10, height: 10, color: isCurrentlyActiveInProfile ? s.color : '#CBD5E1' }} />
                    <span style={{ fontSize: 10, fontBold: '900', color: isCurrentlyActiveInProfile ? '#0F172A' : '#CBD5E1' }}>{s.label}</span>
                    {!isCurrentlyActiveInProfile && <Lock style={{ width: 8, height: 8, color: '#CBD5E1' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── LISTE DE PROJETS COMPACTE (DYNAMIQUE) ── */}
          {totalInvested > 0 && (
            <div>
              <p className="text-[#0F172A] text-sm font-black mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full inline-block" style={{ backgroundColor: activeSectorDef?.color ?? GOLD }} />
                {activeSectorDef ? `${activeSectorDef.label}` : 'Portefeuille de projets'}
                <span className="text-[#94A3B8] font-medium text-xs ml-0.5">({visibleProjects.length} engagé{visibleProjects.length > 1 ? 's' : ''})</span>
              </p>

              <div className="space-y-2.5">
                {visibleProjects.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-500">
                      Aucun projet correspondant dans ce secteur.
                  </div>
                ) : (
                  visibleProjects.map(p => {
                    const sectorDef = SECTORS.find(s => s.id === p.sector_id)!;
                    const statusConfig = STATUS_STYLE[p.status] ?? { bg: '#F1F5F9', text: '#64748B' };
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                        style={{ backgroundColor: '#fff', border: '1.5px solid #EEF2F7', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                      >
                        {/* Point lumineux du secteur */}
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                          style={{ backgroundColor: sectorDef.color, boxShadow: `0 0 8px ${sectorDef.color}80` }}
                        />

                        {/* Nom + Sous-secteur */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0F172A] text-sm font-bold truncate tracking-tight">{p.name}</p>
                          <p className="text-[#94A3B8] text-xs font-medium">{p.sub_sector}</p>
                        </div>

                        {/* Montant + Statut */}
                        <div className="flex items-center gap-2 flex-shrink-0 text-right">
                          <span className="text-[#0F172A] text-sm font-extrabold">{formatEur(p.amount)}</span>
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider" style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InvestissementsPortefeuilleScreen;
