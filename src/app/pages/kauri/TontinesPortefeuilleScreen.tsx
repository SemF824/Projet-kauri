import { ArrowLeft, ChevronRight, Lock, Globe, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

const TEAL = '#0A847E';

function formatEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PRIVEES = [
  { id: 'p1', name: 'Cercle Familial',        members: 8,  amount: 500,   monthly: 62.5,  nextDate: '1 juil.',   progress: 72 },
  { id: 'p2', name: 'Amis Dakar',              members: 6,  amount: 300,   monthly: 50,    nextDate: '15 juil.',  progress: 55 },
  { id: 'p3', name: 'Groupe Entrepreneurs',    members: 10, amount: 120,   monthly: 12,    nextDate: '5 août',    progress: 40 },
];

const PUBLIQUES = [
  { id: 'q1', name: 'Cercle Émeraude',         members: 20, amount: 350,   monthly: 17.5,  nextDate: '10 juil.', progress: 80 },
  { id: 'q2', name: 'Tontine Diaspora',         members: 15, amount: 200,   monthly: 13.3,  nextDate: '20 juil.', progress: 60 },
];

const TOTAL_PRIVEES  = PRIVEES.reduce((s, t) => s + t.amount, 0);   // 920
const TOTAL_PUBLIQUES = PUBLIQUES.reduce((s, t) => s + t.amount, 0); // 550
const TOTAL = TOTAL_PRIVEES + TOTAL_PUBLIQUES; // 1470

type Section = 'privees' | 'publiques';

function TontineCard({ t, isDark }: { t: typeof PRIVEES[0]; isDark: boolean }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: isDark ? '#1E293B' : '#fff',
        border: `1.5px solid ${isDark ? '#334155' : '#EEF2F7'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{t.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users style={{ width: 12, height: 12, color: '#94A3B8' }} />
            <span className="text-[#94A3B8] text-xs">{t.members} membres</span>
            <span className="text-[#CBD5E1] text-xs">·</span>
            <Calendar style={{ width: 12, height: 12, color: '#94A3B8' }} />
            <span className="text-[#94A3B8] text-xs">{t.nextDate}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{formatEur(t.amount)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#94A3B8] text-xs">Progression du cycle</span>
          <span className="text-[#64748B] text-xs font-medium">{t.progress} %</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${t.progress}%`, background: `linear-gradient(90deg, ${TEAL}, #0D9488)` }}
          />
        </div>
      </div>

      {/* Cotisation mensuelle */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <span className="text-[#94A3B8] text-xs">Cotisation mensuelle</span>
        <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{formatEur(t.monthly)}</span>
      </div>
    </div>
  );
}

export function TontinesPortefeuilleScreen() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('privees');
  const [showAllPrivees, setShowAllPrivees] = useState(false);
  const [showAllPubliques, setShowAllPubliques] = useState(false);
  const [animated, setAnimated] = useState(false);
  const isDark = false;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, []);

  const priveesList  = showAllPrivees   ? PRIVEES   : PRIVEES.slice(0, 2);
  const publiquesList = showAllPubliques ? PUBLIQUES : PUBLIQUES.slice(0, 1);

  const privPct  = (TOTAL_PRIVEES / TOTAL) * 100;   // 62.6
  const pubPct   = (TOTAL_PUBLIQUES / TOTAL) * 100;  // 37.4

  return (
    <div className={`min-h-screen pb-10 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>

      {/* ── HEADER ── */}
      <div
        style={{ backgroundColor: TEAL, borderRadius: '0 0 28px 28px' }}
        className="px-5 pt-14 pb-6 shadow-xl"
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Portefeuille</p>
            <h1 className="text-white text-2xl font-bold">Mes Tontines</h1>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-0.5">Solde total</p>
            <p className="text-white text-lg font-bold">{formatEur(TOTAL)}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">

        {/* ── VISUAL SPLIT BAR ── */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: animated ? '#fff' : '#fff',
            border: '1.5px solid #EEF2F7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <p className="text-[#0F172A] text-sm font-bold mb-4">Répartition</p>

          {/* Bar */}
          <div className="h-3 rounded-full overflow-hidden flex mb-4" style={{ gap: 3 }}>
            <div
              className="rounded-full transition-all"
              style={{ width: `${privPct}%`, background: `linear-gradient(90deg, ${TEAL}, #0D9488)`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
            <div
              className="rounded-full"
              style={{ flex: 1, background: 'linear-gradient(90deg, #D4A373, #E8C547)' }}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Privées',   pct: privPct,  amount: TOTAL_PRIVEES,  color: TEAL,     icon: Lock },
              { label: 'Publiques', pct: pubPct,   amount: TOTAL_PUBLIQUES, color: '#D4A373', icon: Globe },
            ].map(({ label, pct, amount, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                  <Icon style={{ width: 16, height: 16, color }} />
                </div>
                <div>
                  <p className="text-[#0F172A] text-xs font-bold">{label}</p>
                  <p className="text-[#94A3B8] text-xs">{pct.toFixed(0)} % · {formatEur(amount)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
            {[
              { label: 'Cercles actifs', value: String(PRIVEES.length + PUBLIQUES.length) },
              { label: 'Membres total',  value: String(PRIVEES.reduce((s, t) => s + t.members, 0) + PUBLIQUES.reduce((s, t) => s + t.members, 0)) },
              { label: 'Cotisations/mois', value: formatEur(PRIVEES.reduce((s, t) => s + t.monthly, 0) + PUBLIQUES.reduce((s, t) => s + t.monthly, 0)) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[#0F172A] text-sm font-bold">{value}</p>
                <p className="text-[#94A3B8] text-xs leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex rounded-2xl p-1" style={{ backgroundColor: '#E8EDF2' }}>
          {([['privees', 'Privées', Lock], ['publiques', 'Publiques', Globe]] as [Section, string, any][]).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeSection === key ? '#fff' : 'transparent',
                color: activeSection === key ? TEAL : '#64748B',
                boxShadow: activeSection === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── SECTION : PRIVÉES ── */}
        {activeSection === 'privees' && (
          <div
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#0F172A] text-sm font-bold">Tontines Privées</p>
                <p className="text-[#94A3B8] text-xs">{PRIVEES.length} cercles · {formatEur(TOTAL_PRIVEES)}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${TEAL}12`, border: `1px solid ${TEAL}30` }}>
                <Users style={{ width: 12, height: 12, color: TEAL }} />
                <span className="text-xs font-semibold" style={{ color: TEAL }}>{PRIVEES.reduce((s, t) => s + t.members, 0)} membres</span>
              </div>
            </div>

            <div className="space-y-3">
              {priveesList.map(t => <TontineCard key={t.id} t={t} isDark={isDark} />)}
            </div>

            {PRIVEES.length > 2 && (
              <button
                onClick={() => setShowAllPrivees(v => !v)}
                className="w-full mt-3 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: `${TEAL}12`, color: TEAL, border: `1px solid ${TEAL}25` }}
              >
                {showAllPrivees ? 'Réduire' : `Tout afficher (${PRIVEES.length})`}
                <ChevronRight style={{ width: 14, height: 14, transform: showAllPrivees ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
              </button>
            )}
          </div>
        )}

        {/* ── SECTION : PUBLIQUES ── */}
        {activeSection === 'publiques' && (
          <div
            style={{
              opacity: animated ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#0F172A] text-sm font-bold">Tontines Publiques</p>
                <p className="text-[#94A3B8] text-xs">{PUBLIQUES.length} cercles · {formatEur(TOTAL_PUBLIQUES)}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#D4A37318', border: '1px solid #D4A37330' }}>
                <Users style={{ width: 12, height: 12, color: '#D4A373' }} />
                <span className="text-xs font-semibold" style={{ color: '#D4A373' }}>{PUBLIQUES.reduce((s, t) => s + t.members, 0)} membres</span>
              </div>
            </div>

            <div className="space-y-3">
              {publiquesList.map(t => (
                <div
                  key={t.id}
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: '#fff', border: '1.5px solid #EEF2F7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Users style={{ width: 12, height: 12, color: '#94A3B8' }} />
                        <span className="text-[#94A3B8] text-xs">{t.members} membres</span>
                        <span className="text-[#CBD5E1] text-xs">·</span>
                        <Calendar style={{ width: 12, height: 12, color: '#94A3B8' }} />
                        <span className="text-[#94A3B8] text-xs">{t.nextDate}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#0F172A]">{formatEur(t.amount)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#94A3B8] text-xs">Progression du cycle</span>
                      <span className="text-[#64748B] text-xs font-medium">{t.progress} %</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.progress}%`, background: 'linear-gradient(90deg, #D4A373, #E8C547)' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                    <span className="text-[#94A3B8] text-xs">Cotisation mensuelle</span>
                    <span className="text-xs font-bold text-[#0F172A]">{formatEur(t.monthly)}</span>
                  </div>
                </div>
              ))}
            </div>

            {PUBLIQUES.length > 1 && (
              <button
                onClick={() => setShowAllPubliques(v => !v)}
                className="w-full mt-3 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: '#D4A37318', color: '#D4A373', border: '1px solid #D4A37325' }}
              >
                {showAllPubliques ? 'Réduire' : `Tout afficher (${PUBLIQUES.length})`}
                <ChevronRight style={{ width: 14, height: 14, transform: showAllPubliques ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
