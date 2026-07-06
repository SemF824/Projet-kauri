import { ArrowLeft, Globe, Users, Calendar, Euro, Shuffle, ShieldCheck, ChevronDown, Tag, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { getSupabase } from '../../../utils/supabase';
import { toast } from 'sonner';

const GOLD = '#D4AF37';

type Frequence    = 'mensuelle' | 'hebdomadaire' | 'bihebdomadaire';
type OrdrePassage = 'aleatoire' | 'fixe';
type Categorie    = 'famille' | 'entrepreneuriat' | 'diaspora' | 'epargne' | 'investissement' | 'autre';
type Duree        = '3' | '6' | '9' | '12' | '18' | '24';

const CATEGORIES: { value: Categorie; label: string; emoji: string }[] = [
  { value: 'famille',         label: 'Famille',        emoji: '👨‍👩‍👧' },
  { value: 'entrepreneuriat', label: 'Entrepreneuriat', emoji: '🚀' },
  { value: 'diaspora',        label: 'Diaspora',        emoji: '🌍' },
  { value: 'epargne',         label: 'Épargne',         emoji: '💰' },
  { value: 'investissement',  label: 'Investissement',  emoji: '📈' },
  { value: 'autre',           label: 'Autre',           emoji: '✨' },
];

export function CreerTontinePubliqueScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [nom, setNom]                     = useState('');
  const [description, setDescription]     = useState('');
  const [cotisation, setCotisation]       = useState('');
  const [maxMembres, setMaxMembres]       = useState('');
  const [dateDebut, setDateDebut]         = useState('');
  const [frequence, setFrequence]         = useState<Frequence>('mensuelle');
  const [ordre, setOrdre]                 = useState<OrdrePassage>('aleatoire');
  const [categorie, setCategorie]         = useState<Categorie | null>(null);
  const [trustMin, setTrustMin]           = useState('60');
  const [duree, setDuree]                 = useState<Duree | ''>('');
  const [showFrequence, setShowFrequence] = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const bg          = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg      = isDarkMode ? '#1E293B' : '#ffffff';
  const border      = isDarkMode ? '#334155' : '#E8EDF2';
  const textPrimary = isDarkMode ? '#ffffff' : '#0F172A';
  const textSec     = '#94A3B8';
  const inputBg     = isDarkMode ? '#0F172A' : '#F8FAFC';

  const FREQUENCES: { value: Frequence; label: string }[] = [
    { value: 'mensuelle',      label: 'Mensuelle'         },
    { value: 'hebdomadaire',   label: 'Hebdomadaire'      },
    { value: 'bihebdomadaire', label: 'Toutes les 2 sem.' },
  ];

  const potTotal = cotisation && maxMembres && duree
    ? parseFloat(cotisation) * parseInt(maxMembres) * parseInt(duree)
    : null;

  function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
    return (
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: textSec }}>
          <Icon style={{ width: 13, height: 13 }} />
          {label}
        </label>
        {children}
      </div>
    );
  }

  function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
    return (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ backgroundColor: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
      />
    );
  }

  function ToggleGroup<T extends string>({ options, value, onChange, color }: {
    options: { value: T; label: string; icon?: any }[];
    value: T;
    onChange: (v: T) => void;
    color: string;
  }) {
    return (
      <div className="flex rounded-xl p-1" style={{ backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: value === opt.value ? color : 'transparent',
              color: value === opt.value ? '#fff' : textSec,
              boxShadow: value === opt.value ? `0 2px 8px ${color}44` : 'none',
            }}
          >
            {opt.icon && <opt.icon style={{ width: 13, height: 13 }} />}
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  const isValid = nom.trim() && cotisation && maxMembres && dateDebut && categorie && duree !== '';

  const handleCreate = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Session introuvable. Reconnectez-vous.");

      // 1. Insertion de la Tontine Publique avec contraintes de confiance
      const { data: newTontine, error: tontineError } = await supabase
        .from('tontines')
        .insert({
          creator_id: user.id,
          name: nom,
          description: description || null,
          contribution_amount: Number(cotisation),
          frequency: frequence,
          max_members: Number(maxMembres),
          duration_months: Number(duree),
          start_date: dateDebut,
          order_type: ordre,
          category: categorie,
          min_trust_score: Number(trustMin),
          type: 'publique',
          status: 'en_attente',
          current_round: 0,
          total_rounds: Number(maxMembres)
        })
        .select()
        .single();

      if (tontineError) throw tontineError;

      // 2. Enregistrement automatique de l'admin
      const { error: memberError } = await supabase
        .from('tontine_members')
        .insert({
          tontine_id: newTontine.id,
          user_id: user.id,
          role: 'admin',
          payout_order: 1
        });

      if (memberError) throw memberError;

      toast.success('Tontine publique créée !');
      navigate('/kauri/mes-tontines');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erreur Supabase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: bg }}>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 shadow-xl"
        style={{ background: `linear-gradient(135deg, #B8860B 0%, ${GOLD} 100%)`, borderRadius: '0 0 28px 28px' }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest">Nouvelle tontine</p>
            <h1 className="text-white text-xl font-bold">Créer • Publique</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">
        {/* Infos générales */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Informations générales</p>

          <Field label="Nom de la tontine" icon={Globe}>
            <Input value={nom} onChange={setNom} placeholder="Ex : Cercle Émeraude" />
          </Field>

          <Field label="Description" icon={Globe}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez l'objectif et les valeurs de ce cercle public..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{ backgroundColor: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
            />
          </Field>

          <Field label="Catégorie" icon={Tag}>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategorie(cat.value)}
                  className="flex flex-col items-center py-3 rounded-xl text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: categorie === cat.value ? `${GOLD}20` : inputBg,
                    border: `1.5px solid ${categorie === cat.value ? GOLD : border}`,
                    color: categorie === cat.value ? GOLD : textSec,
                    fontWeight: categorie === cat.value ? 700 : 400,
                  }}
                >
                  <span className="text-lg mb-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Paramètres financiers */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Paramètres financiers</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cotisation (€)" icon={Euro}>
              <Input value={cotisation} onChange={setCotisation} placeholder="150" type="number" />
            </Field>
            <Field label="Membres max" icon={Users}>
              <Input value={maxMembres} onChange={setMaxMembres} placeholder="20" type="number" />
            </Field>
          </div>

          <Field label="Durée de la tontine" icon={Calendar}>
            <div className="grid grid-cols-3 gap-2">
              {(['3', '6', '9', '12', '18', '24'] as Duree[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDuree(d)}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: duree === d ? `linear-gradient(135deg, #B8860B, ${GOLD})` : inputBg,
                    color: duree === d ? '#fff' : textSec,
                    border: `1.5px solid ${duree === d ? GOLD : border}`,
                    boxShadow: duree === d ? `0 2px 8px ${GOLD}40` : 'none',
                  }}
                >
                  {d} mois
                </button>
              ))}
            </div>
          </Field>

          <Field label="Fréquence" icon={Calendar}>
            <button
              onClick={() => setShowFrequence(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
            >
              <span>{FREQUENCES.find(f => f.value === frequence)?.label}</span>
              <ChevronDown style={{ width: 16, height: 16, color: textSec, transform: showFrequence ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showFrequence && (
              <div className="mt-1 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${border}` }}>
                {FREQUENCES.map(f => (
                  <button
                    key={f.value}
                    onClick={() => { setFrequence(f.value); setShowFrequence(false); }}
                    className="w-full px-4 py-3 text-sm text-left"
                    style={{
                      backgroundColor: frequence === f.value ? `${GOLD}14` : cardBg,
                      color: frequence === f.value ? GOLD : textPrimary,
                      fontWeight: frequence === f.value ? 600 : 400,
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <Field label="Date de début" icon={Calendar}>
            <Input value={dateDebut} onChange={setDateDebut} placeholder="" type="date" />
          </Field>

          {/* Pot estimé */}
          {potTotal !== null && (
            <div className="rounded-xl p-3.5 flex items-center gap-3"
              style={{ background: `${GOLD}10`, border: `1.5px solid ${GOLD}35` }}>
              <TrendingUp style={{ width: 16, height: 16, color: GOLD, flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#92400E' }}>
                  Pot total estimé : {potTotal.toLocaleString('fr-FR')} €
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: textSec }}>
                  {cotisation} € × {maxMembres} membres × {duree} mois
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Règles & critères */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Règles & critères d'adhésion</p>

          <Field label="Ordre de passage" icon={Shuffle}>
            <ToggleGroup
              value={ordre}
              onChange={setOrdre}
              color={GOLD}
              options={[
                { value: 'aleatoire', label: 'Aléatoire', icon: Shuffle },
                { value: 'fixe',      label: 'Fixe',      icon: Users   },
              ]}
            />
          </Field>

          <Field label="Trust Score minimum requis" icon={ShieldCheck}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: textSec }}>Score minimum</span>
                <span className="text-sm font-bold" style={{ color: GOLD }}>{trustMin} / 100</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={trustMin}
                onChange={e => setTrustMin(e.target.value)}
                className="w-full h-2 rounded-full outline-none cursor-pointer"
                style={{ accentColor: GOLD }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: textSec }}>0 — Ouvert à tous</span>
                <span className="text-xs" style={{ color: textSec }}>100</span>
              </div>
            </div>
          </Field>
        </div>

        {/* CTA */}
        <button
          disabled={!isValid || isSubmitting}
          onClick={handleCreate}
          className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: isValid ? `linear-gradient(135deg, #B8860B, ${GOLD})` : '#CBD5E1',
            boxShadow: isValid ? `0 4px 16px ${GOLD}44` : 'none',
            opacity: isValid ? 1 : 0.7,
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white安全 animate-spin" />
              Création…
            </>
          ) : 'Créer ma tontine publique'}
        </button>

        <p className="text-center text-xs pb-4" style={{ color: textSec }}>
          Votre tontine sera visible par tous les membres KAURI ayant le Trust Score requis.
        </p>
      </div>
    </div>
  );
}
