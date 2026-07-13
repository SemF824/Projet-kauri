import { ArrowLeft, Camera, User, FileText, Loader2, CheckCircle2, RotateCw, Eye, EyeOff, MapPin, Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

// ── 🔒 CLÉ PUBLIQUE ADMINISTRATIVE RÉELLE ──
const ADMIN_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8ur5G69kIhRoKMax0kr+
Xn60dzeviG9BxtwZMNluOAKjQiPbyDrnhem7zvB4BMRsywP8GB3lnz3dyegiQJUY
tdj6stKNl3oAgWCYvcj2o+VhU6se35YqGixeog4rcIdmzj3DTOLvdubWf14eR4q9
+pkOVWiGexJrDRf72na6f04jXIiL58G5grx7rPUiYSki5T4gwqXz/L8JO1Eg7b0X
Tr/FnQdG320uN7L1KAF56R2dmt/XnJTotnsL0sJwxeHf97BtoFtIGqdFCzBHcbEB
h+OUooG1o/3me86Vw/KwjbPwlt3DXB/Y1YiV2xrKueJDbhYNhtbKJw9o1cxRckob
EQIDAQAB
-----END PUBLIC KEY-----`;

// ── 🛡️ UTILITAIRES WEBCRYPTO & INDEXED-DB ──
const DB_NAME = "KauriSecureEnclave";
const STORE_NAME = "client_keys";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveKeysToEnclave(id: string, keys: { decryptKey: CryptoKey; signKey: CryptoKey }) {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(keys, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getKeysFromEnclave(id: string): Promise<{ decryptKey: CryptoKey; signKey: CryptoKey } | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem.replace(/-----\s*BEGIN[^-]*-----\s*/g, "").replace(/-----\s*END[^-]*-----\s*/g, "").replace(/\s/g, "");
  const binaryString = window.atob(b64Lines);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

function detectMimeType(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer).slice(0, 4);
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
  return "image/jpeg";
}

export function KYCVerificationScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") || "particulier";
  const supabase = getSupabase();

  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [identityPreviewUrl, setIdentityPreviewUrl] = useState<string | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [identityType, setIdentityFileType] = useState<'image' | 'pdf'>('image');
  const [selfieType, setSelfieFileType] = useState<'image' | 'pdf'>('image');

  const [address, setAddress] = useState({ firstName: "", lastName: "", street: "", zip: "", city: "", country: "France" });

  const identityInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // 🎯 GESTION ET MIGRATION DE LA CLÉ PRIVÉE SOUVERAINE
  const ensureKeysInEnclave = async () => {
    let keys = await getKeysFromEnclave('kauri_client');
    if (!keys) {
      const legacyPem = localStorage.getItem('kauri_client_priv_key');
      if (legacyPem) {
        const rawBuffer = pemToArrayBuffer(legacyPem);
        const decryptKey = await window.crypto.subtle.importKey(
          "pkcs8", rawBuffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["decrypt"]
        );
        const signKey = await window.crypto.subtle.importKey(
          "pkcs8", rawBuffer, { name: "RSA-PSS", hash: "SHA-256" }, false, ["sign"]
        );
        keys = { decryptKey, signKey };
        await saveKeysToEnclave('kauri_client', keys);
        localStorage.removeItem('kauri_client_priv_key'); // Éradication de la faille
      }
    }
    return keys;
  };

  const decryptUserFile = async (packedBuffer: ArrayBuffer, decryptKey: CryptoKey): Promise<{ url: string; type: 'image' | 'pdf' }> => {
    const packedBytes = new Uint8Array(packedBuffer);
    const view = new DataView(packedBytes.buffer);
    
    const adminKeyLen = view.getUint32(0, false);
    const userKeyLen = view.getUint32(4, false);
    const sigLen = view.getUint32(8, false);
    
    const adminKeyOffset = 12;
    const userKeyOffset = adminKeyOffset + adminKeyLen;
    const sigOffset = userKeyOffset + userKeyLen;
    const ivOffset = sigOffset + sigLen;
    
    const encryptedAesKeyUser = packedBytes.slice(userKeyOffset, sigOffset);
    const iv = packedBytes.slice(ivOffset, ivOffset + 12);
    const ciphertext = packedBytes.slice(ivOffset + 12);

    const decryptedAesKeyRaw = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" }, decryptKey, encryptedAesKeyUser
    );

    const aesKey = await window.crypto.subtle.importKey(
      "raw", decryptedAesKeyRaw, { name: "AES-GCM" }, false, ["decrypt"]
    );

    const decryptedFileBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, aesKey, ciphertext
    );

    const mime = detectMimeType(decryptedFileBuffer);
    return {
      url: URL.createObjectURL(new Blob([decryptedFileBuffer], { type: mime })),
      type: mime === "application/pdf" ? 'pdf' : 'image'
    };
  };

  useEffect(() => {
    const loadAndDecryptKycHub = async () => {
      if (!profile?.id) return;
      setIsLoadingDocuments(true);

      try {
        const enclaveKeys = await ensureKeysInEnclave();
        if (!enclaveKeys) throw new Error("Clés absentes de l'enclave.");

        const { data: files } = await supabase.storage.from('secure-kyc').list(profile.id);
        if (files) {
          const idFile = files.find(f => f.name.startsWith('identity'));
          const sfFile = files.find(f => f.name.startsWith('selfie'));

          if (idFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${idFile.name}`);
            if (blob) {
              const dec = await decryptUserFile(await blob.arrayBuffer(), enclaveKeys.decryptKey);
              setIdentityFileType(dec.type);
              setIdentityPreviewUrl(dec.url);
            }
          }

          if (sfFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${sfFile.name}`);
            if (blob) {
              const dec = await decryptUserFile(await blob.arrayBuffer(), enclaveKeys.decryptKey);
              setSelfieFileType(dec.type);
              setSelfiePreviewUrl(dec.url);
            }
          }
        }
      } catch (err) {
        console.error("Hub self-decryption bypassed or failed:", err);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    loadAndDecryptKycHub();
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setAddress(prev => ({
        ...prev,
        firstName: profile.first_name && profile.first_name !== 'Prénom' ? profile.first_name : "",
        lastName: profile.last_name && profile.last_name !== 'Nom' ? profile.last_name : "",
        street: profile.street || "",
        zip: profile.zip || "",
        city: profile.city || "",
      }));
    }
  }, [profile]);

  const handleUploadAndEncrypt = async (e: React.ChangeEvent<HTMLInputElement>, type: "identity" | "selfie") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsActionLoading(true);
    const toastId = toast.loading(`Mise à jour et scellage du document ${type === 'identity' ? "d'identité" : "selfie"}...`);

    try {
      const enclaveKeys = await ensureKeysInEnclave();
      if (!enclaveKeys) throw new Error("Enclave non armée pour la signature.");

      const { data: dbProfile } = await supabase.from('profiles').select('user_public_key').eq('id', profile?.id).single();
      if (!dbProfile?.user_public_key) throw new Error("Clé de session publique manquante.");

      const fileBuffer = await file.arrayBuffer();

      // 1. Chiffrement AES
      const aesKey = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, fileBuffer);
      const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

      // 2. Chiffrement asymétrique de la clé AES (Admin & User)
      const adminPublicKey = await window.crypto.subtle.importKey(
        "spki", pemToArrayBuffer(ADMIN_PUBLIC_KEY_PEM), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]
      );
      const encryptedAesKeyAdmin = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, adminPublicKey, exportedAesKey);

      const userPublicKey = await window.crypto.subtle.importKey(
        "spki", pemToArrayBuffer(dbProfile.user_public_key), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]
      );
      const encryptedAesKeyUser = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, userPublicKey, exportedAesKey);

      // 3. Signature Numérique (Preuve d'origine sur le payload chiffré)
      const dataToSign = new Uint8Array(iv.length + encryptedFileContent.byteLength);
      dataToSign.set(iv, 0);
      dataToSign.set(new Uint8Array(encryptedFileContent), iv.length);
      
      const signatureBuffer = await window.crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 }, enclaveKeys.signKey, dataToSign
      );

      // 4. Assemblage de la matrice
      const packedBuffer = new ArrayBuffer(
        12 + encryptedAesKeyAdmin.byteLength + encryptedAesKeyUser.byteLength + signatureBuffer.byteLength + 12 + encryptedFileContent.byteLength
      );
      const view = new DataView(packedBuffer);
      view.setUint32(0, encryptedAesKeyAdmin.byteLength, false);
      view.setUint32(4, encryptedAesKeyUser.byteLength, false);
      view.setUint32(8, signatureBuffer.byteLength, false);

      const packedBytes = new Uint8Array(packedBuffer);
      let offset = 12;
      packedBytes.set(new Uint8Array(encryptedAesKeyAdmin), offset); offset += encryptedAesKeyAdmin.byteLength;
      packedBytes.set(new Uint8Array(encryptedAesKeyUser), offset); offset += encryptedAesKeyUser.byteLength;
      packedBytes.set(new Uint8Array(signatureBuffer), offset); offset += signatureBuffer.byteLength;
      packedBytes.set(iv, offset); offset += 12;
      packedBytes.set(new Uint8Array(encryptedFileContent), offset);

      const encryptedBlob = new Blob([packedBytes], { type: "application/octet-stream" });
      const { error: uploadError } = await supabase.storage.from('secure-kyc').upload(`${profile?.id}/${type}.enc`, encryptedBlob, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;

      const localUrl = URL.createObjectURL(file);
      if (type === "identity") {
        setIdentityFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
        setIdentityPreviewUrl(localUrl);
      } else {
        setSelfieFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
        setSelfiePreviewUrl(localUrl);
      }

      toast.success("Document signé, sécurisé et transmis !", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Échec de l'opération cryptographique.", { id: toastId });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!identityPreviewUrl || !selfiePreviewUrl) {
      toast.warning("Vos pièces justificatives doivent être complétées."); return;
    }
    if (!address.firstName.trim() || !address.lastName.trim() || !address.street.trim() || !address.zip.trim() || !address.city.trim()) {
      toast.warning("Le formulaire doit être intégralement renseigné."); return;
    }

    setIsActionLoading(true);
    const toastId = toast.loading("Actualisation de votre dossier de conformité...");
    
    try {
      const { error } = await supabase.from('profiles').update({
        first_name: address.firstName.trim(), last_name: address.lastName.trim(),
        street: address.street.trim(), city: address.city.trim(), zip: address.zip.trim(), kyc_status: 'pending'
      }).eq('id', profile?.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Registre mis à jour avec succès !", { id: toastId });
      navigate(`/kauri/biometric-setup?type=${accountType}`);
    } catch (err) {
      toast.error("Erreur de synchronisation.", { id: toastId });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans select-none">
      <input type="file" ref={identityInputRef} onChange={(e) => handleUploadAndEncrypt(e, "identity")} accept="image/*,application/pdf" className="hidden" />
      <input type="file" ref={selfieInputRef} onChange={(e) => handleUploadAndEncrypt(e, "selfie")} accept="image/*" capture="user" className="hidden" />

      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-4 text-white flex items-center gap-2 bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Retour</span>
        </button>
        <h1 className="text-white text-2xl font-black tracking-tight">Kauri KYC Hub</h1>
        <p className="text-[#E0F2FE] text-xs opacity-90">Espace souverain de scellage cryptographique (AES + RSA-PSS)</p>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto w-full space-y-6">
        {isLoadingDocuments ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-md">
            <Loader2 className="w-8 h-8 animate-spin text-[#006D77]" />
            <p className="text-xs text-slate-500 font-medium">Synchronisation de l'enclave matérielle...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Justificatifs Matériels</h3>
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100">
                    {identityPreviewUrl ? (identityType === 'pdf' ? <FileText className="w-6 h-6 text-red-400" /> : <img src={identityPreviewUrl} alt="Identity" className="w-full h-full object-cover" />) : <FileText className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">Pièce d'identité légale</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-2 rounded-full ${identityPreviewUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p className="text-[11px] text-slate-500 font-medium">{identityPreviewUrl ? 'Signé et Scellé' : 'Non communiqué'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => identityInputRef.current?.click()} className="px-4 py-2.5 bg-[#006D77]/10 hover:bg-[#006D77]/20 text-[#006D77] font-bold text-xs rounded-xl border-none transition-all cursor-pointer flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />{identityPreviewUrl ? "Modifier" : "Ajouter"}
                </button>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100">
                    {selfiePreviewUrl ? (selfieType === 'pdf' ? <FileText className="w-6 h-6 text-red-400" /> : <img src={selfiePreviewUrl} alt="Selfie" className="w-full h-full object-cover" />) : <User className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">Selfie de présence</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-2 rounded-full ${selfiePreviewUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p className="text-[11px] text-slate-500 font-medium">{selfiePreviewUrl ? 'Signé et Scellé' : 'Non communiqué'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => selfieInputRef.current?.click()} className="px-4 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#B8860B] font-bold text-xs rounded-xl border-none transition-all cursor-pointer flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />{selfiePreviewUrl ? "Modifier" : "Prendre"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Attestation de Résidence</h3>
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5">
                <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Numéro et libellé de voie</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="1 Rue de la Solidarité" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Code postal</label>
                    <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="75001" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                  </div>
                  <div>
                    <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Ville de résidence</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Paris" className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleFinalSubmit} disabled={isActionLoading} className="w-full bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white py-4 rounded-2xl mt-4 shadow-lg shadow-[#006D77]/20 font-bold text-sm tracking-wide transition-all active:scale-[0.99] border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Enregistrer et Transmettre le Dossier</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default KYCVerificationScreen;
