import { ArrowLeft, Lock, Users, Calendar, Euro, Shuffle, Link2, QrCode, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const TEAL = '#006D77';

type Frequence = 'mensuelle' | 'hebdomadaire' | 'bihebdomadaire';
type OrdrePassage = 'aleatoire' | 'fixe';
type ModeInvitation = 'lien' | 'qr' | 'les_deux';

export function CreerTontinePriveeScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [nom, setNom]                     = useState('');
  const [description, setDescription]     = useState('');
  const [cotisation, setCotisation]       = useState('');
  const [maxMembres, setMaxMembres]       = useState('');
  const [dateDebut, setDateDebut]         = useState('');
  const [frequence, setFrequence]         = useState<Frequence>('mensuelle');
  const [ordre, setOrdre]                 = useState<OrdrePassage>('aleatoire');
  const [invitation, setInvitation]       = useState<ModeInvitation>('lien');
  const [showFrequence, setShowFrequence] = useState(false);

  const bg         = isDarkMode ? '#0F172A' : '#F8FAFC';
  const cardBg     = isDarkMode ? '#1E293B' : '#ffffff';
  const border     = isDarkMode ? '#334155' : '#E8EDF2';
  const textPrimary  = isDarkMode ? '#ffffff' : '#0F172A';
  const textSecondary = '#94A3B8';
  const inputBg    = isDarkMode ? '#0F172A' : '#F8FAFC';

  const FREQUENCES: { value: Frequence; label: string }[] = [
    { value: 'mensuelle',      label: 'Mensuelle'          },
    { value: 'hebdomadaire',   label: 'Hebdomadaire'       },
    { value: 'bihebdomadaire', label: 'Toutes les 2 sem.'  },
  ];

  function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
    return (
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: textSecondary }}>
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
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={{
          backgroundColor: inputBg,
          border: `1.5px solid ${border}`,
          color: textPrimary,
        }}
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
              color: value === opt.value ? '#fff' : textSecondary,
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

  const isValid = nom.trim() && cotisation && maxMembres && dateDebut;

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: bg }}>

      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 shadow-xl"
        style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0D9488 100%)`, borderRadius: '0 0 28px 28px' }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest">Nouvelle tontine</p>
            <h1 className="text-white text-xl font-bold">Créer • Privée</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-4">

        {/* Infos générales */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>Informations générales</p>

          <Field label="Nom de la tontine" icon={Lock}>
            <Input value={nom} onChange={setNom} placeholder="Ex : Cercle Familial" />
          </Field>

          <Field label="Description (optionnel)" icon={Lock}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez l'objectif de ce cercle..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{ backgroundColor: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
            />
          </Field>
        </div>

        {/* Paramètres financiers */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>Paramètres financiers</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cotisation (€)" icon={Euro}>
              <Input value={cotisation} onChange={setCotisation} placeholder="100" type="number" />
            </Field>
            <Field label="Membres max" icon={Users}>
              <Input value={maxMembres} onChange={setMaxMembres} placeholder="10" type="number" />
            </Field>
          </div>

          <Field label="Fréquence de cotisation" icon={Calendar}>
            <button
              onClick={() => setShowFrequence(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: inputBg, border: `1.5px solid ${border}`, color: textPrimary }}
            >
              <span>{FREQUENCES.find(f => f.value === frequence)?.label}</span>
              <ChevronDown style={{ width: 16, height: 16, color: textSecondary, transform: showFrequence ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {showFrequence && (
              <div className="mt-1 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${border}` }}>
                {FREQUENCES.map(f => (
                  <button
                    key={f.value}
                    onClick={() => { setFrequence(f.value); setShowFrequence(false); }}
                    className="w-full px-4 py-3 text-sm text-left transition-colors"
                    style={{
                      backgroundColor: frequence === f.value ? `${TEAL}14` : cardBg,
                      color: frequence === f.value ? TEAL : textPrimary,
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
        </div>

        {/* Règles du groupe */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: cardBg, border: `1.5px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>Règles du groupe</p>

          <Field label="Ordre de passage" icon={Shuffle}>
            <ToggleGroup
              value={ordre}
              onChange={setOrdre}
              color={TEAL}
              options={[
                { value: 'aleatoire', label: 'Aléatoire', icon: Shuffle },
                { value: 'fixe',      label: 'Fixe',      icon: Users   },
              ]}
            />
          </Field>

          <Field label="Mode d'invitation" icon={Link2}>
            <ToggleGroup
              value={invitation}
              onChange={setInvitation}
              color={TEAL}
              options={[
                { value: 'lien',     label: 'Lien',         icon: Link2  },
                { value: 'qr',       label: 'QR Code',      icon: QrCode },
                { value: 'les_deux', label: 'Les deux',      icon: Users  },
              ]}
            />
          </Field>
        </div>

        {/* CTA */}
        <button
          disabled={!isValid}
          className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-opacity"
          style={{
            background: isValid ? `linear-gradient(135deg, ${TEAL}, #0D9488)` : '#CBD5E1',
            boxShadow: isValid ? `0 4px 16px ${TEAL}44` : 'none',
            opacity: isValid ? 1 : 0.7,
          }}
        >
          Créer ma tontine privée
        </button>

        <p className="text-center text-xs" style={{ color: textSecondary }}>
          Un lien d'invitation sera généré automatiquement après création.
        </p>
      </div>
    </div>
  );
}
