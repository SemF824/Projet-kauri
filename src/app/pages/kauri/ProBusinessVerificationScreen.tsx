import {
  ArrowLeft, ArrowRight, Building2, FileText, CheckCircle2,
  Rocket, Users, Lightbulb, Upload, SkipForward, Shield,
  Sparkles, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const TEAL = '#0A847E';
const GOLD = '#D4AF37';

type StructureType = 'idea' | 'company' | 'asso' | null;

// Step IDs: 'type' → 'details' → 'docs' (company/asso only) → 'done'
type StepId = 'type' | 'details' | 'docs' | 'done';

const SECTORS = [
  'Agriculture & Agroalimentaire',
  'Hôtellerie & Restauration',
  'Commerce de détail',
  'Services aux personnes',
  'Immobilier',
  'Technologie & Numérique',
  'Artisanat & Créativité',
  'Santé & Bien-être',
  'Éducation & Formation',
  'Tourisme & Culture',
  'Autre',
];

export function ProBusinessVerificationScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const [step, setStep] = useState<StepId>('type');
  const [structure, setStructure] = useState<StructureType>(null);

  // details form
  const [projectName, setProjectName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');

  // doc upload state (simulated)
  const [kbisUploaded, setKbisUploaded] = useState(false);
  const [statutsUploaded, setStatutsUploaded] = useState(false);
  const [docsSkipped, setDocsSkipped] = useState(false);

  const bg    = isDarkMode ? '#0F172A' : '#F8FAFC';
  const card  = isDarkMode ? '#1E293B' : '#ffffff';
  const bdr   = isDarkMode ? '#334155' : '#E8EDF2';
  const textP = isDarkMode ? '#ffffff' : '#0F172A';
  const textS = isDarkMode ? '#94A3B8' : '#64748B';

  // ── Progress bar ────────────────────────────────────────────────────────────
  const steps: { id: StepId; label: string }[] = structure === 'idea'
    ? [
        { id: 'type',    label: 'Structure' },
        { id: 'details', label: 'Projet' },
        { id: 'done',    label: 'Activation' },
      ]
    : [
        { id: 'type',    label: 'Structure' },
        { id: 'details', label: 'Entité' },
        { id: 'docs',    label: 'Documents' },
        { id: 'done',    label: 'Activation' },
      ];

  const stepIndex = steps.findIndex(s => s.id === step);

  function handleBack() {
    if (step === 'type') { navigate(-1); return; }
    if (step === 'details') { setStep('type'); return; }
    if (step === 'docs') { setStep('details'); return; }
  }

  function canAdvanceDetails() {
    if (structure === 'idea') return projectName.trim() !== '' && sector !== '';
    return companyName.trim() !== '' && siret.trim() !== '' && sector !== '';
  }

  function handleDetailsNext() {
    if (structure === 'idea') { setStep('done'); }
    else { setStep('docs'); }
  }

  function handleDocsNext() { setStep('done'); }

  // ── Input helper ─────────────────────────────────────────────────────────────
  function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: textP }}>
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
      </div>
    );
  }

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-[${TEAL}] transition-colors`;
  const inputStyle = { backgroundColor: card, borderColor: bdr, color: textP };

  // ── Simulated doc upload button ────────────────────────────────────────────
  function DocCard({ label, hint, uploaded, onToggle }: { label: string; hint: string; uploaded: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all"
        style={{
          backgroundColor: uploaded ? `${TEAL}12` : card,
          border: `1.5px solid ${uploaded ? TEAL : bdr}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: uploaded ? `${TEAL}20` : `${GOLD}15` }}
        >
          {uploaded
            ? <CheckCircle2 style={{ width: 22, height: 22, color: TEAL }} />
            : <Upload style={{ width: 20, height: 20, color: GOLD }} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: textP }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: uploaded ? TEAL : textS }}>{uploaded ? 'Document ajouté ✓' : hint}</p>
        </div>
        {!uploaded && <ChevronRight style={{ width: 16, height: 16, color: textS }} />}
      </button>
    );
  }

  return (
    <div className="min-h-screen pb-10 transition-colors" style={{ backgroundColor: bg }}>

      {/* ── HEADER ── */}
      <div
        className="px-5 pt-12 pb-6 shadow-xl"
        style={{ background: `linear-gradient(150deg, ${GOLD} 0%, #B8860B 100%)`, borderRadius: '0 0 28px 28px' }}
      >
        <button onClick={handleBack} className="flex items-center gap-2 mb-5 text-white/80">
          <ArrowLeft style={{ width: 18, height: 18 }} />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-xl font-bold mb-1">Activer le profil Pro</h1>
        <p className="text-white/75 text-xs mb-5">Votre identité est déjà vérifiée — aucune re-saisie nécessaire.</p>

        {/* Identity confirmed badge */}
        <div
          className="flex items-center gap-3 rounded-2xl p-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <Shield style={{ width: 17, height: 17, color: '#fff' }} />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold">Jean Dupont · KYC validé</p>
            <p className="text-white/65 text-xs">Identité · Selfie · Adresse — déjà confirmés</p>
          </div>
          <CheckCircle2 style={{ width: 18, height: 18, color: '#fff' }} />
        </div>

        {/* Progress bar */}
        {step !== 'done' && (
          <div className="flex items-center gap-1 mt-5">
            {steps.filter(s => s.id !== 'done').map((s, i) => {
              const idx = steps.findIndex(x => x.id === step);
              const filled = i < idx;
              const active = i === idx;
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-1.5 rounded-full transition-all"
                    style={{ backgroundColor: filled || active ? '#fff' : 'rgba(255,255,255,0.25)', opacity: active ? 1 : filled ? 0.9 : 0.4 }}
                  />
                  <span className="text-white/60 text-[10px]">{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 pt-6 space-y-5">

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1 — Type de structure
        ══════════════════════════════════════════════════════════════════ */}
        {step === 'type' && (
          <>
            <p className="text-sm font-semibold" style={{ color: textP }}>Quelle est votre situation ?</p>
            <p className="text-xs -mt-3" style={{ color: textS }}>Choisissez l'option qui correspond à votre projet — vous pourrez toujours évoluer.</p>

            {([
              {
                id: 'idea' as StructureType,
                icon: Lightbulb,
                iconColor: '#F59E0B',
                iconBg: '#F59E0B18',
                title: "J'ai une idée / un projet",
                desc: "Pas encore de structure juridique. Vous lancez votre activité et souhaitez lever des fonds ou recevoir des dons.",
                badge: 'Recommandé pour débuter',
                badgeColor: TEAL,
              },
              {
                id: 'company' as StructureType,
                icon: Building2,
                iconColor: GOLD,
                iconBg: `${GOLD}18`,
                title: 'Entreprise existante',
                desc: "SARL, SAS, auto-entrepreneur, EURL… Vous disposez déjà d'un numéro SIRET ou équivalent.",
                badge: null,
                badgeColor: '',
              },
              {
                id: 'asso' as StructureType,
                icon: Users,
                iconColor: '#8B5CF6',
                iconBg: '#8B5CF618',
                title: 'Association / Coopérative',
                desc: 'Loi 1901, SCOP, coopérative agricole… Structure à but non lucratif ou mutualisée.',
                badge: null,
                badgeColor: '',
              },
            ] as { id: StructureType; icon: any; iconColor: string; iconBg: string; title: string; desc: string; badge: string | null; badgeColor: string }[]).map(opt => (
              <button
                key={opt.id!}
                onClick={() => { setStructure(opt.id); setStep('details'); }}
                className="w-full rounded-2xl p-5 flex items-start gap-4 text-left transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: card,
                  border: `1.5px solid ${structure === opt.id ? GOLD : bdr}`,
                  boxShadow: structure === opt.id ? `0 4px 16px ${GOLD}22` : 'none',
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opt.iconBg }}>
                  <opt.icon style={{ width: 22, height: 22, color: opt.iconColor }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold" style={{ color: textP }}>{opt.title}</p>
                    {opt.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${opt.badgeColor}18`, color: opt.badgeColor }}>
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: textS }}>{opt.desc}</p>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: textS, flexShrink: 0, marginTop: 2 }} />
              </button>
            ))}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2a — Idée / Projet
        ══════════════════════════════════════════════════════════════════ */}
        {step === 'details' && structure === 'idea' && (
          <>
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor: `${TEAL}12`, border: `1px solid ${TEAL}30` }}>
              <Sparkles style={{ width: 17, height: 17, color: TEAL, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: TEAL }}>
                <strong>Aucun document légal requis pour l'instant.</strong> Vous pourrez ajouter votre SIRET ou statuts dès que votre structure sera créée.
              </p>
            </div>

            <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: card, border: `1.5px solid ${bdr}` }}>
              <Field label="Nom de votre projet" required>
                <input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Ex: Épicerie solidaire des Antilles"
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>

              <Field label="Secteur d'activité" required>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">Sélectionner…</option>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Décrivez votre projet en quelques mots">
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Créer un réseau d'épiceries solidaires proposant des produits locaux à prix juste…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                />
              </Field>
            </div>

            <button
              onClick={handleDetailsNext}
              disabled={!canAdvanceDetails()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: '#fff', boxShadow: `0 4px 16px ${GOLD}40` }}
            >
              Continuer
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2b — Entreprise / Association existante
        ══════════════════════════════════════════════════════════════════ */}
        {step === 'details' && (structure === 'company' || structure === 'asso') && (
          <>
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor: `${GOLD}12`, border: `1px solid ${GOLD}30` }}>
              <CheckCircle2 style={{ width: 17, height: 17, color: GOLD, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? GOLD : '#92400E' }}>
                Votre identité personnelle est déjà validée. Renseignez uniquement les informations de votre {structure === 'asso' ? 'association' : 'entreprise'}.
              </p>
            </div>

            <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: card, border: `1.5px solid ${bdr}` }}>
              <Field label={structure === 'asso' ? "Nom de l'association" : "Raison sociale"} required>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder={structure === 'asso' ? "Ex: Association Diaspora Caraïbe" : "Ex: Coopérative Agricole Antilles SAS"}
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>

              <Field label={structure === 'asso' ? "Numéro RNA / SIREN" : "Numéro SIRET"} required>
                <input
                  value={siret}
                  onChange={e => setSiret(e.target.value)}
                  placeholder={structure === 'asso' ? "W123456789" : "123 456 789 00012"}
                  className={inputCls}
                  style={inputStyle}
                />
                <p className="text-xs mt-1.5" style={{ color: textS }}>
                  {structure === 'asso'
                    ? "RNA pour les associations loi 1901 (France), ou SIREN équivalent."
                    : "14 chiffres pour le SIRET français, ou numéro d'entreprise local."}
                </p>
              </Field>

              <Field label="Secteur d'activité" required>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">Sélectionner…</option>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <button
              onClick={handleDetailsNext}
              disabled={!canAdvanceDetails()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: '#fff', boxShadow: `0 4px 16px ${GOLD}40` }}
            >
              Continuer
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3 — Documents (entreprise / asso uniquement)
        ══════════════════════════════════════════════════════════════════ */}
        {step === 'docs' && (
          <>
            <p className="text-sm font-semibold" style={{ color: textP }}>Documents de la personne morale</p>
            <p className="text-xs -mt-3 mb-1" style={{ color: textS }}>
              Ces documents permettent de valider votre {structure === 'asso' ? 'association' : 'entreprise'} sur KAURI Pro.
              Vous pouvez les ajouter maintenant ou plus tard depuis vos paramètres.
            </p>

            <div className="space-y-3">
              <DocCard
                label={structure === 'asso' ? "Récépissé de déclaration (Préfecture)" : "Extrait Kbis (moins de 3 mois)"}
                hint="PDF ou photo lisible · Max 10 Mo"
                uploaded={kbisUploaded}
                onToggle={() => setKbisUploaded(v => !v)}
              />
              <DocCard
                label="Statuts de la structure"
                hint="Version signée en vigueur"
                uploaded={statutsUploaded}
                onToggle={() => setStatutsUploaded(v => !v)}
              />
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: `${TEAL}0D`, border: `1px solid ${TEAL}25` }}>
              <p className="text-xs leading-relaxed" style={{ color: textS }}>
                <span style={{ color: TEAL, fontWeight: 600 }}>ℹ️ Votre pièce d'identité personnelle n'est pas redemandée</span> — elle est déjà dans votre dossier KYC validé.
              </p>
            </div>

            <button
              onClick={handleDocsNext}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: '#fff', boxShadow: `0 4px 16px ${GOLD}40` }}
            >
              {kbisUploaded || statutsUploaded ? 'Envoyer et continuer' : 'Continuer sans documents'}
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            {!kbisUploaded && !statutsUploaded && (
              <button
                onClick={() => { setDocsSkipped(true); handleDocsNext(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium"
                style={{ backgroundColor: 'transparent', border: `1.5px dashed ${bdr}`, color: textS }}
              >
                <SkipForward style={{ width: 15, height: 15 }} />
                Ajouter les documents plus tard
              </button>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ÉTAPE FINALE — Activation confirmée
        ══════════════════════════════════════════════════════════════════ */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center pt-6">
            {/* Animated ring */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, boxShadow: `0 0 0 12px ${GOLD}20, 0 8px 28px ${GOLD}50` }}
            >
              <Rocket style={{ width: 40, height: 40, color: '#fff' }} />
            </div>

            <h2 className="text-xl font-bold mb-2" style={{ color: textP }}>
              {structure === 'idea' ? 'Projet enregistré !' : 'Profil Pro activé !'}
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: textS, maxWidth: 300 }}>
              {structure === 'idea'
                ? `Votre projet "${projectName}" est créé. Vous pouvez déjà lancer une campagne et ajouter vos documents légaux dès que votre structure sera formalisée.`
                : `Votre compte professionnel pour "${companyName}" est en cours de validation. Accédez dès maintenant à votre tableau de bord Pro.`}
            </p>

            {/* Recap pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {[
                { label: '✓ Identité personnelle', color: TEAL },
                { label: structure === 'idea' ? `✓ Projet : ${projectName || '…'}` : `✓ ${companyName || '…'}`, color: GOLD },
                ...(docsSkipped ? [{ label: '⚠ Documents à ajouter', color: '#F59E0B' }] : []),
              ].map(p => (
                <span key={p.label} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>
                  {p.label}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate('/kauri/pro-dashboard')}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: '#fff', boxShadow: `0 4px 20px ${GOLD}50` }}
            >
              Accéder au tableau de bord Pro
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            {docsSkipped && (
              <button
                onClick={() => navigate('/kauri/coffre-numerique')}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium"
                style={{ backgroundColor: card, border: `1.5px solid ${bdr}`, color: textP }}
              >
                <FileText style={{ width: 15, height: 15 }} />
                Ajouter mes documents maintenant
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
