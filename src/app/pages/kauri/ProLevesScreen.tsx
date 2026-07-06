import { ArrowLeft, TrendingUp, Target, ChevronRight, Plus, Users, Heart, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useProData } from '../../contexts/ProDataContext';
import type { ProProjet } from '../../contexts/ProDataContext';

const TEAL  = '#006D77';
const GOLD  = '#D4AF37';
const TERRA = '#B05B3B';
const AMBER = '#92400E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}

// Mois affichés dans le graphique (6 derniers mois)
const MOIS_LABELS = ['Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'];

const BASE_PROJETS_IDS = ['p1', 'p2', 'p3'];
const BASE_MENSUEL: Record<string, number[]> = {
  p1: [0,    0,    8_000, 12_000, 18_000, 7_000],
  p2: [0,    0,    0,     9_000,  15_000, 8_000],
  p3: [4_200,11_500,8_300, 4_500,  0,      0   ],
};

// ── Calcule les contributions simulées par palier ─────────────────────────────
function getPaliersStats(proj: ProProjet) {
  const { leve, backers, finType, paliers } = proj;
  if (!leve || !backers || paliers.every(p => !p.montant)) return null;

  // Distribution pyramidale réaliste: 60% / 30% / 10% des backers par palier croissant
  const splits = [0.60, 0.30, 0.10];
  const backersSplit = splits.map(s => Math.round(backers * s));
  const totalAmounts = paliers.map((p, i) => {
    const montant = parseFloat(p.montant) || 0;
    return backersSplit[i] * montant;
  });
  const totalSimulated = totalAmounts.reduce((s, a) => s + a, 0);
  // Normaliser pour que le total corresponde à leve réel
  const scale = totalSimulated > 0 ? leve / totalSimulated : 1;

  return paliers.map((p, i) => {
    const montant = parseFloat(p.montant) || 0;
    const nbBackers = backersSplit[i];
    const montantLeve = Math.round(totalAmounts[i] * scale);

    const acceptsDons    = finType === 'dons' || finType === 'les-deux';
    const acceptsInvest  = finType === 'investissement' || finType === 'les-deux';

    // Répartition don/invest sur "les-deux": 40% don, 60% invest
    const backersD = finType === 'les-deux' ? Math.round(nbBackers * 0.4) : (acceptsDons ? nbBackers : 0);
    const backersI = finType === 'les-deux' ? nbBackers - backersD : (acceptsInvest ? nbBackers : 0);
    const montantD = finType === 'les-deux' ? Math.round(montantLeve * 0.4) : (acceptsDons ? montantLeve : 0);
    const montantI = finType === 'les-deux' ? montantLeve - montantD : (acceptsInvest ? montantLeve : 0);

    return {
      label: p.label || `Palier ${i + 1}`,
      seuil: montant,
      description: p.description,
      contrepartie_don: p.contrepartie_don,
      rendement_invest: p.rendement_invest,
      nbBackers,
      montantLeve,
      don:   { backers: backersD, montant: montantD },
      invest:{ backers: backersI, montant: montantI },
      finType,
    };
  });
}

// ── Carte palier ──────────────────────────────────────────────────────────────
function PalierRow({ stat, color, animated }: {
  stat: NonNullable<ReturnType<typeof getPaliersStats>>[number];
  color: string;
  animated: boolean;
}) {
  const acceptsDons   = stat.finType === 'dons' || stat.finType === 'les-deux';
  const acceptsInvest = stat.finType === 'investissement' || stat.finType === 'les-deux';
  const pct = stat.seuil > 0 ? Math.min(Math.round((stat.montantLeve / (stat.seuil * (stat.nbBackers || 1))) * 100), 100) : 0;

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[#0F172A] text-xs font-semibold truncate">{stat.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{ background: `${color}18`, color }}>
              {formatEur(stat.seuil)} / contrib.
            </span>
          </div>
          {stat.description && (
            <p className="text-[#94A3B8] text-[10px] leading-snug">{stat.description}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[#0F172A] text-xs font-bold">{formatEur(stat.montantLeve)}</p>
          <p className="text-[#94A3B8] text-[10px]">{stat.nbBackers} contrib.</p>
        </div>
      </div>

      {/* Barre de progression palier */}
      <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: animated ? `${pct}%` : '0%', backgroundColor: color }} />
      </div>

      {/* Badges Don / Investissement */}
      <div className="flex items-center gap-2 flex-wrap">
        {acceptsDons && stat.don.backers > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: '#FEF3EE', border: '1px solid #B05B3B20' }}>
            <Heart style={{ width: 10, height: 10, color: TERRA }} />
            <span className="text-[10px] font-semibold" style={{ color: TERRA }}>
              Don · {stat.don.backers} pers. · {formatEur(stat.don.montant)}
            </span>
          </div>
        )}
        {acceptsInvest && stat.invest.backers > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: '#E0F2FE', border: `1px solid ${TEAL}20` }}>
            <BarChart2 style={{ width: 10, height: 10, color: TEAL }} />
            <span className="text-[10px] font-semibold" style={{ color: TEAL }}>
              Invest. · {stat.invest.backers} pers. · {formatEur(stat.invest.montant)}
              {stat.rendement_invest ? ` · ${stat.rendement_invest}%/an` : ''}
            </span>
          </div>
        )}
        {acceptsDons && stat.contrepartie_don && (
          <span className="text-[10px] text-[#94A3B8] italic">{stat.contrepartie_don}</span>
        )}
      </div>
    </div>
  );
}

// ── Carte projet avec accordéon paliers ──────────────────────────────────────
function ProjetCard({ proj, animated }: { proj: ProProjet; animated: boolean }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const pct = proj.objectif > 0 ? Math.round((proj.leve / proj.objectif) * 100) : 0;
  const isTermine = proj.statut === 'Terminé';
  const statsP = getPaliersStats(proj);

  const finBadge = {
    'dons':         { label: 'Dons',           icon: Heart,    color: TERRA },
    'investissement':{ label: 'Investissement', icon: BarChart2, color: TEAL },
    'les-deux':     { label: 'Don + Invest.',   icon: null,      color: '#7C3AED' },
  }[proj.finType];

  return (
    <div className="rounded-2xl bg-white overflow-hidden"
      style={{ border: `1.5px solid ${proj.color}25`, boxShadow: `0 2px 10px ${proj.color}0A` }}>

      {/* Header projet */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center flex-shrink-0"
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${proj.color}14` }}>
            <TrendingUp style={{ width: 18, height: 18, color: proj.color }} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[#0F172A] text-sm font-semibold truncate">{proj.nom}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: isTermine ? '#D1FAE5' : proj.leve === 0 ? '#F1F5F9' : '#EFF6FF',
                  color:      isTermine ? '#059669' : proj.leve === 0 ? '#64748B' : TEAL,
                }}>
                {isTermine ? '✓ Terminé' : proj.leve === 0 ? '⏳ En attente' : '● En cours'}
              </span>
            </div>
            {/* Badge type financement */}
            <div className="flex items-center gap-1 mt-0.5">
              {finBadge.icon ? (
                <finBadge.icon style={{ width: 10, height: 10, color: finBadge.color }} />
              ) : (
                <div className="flex gap-0.5">
                  <Heart style={{ width: 9, height: 9, color: TERRA }} />
                  <BarChart2 style={{ width: 9, height: 9, color: TEAL }} />
                </div>
              )}
              <span className="text-[10px]" style={{ color: finBadge.color }}>{finBadge.label}</span>
            </div>
          </div>
          <button onClick={() => navigate('/kauri/pro-projets')}
            className="p-1 rounded-lg hover:bg-[#F8FAFC] transition-colors flex-shrink-0">
            <ChevronRight style={{ width: 16, height: 16, color: '#CBD5E1' }} />
          </button>
        </div>

        {/* Barre progression globale */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: animated ? `${Math.min(pct, 100)}%` : '0%',
                backgroundColor: proj.color,
                opacity: 0.85,
              }} />
          </div>
          <span className="text-[#94A3B8] text-xs flex-shrink-0">{pct}%</span>
        </div>
        <div className="flex justify-between">
          <p className="text-[#64748B] text-xs">
            {formatEur(proj.leve)} / {formatEur(proj.objectif)}
          </p>
          {proj.backers > 0 && (
            <p className="text-[#94A3B8] text-xs">{proj.backers} contributeurs</p>
          )}
        </div>
      </div>

      {/* Toggle détail paliers */}
      {statsP && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
            <span className="text-xs font-medium" style={{ color: proj.color }}>
              Détail par palier ({statsP.length} paliers)
            </span>
            {expanded
              ? <ChevronUp style={{ width: 14, height: 14, color: '#94A3B8' }} />
              : <ChevronDown style={{ width: 14, height: 14, color: '#94A3B8' }} />
            }
          </button>

          {expanded && (
            <div className="px-4 pb-3 bg-[#FAFBFC]">
              {statsP.map((stat, i) => (
                <PalierRow key={i} stat={stat} color={proj.color} animated={animated} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Projet sans données de contribution */}
      {!statsP && proj.leve === 0 && (
        <div className="px-4 pb-3 border-t border-[#F1F5F9]">
          <p className="text-[#94A3B8] text-xs py-2 text-center">
            En attente de premières contributions
          </p>
        </div>
      )}
    </div>
  );
}

// ── Résumé global Don vs Investissement ─────────────────────────────────────
function SummaryDonInvest({ projets }: { projets: ProProjet[] }) {
  let totalDon = 0, totalInvest = 0, backersDon = 0, backersInvest = 0;

  projets.forEach(proj => {
    const stats = getPaliersStats(proj);
    if (!stats) return;
    stats.forEach(s => {
      totalDon    += s.don.montant;
      totalInvest += s.invest.montant;
      backersDon    += s.don.backers;
      backersInvest += s.invest.backers;
    });
  });

  const total = totalDon + totalInvest;
  const pctDon = total > 0 ? Math.round((totalDon / total) * 100) : 50;

  if (total === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-white mb-5" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <p className="text-[#0F172A] text-xs font-bold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: TERRA }} />
        Répartition Don / Investissement
      </p>

      {/* Barre bicolore */}
      <div className="h-3 rounded-full overflow-hidden flex mb-2">
        <div className="h-full transition-all duration-700" style={{ width: `${pctDon}%`, backgroundColor: TERRA }} />
        <div className="h-full transition-all duration-700" style={{ width: `${100 - pctDon}%`, backgroundColor: TEAL }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: '#FEF3EE' }}>
          <Heart style={{ width: 16, height: 16, color: TERRA, flexShrink: 0 }} />
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ color: TERRA }}>{formatEur(totalDon)}</p>
            <p className="text-[10px] text-[#94A3B8]">Dons · {backersDon} pers. · {pctDon}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: '#E0F2FE' }}>
          <BarChart2 style={{ width: 16, height: 16, color: TEAL, flexShrink: 0 }} />
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ color: TEAL }}>{formatEur(totalInvest)}</p>
            <p className="text-[10px] text-[#94A3B8]">Invest. · {backersInvest} pers. · {100 - pctDon}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────
export function ProLevesScreen() {
  const navigate = useNavigate();
  const { projets } = useProData();
  const [animated, setAnimated] = useState(false);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const totalLeve      = projets.reduce((s, p) => s + p.leve, 0);
  const objectifGlobal = projets.reduce((s, p) => s + p.objectif, 0);
  const pctGlobal      = objectifGlobal > 0 ? Math.round((totalLeve / objectifGlobal) * 100) : 0;
  const projetsActifs  = projets.filter(p => p.statut === 'En cours').length;
  const totalBackers   = projets.reduce((s, p) => s + (p.backers || 0), 0);

  const mensuel = MOIS_LABELS.map((mois, i) => {
    const base = BASE_PROJETS_IDS.reduce((s, id) => s + (BASE_MENSUEL[id]?.[i] ?? 0), 0);
    const nouveaux = i === MOIS_LABELS.length - 1
      ? projets.filter(p => !BASE_PROJETS_IDS.includes(p.id)).reduce((s, p) => s + p.leve, 0)
      : 0;
    return { mois, montant: base + nouveaux };
  });

  const maxMensuel    = Math.max(...mensuel.map(m => m.montant), 1);
  const totalActuel   = mensuel[mensuel.length - 1].montant;
  const totalPrec     = mensuel[mensuel.length - 2].montant;
  const evolutionPct  = totalPrec > 0 ? Math.round(((totalActuel - totalPrec) / totalPrec) * 100) : 0;

  // Projets avec contributions (actifs ou terminés)
  const projetsAvecData  = projets.filter(p => p.leve > 0);
  const projetsSansData  = projets.filter(p => p.leve === 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-10">

      {/* HEADER */}
      <div style={{ backgroundColor: AMBER, borderRadius: '0 0 28px 28px' }} className="px-5 pt-14 pb-6 shadow-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Financement · Pro</p>
            <h1 className="text-white text-2xl font-bold">Mes Levées de Fonds</h1>
          </div>
          <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-white text-xs font-semibold">{formatEur(totalLeve)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0 px-5 pt-6 pb-2">

        {/* PROGRESSION GLOBALE */}
        <div className="rounded-2xl p-5 bg-white mb-5" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Target style={{ width: 15, height: 15, color: AMBER }} />
            <span className="text-[#64748B] text-xs font-medium">Objectif global de levée</span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-[#0F172A] text-xl font-bold">{formatEur(totalLeve)}</span>
            <span className="text-[#64748B] text-sm">/ {formatEur(objectifGlobal)}</span>
          </div>
          <div className="h-3 rounded-full bg-[#F1F5F9] overflow-hidden mb-2">
            <div className="h-full rounded-full" style={{
              width: animated ? `${pctGlobal}%` : '0%',
              background: `linear-gradient(90deg, ${AMBER}, ${GOLD})`,
              transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8] text-xs">{pctGlobal}% atteint</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              {formatEur(objectifGlobal - totalLeve)} restants
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: TrendingUp, label: 'Total levé',    value: formatEur(totalLeve), color: AMBER,     bg: '#FEF3C7'   },
            { icon: Target,     label: 'Projets actifs',value: String(projetsActifs), color: TEAL,     bg: `${TEAL}14` },
            { icon: Users,      label: 'Contributeurs', value: String(totalBackers),  color: '#7C3AED', bg: '#7C3AED14' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="rounded-2xl p-3 bg-white" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: bg }}>
                <Icon style={{ width: 15, height: 15, color }} />
              </div>
              <p className="text-[#0F172A] text-sm font-bold leading-tight">{value}</p>
              <p className="text-[#94A3B8] text-xs mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <div className="mx-0 h-px bg-[#E8EDF2] mb-5" />

        {/* GRAPHE MENSUEL */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#0F172A] text-sm font-bold flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: AMBER }} />
            Évolution des levées
          </p>
          {evolutionPct !== 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: evolutionPct > 0 ? '#D1FAE5' : '#FEE2E2', color: evolutionPct > 0 ? '#059669' : '#EF4444' }}>
              {evolutionPct > 0 ? '+' : ''}{evolutionPct}% vs mois préc.
            </span>
          )}
        </div>

        <div className="rounded-2xl p-4 bg-white mb-5" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
          <div className="flex items-end gap-2 h-32 px-1">
            {mensuel.map((m, i) => {
              const pct = maxMensuel > 0 ? m.montant / maxMensuel : 0;
              const isLast = i === mensuel.length - 1;
              const isSelected = selectedBar === i;
              return (
                <div key={m.mois} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-center leading-tight"
                    style={{ color: isSelected || isLast ? AMBER : 'transparent', minHeight: 14 }}>
                    {m.montant > 0 ? formatEur(m.montant) : ''}
                  </span>
                  <button
                    onClick={() => setSelectedBar(isSelected ? null : i)}
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: animated ? `${Math.max(pct * 90, m.montant > 0 ? 4 : 0)}px` : '4px',
                      background: isSelected
                        ? `linear-gradient(180deg, ${AMBER}, ${GOLD})`
                        : isLast
                        ? `linear-gradient(180deg, ${AMBER}CC, ${GOLD}99)`
                        : `${AMBER}35`,
                      transition: `height ${0.4 + i * 0.08}s cubic-bezier(0.34,1.56,0.64,1)`,
                      minHeight: m.montant > 0 ? 4 : 0,
                      cursor: m.montant > 0 ? 'pointer' : 'default',
                    }}
                  />
                  <span className="text-[11px] font-medium" style={{ color: isSelected || isLast ? AMBER : '#94A3B8' }}>
                    {m.mois}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[#F1F5F9] text-xs text-[#94A3B8]">
            <span>Cumul : <strong className="text-[#0F172A]">{formatEur(mensuel.reduce((s, m) => s + m.montant, 0))}</strong></span>
            <span>Moy./mois : <strong className="text-[#0F172A]">{formatEur(Math.round(mensuel.reduce((s, m) => s + m.montant, 0) / (mensuel.filter(m => m.montant > 0).length || 1)))}</strong></span>
          </div>
        </div>

        <div className="mx-0 h-px bg-[#E8EDF2] mb-5" />

        {/* RÉPARTITION DON / INVESTISSEMENT */}
        <SummaryDonInvest projets={projetsAvecData} />

        {/* PROJETS AVEC CONTRIBUTIONS — DÉTAIL PAR PALIER */}
        {projetsAvecData.length > 0 && (
          <>
            <p className="text-[#0F172A] text-sm font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: GOLD }} />
              Contributions par palier ({projetsAvecData.length} projet{projetsAvecData.length > 1 ? 's' : ''})
            </p>
            <div className="space-y-3 mb-5">
              {projetsAvecData.map(proj => (
                <ProjetCard key={proj.id} proj={proj} animated={animated} />
              ))}
            </div>
          </>
        )}

        {/* PROJETS EN ATTENTE */}
        {projetsSansData.length > 0 && (
          <>
            <div className="mx-0 h-px bg-[#E8EDF2] mb-5" />
            <p className="text-[#0F172A] text-sm font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: '#94A3B8' }} />
              En attente de contributions ({projetsSansData.length})
            </p>
            <div className="space-y-3 mb-5">
              {projetsSansData.map(proj => (
                <ProjetCard key={proj.id} proj={proj} animated={animated} />
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate('/kauri/pro-project-form')}
          className="w-full mt-2 flex items-center justify-center gap-2 py-4 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${AMBER}, ${GOLD})`, boxShadow: `0 4px 16px ${AMBER}40` }}>
          <Plus style={{ width: 18, height: 18, color: '#fff' }} />
          <span className="text-white text-sm font-bold">Lancer une nouvelle levée</span>
        </button>
      </div>

      {/* FOOTER */}
      <div className="mx-5 mt-6 flex items-center justify-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        <p className="text-[#94A3B8] text-xs">Valorisation en temps réel · Mis à jour il y a 2 min</p>
      </div>
    </div>
  );
}
