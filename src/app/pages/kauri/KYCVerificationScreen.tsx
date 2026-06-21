import { ArrowLeft, Camera, CheckCircle2, User, MapPin, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';

export function KYCVerificationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') || 'particulier';
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: 'Document d\'identité', completed: false },
    { id: 2, label: 'Vérification selfie', completed: false },
    { id: 3, label: 'Adresse', completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate(`/kauri/biometric-setup?type=${accountType}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Vérification d'identité</h1>
        <p className="text-[#E0F2FE] text-sm mb-6">
          Sécurisez votre compte en 3 étapes simples
        </p>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step.id < currentStep
                      ? 'bg-[#D4AF37]'
                      : step.id === currentStep
                      ? 'bg-white'
                      : 'bg-white/20'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm ${
                        step.id === currentStep ? 'text-[#006D77]' : 'text-white'
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
                  className={`h-0.5 flex-1 mx-2 mb-8 ${
                    step.id < currentStep ? 'bg-[#D4AF37]' : 'bg-white/20'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#006D77]/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#006D77]" />
                </div>
                <div>
                  <h3 className="text-[#0F172A]">Document d'identité</h3>
                  <p className="text-[#64748B] text-sm">Carte d'identité ou passeport</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#006D77]/5 to-[#E0F2FE] rounded-2xl p-8 border-2 border-dashed border-[#006D77]/30 text-center mb-4">
                <Camera className="w-16 h-16 text-[#006D77] mx-auto mb-4" />
                <h4 className="text-[#0F172A] mb-2">Scannez votre document</h4>
                <p className="text-[#64748B] text-sm mb-4">
                  Positionnez votre pièce d'identité dans le cadre
                </p>
                <button className="bg-[#006D77] text-white px-6 py-3 rounded-xl">
                  Activer la caméra
                </button>
              </div>

              <div className="bg-[#FEF3C7] rounded-xl p-4 border border-[#D4AF37]/30">
                <p className="text-[#92400E] text-xs">
                  ✓ Assurez-vous que le document est lisible
                  <br />
                  ✓ Évitez les reflets de lumière
                  <br />✓ Le scan prend moins de 10 secondes
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-[#0F172A]">Vérification vivacité</h3>
                  <p className="text-[#64748B] text-sm">Selfie animé</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-[#FEF3C7] rounded-2xl p-8 border-2 border-dashed border-[#D4AF37]/30 text-center mb-4">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white border-4 border-[#D4AF37] flex items-center justify-center">
                  <User className="w-16 h-16 text-[#D4AF37]" />
                </div>
                <h4 className="text-[#0F172A] mb-2">Positionnez votre visage</h4>
                <p className="text-[#64748B] text-sm mb-4">
                  Suivez les instructions à l'écran
                </p>
                <button className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl">
                  Commencer la vérification
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#006D77]">1</span>
                  </div>
                  <span>Regardez directement la caméra</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#006D77]">2</span>
                  </div>
                  <span>Tournez lentement la tête</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#006D77]">3</span>
                  </div>
                  <span>Souriez naturellement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#475569]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#475569]" />
                </div>
                <div>
                  <h3 className="text-[#0F172A]">Adresse de résidence</h3>
                  <p className="text-[#64748B] text-sm">Validation officielle</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[#0F172A] text-sm mb-2 block">Numéro et rue</label>
                  <input
                    type="text"
                    placeholder="123 Rue de la Liberté"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#0F172A] text-sm mb-2 block">Code postal</label>
                    <input
                      type="text"
                      placeholder="75001"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                    />
                  </div>
                  <div>
                    <label className="text-[#0F172A] text-sm mb-2 block">Ville</label>
                    <input
                      type="text"
                      placeholder="Paris"
                      className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006D77]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#0F172A] text-sm mb-2 block">Pays</label>
                  <select className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006D77]">
                    <option>France</option>
                    <option>Canada</option>
                    <option>Haïti</option>
                    <option>Martinique</option>
                    <option>Guadeloupe</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 bg-[#E0F2FE] rounded-xl p-4 border border-[#006D77]/30">
                <p className="text-[#0369A1] text-xs">
                  ℹ️ Un justificatif de domicile pourra être demandé ultérieurement (facture,
                  attestation de résidence)
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl mt-6 shadow-lg"
        >
          {currentStep === 3 ? 'Continuer' : 'Suivant'}
        </button>
      </div>
    </div>
  );
}
