import { ArrowLeft, ChevronRight, Users, BarChart2, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, Percent, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

const TEAL = '#0A847E';
const GOLD = '#D4A373';
const SIZE = 210;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 84;
const R_INNER = 50;
const GAP = 3;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(cx: number, cy: number, rO: number, rI: number, s: number, e: number) {
  // Si le pourcentage est très proche de 0 ou 100, on évite les bugs d'affichage géométrique
  if (Math.abs(e - s) < 0.1) return ''; 
  if (Math.abs(e - s) >= 359.9) {
    const o1 = polarToXY(cx, cy, rO, 0), o2 = polarToXY(cx, cy, rO, 180), o3 = polarToXY(cx, cy, rO, 359.9);
    const i1 = polarToXY(cx, cy, rI, 359.9), i2 = polarToXY(cx, cy, rI, 180), i3 = polarToXY(cx, cy, rI, 0);
    return `M ${o1.x} ${o1.y} A ${rO} ${rO} 0 1 1 ${o2.x} ${o2.y} A ${rO} ${rO} 0 1 1 ${o3.x} ${o3.y} L ${i1.x} ${i1.y} A ${rI} ${rI} 0 1 0 ${i2.x} ${i2.y} A ${rI} ${rI} 0 1 0 ${i3.x} ${i3.y} Z`;
  }

  const o1 = polarToXY(cx, cy, rO, s), o2 = polarToXY(cx, cy, rO, e);
  const i1 = polarToXY(cx, cy, rI, e), i2 = polarToXY(cx, cy, rI, s);
  const la = e - s > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`, `A ${rO} ${rO} 0 ${la} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`, `A ${rI} ${rI} 0 ${la} 0 ${i2.x} ${i2.y}`, 'Z',
  ].join(' ');
}

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export function PortefeuilleScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [activeSlice, setActiveSlice] = useState<'tontines' | 'invest' | null>(null);
  const [animated, setAnimated] = useState(false);
  
  // 🎯 ÉTATS DYNAMIQUES DU PORTEFEUILLE
  const [tontinesTotal, setTontinesTotal] = useState(0);
  const [investTotal, setInvestTotal] = useState(0);
  const [gainsNets, setGainsNets] = useState(0);
  const [rendementMoyen, setRendementMoyen] = useState(0);
  const [totalRetire, setTotalRetire] = useState(0);
  
  const totalBalance = profile?.balance ?? 0;
  const totalEngaged = tontinesTotal + investTotal;
  
  // Si le solde total est à zéro, on évite les divisions par zéro
  const tontinesPct = totalEngaged > 0 ? tontinesTotal / totalEngaged : 0;
  const investPct = totalEngaged > 0 ? investTotal / totalEngaged : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      try {
        const supabase = getSupabase();

        // 1. Récupération des dépôts en Tontine (Montant total contribué par l'utilisateur)
        // Simplification : on récupère le nombre de tontines actives et on multiplie par un montant moyen, 
        // ou on interroge la table transactions. À adapter selon ta table exacte.
        const { data: tontinesData } = await supabase
          .from('tontine_members')
          .select('tontine_id')
          .eq('user_id', user.id);
        
        // Pour l'exemple, on valorise chaque tontine active à 245€ de dépôt (remplace par ton vrai agrégat)
        const calcTontines = (tontinesData?.length || 0) * 245; 
        setTontinesTotal(calcTontines);

        // 2. Récupération des investissements RWA
        const { data: investData } = await supabase
          .from('investments')
          .select('amount')
          .eq('user_id', user.id);
        
        const calcInvest = investData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
        setInvestTotal(calcInvest);

        // 3. Calculs dynamiques de synthèse
        // (Ces valeurs devraient idéalement provenir de ta table "transactions")
        setGainsNets(calcInvest * 0.041); // Simulation: 4.1% de gains sur investissements
        setRendementMoyen(8.5); // Simulation: Rendement du profil RWA
        setTotalRetire(0); // Simulation: Aucun retrait pour le moment

      } catch (err) {
        console.error('Erreur de synchronisation du portefeuille:', err);
      }
    };

    fetchWalletData();
  }, [user]);

  // 📐 Calcul des tranches géométriques
  let sliceTontines = '';
  let sliceInvest = '';
  
  if (totalEngaged === 0) {
    // Portefeuille vide : Donut gris
    sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else if (tontinesPct === 1) {
    sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else if (investPct === 1) {
    sliceInvest = donutSlice(CX, CY, R_OUTER, R_INNER, 0, 359.9);
  } else {
    sliceTontines = donutSlice(CX, CY, R_OUTER, R_INNER, GAP / 2, 360 * tontinesPct - GAP / 2);
    sliceInvest   = donutSlice(CX, CY, R_OUTER, R_INNER, 360 * tontinesPct + GAP / 2, 360 - GAP / 2);
  }

  const centerLabel = activeSlice === 'tontines'
    ? { pct: `${Math.round(tontinesPct * 100)}%`, amount: formatEur(tontinesTotal), color: TEAL, label: 'Tontines' }
    : activeSlice === 'invest'
    ? { pct: `${Math.round(investPct * 100)}%`, amount: formatEur(investTotal), color: GOLD, label: 'Invest. RWA' }
    : { pct: '100%', amount: formatEur(totalEngaged > 0 ? totalEngaged : totalBalance), color: '#1A1A1A', label: 'Total engagé' };

  // METRICS DYNAMIQUES
  const METRICS = [
    { icon: ArrowDownLeft, label: 'Total engagé',   value: formatEur(totalEngaged),      color: TEAL,       bg: `${TEAL}14`,    trend: null },
    { icon: ArrowUpRight,  label: 'Total retiré',   value: formatEur(totalRetire),       color: '#B05B3B',  bg: '#B05B3B14',    trend: null },
    { icon: TrendingUp,    label: 'Gains nets',     value: `+${formatEur(gainsNets)}`,   color: '#16A34A',  bg: '#16A34A14',    trend: '+4,1%' },
    { icon: Percent,       label: 'Rendement moy.', value: `${rendementMoyen} %`,        color: GOLD,       bg: `${GOLD}1A`,    trend: null },
    { icon: Clock,         label: 'Prochaine éch.', value: '1 juil.',                    color: '#7C3AED',  bg: '#7C3AED14',    trend: null },
    { icon: TrendingDown,  label: 'Solde liquide',  value: formatEur(totalBalance),      color: '#F59E0B',  bg: '#F59E0B14',    trend: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10 font-sans select-none">

      {/* ── HEADER ── */}
      <div
        style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl relative z-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">Détails</p>
            <h1 className="text-white text-2xl font-black tracking-tight">Mon Portefeuille</h1>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="text-white text-xs font-bold tracking-wide">{formatEur(totalBalance)}</span>
          </div>
        </div>
      </div>

      {/* ── DONUT CHART (DYNAMIQUE) ── */}
      <div className="flex flex-col items-center pt-7 pb-3 px-6">
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <svg
            width={SIZE} height={SIZE}
            style={{
              transform: animated ? 'scale(1)' : 'scale(0.85)',
              opacity: animated ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
              overflow: 'visible',
              filter: 'drop-shadow(0 8px 24px rgba(10,132,126,0.15))',
            }}
          >
            {totalEngaged === 0 ? (
              <path d={sliceTontines} fill="#E2E8F0" />
            ) : (
              <>
                {tontinesPct > 0 && (
                  <path d={sliceTontines} fill={TEAL}
                    style={{ transform: activeSlice === 'tontines' ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'tontines' ? `drop-shadow(0 4px 12px ${TEAL}88)` : 'none' }}
                    onClick={() => setActiveSlice(s => s === 'tontines' ? null : 'tontines')}
                  />
                )}
                {investPct > 0 && (
                  <path d={sliceInvest} fill={GOLD}
                    style={{ transform: activeSlice === 'invest' ? 'scale(1.05)' : 'scale(1)', transformOrigin: `${CX}px ${CY}px`, transition: 'transform 0.2s ease', cursor: 'pointer', filter: activeSlice === 'invest' ? `drop-shadow(0 4px 12px ${GOLD}88)` : 'none' }}
                    onClick={() => setActiveSlice(s => s === 'invest' ? null : 'invest')}
                  />
                )}
              </>
            )}
            <circle cx={CX} cy={CY} r={R_INNER - 2} fill="#F8FAFC" />
          </svg>
          
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: centerLabel.color, letterSpacing: '-0.03em', lineHeight: 1, transition: 'color 0.2s' }}>{centerLabel.pct}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginTop: 3 }}>{centerLabel.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{centerLabel.amount}</span>
          </div>
        </div>

        {/* Legend */}
        {totalEngaged > 0 && (
          <div className="flex items-center gap-6 mt-4">
            {[
              { key: 'tontines' as const, color: TEAL,  label: `Tontines ${Math.round(tontinesPct * 100)}%` },
              { key: 'invest'   as const, color: GOLD,  label: `Invest. RWA ${Math.round(investPct * 100)}%` },
            ].map(({ key, color, label }) => (
              <button key={key} className="flex items-center gap-2 border-none bg-transparent cursor-pointer" onClick={() => setActiveSlice(s => s === key ? null : key)}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color, boxShadow: activeSlice === key ? `0 0 0 2.5px ${color}44` : 'none', transition: 'box-shadow 0.2s' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: activeSlice === key ? color : '#64748B' }}>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-5 h-px bg-[#E8EDF2] my-1" />

      {/* ── FINANCIAL SNAPSHOT (DYNAMIQUE) ── */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[#0F172A] text-sm font-black mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: TEAL }} />
          Synthèse financière
        </p>
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(({ icon: Icon, label, value, color, bg, trend }) => (
            <div
              key={label}
              className="rounded-2xl p-4 transition-all"
              style={{ backgroundColor: '#fff', border: '1.5px solid #EEF2F7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon style={{ width: 16, height: 16, color }} />
                </div>
                <span className="text-[#64748B] text-xs font-medium leading-tight">{label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[#0F172A] text-sm font-black">{value}</span>
                {trend && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#16A34A' }}>
                    {trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-5 h-px bg-[#E8EDF2] mt-4 mb-3" />

      {/* ── ALLOCATION ROWS (DYNAMIQUE) ── */}
      <div className="px-5 space-y-3">
        <p className="text-[#0F172A] text-sm font-black mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
          Répartition
        </p>

        {/* Tontines */}
        <button
          onClick={() => navigate('/kauri/portefeuille-tontines')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:scale-95 transition-all cursor-pointer"
          style={{ border: '1.5px solid #E0F0EF', boxShadow: '0 2px 10px rgba(10,132,126,0.06)' }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${TEAL}14` }}>
            <Users style={{ width: 20, height: 20, color: TEAL }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-bold">Tontines</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${tontinesPct * 80}px`, backgroundColor: TEAL, opacity: 0.4 }} />
              <span className="text-[#94A3B8] text-xs font-medium">{Math.round(tontinesPct * 100)} %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-black">{formatEur(tontinesTotal)}</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>

        {/* Investissements RWA */}
        <button
          onClick={() => navigate('/kauri/portefeuille-investissements')}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white active:scale-95 transition-all cursor-pointer"
          style={{ border: '1.5px solid #F0E8D8', boxShadow: '0 2px 10px rgba(212,163,115,0.07)' }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${GOLD}1A` }}>
            <BarChart2 style={{ width: 20, height: 20, color: GOLD }} strokeWidth={2} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#0F172A] text-sm font-bold">Investissements RWA</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: `${investPct * 80}px`, backgroundColor: GOLD, opacity: 0.5 }} />
              <span className="text-[#94A3B8] text-xs font-medium">{Math.round(investPct * 100)} %</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0F172A] text-sm font-black">{formatEur(investTotal)}</span>
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </div>
        </button>
      </div>

      {/* ── FOOTER ── */}
      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
        <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">Valorisation en temps réel</p>
      </div>
    </div>
  );
}

export default PortefeuilleScreen;
