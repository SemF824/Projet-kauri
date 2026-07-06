import { ArrowLeft, CheckCircle2, Upload, FileText, TrendingUp, Target, Rocket, Heart, BarChart2, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { useProData } from '../../contexts/ProDataContext';

type FinancementType = 'dons' | 'investissement' | 'les-deux';

interface Palier {
  montant: string;
  label: string;
  description: string;
  contrepartie_don: string;
  rendement_invest: string;
}

export function ProProjectFormScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [financementType, setFinancementType] = useState<FinancementType | ''>('');
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    cycleDuration: '',
    maxParticipants: '',
    impactDescription: '',
    files: [] as File[],
    paliers: [
      { montant: '', label: 'Palier Soutien', description: '', contrepartie_don: '', rendement_invest: '' },
      { montant: '', label: 'Palier Partenaire', description: '', contrepartie_don: '', rendement_invest: '' },
      { montant: '', label: 'Palier Visionnaire', description: '', contrepartie_don: '', rendement_invest: '' },
    ] as Palier[],
  });

  const updatePalier = (index: number, field: keyof Palier, value: string) => {
    const newPaliers = [...formData.paliers];
    newPaliers[index] = { ...newPaliers[index], [field]: value };
    setFormData({ ...formData, paliers: newPaliers });
  };

  const palierMeta = [
    {
      icon: TrendingUp,
      color: '#006D77',
      bgGrad: 'from-[#006D77]/8 to-[#E0F2FE]/60',
      border: 'border-[#006D77]/25',
      badge: '#006D77',
      tier: 'Palier 1',
      sublabel: 'Montant le plus bas',
      amountPlaceholder: '500',
    },
    {
      icon: Target,
      color: '#D4AF37',
      bgGrad: 'from-[#D4AF37]/8 to-[#FEF9E7]/60',
      border: 'border-[#D4AF37]/25',
      badge: '#D4AF37',
      tier: 'Palier 2',
      sublabel: 'Montant intermédiaire',
      amountPlaceholder: '5 000',
    },
    {
      icon: Rocket,
      color: '#B05B3B',
      bgGrad: 'from-[#B05B3B]/8 to-[#FEF3EE]/60',
      border: 'border-[#B05B3B]/25',
      badge: '#B05B3B',
      tier: 'Palier 3',
      sublabel: 'Montant maximal',
      amountPlaceholder: '20 000',
    },
  ];

  const steps = [
    { id: 1, label: 'Informations de base' },
    { id: 2, label: 'Financement & Paliers' },
    { id: 3, label: 'Impact & Justificatifs' },
  ];

  const categories = [
    'Agriculture', 'Immobilier', 'Technologie', 'Social & Communautaire',
    'Commerce', 'Hôtellerie & Restauration', 'Artisanat', 'Autre',
  ];

  const { addProjet } = useProData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Persister le nouveau projet dans localStorage pour ProProjetsScreen
      const COLORS: Record<string, string> = {
        'Agriculture': '#059669', 'Immobilier': '#006D77', 'Technologie': '#7C3AED',
        'Social & Communautaire': '#B05B3B', 'Commerce': '#D4AF37', 'Tech': '#7C3AED',
        'Hôtellerie & Restauration': '#D97706', 'Artisanat': '#92400E', 'Autre': '#64748B',
      };
      addProjet({
        id: `p_${Date.now()}`,
        nom: formData.projectName,
        description: formData.impactDescription || `Projet de levée de fonds — ${formData.category}`,
        leve: 0,
        objectif: parseFloat(formData.paliers[2].montant) || 0,
        backers: 0,
        statut: 'En attente',
        color: COLORS[formData.category] || '#006D77',
        categorie: formData.category,
        dateDebut: '—',
        dateFin: formData.cycleDuration ? `Dans ${formData.cycleDuration} mois` : '—',
        progress: 0,
        finType: (financementType || 'les-deux') as 'dons' | 'investissement' | 'les-deux',
        paliers: formData.paliers,
      });
      setSubmitted(true);
      setTimeout(() => navigate('/kauri/pro-projets'), 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const acceptsDons = financementType === 'dons' || financementType === 'les-deux';
  const acceptsInvest = financementType === 'investissement' || financementType === 'les-deux';

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-6 px-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-[#0F172A] text-2xl font-bold text-center">Projet soumis !</h2>
        <p className="text-[#64748B] text-sm text-center">
          Votre projet <strong>"{formData.projectName}"</strong> a été créé et ajouté à votre liste de projets.
        </p>
        <p className="text-[#94A3B8] text-xs">Redirection en cours…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Demande de Levée de Fonds</h1>
        <p className="text-white/90 text-sm mb-6">Formulaire de création de projet</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${step.id <= currentStep ? 'bg-white' : 'bg-white/20'}`}>
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] animate-scaleIn" />
                  ) : (
                    <span className={`text-sm ${step.id === currentStep ? 'text-[#D4AF37]' : 'text-white'}`}>{step.id}</span>
                  )}
                </div>
                <p className={`text-xs text-center ${step.id <= currentStep ? 'text-white' : 'text-white/60'}`}>{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-8 transition-all ${step.id < currentStep ? 'bg-white' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">

          {/* ─── ÉTAPE 1 : Informations de base ─── */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-[#0F172A] mb-2 block text-sm font-medium">
                  Nom du Projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Ex: Restaurant Lolo Moderne"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="text-[#0F172A] mb-2 block text-sm font-medium">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
                <p className="text-[#0369A1] text-sm">
                  💡 <strong>Conseil :</strong> Choisissez une catégorie pertinente pour attirer les bons contributeurs.
                </p>
              </div>
            </div>
          )}

          {/* ─── ÉTAPE 2 : Type de financement + Paliers ─── */}
          {currentStep === 2 && (
            <div className="space-y-6">

              {/* Type de financement */}
              <div>
                <p className="text-[#0F172A] font-semibold text-sm mb-1">
                  Type de financement accepté <span className="text-red-500">*</span>
                </p>
                <p className="text-[#64748B] text-xs mb-3">
                  Définissez ce que pourront faire les particuliers sur votre projet.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dons', icon: Heart, label: 'Dons', sublabel: 'Contribution solidaire', color: '#B05B3B' },
                    { value: 'investissement', icon: BarChart2, label: 'Investissement', sublabel: 'Retour financier', color: '#006D77' },
                    { value: 'les-deux', icon: null, label: 'Les deux', sublabel: 'Don ou investir', color: '#D4AF37' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFinancementType(opt.value as FinancementType)}
                      className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all ${
                        financementType === opt.value
                          ? 'border-current bg-current/5 shadow-sm'
                          : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                      style={{ color: financementType === opt.value ? opt.color : '#64748B' }}
                    >
                      {opt.icon ? (
                        <opt.icon className="w-5 h-5" />
                      ) : (
                        <div className="flex gap-0.5">
                          <Heart className="w-4 h-4" style={{ color: '#B05B3B' }} />
                          <BarChart2 className="w-4 h-4" style={{ color: '#006D77' }} />
                        </div>
                      )}
                      <span className="text-xs font-bold leading-tight text-center">{opt.label}</span>
                      <span className="text-[10px] text-[#94A3B8] leading-tight text-center">{opt.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explication contextuelle */}
              {financementType && (
                <div className={`rounded-xl p-3 border text-xs flex gap-2 ${
                  financementType === 'dons' ? 'bg-[#FEF3EE] border-[#B05B3B]/30 text-[#7C3B25]' :
                  financementType === 'investissement' ? 'bg-[#E0F2FE] border-[#006D77]/30 text-[#0369A1]' :
                  'bg-[#FEF9E7] border-[#D4AF37]/30 text-[#92400E]'
                }`}>
                  <span className="text-base leading-none flex-shrink-0">
                    {financementType === 'dons' ? '🤝' : financementType === 'investissement' ? '📈' : '✨'}
                  </span>
                  <span>
                    {financementType === 'dons' && 'Les particuliers feront un don à votre projet. Définissez des contreparties symboliques (remerciements, produits, visibilité…) pour chaque palier.'}
                    {financementType === 'investissement' && 'Les particuliers investissent et attendent un rendement financier. Définissez le taux de retour proposé à chaque palier.'}
                    {financementType === 'les-deux' && 'Chaque particulier choisira librement de faire un don ou d\'investir. Configurez les contreparties pour les deux modes à chaque palier.'}
                  </span>
                </div>
              )}

              {/* Paliers */}
              {financementType && (
                <>
                  <div>
                    <p className="text-[#0F172A] font-semibold text-sm mb-1">
                      Configuration des 3 paliers <span className="text-red-500">*</span>
                    </p>
                    <p className="text-[#64748B] text-xs mb-4">
                      Les particuliers verront ces paliers et choisiront leur niveau de contribution.
                    </p>

                    <div className="space-y-4">
                      {palierMeta.map((meta, index) => {
                        const Icon = meta.icon;
                        const palier = formData.paliers[index];
                        return (
                          <div
                            key={index}
                            className={`bg-gradient-to-br ${meta.bgGrad} rounded-2xl p-4 border ${meta.border}`}
                          >
                            {/* En-tête palier */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.badge }}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: meta.badge }}>
                                    {meta.tier}
                                  </span>
                                  <span className="text-xs text-[#64748B]">{meta.sublabel}</span>
                                </div>
                                <input
                                  type="text"
                                  value={palier.label}
                                  onChange={(e) => updatePalier(index, 'label', e.target.value)}
                                  className="mt-1 text-sm font-semibold text-[#0F172A] bg-transparent border-b border-dashed border-[#CBD5E1] focus:outline-none w-full placeholder:text-[#94A3B8]"
                                  placeholder="Nom du palier (modifiable)"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              {/* Montant */}
                              <div>
                                <label className="text-xs text-[#64748B] mb-1 block">Montant du palier (€) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] font-bold text-sm">€</span>
                                  <input
                                    type="number"
                                    value={palier.montant}
                                    onChange={(e) => updatePalier(index, 'montant', e.target.value)}
                                    placeholder={meta.amountPlaceholder}
                                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-white/80 rounded-xl focus:outline-none focus:ring-2 text-sm transition-all"
                                    style={{ '--tw-ring-color': meta.color } as React.CSSProperties}
                                  />
                                </div>
                              </div>

                              {/* Ce que finance ce palier */}
                              <div>
                                <label className="text-xs text-[#64748B] mb-1 block">Ce que finance ce palier</label>
                                <input
                                  type="text"
                                  value={palier.description}
                                  onChange={(e) => updatePalier(index, 'description', e.target.value)}
                                  placeholder={
                                    index === 0 ? 'Ex: Équipement de départ, local...' :
                                    index === 1 ? 'Ex: + Recrutement, communication...' :
                                    'Ex: + Expansion nationale, franchise...'
                                  }
                                  className="w-full px-3 py-2.5 bg-white border border-white/80 rounded-xl focus:outline-none text-sm transition-all"
                                />
                              </div>

                              {/* Contrepartie don */}
                              {acceptsDons && (
                                <div className="bg-[#FEF3EE]/60 rounded-xl p-3 border border-[#B05B3B]/15">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <Heart className="w-3.5 h-3.5 text-[#B05B3B]" />
                                    <label className="text-xs font-semibold text-[#B05B3B]">Contrepartie pour les donateurs</label>
                                  </div>
                                  <input
                                    type="text"
                                    value={palier.contrepartie_don}
                                    onChange={(e) => updatePalier(index, 'contrepartie_don', e.target.value)}
                                    placeholder={
                                      index === 0 ? 'Ex: Remerciement public, goodies...' :
                                      index === 1 ? 'Ex: + Invitation inauguration, produits offerts...' :
                                      'Ex: + Nom gravé, accès VIP à vie...'
                                    }
                                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#B05B3B]/20 focus:outline-none text-xs transition-all"
                                  />
                                </div>
                              )}

                              {/* Rendement investissement */}
                              {acceptsInvest && (
                                <div className="bg-[#E0F2FE]/60 rounded-xl p-3 border border-[#006D77]/15">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <BarChart2 className="w-3.5 h-3.5 text-[#006D77]" />
                                    <label className="text-xs font-semibold text-[#006D77]">Retour pour les investisseurs</label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        value={palier.rendement_invest}
                                        onChange={(e) => updatePalier(index, 'rendement_invest', e.target.value)}
                                        placeholder={index === 0 ? '5' : index === 1 ? '8' : '12'}
                                        className="w-full pr-7 pl-3 py-2 bg-white rounded-lg border border-[#006D77]/20 focus:outline-none text-xs transition-all"
                                      />
                                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#006D77] text-xs font-bold">%</span>
                                    </div>
                                    <div className="flex items-center text-[10px] text-[#64748B]">
                                      taux annuel proposé aux investisseurs
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Durée + Participants */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[#0F172A] text-sm font-medium mb-2 block">
                        Durée de la campagne <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.cycleDuration}
                        onChange={(e) => setFormData({ ...formData, cycleDuration: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm"
                      >
                        <option value="">Sélectionner</option>
                        <option value="3">3 mois</option>
                        <option value="6">6 mois</option>
                        <option value="12">12 mois</option>
                        <option value="24">24 mois</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[#0F172A] text-sm font-medium mb-2 block">
                        Contributeurs max <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder="100"
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Récapitulatif */}
                  {(formData.paliers[0].montant || formData.paliers[1].montant || formData.paliers[2].montant) && (
                    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
                      <h4 className="text-[#0F172A] text-sm font-semibold mb-3">Récapitulatif des paliers</h4>
                      <div className="space-y-2">
                        {palierMeta.map((meta, i) => {
                          const p = formData.paliers[i];
                          if (!p.montant) return null;
                          return (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: meta.badge }} />
                                <span className="text-xs text-[#64748B]">{p.label || meta.tier}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold" style={{ color: meta.badge }}>
                                  {parseFloat(p.montant).toLocaleString()} €
                                </span>
                                {acceptsInvest && p.rendement_invest && (
                                  <span className="text-[10px] bg-[#006D77]/10 text-[#006D77] px-1.5 py-0.5 rounded-full font-medium">
                                    {p.rendement_invest}% / an
                                  </span>
                                )}
                                {acceptsDons && p.contrepartie_don && (
                                  <span className="text-[10px] bg-[#B05B3B]/10 text-[#B05B3B] px-1.5 py-0.5 rounded-full font-medium">
                                    🤝 Don
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ─── ÉTAPE 3 : Impact & Justificatifs ─── */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-[#0F172A] mb-2 block text-sm font-medium">
                  Description d'Impact <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.impactDescription}
                  onChange={(e) => setFormData({ ...formData, impactDescription: e.target.value })}
                  placeholder="Décrivez l'impact social, économique ou environnemental de votre projet..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none transition-all"
                />
                <p className="text-xs text-[#64748B] mt-1">{formData.impactDescription.length}/500 caractères</p>
              </div>

              <div>
                <label className="text-[#0F172A] mb-2 block text-sm font-medium">
                  Justificatifs (Business Plan, Documents)
                </label>

                {/* Zone de dépôt cliquable */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-[#0F172A] text-sm mb-1">Glissez vos fichiers ici</p>
                  <p className="text-[#64748B] text-xs mb-3">ou cliquez pour parcourir</p>
                  <span className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg text-sm inline-block">
                    Sélectionner des fichiers
                  </span>
                  <p className="text-xs text-[#64748B] mt-3">PDF, DOC, DOCX jusqu'à 10 MB</p>
                </div>

                {/* Input caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Fichiers sélectionnés */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                        <FileText className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0F172A] text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[#94A3B8] text-[10px]">
                            {(file.size / 1024).toFixed(0)} Ko
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
                <FileText className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#92400E] text-sm mb-2"><strong>Documents recommandés :</strong></p>
                  <ul className="text-[#92400E] text-xs space-y-1">
                    <li>• Business Plan détaillé</li>
                    <li>• Prévisions financières</li>
                    <li>• Justificatifs d'identité</li>
                    <li>• Kbis ou équivalent (pour les entreprises)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl text-sm font-medium"
            >
              Précédent
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={currentStep === 2 && !financementType}
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl shadow-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {currentStep === 3 ? 'Soumettre la Demande' : 'Suivant'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
