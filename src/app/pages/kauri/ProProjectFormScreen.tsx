import { ArrowLeft, CheckCircle2, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export function ProProjectFormScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    targetAmount: '',
    cycleDuration: '',
    maxParticipants: '',
    impactDescription: '',
    files: [] as File[],
  });

  const steps = [
    { id: 1, label: 'Informations de base' },
    { id: 2, label: 'Détails financiers' },
    { id: 3, label: 'Impact & Justificatifs' },
  ];

  const categories = [
    'Agriculture',
    'Immobilier',
    'Technologie',
    'Social & Communautaire',
    'Commerce',
    'Hôtellerie & Restauration',
    'Artisanat',
    'Autre',
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Soumettre le formulaire
      navigate('/kauri/pro-dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Demande de Tontine Projet</h1>
        <p className="text-white/90 text-sm mb-6">Formulaire de levée de fonds</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step.id < currentStep
                      ? 'bg-white'
                      : step.id === currentStep
                      ? 'bg-white'
                      : 'bg-white/20'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] animate-scaleIn" />
                  ) : (
                    <span
                      className={`text-sm ${
                        step.id === currentStep ? 'text-[#D4AF37]' : 'text-white'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs text-center ${
                    step.id <= currentStep ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-8 transition-all ${
                    step.id < currentStep ? 'bg-white' : 'bg-white/20'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-[#0F172A] mb-2 block">
                  Nom du Projet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  placeholder="Ex: Restaurant Lolo Moderne"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="text-[#0F172A] mb-2 block">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
                <p className="text-[#0369A1] text-sm">
                  💡 <strong>Conseil :</strong> Choisissez une catégorie pertinente pour attirer
                  les bons investisseurs.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-[#0F172A] mb-2 block">
                  Montant Cible (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  placeholder="100000"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#0F172A] mb-2 block">
                    Durée du Cycle (mois) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.cycleDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, cycleDuration: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="3">3 mois</option>
                    <option value="6">6 mois</option>
                    <option value="12">12 mois</option>
                    <option value="24">24 mois</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#0F172A] mb-2 block">
                    Participants max <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({ ...formData, maxParticipants: e.target.value })
                    }
                    placeholder="100"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
                <h4 className="text-[#0F172A] mb-2">Calcul automatique</h4>
                <p className="text-[#64748B] text-sm">
                  Contribution moyenne :{' '}
                  {formData.targetAmount && formData.maxParticipants
                    ? (
                        parseFloat(formData.targetAmount) /
                        parseFloat(formData.maxParticipants)
                      ).toLocaleString()
                    : '---'}{' '}
                  € par personne
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-[#0F172A] mb-2 block">
                  Description d'Impact <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.impactDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, impactDescription: e.target.value })
                  }
                  placeholder="Décrivez l'impact social, économique ou environnemental de votre projet..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none transition-all"
                ></textarea>
                <p className="text-xs text-[#64748B] mt-1">
                  {formData.impactDescription.length}/500 caractères
                </p>
              </div>

              <div>
                <label className="text-[#0F172A] mb-2 block">
                  Justificatifs (Business Plan, Documents)
                </label>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-[#0F172A] mb-1">Glissez vos fichiers ici</p>
                  <p className="text-[#64748B] text-sm mb-3">ou cliquez pour parcourir</p>
                  <button className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg text-sm">
                    Sélectionner des fichiers
                  </button>
                  <p className="text-xs text-[#64748B] mt-3">
                    PDF, DOC, DOCX jusqu'à 10 MB
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
                <FileText className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#92400E] text-sm mb-2">
                    <strong>Documents recommandés :</strong>
                  </p>
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

        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-white border-2 border-[#E2E8F0] text-[#64748B] py-4 rounded-xl"
            >
              Précédent
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-white py-4 rounded-xl shadow-lg"
          >
            {currentStep === 3 ? 'Soumettre la Demande' : 'Suivant'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
