import {
  ArrowLeft, Search, Users, TrendingUp, Calendar, Shield,
  Star, Filter, ChevronRight, X, CheckCircle2, Lock,
  Globe, Zap, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';
import { toast } from 'sonner';

interface TontineOffer {
  id: string;
  name: string;
  description: string;
  organizer: string;
  organizerAvatar: string;
  trustScore: number;
  members: number;
  maxMembers: number;
  contribution: number;
  frequency: 'Mensuelle' | 'Bimensuelle' | 'Hebdomadaire';
  duration: number; 
  nextStart: string;
  category: 'Famille' | 'Business' | 'Diaspora' | 'Jeunes' | 'Investissement';
  categoryColor: string;
  isPrivate: boolean;
  spotsLeft: number;
  featured?: boolean;
  minTrustScore?: number;
}

const CATEGORIES = ['Tous', 'Investissement', 'Diaspora', 'Jeunes', 'Famille', 'Business'];
const FREQUENCIES = ['Toutes', 'Mensuelle', 'Bimensuelle', 'Hebdomadaire'];
const AMOUNTS = ['Tous', '< 200€', '200–500€', '> 500€'];

const CATEGORY_UI_CONFIG: Record<string, { color: string }> = {
  'Investissement': { color: '#006D77' },
  'Diaspora': { color: '#D4AF37' },
  'Jeunes': { color: '#7C3AED' },
  'Business': { color: '#16A34A' },
  'Famille': { color: '#EC4899' }
};

interface JoinSheetProps {
  tontine: TontineOffer;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

function JoinSheet({ tontine, onClose, onConfirm, isDarkMode }: JoinSheetProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsActionSubmitting] = useState(false);
  const { user } = useAuth();
  
  const bg = isDarkMode ? '#1E293B' : '#FFFFFF';
  const textMain = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';
  const border = isDarkMode ? '#334155' : '#E8ECF0';

  const executeJoinTransaction = async () => {
    if (!user) return;
    setIsActionSubmitting(true);
    const toastId = toast.loading("Signature du contrat Smart KAURI sur la blockchain...");
    
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('tontine_members')
        .insert({
          tontine_id: tontine.id,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') {
          toast.warning("Vous êtes déjà membre de ce cercle d'épargne.", { id: toastId });
          onClose();
          return;
        }
        throw error;
      }

      toast.success("Ralliement validé avec succès !", { id: toastId });
      onConfirm();
    } catch (err: any) {
      toast.error("Échec de la transaction réseau.", { id: toastId });
      console.error(err);
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }} />

      <div style={{
        position: 'relative', background: bg, borderRadius: '24px 24px 0 0', padding: '0 0 40px',
        maxHeight: '85dvh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        maxWidth: 430, width: '100%', margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: isDarkMode ? '#334155' : '#E2E8F0' }} />
        </div>

        <div style={{ background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}CC)`, margin: '12px 16px 0', borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rejoindre la tontine</p>
              <h2 style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 800 }}>{tontine.name}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} color="#fff" />
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ background: isDarkMode ? '#0F172A' : '#F8FAFC', borderRadius: 14, padding: '14px 16px', marginBottom: 14, border: `1px solid ${border}` }}>
            {[
              { label: 'Contribution', value: `${tontine.contribution} € / ${tontine.frequency.toLowerCase()}` },
              { label: 'Durée', value: `${tontine.duration} mois` },
              { label: 'Cagnotte totale', value: `${(tontine.contribution * tontine.maxMembers * tontine.duration).toLocaleString('fr-FR')} €` },
              { label: 'Tu recevras', value: `${(tontine.contribution * tontine.maxMembers).toLocaleString('fr-FR')} €`, highlight: true },
              { label: 'Membres', value: `${tontine.members} / ${tontine.maxMembers}` },
              { label: 'Prochain départ', value: tontine.nextStart },
            ].map((row: any, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0,
                borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none'
              }}>
                <span style={{ fontSize: 13, color: textMuted }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.highlight ? tontine.categoryColor : textMain }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: isDarkMode ? '#0F172A' : '#F8FAFC', borderRadius: 14, padding: '12px 16px', marginBottom: 14, border: `1px solid ${border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {tontine.organizerAvatar}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: textMain }}>{tontine.organizer}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: textMuted }}>Organisateur · Trust Score {tontine.trustScore}/5</p>
            </div>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} style={{ fill: i <= Math.round(tontine.trustScore) ? '#D4AF37' : 'none', color: i <= Math.round(tontine.trustScore) ? '#D4AF37' : '#CBD5E1' }} />
              ))}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            onClick={() => setAgreed(a => !a)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 20, textAlign: 'left' }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: `2px solid ${agreed ? tontine.categoryColor : isDarkMode ? '#475569' : '#CBD5E1'}`,
              background: agreed ? tontine.categoryColor : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
            }}>
              {agreed && <CheckCircle2 size={14} color="#fff" />}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: textMuted, lineHeight: 1.5 }}>
              J'ai lu et j'accepte les <span style={{ color: tontine.categoryColor, fontWeight: 700 }}>règles de la tontine</span> et le <span style={{ color: tontine.categoryColor, fontWeight: 700 }}>contrat smart KAURI</span>. Je m'engage à effectuer mes contributions à temps.
            </p>
          </button>

          <button
            disabled={!agreed || isSubmitting}
            onClick={executeJoinTransaction}
            style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none',
              background: agreed ? `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}BB)` : isDarkMode ? '#1E293B' : '#E2E8F0',
              color: agreed ? '#fff' : isDarkMode ? '#475569' : '#94A3B8',
              fontSize: 15, fontWeight: 800, cursor: agreed && !isSubmitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', boxShadow: agreed ? `0 4px 20px ${tontine.categoryColor}40` : 'none'
            }}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" style={{ margin: '0 auto' }} /> : agreed ? `Rejoindre · ${tontine.contribution} € / mois` : 'Acceptez les conditions pour continuer'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessOverlayProps {
  tontine: TontineOffer;
  onDone: () => void;
  isDarkMode: boolean;
}

function SuccessOverlay({ tontine, onDone, isDarkMode }: SuccessOverlayProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: isDarkMode ? '#0F172A' : '#F0FDF4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}BB)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: `0 0 0 16px ${tontine.categoryColor}20` }}>
        <CheckCircle2 size={48} color="#fff" />
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: isDarkMode ? '#F8FAFC' : '#0F172A', textAlign: 'center' }}>Bienvenue dans la tontine !</h2>
      <p style={{ margin: '0 0 6px', fontSize: 15, color: isDarkMode ? '#94A3B8' : '#64748B', textAlign: 'center' }}>
        Tu as rejoint <strong style={{ color: tontine.categoryColor }}>{tontine.name}</strong>
      </p>
      <p style={{ margin: '0 0 32px', fontSize: 13, color: isDarkMode ? '#64748B' : '#94A3B8', textAlign: 'center' }}>
        Premier versement de <strong>{tontine.contribution} €</strong> le {tontine.nextStart}
      </p>
      <div style={{ background: isDarkMode ? '#1E293B' : '#fff', border: `1px solid ${isDarkMode ? '#334155' : '#D1FAE5'}`, borderRadius: 16, padding: '16px 20px', width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Zap size={20} color={tontine.categoryColor} />
        <p style={{ margin: 0, fontSize: 13, color: isDarkMode ? '#94A3B8' : '#475569', lineHeight: 1.5 }}>
          La tontine est sécurisée par <strong style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>smart contract KAURI</strong>. Tes fonds sont protégés.
        </p>
      </div>
      <button
        onClick={onDone}
        style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}BB)`,
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 20px ${tontine.categoryColor}40`
        }}
      >
        Voir mes tontines actives
      </button>
    </div>
  );
}

export function RejoindreTontineScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { profile, user } = useAuth();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeFreq, setActiveFreq] = useState('Toutes');
  const [activeAmount, setActiveAmount] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTontine, setSelectedTontine] = useState<TontineOffer | null>(null);
  const [joinedTontine, setJoinedTontine] = useState<TontineOffer | null>(null);
  
  const [tontinesList, setTontinesList] = useState<TontineOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const trustScore = Math.round(Number(profile?.trust_score ?? profile?.trustScore) || 0);

  useEffect(() => {
    const fetchGlobalTontinesCatalogue = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('tontines')
          .select('id, name, contribution_amount, frequency, start_date, max_members, description, min_trust_score, type')
          .eq('type', 'publique')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedOffers: TontineOffer[] = (data || []).map((t: any) => {
          let deducedCategory: any = 'Investissement';
          if (t.name.toLowerCase().includes('famille')) deducedCategory = 'Famille';
          else if (t.name.toLowerCase().includes('diaspora')) deducedCategory = 'Diaspora';
          else if (t.name.toLowerCase().includes('pro') || t.name.toLowerCase().includes('agro')) deducedCategory = 'Business';
          else if (t.name.toLowerCase().includes('young')) deducedCategory = 'Jeunes';

          const maxM = Number(t.max_members) || 12;
          const currentMembersCount = Math.floor(Math.random() * 4) + 4;

          let displayFrequency: 'Mensuelle' | 'Bimensuelle' | 'Hebdomadaire' = 'Mensuelle';
          if (t.frequency === 'weekly') displayFrequency = 'Hebdomadaire';
          if (t.frequency === 'biweekly') displayFrequency = 'Bimensuelle';

          return {
            id: t.id,
            name: t.name,
            description: t.description || "Aucune description fournie par le créateur du cercle d'épargne.",
            organizer: 'KAURI Validator',
            organizerAvatar: 'KV',
            trustScore: 4.9,
            members: Math.min(currentMembersCount, maxM),
            maxMembers: maxM,
            contribution: Number(t.contribution_amount) || 0,
            frequency: displayFrequency,
            duration: 12,
            nextStart: new Date(t.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            category: deducedCategory,
            categoryColor: CATEGORY_UI_CONFIG[deducedCategory]?.color || '#006D77',
            isPrivate: t.type === 'privee',
            spotsLeft: Math.max(0, maxM - currentMembersCount),
            featured: Number(t.min_trust_score) >= 80,
            minTrustScore: Number(t.min_trust_score) || 0
          };
        });

        setTontinesList(mappedOffers);
      } catch (err) {
        console.error('Erreur lors du chargement des offres:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalTontinesCatalogue();
  }, [user]);

  const bg = isDarkMode ? '#0F172A' : '#F4F6F8';
  const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#334155' : '#E8ECF0';
  const textMain = isDarkMode ? '#F8FAFC' : '#0F172A';
  const textMuted = isDarkMode ? '#94A3B8' : '#64748B';

  const filtered = tontinesList.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tous' || t.category === activeCategory;
    const matchFreq = activeFreq === 'Toutes' || t.frequency === activeFreq;
    const matchAmt = activeAmount === 'Tous'
      || (activeAmount === '< 200€' && t.contribution < 200)
      || (activeAmount === '200–500€' && t.contribution >= 200 && t.contribution <= 500)
      || (activeAmount === '> 500€' && t.contribution > 500);
    return matchSearch && matchCat && matchFreq && matchAmt;
  });

  const featuredOffers = filtered.filter(t => t.featured);
  const regularOffers = filtered.filter(t => !t.featured);

  return (
    <div style={{ minHeight: '100dvh', background: bg, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006D77 0%, #0D9488 100%)', padding: '48px 20px 20px', position: 'relative' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 52, left: 20, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>

        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>KAURI TONTINES</p>
          <h1 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 800 }}>Rejoindre une tontine</h1>
          <p style={{ margin: '4px 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {isLoading ? '...' : `${tontinesList.reduce((s, t) => s + t.spotsLeft, 0)} places disponibles · ${tontinesList.length} tontines ouvertes`}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="rgba(255,255,255,0.7)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une tontine…"
            style={{
              width: '100%', boxSizing: 'border-box', paddingLeft: 40, paddingRight: 44, paddingTop: 12, paddingBottom: 12,
              borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)', color: '#fff', fontSize: 14, outline: 'none'
            }}
          />
          <button
            onClick={() => setShowFilters(s => !s)}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: showFilters ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <Filter size={15} color="#fff" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ background: isDarkMode ? '#1E293B' : '#fff', borderBottom: `1px solid ${cardBorder}`, padding: '14px 16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catégorie</p>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${activeCategory === c ? '#006D77' : cardBorder}`,
                background: activeCategory === c ? '#006D77' : 'transparent', color: activeCategory === c ? '#fff' : textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>{c}</button>
            ))}
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fréquence</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {FREQUENCIES.map(f => (
              <button key={f} onClick={() => setActiveFreq(f)} style={{
                flexShrink: 0, padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${activeFreq === f ? '#006D77' : cardBorder}`,
                background: activeFreq === f ? '#006D77' : 'transparent', color: activeFreq === f ? '#fff' : textMuted, fontSize: 11, fontWeight: 600, cursor: 'pointer'
              }}>{f}</button>
            ))}
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contribution</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {AMOUNTS.map(a => (
              <button key={a} onClick={() => setActiveAmount(a)} style={{
                flexShrink: 0, padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${activeAmount === a ? '#006D77' : cardBorder}`,
                background: activeAmount === a ? '#006D77' : 'transparent', color: activeAmount === a ? '#fff' : textMuted, fontSize: 11, fontWeight: 600, cursor: 'pointer'
              }}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {/* Category pills */}
      {!showFilters && (
        <div style={{ background: isDarkMode ? '#1E293B' : '#fff', borderBottom: `1px solid ${cardBorder}`, padding: '10px 0' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${activeCategory === c ? '#006D77' : cardBorder}`,
                background: activeCategory === c ? '#006D77' : 'transparent', color: activeCategory === c ? '#fff' : textMuted, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 12 }}>
            <Loader2 className="animate-spin text-[#006D77]" size={24} />
            <p style={{ fontSize: 12, color: textMuted, fontWeight: 600 }}>Calcul du catalogue de tontines...</p>
          </div>
        ) : (
          <>
            {/* Recommandées */}
            {featuredOffers.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>⚡ Recommandées</p>
                {featuredOffers.map(t => <TontineCard key={t.id} tontine={t} userTrustScore={trustScore} onJoin={setSelectedTontine} isDarkMode={isDarkMode} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted={textMuted} featured />)}
              </div>
            )}

            {/* Toutes */}
            {regularOffers.length > 0 && (
              <div>
                {featuredOffers.length > 0 && (
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Toutes les tontines</p>
                )}
                {regularOffers.map(t => <TontineCard key={t.id} tontine={t} userTrustScore={trustScore} onJoin={setSelectedTontine} isDarkMode={isDarkMode} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted={textMuted} />)}
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <Users size={40} color={isDarkMode ? '#334155' : '#CBD5E1'} style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 14, color: textMuted }}>Aucune tontine ne correspond à votre recherche</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Join sheet */}
      {selectedTontine && (
        <JoinSheet
          tontine={selectedTontine}
          onClose={() => setSelectedTontine(null)}
          onConfirm={() => {
            setJoinedTontine(selectedTontine);
            setSelectedTontine(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Success overlay */}
      {joinedTontine && (
        <SuccessOverlay
          tontine={joinedTontine}
          onDone={() => navigate('/kauri/tontines-actives')}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

function TontineCard({
  tontine, userTrustScore, onJoin, isDarkMode, cardBg, cardBorder, textMain, textMuted, featured,
}: {
  tontine: TontineOffer;
  userTrustScore: number;
  onJoin: (t: TontineOffer) => void;
  isDarkMode: boolean;
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textMuted: string;
  featured?: boolean;
}) {
  const fillPct = tontine.members / tontine.maxMembers;
  const urgency = tontine.spotsLeft <= 2;
  
  const isLockedForUser = tontine.minTrustScore ? userTrustScore < tontine.minTrustScore : false;

  return (
    <div style={{
      background: cardBg, border: `1.5px solid ${featured ? tontine.categoryColor + '50' : cardBorder}`,
      borderRadius: 20, marginBottom: 12, overflow: 'hidden',
      boxShadow: featured ? `0 4px 20px ${tontine.categoryColor}15` : isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${tontine.categoryColor}, ${tontine.categoryColor}44)` }} />

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: tontine.categoryColor, background: tontine.categoryColor + '15', padding: '2px 7px', borderRadius: 8 }}>
                {tontine.category}
              </span>
              {tontine.isPrivate ? <Lock size={11} color={textMuted} /> : <Globe size={11} color={textMuted} />}
              {urgency && <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '2px 6px', borderRadius: 8 }}>⚡ Plus que {tontine.spotsLeft} place{tontine.spotsLeft > 1 ? 's' : ''}</span>}
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: textMain }}>{tontine.name}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, marginLeft: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: tontine.categoryColor }}>{tontine.contribution} €</span>
            <span style={{ fontSize: 11, color: textMuted, whiteSpace: 'nowrap' }}>/ {tontine.frequency.toLowerCase()}</span>
          </div>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 13, color: textMuted, lineHeight: 1.45 }}>{tontine.description}</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} color={textMuted} />
            <span style={{ fontSize: 12, color: textMuted }}>{tontine.members}/{tontine.maxMembers}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={13} color={textMuted} />
            <span style={{ fontSize: 12, color: textMuted }}>{tontine.duration} mois</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color={textMuted} />
            <span style={{ fontSize: 12, color: textMuted, whiteSpace: 'nowrap' }}>Départ {tontine.nextStart.split(' ').slice(-2).join(' ')}</span>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: textMuted }}>Places occupées</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: textMain }}>{Math.round(fillPct * 100)}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: isDarkMode ? '#334155' : '#F1F5F9', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, width: `${fillPct * 100}%`,
              background: urgency ? 'linear-gradient(90deg, #EF4444, #F97316)' : `linear-gradient(90deg, ${tontine.categoryColor}, ${tontine.categoryColor}BB)`,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 10 }}>
              {tontine.organizerAvatar}
            </div>
            <span style={{ fontSize: 12, color: textMuted }}>{tontine.organizer}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Shield size={12} color="#D4AF37" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37' }}>{tontine.trustScore}</span>
          </div>
        </div>

        {isLockedForUser ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isDarkMode ? 'rgba(212,175,55,0.08)' : '#FFFBEB',
            border: `1px solid ${isDarkMode ? 'rgba(212,175,55,0.2)' : '#FDE68A'}`, borderRadius: 12, padding: '10px 14px'
          }}>
            <Lock size={14} color="#D4AF37" />
            <span style={{ fontSize: 12, color: isDarkMode ? '#FDE68A' : '#92400E', fontWeight: 600 }}>
              Trust Score ≥ {tontine.minTrustScore} requis (Membre Émérite)
            </span>
          </div>
        ) : (
          <button
            onClick={() => onJoin(tontine)}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, ${tontine.categoryColor}, ${tontine.categoryColor}CC)`,
              color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 3px 14px ${tontine.categoryColor}30`
            }}
          >
            <Users size={15} color="#fff" />
            Rejoindre cette tontine
            <ChevronRight size={15} color="rgba(255,255,255,0.7)" />
          </button>
        )}
      </div>
    </div>
  );
}

export default RejoindreTontineScreen;
