import {
  ArrowLeft, CheckCircle2, Users, User, UserCheck, Shuffle, ListOrdered,
  Search, X, Plus, ChevronRight, Sparkles, Gift, TrendingUp, Clock,
  Shield, Zap, AlertTriangle, Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';

// ── Constantes design ─────────────────────────────────────────────────────────
const TEAL  = '#006D77';
const GOLD  = '#D4AF37';
const TERRA = '#B05B3B';
const AMBER = '#92400E';
const SLATE = '#4A4A4A';

type FinMode  = 'tontine-pro' | 'levee' | 'mixte';
type GroupType = 'solo' | 'pro-only' | 'mixte';
type OrderType = 'fixe' | 'aleatoire';
type Duration  = '3' | '6' | '9' | '12' | '18' | '24';

interface Membre {
  id: string;
  nom: string;
  entreprise: string;
  secteur: string;
  verified: boolean;
  avatar: string;
}

// Membres Pro vérifiés simulés pour la recherche
const PRO_VERIFIED_MEMBERS: Membre[] = [
  { id: 'm1', nom: 'Marianne Céleste',  entreprise: 'Agri-Bio Guadeloupe',  secteur: 'Agriculture',  verified: true, avatar: 'MC' },
  { id: 'm2', nom: 'David Okonkwo',     entreprise: 'Tech Hub Diaspora',    secteur: 'Tech',          verified: true, avatar: 'DO' },
  { id: 'm3', nom: 'Isabelle Moreau',   entreprise: 'Solaire Antilles',     secteur: 'Énergie',       verified: true, avatar: 'IM' },
  { id: 'm4', nom: 'Franck Beaubrun',   entreprise: 'Lolo Moderne SAS',     secteur: 'Immobilier',    verified: true, avatar: 'FB' },
  { id: 'm5', nom: 'Naomi Théodore',    entreprise: 'Livraison Caribéenne', secteur: 'Commerce',      verified: true, avatar: 'NT' },
  { id: 'm6', nom: 'André Kalinda',     entreprise: 'Artisanat & Terroir',  secteur: 'Artisanat',     verified: true, avatar: 'AK' },
  { id: 'm7', nom: 'Sophie Fontaine',   entreprise: 'Restaurant Créole Pro', secteur: 'Restauration', verified: true, avatar: 'SF' },
  { id: 'm8', nom: 'Marc Delacroix',    entreprise: 'Import-Export DOM',    secteur: 'Commerce',      verified: false, avatar: 'MD' },
];

// ── Composant avatars couleur ─────────────────────────────────────────────────
const AVATAR_COLORS = [TEAL, GOLD, TERRA, AMBER, '#7C3AED', '#059669', '#0369A1', '#D97706'];
function Avatar({ initials, idx, size = 36 }: { initials: string; idx: number; size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.33, backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
      {initials}
    </div>
  );
}

// ── Étapes ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Mode' },
  { id: 2, label: 'Groupe' },
  { id: 3, label: 'Membres' },
  { id: 4, label: 'Paramètres' },
];

// ── Badge "Gratuit" ───────────────────────────────────────────────────────────
function GratuitBadge({ visible, reason }: { visible: boolean; reason: string }) {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', boxShadow: '0 2px 10px rgba(212,175,55,0.35)' }}>
      <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />
      <div>
        <p className="text-white text-xs font-bold leading-none">🆓 Tontine Gratuite</p>
        <p className="text-white/80 text-[10px] mt-0.5">{reason}</p>
      </div>
    </div>
  );
}

// ── Bandeau statut tarifaire temps réel ──────────────────────────────────────
type TarifStatus = 'gratuit' | 'mixte' | 'standard' | 'exonere' | 'pending';

function PricingStatusBanner({ status, nonVerifiesCount }: { status: TarifStatus; nonVerifiesCount: number }) {
  const configs: Record<TarifStatus, { bg: string; border: string; icon: React.ElementType; iconColor: string; title: string; desc: string }> = {
    gratuit: {
      bg: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(245,158,11,0.08))',
      border: '#D4AF3750',
      icon: Sparkles, iconColor: GOLD,
      title: '🆓 Tontine 100% Gratuite',
      desc: 'Tous les membres sont des porteurs de projet vérifiés.',
    },
    exonere: {
      bg: 'rgba(212,175,55,0.08)',
      border: '#D4AF3740',
      icon: Gift, iconColor: GOLD,
      title: '⚡ Exonéré (mode Solo)',
      desc: 'Aucun frais appliqué lors de votre tour de collecte.',
    },
    mixte: {
      bg: '#FFF7ED',
      border: '#FED7AA',
      icon: AlertTriangle, iconColor: '#EA580C',
      title: '⚠ Tarification mixte',
      desc: `${nonVerifiesCount} membre${nonVerifiesCount > 1 ? 's' : ''} non vérifié${nonVerifiesCount > 1 ? 's' : ''} — frais standard appliqués.`,
    },
    standard: {
      bg: `${TEAL}08`,
      border: `${TEAL}25`,
      icon: Info, iconColor: TEAL,
      title: 'Tarification standard',
      desc: "Des frais de plateforme s'appliquent à ce mode.",
    },
    pending: {
      bg: '#F8FAFC',
      border: '#E2E8F0',
      icon: Users, iconColor: '#94A3B8',
      title: 'En attente de membres',
      desc: 'Invitez des porteurs de projet vérifiés pour bénéficier de la gratuité.',
    },
  };
  const c = configs[status];
  return (
    <div className="flex items-start gap-3 px-3.5 py-3 rounded-xl mb-1 transition-all"
      style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
      <c.icon style={{ width: 15, height: 15, color: c.iconColor, flexShrink: 0, marginTop: 1 }} />
      <div className="text-xs">
        <p className="font-bold" style={{ color: status === 'mixte' ? '#92400E' : status === 'pending' ? '#64748B' : status === 'standard' ? TEAL : AMBER }}>
          {c.title}
        </p>
        <p className="mt-0.5" style={{ color: status === 'mixte' ? '#92400E' : '#64748B' }}>{c.desc}</p>
      </div>
    </div>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────
export function ProCreerTontineScreen() {
  const navigate = useNavigate();

  const [step, setStep]               = useState(1);
  const [finMode, setFinMode]         = useState<FinMode | ''>('');
  const [groupType, setGroupType]     = useState<GroupType | ''>('');
  const [membres, setMembres]         = useState<Membre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType]     = useState<OrderType>('fixe');
  const [duration, setDuration]       = useState<Duration | ''>('');
  const [montant, setMontant]         = useState('');
  const [nomTontine, setNomTontine]   = useState('');
  const [submitted, setSubmitted]     = useState(false);

  // ── Logique de qualification automatique ──────────────────────────────────────
  const membresNonVerifies  = membres.filter(m => !m.verified);
  const membresVerifies     = membres.filter(m => m.verified);
  const tousProVerifies     = membres.length > 0 && membresNonVerifies.length === 0;
  const isSolo              = groupType === 'solo';
  const hasMixedComposition = finMode === 'tontine-pro' && !isSolo && membresNonVerifies.length > 0;

  const tarifStatus = useMemo<'gratuit' | 'mixte' | 'standard' | 'exonere' | 'pending'>(() => {
    if (finMode !== 'tontine-pro') return 'standard';
    if (isSolo) return 'exonere';
    if (membres.length === 0) return 'pending';
    if (tousProVerifies) return 'gratuit';
    return 'mixte';
  }, [finMode, isSolo, membres, tousProVerifies]);

  const isGratuit     = tarifStatus === 'gratuit' || tarifStatus === 'exonere';
  const gratuitReason = isSolo
    ? 'Exonération de frais lors de votre tour (mode Solo)'
    : '100% des membres sont des porteurs de projet vérifiés';

  // Recherche membres
  const searchResults = searchQuery.length >= 2
    ? PRO_VERIFIED_MEMBERS.filter(m =>
        (m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.entreprise.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !membres.find(x => x.id === m.id)
      )
    : [];

  const addMembre = (m: Membre) => {
    setMembres(prev => [...prev, m]);
    setSearchQuery('');
  };
  const removeMembre = (id: string) => setMembres(prev => prev.filter(m => m.id !== id));

  const canNext = () => {
    if (step === 1) return finMode !== '';
    if (step === 2) return groupType !== '';
    if (step === 3) return isSolo || membres.length >= 1;
    if (step === 4) return montant !== '' && duration !== '' && nomTontine.trim() !== '';
    return false;
  };

  const handleNext = () => {
    if (step < 4) {
      // Si solo, sauter l'étape "Membres"
      if (step === 2 && groupType === 'solo') { setStep(4); return; }
      setStep(step + 1);
    } else {
      setSubmitted(true);
      setTimeout(() => navigate('/kauri/pro-dashboard'), 2500);
    }
  };

  const handlePrev = () => {
    if (step === 4 && groupType === 'solo') { setStep(2); return; }
    if (step > 1) setStep(step - 1);
  };

  // ── Succès ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-6 px-8 pb-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center animate-bounce"
          style={{ background: 'linear-gradient(135deg, #006D77, #D4AF37)' }}>
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-[#0F172A] text-2xl font-bold text-center">Tontine créée !</h2>
        <p className="text-[#64748B] text-sm text-center leading-relaxed">
          Votre tontine <strong>"{nomTontine}"</strong> a été initialisée.
          {isGratuit && (
            <span className="block mt-2 font-semibold" style={{ color: GOLD }}>
              ✨ Aucun frais de plateforme appliqué.
            </span>
          )}
        </p>
        {isGratuit && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', boxShadow: '0 4px 16px rgba(212,175,55,0.4)' }}>
            <Gift style={{ width: 16, height: 16, color: '#fff' }} />
            <span className="text-white text-sm font-bold">Offre Pro — 100% Gratuit</span>
          </div>
        )}
        <p className="text-[#94A3B8] text-xs">Redirection vers le dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">

      {/* HEADER */}
      <div className="px-5 pt-12 pb-7 rounded-b-[2.5rem]"
        style={{ background: `linear-gradient(135deg, ${TEAL}, #004D56)` }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Tontine · Pro</p>
            <h1 className="text-white text-2xl font-bold">Créer une Tontine</h1>
            <p className="text-white/70 text-sm mt-1">Outil de levée de fonds communautaire</p>
          </div>
          {isGratuit && (
            <div className="px-2.5 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ background: 'rgba(212,175,55,0.25)', border: '1px solid rgba(212,175,55,0.4)' }}>
              <Sparkles style={{ width: 12, height: 12, color: GOLD }} />
              <span className="text-xs font-bold" style={{ color: GOLD }}>Gratuit</span>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between">
          {STEPS.filter(s => !(s.id === 3 && groupType === 'solo')).map((s, idx, arr) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all"
                  style={{
                    background: s.id < step ? GOLD : s.id === step ? '#fff' : 'rgba(255,255,255,0.15)',
                    border: s.id === step ? `2px solid ${GOLD}` : 'none',
                  }}>
                  {s.id < step
                    ? <CheckCircle2 style={{ width: 18, height: 18, color: '#fff' }} />
                    : <span className="text-xs font-bold" style={{ color: s.id === step ? TEAL : 'rgba(255,255,255,0.6)' }}>{s.id}</span>
                  }
                </div>
                <span className="text-[10px] font-medium text-center"
                  style={{ color: s.id <= step ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className="h-0.5 flex-1 mx-1 mb-5 rounded-full"
                  style={{ background: s.id < step ? GOLD : 'rgba(255,255,255,0.2)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">

        {/* ═══════════════════════════════════════════════════════════
            ÉTAPE 1 — MODE DE FINANCEMENT
        ════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[#0F172A] text-base font-bold mb-1">Mode de financement</h2>
              <p className="text-[#64748B] text-xs mb-4">Choisissez comment cette tontine sera utilisée pour lever des fonds.</p>
            </div>

            {[
              {
                value: 'tontine-pro' as FinMode,
                icon: Shield,
                color: TEAL,
                bg: `${TEAL}12`,
                label: 'Tontine Pro',
                sublabel: 'Rotation entre porteurs de projet · Offre gratuite',
                badge: '🆓 Gratuit si 100% Pro',
                recommended: true,
              },
              {
                value: 'levee' as FinMode,
                icon: TrendingUp,
                color: GOLD,
                bg: `${GOLD}12`,
                label: 'Tontine + Levée de fonds',
                sublabel: 'Les cycles alimentent votre projet de financement',
                badge: null,
                recommended: false,
              },
              {
                value: 'mixte' as FinMode,
                icon: Zap,
                color: TERRA,
                bg: `${TERRA}12`,
                label: 'Hybride',
                sublabel: 'Tontine communautaire ouverte + projet Pro',
                badge: null,
                recommended: false,
              },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFinMode(opt.value)}
                className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  background: finMode === opt.value ? opt.bg : '#fff',
                  border: finMode === opt.value ? `2px solid ${opt.color}` : '1.5px solid #EEF2F7',
                  boxShadow: finMode === opt.value ? `0 4px 16px ${opt.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: opt.bg }}>
                  <opt.icon style={{ width: 20, height: 20, color: opt.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[#0F172A] text-sm font-semibold">{opt.label}</p>
                    {opt.recommended && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${TEAL}15`, color: TEAL }}>Recommandé</span>
                    )}
                    {opt.badge && finMode === opt.value && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${GOLD}20`, color: AMBER }}>{opt.badge}</span>
                    )}
                  </div>
                  <p className="text-[#94A3B8] text-xs mt-0.5">{opt.sublabel}</p>
                </div>
                {finMode === opt.value && (
                  <CheckCircle2 style={{ width: 18, height: 18, color: opt.color, flexShrink: 0, marginTop: 2 }} />
                )}
              </button>
            ))}

            {/* Info Tontine Pro */}
            {finMode === 'tontine-pro' && (
              <div className="rounded-xl p-3.5 flex gap-3"
                style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}25` }}>
                <Shield style={{ width: 16, height: 16, color: TEAL, flexShrink: 0, marginTop: 1 }} />
                <div className="text-xs" style={{ color: TEAL }}>
                  <strong>Offre Pro :</strong> Si tous les membres sont des porteurs de projet vérifiés, la tontine est <strong>100% gratuite</strong>.
                  Si vous êtes seul (mode Solo), vous êtes <strong>exonéré lors de votre tour</strong> de collecte.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ÉTAPE 2 — TYPE DE GROUPE
        ════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[#0F172A] text-base font-bold mb-1">Type de groupe</h2>
              <p className="text-[#64748B] text-xs mb-4">Définissez qui peut participer à cette tontine.</p>
            </div>

            {[
              {
                value: 'solo' as GroupType,
                icon: User,
                color: AMBER,
                bg: `${AMBER}12`,
                label: 'Solo',
                sublabel: 'Vous êtes le seul porteur de projet',
                note: 'Exonéré lors de votre tour · Aucun autre membre requis',
                badge: '⚡ Exonération',
              },
              {
                value: 'pro-only' as GroupType,
                icon: UserCheck,
                color: TEAL,
                bg: `${TEAL}12`,
                label: 'Groupe Pro uniquement',
                sublabel: 'Tous les membres doivent être Pro vérifiés',
                note: 'Tontine 100% gratuite si tous sont vérifiés',
                badge: '🆓 Gratuit potentiel',
              },
              {
                value: 'mixte' as GroupType,
                icon: Users,
                color: '#7C3AED',
                bg: '#7C3AED12',
                label: 'Groupe mixte',
                sublabel: 'Pro + Particuliers KAURI',
                note: 'Tarification standard applicable',
                badge: null,
              },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setGroupType(opt.value)}
                className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  background: groupType === opt.value ? opt.bg : '#fff',
                  border: groupType === opt.value ? `2px solid ${opt.color}` : '1.5px solid #EEF2F7',
                  boxShadow: groupType === opt.value ? `0 4px 16px ${opt.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: opt.bg }}>
                  <opt.icon style={{ width: 20, height: 20, color: opt.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[#0F172A] text-sm font-semibold">{opt.label}</p>
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${opt.color}18`, color: opt.color }}>{opt.badge}</span>
                    )}
                  </div>
                  <p className="text-[#94A3B8] text-xs">{opt.sublabel}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: opt.color }}>{opt.note}</p>
                </div>
                {groupType === opt.value && (
                  <CheckCircle2 style={{ width: 18, height: 18, color: opt.color, flexShrink: 0, marginTop: 2 }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ÉTAPE 3 — INVITATION DES MEMBRES
        ════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[#0F172A] text-base font-bold mb-1">Inviter des membres</h2>
              <p className="text-[#64748B] text-xs mb-2">
                {groupType === 'pro-only'
                  ? 'Seuls les comptes Pro vérifiés (badge ✓) seront acceptés.'
                  : 'Recherchez des membres Pro ou Particuliers KAURI.'}
              </p>

              {/* Statut tarifaire en temps réel */}
              {finMode === 'tontine-pro' && (
                <PricingStatusBanner status={tarifStatus} nonVerifiesCount={membresNonVerifies.length} />
              )}
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94A3B8' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom ou entreprise…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: `1.5px solid ${searchQuery ? TEAL : '#E2E8F0'}`, background: '#fff' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X style={{ width: 16, height: 16, color: '#94A3B8' }} />
                </button>
              )}
            </div>

            {/* Résultats recherche */}
            {searchResults.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #EEF2F7', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                {searchResults.map((m, i) => {
                  const isBlocked = groupType === 'pro-only' && !m.verified;
                  const willBreakFree = finMode === 'tontine-pro' && !m.verified && tousProVerifies;
                  return (
                    <button
                      key={m.id}
                      onClick={() => !isBlocked && addMembre(m)}
                      disabled={isBlocked}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAFAFA]"
                      style={{
                        borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                        opacity: isBlocked ? 0.45 : 1,
                        cursor: isBlocked ? 'not-allowed' : 'pointer',
                      }}>
                      <Avatar initials={m.avatar} idx={i} size={38} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-[#0F172A] text-sm font-semibold truncate">{m.nom}</p>
                          {m.verified
                            ? <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                                style={{ background: `${TEAL}15`, color: TEAL }}>Pro ✓</span>
                            : <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                                style={{ background: '#FEF3C7', color: '#92400E' }}>Particulier</span>
                          }
                          {willBreakFree && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                              style={{ background: '#FEE2E2', color: '#DC2626' }}>⚠ Perd la gratuité</span>
                          )}
                          {isBlocked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                              style={{ background: '#F1F5F9', color: '#64748B' }}>Bloqué · Pro requis</span>
                          )}
                        </div>
                        <p className="text-[#94A3B8] text-xs truncate">{m.entreprise} · {m.secteur}</p>
                      </div>
                      {isBlocked
                        ? <Shield style={{ width: 16, height: 16, color: '#CBD5E1', flexShrink: 0 }} />
                        : <Plus style={{ width: 18, height: 18, color: TEAL, flexShrink: 0 }} />
                      }
                    </button>
                  );
                })}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="text-[#94A3B8] text-xs text-center py-3">Aucun résultat pour "{searchQuery}"</p>
            )}

            {/* Alerte composition mixte */}
            {hasMixedComposition && (
              <div className="rounded-xl p-3.5 flex gap-3"
                style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA' }}>
                <AlertTriangle style={{ width: 16, height: 16, color: '#EA580C', flexShrink: 0, marginTop: 1 }} />
                <div className="text-xs" style={{ color: '#92400E' }}>
                  <strong>Tarification mixte activée :</strong> {membresNonVerifies.length} membre{membresNonVerifies.length > 1 ? 's' : ''} non vérifié{membresNonVerifies.length > 1 ? 's' : ''} dans le groupe.
                  Des frais standard s'appliqueront. Retirez-les pour retrouver la <strong>gratuité Pro</strong>.
                </div>
              </div>
            )}

            {/* Membres ajoutés */}
            {membres.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#0F172A] text-xs font-bold">
                    Membres invités ({membres.length})
                    <span className="font-normal text-[#94A3B8] ml-1">
                      · {membresVerifies.length} Pro ✓
                      {membresNonVerifies.length > 0 && ` · ${membresNonVerifies.length} Particulier${membresNonVerifies.length > 1 ? 's' : ''}`}
                    </span>
                  </p>
                  {finMode === 'tontine-pro' && tousProVerifies && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${GOLD}20`, color: AMBER }}>🆓 100% Pro · Gratuit</span>
                  )}
                </div>
                <div className="space-y-2">
                  {membres.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white transition-all"
                      style={{
                        border: `1.5px solid ${!m.verified && finMode === 'tontine-pro' ? '#FED7AA' : m.verified ? TEAL + '30' : '#EEF2F7'}`,
                        background: !m.verified && finMode === 'tontine-pro' ? '#FFFBF5' : '#fff',
                      }}>
                      <Avatar initials={m.avatar} idx={i} size={34} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[#0F172A] text-xs font-semibold truncate">{m.nom}</p>
                          {m.verified
                            ? <span className="text-[10px] px-1 py-0 rounded font-bold flex-shrink-0" style={{ color: TEAL }}>✓ Pro</span>
                            : <span className="text-[10px] px-1 py-0 rounded font-bold flex-shrink-0" style={{ color: '#EA580C' }}>⚠ Particulier</span>
                          }
                        </div>
                        <p className="text-[#94A3B8] text-[10px] truncate">{m.entreprise}</p>
                      </div>
                      <button onClick={() => removeMembre(m.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors">
                        <X style={{ width: 13, height: 13, color: '#94A3B8' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {membres.length === 0 && searchQuery.length < 2 && (
              <div className="text-center py-8">
                <Users style={{ width: 36, height: 36, color: '#CBD5E1', margin: '0 auto 8px' }} />
                <p className="text-[#94A3B8] text-xs">Tapez au moins 2 caractères pour rechercher</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ÉTAPE 4 — PARAMÈTRES
        ════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[#0F172A] text-base font-bold mb-1">Paramètres de la tontine</h2>
              <p className="text-[#64748B] text-xs mb-2">Définissez les règles de fonctionnement.</p>
              {finMode === 'tontine-pro' && (
                <PricingStatusBanner status={tarifStatus} nonVerifiesCount={membresNonVerifies.length} />
              )}
              {isGratuit && !isSolo && <GratuitBadge visible={true} reason={gratuitReason} />}
            </div>

            {/* Nom */}
            <div>
              <label className="text-[#0F172A] text-sm font-medium mb-2 block">
                Nom de la tontine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nomTontine}
                onChange={e => setNomTontine(e.target.value)}
                placeholder="Ex: Tontine Entrepreneurs Caraïbes 2026"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: `1.5px solid ${nomTontine ? TEAL : '#E2E8F0'}`, background: '#fff' }}
              />
            </div>

            {/* Montant / cycle */}
            <div>
              <label className="text-[#0F172A] text-sm font-medium mb-2 block">
                Montant par cycle (€) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] font-bold text-sm">€</span>
                <input
                  type="number"
                  value={montant}
                  onChange={e => setMontant(e.target.value)}
                  placeholder="Ex: 2 000"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={{ border: `1.5px solid ${montant ? TEAL : '#E2E8F0'}`, background: '#fff' }}
                />
              </div>
              {montant && membres.length > 0 && (
                <p className="text-xs mt-1.5" style={{ color: TEAL }}>
                  → Pot total par cycle : {(parseFloat(montant) * (membres.length + 1)).toLocaleString('fr-FR')} €
                  ({membres.length + 1} membres)
                </p>
              )}
            </div>

            {/* Durée */}
            <div>
              <label className="text-[#0F172A] text-sm font-medium mb-2 block">
                Durée de la campagne <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['3', '6', '9', '12', '18', '24'] as Duration[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: duration === d ? TEAL : '#fff',
                      color: duration === d ? '#fff' : '#64748B',
                      border: duration === d ? `2px solid ${TEAL}` : '1.5px solid #E2E8F0',
                    }}>
                    {d} mois
                  </button>
                ))}
              </div>
            </div>

            {/* Ordre de passage */}
            <div>
              <label className="text-[#0F172A] text-sm font-medium mb-2 block">Ordre de passage</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'fixe' as OrderType, icon: ListOrdered, label: 'Ordre fixe', sublabel: "Défini à l'inscription" },
                  { value: 'aleatoire' as OrderType, icon: Shuffle, label: 'Tirage au sort', sublabel: 'Aléatoire à chaque cycle' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOrderType(opt.value)}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all"
                    style={{
                      background: orderType === opt.value ? `${TEAL}10` : '#fff',
                      border: orderType === opt.value ? `2px solid ${TEAL}` : '1.5px solid #E2E8F0',
                    }}>
                    <opt.icon style={{ width: 22, height: 22, color: orderType === opt.value ? TEAL : '#94A3B8' }} />
                    <p className="text-xs font-bold" style={{ color: orderType === opt.value ? TEAL : '#0F172A' }}>{opt.label}</p>
                    <p className="text-[10px] text-[#94A3B8] text-center leading-tight">{opt.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Récap */}
            {nomTontine && montant && duration && (
              <div className="rounded-2xl p-4" style={{ background: `${TEAL}08`, border: `1.5px solid ${TEAL}25` }}>
                <p className="text-[#0F172A] text-xs font-bold mb-3 flex items-center gap-2">
                  <Clock style={{ width: 14, height: 14, color: TEAL }} />
                  Récapitulatif
                </p>
                <div className="space-y-2">
                  {[
                    ['Nom', nomTontine],
                    ['Mode', finMode === 'tontine-pro' ? 'Tontine Pro' : finMode === 'levee' ? 'Tontine + Levée' : 'Hybride'],
                    ['Groupe', groupType === 'solo' ? 'Solo' : groupType === 'pro-only' ? 'Pro uniquement' : 'Mixte'],
                    ['Membres', isSolo ? 'Vous seul' : `${membres.length} invité${membres.length > 1 ? 's' : ''} + vous`],
                    ['Montant/cycle', `${parseFloat(montant).toLocaleString('fr-FR')} € / membre`],
                    ['Durée', `${duration} mois`],
                    ['Ordre', orderType === 'fixe' ? 'Fixe' : 'Tirage au sort'],
                    ['Frais', tarifStatus === 'gratuit' ? '🆓 Gratuit (100% Pro)' : tarifStatus === 'exonere' ? '⚡ Exonéré (Solo)' : tarifStatus === 'mixte' ? '⚠ Mixte (frais partiels)' : 'Standard'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-[#94A3B8] text-xs">{k}</span>
                      <span className="text-xs font-semibold"
                        style={{ color: k === 'Frais'
                          ? (tarifStatus === 'gratuit' || tarifStatus === 'exonere' ? GOLD : tarifStatus === 'mixte' ? '#EA580C' : '#0F172A')
                          : '#0F172A' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NAVIGATION BAS DE PAGE */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-6 pt-3 bg-[#F8FAFC]"
        style={{ borderTop: '1px solid #E8EDF2' }}>
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-4 rounded-xl text-sm font-semibold bg-white transition-colors"
              style={{ border: '1.5px solid #E2E8F0', color: SLATE }}>
              Précédent
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex-1 py-4 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canNext()
                ? `linear-gradient(135deg, ${TEAL}, #004D56)`
                : '#CBD5E1',
              boxShadow: canNext() ? `0 4px 16px ${TEAL}40` : 'none',
            }}>
            {step === 4 ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles style={{ width: 16, height: 16 }} />
                {isGratuit ? 'Créer (Gratuit)' : 'Créer la tontine'}
              </span>
            ) : step === 2 && groupType === 'solo' ? (
              <span className="flex items-center justify-center gap-2">
                Paramètres <ChevronRight style={{ width: 16, height: 16 }} />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Suivant <ChevronRight style={{ width: 16, height: 16 }} />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
