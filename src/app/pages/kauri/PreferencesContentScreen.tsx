import { useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
  { id: 'international',  emoji: '🌍', label: 'International & Diaspora',   description: 'Projets transfrontaliers, développement local',   color: TEAL,      bg: '#CCFBF1' },
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
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    localStorage.setItem('kauri_preferences', JSON.stringify([...selected]));
    navigate(`/kauri/wallet-creation?type=${accountType}`);
  };

  const remaining = Math.max(0, MIN_SELECTION - selected.size);
  const ready = selected.size >= MIN_SELECTION;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

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
              className="h-1 rounded-full flex-1"
              style={{ backgroundColor: s <= 4 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>

        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Étape finale</p>
        <h1 className="text-white text-2xl font-bold mb-2">Vos centres d'intérêt</h1>
        <p className="text-white/75 text-sm leading-relaxed">
          Sélectionnez <span className="text-white font-semibold">au moins {MIN_SELECTION} thèmes</span> pour personnaliser vos recommandations de projets.
        </p>

        {/* Selection counter */}
        {selected.size > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: ready ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.15)' }}
            >
              {ready
                ? <CheckCircle2 style={{ width: 13, height: 13, color: '#4ADE80' }} />
                : <span style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', display: 'inline-block' }} />
              }
              <span className="text-xs font-semibold" style={{ color: ready ? '#4ADE80' : 'rgba(255,255,255,0.80)' }}>
                {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
                {!ready && ` · encore ${remaining}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── GRID ── */}
      <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const isSelected = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className="text-left rounded-2xl p-4 transition-all active:scale-[0.97] relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? cat.bg : '#fff',
                  border: `2px solid ${isSelected ? cat.color : '#E8EDF2'}`,
                  boxShadow: isSelected
                    ? `0 4px 16px ${cat.color}30`
                    : '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CheckCircle2 style={{ width: 13, height: 13, color: '#fff' }} />
                  </div>
                )}

                {/* Emoji */}
                <span className="text-2xl mb-2.5 block">{cat.emoji}</span>

                {/* Label */}
                <p
                  className="text-xs font-bold leading-tight mb-1"
                  style={{ color: isSelected ? cat.color : '#0F172A', paddingRight: isSelected ? 16 : 0 }}
                >
                  {cat.label}
                </p>

                {/* Description */}
                <p className="text-xs leading-snug" style={{ color: isSelected ? cat.color + 'BB' : '#94A3B8', fontSize: 10 }}>
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-center text-xs mt-4 text-[#94A3B8]">
          Vous pourrez modifier vos préférences à tout moment dans votre profil.
        </p>
      </div>

      {/* ── FOOTER CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #F8FAFC 80%, transparent)' }}
      >
        <button
          disabled={!ready}
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all"
          style={{
            background: ready
              ? `linear-gradient(135deg, ${TEAL}, #0D9488)`
              : '#E2E8F0',
            color: ready ? '#fff' : '#94A3B8',
            boxShadow: ready ? `0 6px 20px ${TEAL}44` : 'none',
            cursor: ready ? 'pointer' : 'not-allowed',
          }}
        >
          {ready
            ? <>Accéder à mon espace KAURI <ArrowRight style={{ width: 17, height: 17 }} /></>
            : `Choisissez encore ${remaining} thème${remaining > 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  );
}
