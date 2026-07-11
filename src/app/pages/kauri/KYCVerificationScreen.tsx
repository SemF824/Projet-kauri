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

// ── 🔒 CLÉ PUBLIQUE ADMINISTRATIVE KAURI RSA-2048 (NE PAS MODIFIER LA STRUCTURE) ──
const ADMIN_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8ur5G69kIhRoKMax0kr+
Xn60dzeviG9BxtwZMNluOAKjQiPbyDrnhem7zvB4BMRsywP8GB3lnz3dyegiQJUY
tdj6stKNl3oAgWCYvcj2o+VhU6se35YqGixeog4rcIdmzj3DTOLvdubWf14eR4q9
+pkOVWiGexJrDRf72na6f04jXIiL58G5grx7rPUiYSki5T4gwqXz/L8JO1Eg7b0X
Tr/FnQdG320uN7L1KAF56R2dmt/XnJTotnsL0sJwxeHf97BtoFtIGqdFCzBHcbEB
h+OUooG1o/3me86Vw/KwjbPwlt3DXB/Y1YiV2xrKueJDbhYNhtbKJw9o1cxRckob
EQIDAQAB
-----END PUBLIC KEY-----`;

// Utilitaires de conversion binaire pour l'API WebCrypto
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem.replace(/-----\s*BEGIN[^-]*-----\s*/g, "").replace(/-----\s*END[^-]*-----\s*/g, "").replace(/\s/g, "");
  const binaryString = window.atob(b64Lines);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

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

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    city: "",
    country: "France",
  });

  useEffect(() => {
    if (profile) {
      setAddress((prev) => ({
        ...prev,
        firstName: profile.first_name && profile.first_name !== 'Prénom' ? profile.first_name : "",
        lastName: profile.last_name && profile.last_name !== 'Nom' ? profile.last_name : "",
        street: profile.street || "",
        zip: profile.zip || "",
        city: profile.city || "",
      }));
    }
  }, [profile]);

  const identityInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, label: "Document d'identité", completed: identityVerified },
    { id: 2, label: "Vérification selfie", completed: selfieVerified },
    { id: 3, label: "Identité & Adresse", completed: false },
  ];

  // 🎯 CRYPTAGE LOCAL ENVELOPPE AVANT TÉLÉVERSEMENT EFFECTIF
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
    const toastId = toast.loading("Chiffrement asymétrique de l'enveloppe réglementaire (Zero-Knowledge)...");

    try {
      // 1. Lire le fichier sous forme de tableau binaire
      const fileBuffer = await file.arrayBuffer();

      // 2. Générer une clé symétrique AES-GCM 256 bits unique pour ce fichier
      const aesKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      // 3. Chiffrer le fichier avec la clé AES
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        fileBuffer
      );

      // 4. Exporter et chiffrer la clé AES avec la Clé Publique Administrative RSA
      const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
      const adminPublicKeyBuffer = pemToArrayBuffer(ADMIN_PUBLIC_KEY_PEM);
      const adminPublicKey = await window.crypto.subtle.importKey(
        "spki",
        adminPublicKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      );

      const encryptedAesKey = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        adminPublicKey,
        exportedAesKey
      );

      // 5. Assemblage du package binaire structuré [.enc]
      // Structure : [Taille Clé RSA (4 octets)] + [Clé RSA Chiffrée] + [IV AES (12 octets)] + [Payload Chiffré]
      const packedBuffer = new ArrayBuffer(4 + encryptedAesKey.byteLength + 12 + encryptedFileContent.byteLength);
      const view = new DataView(packedBuffer);
      view.setUint32(0, encryptedAesKey.byteLength, false);

      const packedBytes = new Uint8Array(packedBuffer);
      packedBytes.set(new Uint8Array(encryptedAesKey), 4);
      packedBytes.set(iv, 4 + encryptedAesKey.byteLength);
      packedBytes.set(new Uint8Array(encryptedFileContent), 4 + encryptedAesKey.byteLength + 12);

      const encryptedBlob = new Blob([packedBytes], { type: "application/octet-stream" });
      const filePath = `${profile.id}/${type}.enc`;

      // 6. Envoi du flux scellé dans le stockage
      const { error: uploadError } = await supabase.storage
        .from('secure-kyc')
        .upload(filePath, encryptedBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      toast.success("Document scellé et transféré avec succès !", { id: toastId });

      if (type === "identity") {
        setIdentityVerified(true);
      } else {
        setSelfieVerified(true);
      }
    } catch (error: any) {
      console.error('[Crypto Package Failure]:', error);
      toast.error(`Échec du bouclier cryptographique : ${error.message || error}`, { id: toastId });
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
    if (currentStep === 3 && (!address.firstName || !address.lastName || !address.street || !address.zip || !address.city)) {
      toast.warning("Veuillez renseigner complètement vos informations personnelles.");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsEncryptingAndUploading(true);
      const toastId = toast.loading("Enregistrement de votre dossier réglementaire...");
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: address.firstName,
            last_name: address.lastName,
            street: address.street,
            city: address.city,
            zip: address.zip,
            kyc_status: 'pending'
          })
          .eq('id', profile?.id);

        if (error) throw error;

        await refreshProfile();
        toast.success("Dossier transmis avec succès !", { id: toastId });
        navigate(`/kauri/biometric-setup?type=${accountType}`);
      } catch (err: any) {
        console.error('[KYC Database Save Error]:', err);
        toast.error("Erreur de liaison des données.", { id: toastId });
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
                  className="bg-[#006D77] text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto border-none disabled:opacity-50 cursor-pointer font-bold"
                >
                  {identityVerified ? "✓ Fichier scellé" : "Activer la caméra"}
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
                  className="bg-[#D4AF37] text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto border-none disabled:opacity-50 cursor-pointer font-bold"
                >
                  {selfieVerified ? "✓ Selfie scellé" : "Prendre un selfie"}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E2E8F0] space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Prénom légal</label>
                  <input type="text" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} placeholder="Jean" className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A]" />
                </div>
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Nom de famille</label>
                  <input type="text" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} placeholder="Dupont" className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A]" />
                </div>
              </div>
              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1 block">Numéro et rue</label>
                <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Rue de la Liberté" className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Code postal</label>
                  <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="75001" className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A]" />
                </div>
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1 block">Ville</label>
                  <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Paris" className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleNext} disabled={isEncryptingAndUploading} className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-xl mt-6 shadow-lg font-medium border-none cursor-pointer">
          {currentStep === 3 ? "Continuer" : "Suivant"}
        </button>
      </div>
    </div>
  );
}

export default KYCVerificationScreen;
