import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

// ── 🔒 TA CLÉ PUBLIQUE ADMINISTRATIVE RÉELLE ENREGISTRÉE ──
const ADMIN_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8ur5G69kIhRoKMax0kr+
Xn60dzeviG9BxtwZMNluOAKjQiPbyDrnhem7zvB4BMRsywP8GB3lnz3dyegiQJUY
tdj6stKNl3oAgWCYvcj2o+VhU6se35YqGixeog4rcIdmzj3DTOLvdubWf14eR4q9
+pkOVWiGexJrDRf72na6f04jXIiL58G5grx7rPUiYSki5T4gwqXz/L8JO1Eg7b0X
Tr/FnQdG320uN7L1KAF56R2dmt/XnJTotnsL0sJwxeHf97BtoFtIGqdFCzBHcbEB
h+OUooG1o/3me86Vw/KwjbPwlt3DXB/Y1YiV2xrKueJDbhYNhtbKJw9o1cxRckob
EQIDAQAB
-----END PUBLIC KEY-----`;

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem
    .replace(/-----\s*BEGIN[^-]*-----\s*/g, "")
    .replace(/-----\s*END[^-]*-----\s*/g, "")
    .replace(/\s/g, "");
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "identity" | "selfie") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profile?.id) {
      toast.error("Session utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    setIsEncryptingAndUploading(true);
    const toastId = toast.loading("Scellage double enveloppe cryptographique (Admin + Client)...");

    try {
      const { data: dbProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('user_public_key')
        .eq('id', profile.id)
        .single();

      if (profileFetchError || !dbProfile?.user_public_key) {
        throw new Error("Impossible de récupérer la clé publique de session de l'utilisateur.");
      }

      const fileBuffer = await file.arrayBuffer();

      // 1. Génération de la clé symétrique AES-GCM 256 bits unique pour ce fichier
      const aesKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        fileBuffer
      );

      const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

      // 2. Chiffrement de la clé AES pour l'Administrateur
      const adminPublicKeyBuffer = pemToArrayBuffer(ADMIN_PUBLIC_KEY_PEM);
      const adminPublicKey = await window.crypto.subtle.importKey(
        "spki", adminPublicKeyBuffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]
      );
      const encryptedAesKeyAdmin = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" }, adminPublicKey, exportedAesKey
      );

      // 3. Chiffrement de la même clé AES pour l'Utilisateur lui-même
      const userPublicKeyBuffer = pemToArrayBuffer(dbProfile.user_public_key);
      const userPublicKey = await window.crypto.subtle.importKey(
        "spki", userPublicKeyBuffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]
      );
      const encryptedAesKeyUser = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" }, userPublicKey, exportedAesKey
      );

      // 4. Assemblage du package binaire multi-destinataires (.enc)
      const packedBuffer = new ArrayBuffer(
        4 + 4 + encryptedAesKeyAdmin.byteLength + encryptedAesKeyUser.byteLength + 12 + encryptedFileContent.byteLength
      );
      const view = new DataView(packedBuffer);
      
      view.setUint32(0, encryptedAesKeyAdmin.byteLength, false);
      view.setUint32(4, encryptedAesKeyUser.byteLength, false);

      const packedBytes = new Uint8Array(packedBuffer);
      let offset = 8;
      
      packedBytes.set(new Uint8Array(encryptedAesKeyAdmin), offset);
      offset += encryptedAesKeyAdmin.byteLength;
      
      packedBytes.set(new Uint8Array(encryptedAesKeyUser), offset);
      offset += encryptedAesKeyUser.byteLength;
      
      packedBytes.set(iv, offset);
      offset += 12;
      
      packedBytes.set(new Uint8Array(encryptedFileContent), offset);

      const encryptedBlob = new Blob([packedBytes], { type: "application/octet-stream" });
      const filePath = `${profile.id}/${type}.enc`;

      // 5. Transfert direct vers le Bucket d'infrastructure
      const { error: uploadError } = await supabase.storage
        .from('secure-kyc')
        .upload(filePath, encryptedBlob, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      toast.success("Document doublement scellé avec succès !", { id: toastId });
      if (type === "identity") setIdentityVerified(true);
      else setSelfieVerified(true);

    } catch (error: any) {
      console.error('[Crypto Packaging Stack Error]:', error);
      toast.error(`Erreur de scellage : ${error.message || error}`, { id: toastId });
    } finally {
      setIsEncryptingAndUploading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !identityVerified) {
      toast.warning("Veuillez téléverser votre pièce d'identité avant de passer à la suite.");
      return;
    }
    if (currentStep === 2 && !selfieVerified) {
      toast.warning("Veuillez valider votre vérification de selfie face caméra.");
      return;
    }
    if (currentStep === 3 && (!address.firstName || !address.lastName || !address.street || !address.zip || !address.city)) {
      toast.warning("Veuillez renseigner complètement vos coordonnées d'attestation.");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsEncryptingAndUploading(true);
      const toastId = toast.loading("Transmission de votre dossier d'immatriculation...");
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: address.firstName.trim(),
            last_name: address.lastName.trim(),
            street: address.street.trim(),
            city: address.city.trim(),
            zip: address.zip.trim(),
            kyc_status: 'pending'
          })
          .eq('id', profile?.id);

        if (error) throw error;
        await refreshProfile();
        toast.success("Dossier résumé !", { id: toastId });
        navigate(`/kauri/biometric-setup?type=${accountType}`);
      } catch (err) {
        toast.error("Erreur de synchronisation avec la base centrale.");
      } finally {
        setIsEncryptingAndUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans select-none">
      <input type="file" ref={identityInputRef} onChange={(e) => handleFileChange(e, "identity")} accept="image/*,application/pdf" className="hidden" />
      <input type="file" ref={selfieInputRef} onChange={(e) => handleFileChange(e, "selfie")} accept="image/*" capture="user" className="hidden" />

      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-md">
        <button onClick={() => navigate(-1)} className="mb-6 text-white flex items-center gap-2 bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h1 className="text-white text-2xl font-bold mb-2">Vérification réglementaire</h1>
        <p className="text-[#E0F2FE] text-xs opacity-90 mb-6">Processus de conformité d'identité KYC / AML</p>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-xs shadow transition-all ${
                  step.id < currentStep || step.completed ? "bg-[#D4AF37] text-white" : step.id === currentStep ? "bg-white text-[#006D77]" : "bg-white/20 text-white/60"
                }`}>
                  {step.id < currentStep || step.completed ? <CheckCircle2 className="w-5 h-5" /> : <span>{step.id}</span>}
                </div>
                <p className={`text-[10px] font-medium tracking-tight text-center ${step.id <= currentStep ? "text-white" : "text-white/50"}`}>{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-6 transition-colors duration-300 ${step.id < currentStep || (step.id === 1 && identityVerified) ? "bg-[#D4AF37]" : "bg-white/20"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto w-full">
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-[#E2E8F0] space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-[#006D77]/10 rounded-2xl flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-[#006D77]" /></div>
              <div>
                <h3 className="text-[#0F172A] text-base font-bold">Pièce d'identité officielle</h3>
                <p className="text-[#64748B] text-xs leading-normal">Passeport, Carte Nationale d'Identité ou Titre de séjour valide.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#006D77]/5 to-[#E0F2FE]/30 rounded-2xl p-8 border-2 border-dashed border-[#006D77]/20 text-center space-y-4">
              <Camera className="w-14 h-14 text-[#006D77] mx-auto opacity-80" />
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] mb-1">Fichier d'immatriculation</h4>
                <p className="text-[11px] text-[#64748B] max-w-[200px] mx-auto">Format image (PNG, JPG) ou document PDF accepté.</p>
              </div>
              <button onClick={() => identityInputRef.current?.click()} disabled={isEncryptingAndUploading} className="bg-[#006D77] hover:bg-[#005c64] text-white text-xs font-bold px-6 py-3.5 rounded-xl border-none cursor-pointer transition-all active:scale-98 shadow-md disabled:opacity-40">
                {identityVerified ? "✓ Document scellé RSA" : "Parcourir le document"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-[#E2E8F0] space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-[#D4AF37]" /></div>
              <div>
                <h3 className="text-[#0F172A] text-base font-bold">Contrôle de présence physique</h3>
                <p className="text-[#64748B] text-xs leading-normal">Vérification de sécurité biométrique par selfie en temps réel.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#D4AF37]/5 to-[#FEF3C7]/30 rounded-2xl p-8 border-2 border-dashed border-[#D4AF37]/20 text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-[#D4AF37] rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <User className="w-12 h-12 text-[#D4AF37] opacity-80" />
              </div>
              <p className="text-[11px] text-[#64748B] max-w-[180px] mx-auto">Placez votre visage au centre du cadre face caméra.</p>
              <button onClick={() => selfieInputRef.current?.click()} disabled={isEncryptingAndUploading} className="bg-[#D4AF37] hover:bg-[#c29f2e] text-white text-xs font-bold px-6 py-3.5 rounded-xl border-none cursor-pointer transition-all active:scale-98 shadow-md disabled:opacity-40">
                {selfieVerified ? "✓ Selfie sécurisé RSA" : "Déclencher l'appareil"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-[#E2E8F0] space-y-5">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Prénom légal</label>
                <input type="text" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} placeholder="Marie" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
              </div>
              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Nom de famille</label>
                <input type="text" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} placeholder="Dupont" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
              </div>
            </div>
            <div>
              <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Adresse résidentielle complète</label>
              <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="1 Rue Pierre Loti" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Code postal</label>
                <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="35700" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
              </div>
              <div>
                <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Ville</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Rennes" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
              </div>
            </div>
          </div>
        )}

        <button onClick={handleNext} disabled={isEncryptingAndUploading} className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-2xl mt-6 shadow-lg shadow-[#006D77]/20 font-bold text-sm tracking-wide transition-all active:scale-[0.99] border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
          {isEncryptingAndUploading && <Loader2 className="w-4 h-4 animate-spin" />}
          {currentStep === 3 ? "Soumettre le dossier de conformité" : "Continuer"}
        </button>
      </div>
    </div>
  );
}

export default KYCVerificationScreen;
