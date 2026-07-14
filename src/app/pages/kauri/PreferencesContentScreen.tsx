import { useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabase } from '../../../utils/supabase';

const TEAL = '#0A847E';
const GOLD = '#D4AF37';

interface Category {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
  bg: string;
}

const CATEGORIES: Category[] = [
  { id: 'agriculture',    emoji: '🌱', label: 'Agriculture & Alimentation', description: 'Coopératives, circuits courts, élevage durable', color: '#16A34A', bg: '#D1FAE5' },
  { id: 'energie',        emoji: '⚡', label: 'Énergie & Environnement',    description: 'Solaire, éolien, éco-construction',              color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'sante',          emoji: '🏥', label: 'Santé & Bien-être',          description: 'Cliniques, pharmacies, télémédecine',            color: '#EC4899', bg: '#FCE7F3' },
  { id: 'commerce',       emoji: '🛍️', label: 'Commerce & Retail',          description: 'Boutiques locales, import-export, e-commerce',   color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'tech',           emoji: '💻', label: 'Tech & Digital',             description: 'Startups, SaaS, cybersécurité, IA',              color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'immobilier',     emoji: '🏗️', label: 'Immobilier',                 description: 'Résidentiel, bureaux, hôtellerie',               color: GOLD,      bg: '#FEF9C3' },
  { id: 'education',      emoji: '📚', label: 'Éducation & Formation',      description: 'Écoles, e-learning, campus numériques',          color: '#0D9488', bg: '#CCFBF1' },
  { id: 'international',  emoji: '🌍', label: 'International & Diaspora',   description: 'Projets transfrontaliers, développement local',  color: TEAL,      bg: '#CCFBF1' },
  { id: 'culture',        emoji: '🎨', label: 'Culture & Médias',           description: 'Arts, musique, presse, événementiel',            color: '#F43F5E', bg: '#FFE4E6' },
  { id: 'microfinance',   emoji: '💳', label: 'Microfinance & PME',         description: 'Entrepreneuriat, micro-crédit, incubateurs',     color: '#64748B', bg: '#F1F5F9' },
  { id: 'tourisme',       emoji: '✈️', label: 'Tourisme & Loisirs',         description: 'Hôtels, voyages, expériences locales',           color: '#06B6D4', bg: '#CFFAFE' },
  { id: 'solidarite',     emoji: '🤝', label: 'Solidarité & Social',        description: 'ONG, associations, projets communautaires',      color: '#EF4444', bg: '#FEE2E2' },
];

const MIN_SELECTION = 3;

export function PreferencesContentScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'particulier';
  
  const { profile } = useAuth();
  const supabase = getSupabase();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = async () => {
    setIsSaving(true);
    const prefsArray = Array.from(selected);

    // 1. Sauvegarde locale (Tolérance aux pannes & Cache rapide)
    localStorage.setItem('kauri_preferences', JSON.stringify(prefsArray));

    // 2. Persistance Cloud (Vraie souveraineté des données)
    if (profile?.id) {
      try {
        // Tentative d'écriture dans la colonne 'preferences' (format JSONB ou text[])
        const { error } = await supabase
          .from('profiles')
          .update({ preferences: prefsArray })
          .eq('id', profile.id);

        if (error) {
          console.warn("[Architecture Alert]: Colonne 'preferences' manquante sur la table profiles. Le fallback local prend le relais.", error);
        }
      } catch (err) {
        console.error("Échec de la synchronisation des préférences", err);
      }
    }

    setIsSaving(false);
    navigate(`/kauri/wallet-creation?type=${accountType}`);
  };

  const remaining = Math.max(0, MIN_SELECTION - selected.size);
  const ready = selected.size >= MIN_SELECTION;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans select-none">

      {/* ── HEADER ── */}
      <div
        style={{ background: `linear-gradient(150deg, ${TEAL} 0%, #064E4A 100%)`, borderRadius: '0 0 32px 32px' }}
        className="px-6 pt-16 pb-8 shadow-xl"
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="h-1 rounded-full flex-1 transition-all"
              style={{ backgroundColor: s <= 4 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>

        <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-bold">Étape finale</p>
        <h1 className="text-white text-2xl font-black mb-2 tracking-tight">Vos centres d'intérêt</h1>
        <p className="text-white/80 text-sm leading-relaxed">
          Sélectionnez <span className="text-white font-bold">au moins {MIN_SELECTION} thèmes</span> pour personnaliser vos recommandations de projets.
        </p>

        {/* Selection counter */}
        {selected.size > 0 && (
          <div className="mt-5 flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: ready ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.1)' }}
            >
              {ready
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                : <span className="w-3.5 h-3.5 rounded-full border-2 border-white/50 block" />
              }
              <span className="text-xs font-bold" style={{ color: ready ? '#4ADE80' : 'rgba(255,255,255,0.9)' }}>
                {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
                {!ready && ` · encore ${remaining}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── GRID ── */}
      <div className="flex-1 px-4 pt-6 pb-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const isSelected = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className="text-left rounded-3xl p-4 transition-all active:scale-[0.96] relative overflow-hidden border-none cursor-pointer"
                style={{
                  backgroundColor: isSelected ? cat.bg : '#ffffff',
                  border: `2px solid ${isSelected ? cat.color : '#F1F5F9'}`,
                  boxShadow: isSelected
                    ? `0 8px 24px ${cat.color}25`
                    : '0 2px 8px rgba(15,23,42,0.04)',
                }}
              >
                {/* Checkmark absolu */}
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}

                <span className="text-3xl mb-3 block drop-shadow-sm">{cat.emoji}</span>

                <p
                  className="text-xs font-black leading-tight mb-1.5"
                  style={{ color: isSelected ? cat.color : '#0F172A', paddingRight: isSelected ? 16 : 0 }}
                >
                  {cat.label}
                </p>

                <p className="text-[10px] leading-relaxed font-medium" style={{ color: isSelected ? cat.color + 'D0' : '#64748B' }}>
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs mt-6 text-slate-400 font-medium">
          Vous pourrez modifier vos préférences à tout moment dans votre profil.
        </p>
      </div>

      {/* ── FOOTER CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-6"
        style={{ background: 'linear-gradient(to top, #F8FAFC 80%, transparent)' }}
      >
        <button
          disabled={!ready || isSaving}
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all border-none"
          style={{
            background: ready ? `linear-gradient(135deg, ${TEAL}, #0D9488)` : '#E2E8F0',
            color: ready ? '#ffffff' : '#94A3B8',
            boxShadow: ready ? `0 10px 25px ${TEAL}40` : 'none',
            cursor: ready && !isSaving ? 'pointer' : 'not-allowed',
          }}
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : ready ? (
            <>Accéder à mon espace KAURI <ArrowRight className="w-5 h-5" /></>
          ) : (
            `Choisissez encore ${remaining} thème${remaining > 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
}

export default PreferencesContentScreen;
