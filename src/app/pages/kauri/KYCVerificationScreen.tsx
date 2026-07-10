import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  User,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

export function KYCVerificationScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") || "particulier";
  const [currentStep, setCurrentStep] = useState(1);

  const supabase = getSupabase();

  const [isEncryptingAndUploading, setIsEncryptingAndUploading] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [selfieVerified, setSelfieVerified] = useState(false);

  // Formulaire étendu pour corriger les profils "Prénom Nom" vides
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    city: "",
    country: "France",
  });

  // Chargement des données existantes du profil pour éviter d'écraser les vraies infos
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name && profile.first_name !== 'Prénom' ? profile.first_name : "",
        lastName: profile.last_name && profile.last_name !== 'Nom' ? profile.last_name : "",
        street: profile.street || "",
        zip: profile.zip || "",
        city: profile.city || "",
        country: "France"
      });
    }
  }, [profile]);

  const identityInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, label: "Document d'identité", completed: identityVerified },
    { id: 2, label: "Vérification selfie", completed: selfieVerified },
    { id: 3, label: "Identité & Adresse", completed: false },
  ];

  // 🎯 TÉLÉVERSEMENT PHYSIQUE DANS LE BUCKET SECURE-KYC
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "identity" | "selfie",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profile?.id) {
      toast.error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    setIsEncryptingAndUploading(true);
    const toastId = toast.loading("Chiffrement et transfert du fichier vers le coffre fort...");

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${type}.${fileExt}`;

      // Envoi direct dans le bucket de production secure-kyc
      const { error: uploadError } = await supabase.storage
        .from('secure-kyc')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      toast.success("Document transféré avec succès !", { id: toastId });

      if (type === "identity") {
        setIdentityVerified(true);
      } else {
        setSelfieVerified(true);
      }
    } catch (error: any) {
      console.error('[Storage Upload Error]:', error);
      toast.error(`Échec du transfert : ${error.message || error}`, { id: toastId });
    } finally {
      setIsEncryptingAndUploading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !identityVerified) {
      toast.warning("Veuillez téléverser votre pièce d'identité avant de continuer.");
      return;
    }
    if (currentStep === 2 && !selfieVerified) {
      toast.warning("Veuillez valider votre vérification de selfie avant de continuer.");
      return;
    }
    if (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.street || !formData.zip || !formData.city)) {
      toast.warning("Veuillez renseigner complètement vos informations personnelles.");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsEncryptingAndUploading(true);
      const toastId = toast.loading("Mise à jour de votre dossier de conformité...");
      
      try {
        // Enregistrement des vraies informations nominatives et postales
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            street: formData.street,
            city: formData.city,
            zip: formData.zip,
            kyc_status: 'pending'
          })
          .eq('id', profile?.id);

        if (error) throw error;

        await refreshProfile();
        toast.success("Dossier KYC validé et transmis !", { id: toastId });
        navigate(`/kauri/biometric-setup?type=${accountType}`);
      } catch (err: any) {
        console.error('[KYC Save Error]:', err);
        toast.error("Erreur d'écriture des données.", { id: toastId });
      } finally {
        setIsEncryptingAndUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <input type="file" ref={identityInputRef} onChange={(e) => handleFileChange(e, "identity")} accept="image/*,application/pdf" className="hidden" />
      <input type="file" ref={selfieInputRef} onChange={(e) => handleFileChange(e, "selfie")} accept="image/*" capture="user" className="hidden" />

      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2 bg-transparent border-none cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-white text-2xl mb-2">Vérification d'identité</h1>
        <p className="text-[#E0F2FE] text-sm mb-6">Sécurisez votre compte en 3 étapes simples</p>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  step.id < currentStep || step.completed ? "bg-[#D4AF37]" : step.id === currentStep ? "bg-white" : "bg-white/20"
                }`}>
                  {step.id < currentStep || step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm ${step.id === currentStep ? "text-[#006D77]" : "text-white"}`}>{step.id}</span>
                  )}
                </div>
                <p className={`text-xs text-center ${step.id <= currentStep ? "text-white" : "text-white/60"}`}>{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-8 ${step.id < currentStep || (step.id === 1 && identityVerified) ? "bg-[#D4AF37]" : "bg-white/20"}`}></div>
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
                <button
                  onClick={() => identityInputRef.current?.click()}
                  disabled={isEncryptingAndUploading}
                  className="bg-[#006D77] text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer border-none font-bold"
                >
                  {identityVerified ? "✓ Document chargé" : "Activer la caméra"}
                </button>
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
                  <p className="text-[#64748B] text-sm">Selfie de contrôle</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-[#FEF3C7] rounded-2xl p-8 border-2 border-dashed border-[#D4AF37]/30 text-center mb-4">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white border-4 border-[#D4AF37] flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-[#D4AF37]" />
                </div>
                <button
                  onClick={() => selfieInputRef.current?.click()}
                  disabled={isEncryptingAndUploading}
                  className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer border-none font-bold"
                >
                  {selfieVerified ? "✓ Selfie validé" : "Prendre un selfie"}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0] space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-[#475569]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#475569]" />
                </div>
                <div>
                  <h3 className="text-[#0F172A]">Informations légales</h3>
                  <p className="text-[#64748B] text-sm">Vérification des pièces</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ex: Jean"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Nom de famille</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Ex: Testeur"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1 block">Numéro et rue</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="123 Rue de la Liberté"
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Code postal</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="75001"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={isEncryptingAndUploading}
          className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl mt-6 shadow-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border-none"
        >
          {currentStep === 3 ? "Continuer" : "Suivant"}
        </button>
      </div>
    </div>
  );
}

export default KYCVerificationScreen;
