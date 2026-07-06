import { ArrowLeft, Lock, Globe, Users, Calendar, ChevronRight, Plus, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useState, useEffect } from 'react';
import { SERVER_URL, authHeaders } from '../../../utils/supabase';

const TEAL = '#006D77';
const GOLD = '#D4AF37';

interface TontineCreee {
  id: string;
  name: string;
  type: 'privee' | 'publique';
  members: number;
  maxMembers: number;
  cotisation: number;
  nextPayment: string;
  progress: number;
  status: 'active' | 'en_attente' | 'complet';
}

function serverTontineToLocal(t: any): TontineCreee {
  const memberCount = t.members?.length ?? 0;
  const progress = Math.round((t.currentRound / t.totalRounds) * 100);
  const nextDate = t.nextPaymentDate
    ? new Date(t.nextPaymentDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  return {
    id: t.id,
    name: t.name,
    type: t.type === 'public' ? 'publique' : 'privee',
    members: memberCount,
    maxMembers: t.maxMembers ?? 10,
    cotisation: t.contribution ?? 0,
    nextPayment: nextDate,
    progress,
    status: t.status === 'active' ? (memberCount >= t.maxMembers ? 'complet' : 'active') : 'en_attente',
  };
}

const STATUS_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  active:     { label: 'Actif',        bg: '#D1FAE5', text: '#16A34A' },
  en_attente: { label: 'En attente',   bg: '#FEF3C7', text: '#D97706' },
  complet:    { label: 'Complet',      bg: '#EDE9FE', text: '#7C3AED' },
};

function TontineCard({ t, isDarkMode }: { t: TontineCreee; isDarkMode: boolean }) {
  const navigate = useNavigate();
  const st = STATUS_LABEL[t.status];
  const color = t.type === 'privee' ? TEAL : GOLD;

  return (
    <div
      className={`rounded-2xl p-4 border cursor-pointer transition-all active:scale-[0.99] ${isDarkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
            {t.type === 'privee'
              ? <Lock style={{ width: 16, height: 16, color }} />
              : <Globe style={{ width: 16, height: 16, color }} />
            }
          </div>
          <div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{t.name}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{t.type === 'privee' ? 'Privée' : 'Publique'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.text }}>
            {st.label}
          </span>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }}>
            <Settings2 style={{ width: 13, height: 13, color: '#94A3B8' }} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Users style={{ width: 11, height: 11, color: '#94A3B8' }} />
            <span className="text-xs text-[#94A3B8]">Membres</span>
          </div>
          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>
            {t.members}<span className="text-[#94A3B8] font-normal">/{t.maxMembers}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] mb-0.5">Cotisation</p>
          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{t.cotisation} €</p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Calendar style={{ width: 11, height: 11, color: '#94A3B8' }} />
            <span className="text-xs text-[#94A3B8]">Prochain</span>
          </div>
          <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{t.nextPayment.split(' ').slice(0,2).join(' ')}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#94A3B8]">Progression du cycle</span>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-[#0F172A]'}`}>{t.progress} %</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }}>
          <div className="h-full rounded-full" style={{ width: `${t.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}BB)` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
        <span className="text-xs font-medium" style={{ color }}>Voir détails</span>
        <ChevronRight style={{ width: 15, height: 15, color: '#CBD5E1' }} />
      </div>
    </div>
  );
}

export function MesTontinesScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [tontines, setTontines] = useState<TontineCreee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authHeaders().then(headers =>
      fetch(`${SERVER_URL}/tontines`, { headers })
        .then(r => r.ok ? r.json() : [])
        .then((data: any[]) => setTontines(data.map(serverTontineToLocal)))
        .catch(() => setTontines([]))
        .finally(() => setLoading(false))
    );
  }, []);

  const privees   = tontines.filter(t => t.type === 'privee');
  const publiques = tontines.filter(t => t.type === 'publique');

  const bg     = isDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]';
  const cardBg = isDarkMode ? 'bg-[#1E293B]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#0F172A]';

  return (
    <div className={`min-h-screen pb-10 ${bg}`}>

      {/* Header */}
      <div className="px-5 pt-14 pb-6 rounded-b-[28px] shadow-xl"
        style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0D9488 100%)` }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Gestion</p>
            <h1 className="text-white text-2xl font-bold">Mes Tontines Créées</h1>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-0.5">Total créées</p>
            <p className="text-white text-lg font-bold">{loading ? '…' : tontines.length}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">

        {/* ── SECTION PRIVÉES ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
              <Lock style={{ width: 14, height: 14, color: TEAL }} />
              Tontines Privées
              <span className="text-xs font-normal text-[#94A3B8]">({privees.length})</span>
            </h2>
            <button
              onClick={() => navigate('/kauri/creer-tontine-privee')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}
            >
              <Plus style={{ width: 12, height: 12 }} />
              Créer
            </button>
          </div>

          {privees.length > 0 ? (
            <div className="space-y-3">
              {privees.map(t => <TontineCard key={t.id} t={t} isDarkMode={isDarkMode} />)}
            </div>
          ) : (
            <div className={`rounded-2xl p-6 text-center border-2 border-dashed ${isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <Lock style={{ width: 28, height: 28, color: '#CBD5E1', margin: '0 auto 8px' }} />
              <p className="text-[#94A3B8] text-sm">Aucune tontine privée créée</p>
              <button
                onClick={() => navigate('/kauri/creer-tontine-privee')}
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-full"
                style={{ backgroundColor: `${TEAL}18`, color: TEAL }}
              >
                + Créer ma première
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION PUBLIQUES ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
              <Globe style={{ width: 14, height: 14, color: GOLD }} />
              Tontines Publiques
              <span className="text-xs font-normal text-[#94A3B8]">({publiques.length})</span>
            </h2>
            <button
              onClick={() => navigate('/kauri/creer-tontine-publique')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}30` }}
            >
              <Plus style={{ width: 12, height: 12 }} />
              Créer
            </button>
          </div>

          {publiques.length > 0 ? (
            <div className="space-y-3">
              {publiques.map(t => <TontineCard key={t.id} t={t} isDarkMode={isDarkMode} />)}
            </div>
          ) : (
            <div className={`rounded-2xl p-6 text-center border-2 border-dashed ${isDarkMode ? 'border-[#334155]' : 'border-[#E2E8F0]'}`}>
              <Globe style={{ width: 28, height: 28, color: '#CBD5E1', margin: '0 auto 8px' }} />
              <p className="text-[#94A3B8] text-sm">Aucune tontine publique créée</p>
              <button
                onClick={() => navigate('/kauri/creer-tontine-publique')}
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-full"
                style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
              >
                + Créer ma première
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
