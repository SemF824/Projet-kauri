import { ArrowLeft, Camera, User, FileText, Loader2, CheckCircle2, RotateCw, Eye, EyeOff, MapPin, Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

// ── 🔒 CLÉ PUBLIQUE ADMINISTRATIVE ECC (P-256) ──
// ATTENTION: Ceci est un format attendu. Tu devras générer une vraie clé ECC P-256.
const ADMIN_ECDH_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAETx/B8L26+2h1t7oZ8P3N7w1K+3o1
ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890
-----END PUBLIC KEY-----`;

// ── 🛡️ UTILITAIRES WEBCRYPTO & INDEXED-DB ──
const DB_NAME = "KauriSecureEnclave";
const STORE_NAME = "client_keys";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2); // Bump version for ECC migration
    req.onupgradeneeded = (e: any) => {
      if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
        e.target.result.createObjectStore(STORE_NAME);
      } else {
        e.target.result.deleteObjectStore(STORE_NAME);
        e.target.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveKeysToEnclave(id: string, keys: { ecdhPriv: CryptoKey; ecdsaPriv: CryptoKey }) {
  const db = await getDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(keys, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getKeysFromEnclave(id: string): Promise<{ ecdhPriv: CryptoKey; ecdsaPriv: CryptoKey } | undefined> {
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

  const decryptUserFile = async (packedBuffer: ArrayBuffer, ecdhPriv: CryptoKey): Promise<{ url: string; type: 'image' | 'pdf' }> => {
    const packedBytes = new Uint8Array(packedBuffer);
    const view = new DataView(packedBytes.buffer);
    
    // 1. Lecture de la matrice d'en-tête (101 octets fixes)
    const adminFekLen = view.getUint32(0, false);
    const userFekLen = view.getUint32(4, false);
    const sigLen = view.getUint32(8, false);
    
    const ephPubRaw = packedBytes.slice(12, 77); // 65 octets (Clé P-256 brute)
    const wrapIV = packedBytes.slice(77, 89);
    const fileIV = packedBytes.slice(89, 101);
    
    // 2. Offsets dynamiques
    const userFekStart = 101 + adminFekLen;
    const encryptedAesKeyUser = packedBytes.slice(userFekStart, userFekStart + userFekLen);
    
    const cipherStart = 101 + adminFekLen + userFekLen + sigLen;
    const ciphertext = packedBytes.slice(cipherStart);

    // 3. Reconstruction de la clé éphémère publique
    const ephPubKey = await window.crypto.subtle.importKey(
      "raw", ephPubRaw, { name: "ECDH", namedCurve: "P-256" }, false, []
    );

    // 4. Dérivation du secret partagé Client (ECDH)
    const userWrapKey = await window.crypto.subtle.deriveKey(
      { name: "ECDH", public: ephPubKey },
      ecdhPriv,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // 5. Déverrouillage de la clé maître du fichier (FEK)
    const decryptedFekRaw = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: wrapIV }, userWrapKey, encryptedAesKeyUser
    );

    const fek = await window.crypto.subtle.importKey(
      "raw", decryptedFekRaw, { name: "AES-GCM" }, false, ["decrypt"]
    );

    // 6. Déchiffrement final du document
    const decryptedFileBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fileIV }, fek, ciphertext
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
        const enclaveKeys = await getKeysFromEnclave('kauri_client');
        if (!enclaveKeys) throw new Error("Clés ECC absentes de l'enclave.");

        const { data: files } = await supabase.storage.from('secure-kyc').list(profile.id);
        if (files) {
          const idFile = files.find(f => f.name.startsWith('identity'));
          const sfFile = files.find(f => f.name.startsWith('selfie'));

          if (idFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${idFile.name}`);
            if (blob) {
              const dec = await decryptUserFile(await blob.arrayBuffer(), enclaveKeys.ecdhPriv);
              setIdentityFileType(dec.type);
              setIdentityPreviewUrl(dec.url);
            }
          }

          if (sfFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${sfFile.name}`);
            if (blob) {
              const dec = await decryptUserFile(await blob.arrayBuffer(), enclaveKeys.ecdhPriv);
              setSelfieFileType(dec.type);
              setSelfiePreviewUrl(dec.url);
            }
          }
        }
      } catch (err) {
        console.error("Hub self-decryption failed (Expected if no ECC keys):", err);
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
    const toastId = toast.loading(`Mise à jour et scellage (ECC) du document ${type === 'identity' ? "d'identité" : "selfie"}...`);

    try {
      const enclaveKeys = await getKeysFromEnclave('kauri_client');
      if (!enclaveKeys) throw new Error("Enclave non armée pour la cryptographie ECC.");

      const { data: dbProfile } = await supabase.from('profiles').select('user_public_key').eq('id', profile?.id).single();
      if (!dbProfile?.user_public_key) throw new Error("Trousseau public manquant sur le serveur.");

      // Extraction des clés publiques depuis le JSON du serveur
      const userPublicKeys = JSON.parse(dbProfile.user_public_key);

      const fileBuffer = await file.arrayBuffer();

      // 1. Génération de la Clé Éphémère (Le cœur d'ECIES)
      const ephKey = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]
      );
      const ephPubRaw = await window.crypto.subtle.exportKey("raw", ephKey.publicKey); // Toujours 65 octets

      // 2. Chiffrement du fichier avec une nouvelle clé AES (FEK)
      const fek = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
      const fileIV = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: fileIV }, fek, fileBuffer);
      const exportedFek = await window.crypto.subtle.exportKey("raw", fek);

      // 3. Dérivation des Secrets Partagés (ECDH) et scellage du FEK
      const wrapIV = window.crypto.getRandomValues(new Uint8Array(12));

      // 3a. Pour l'Admin
      const adminPubKey = await window.crypto.subtle.importKey(
        "spki", pemToArrayBuffer(ADMIN_ECDH_PUBLIC_KEY_PEM), { name: "ECDH", namedCurve: "P-256" }, false, []
      );
      const adminWrapKey = await window.crypto.subtle.deriveKey(
        { name: "ECDH", public: adminPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
      );
      const adminEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, adminWrapKey, exportedFek);

      // 3b. Pour le Client (lui-même)
      const userPubKey = await window.crypto.subtle.importKey(
        "spki", pemToArrayBuffer(userPublicKeys.ecdh), { name: "ECDH", namedCurve: "P-256" }, false, []
      );
      const userWrapKey = await window.crypto.subtle.deriveKey(
        { name: "ECDH", public: userPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
      );
      const userEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, userWrapKey, exportedFek);

      // 4. Signature ECDSA (Preuve d'origine)
      const dataToSign = new Uint8Array(ephPubRaw.byteLength + fileIV.byteLength + encryptedFileContent.byteLength);
      dataToSign.set(new Uint8Array(ephPubRaw), 0);
      dataToSign.set(fileIV, ephPubRaw.byteLength);
      dataToSign.set(new Uint8Array(encryptedFileContent), ephPubRaw.byteLength + fileIV.byteLength);
      
      const signatureBuffer = await window.crypto.subtle.sign(
        { name: "ECDSA", hash: { name: "SHA-256" } }, enclaveKeys.ecdsaPriv, dataToSign
      );

      // 5. Assemblage chirurgical de la matrice binaire
      const headerLength = 101;
      const totalLength = headerLength + adminEncFEK.byteLength + userEncFEK.byteLength + signatureBuffer.byteLength + encryptedFileContent.byteLength;
      
      const packedBuffer = new ArrayBuffer(totalLength);
      const view = new DataView(packedBuffer);
      view.setUint32(0, adminEncFEK.byteLength, false);
      view.setUint32(4, userEncFEK.byteLength, false);
      view.setUint32(8, signatureBuffer.byteLength, false);

      const packedBytes = new Uint8Array(packedBuffer);
      packedBytes.set(new Uint8Array(ephPubRaw), 12);
      packedBytes.set(wrapIV, 77);
      packedBytes.set(fileIV, 89);

      let offset = 101;
      packedBytes.set(new Uint8Array(adminEncFEK), offset); offset += adminEncFEK.byteLength;
      packedBytes.set(new Uint8Array(userEncFEK), offset); offset += userEncFEK.byteLength;
      packedBytes.set(new Uint8Array(signatureBuffer), offset); offset += signatureBuffer.byteLength;
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

      toast.success("Document signé (ECDSA) et scellé (ECDH) !", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Échec de l'opération cryptographique. Clés invalides ?", { id: toastId });
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
      toast.error("Erreur réseau.", { id: toastId });
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
        <p className="text-[#E0F2FE] text-xs opacity-90">Cryptographie ECIES (Courbes Elliptiques P-256)</p>
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
                      <p className="text-[11px] text-slate-500 font-medium">{identityPreviewUrl ? 'Sécurisé ECC' : 'Non communiqué'}</p>
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
                      <p className="text-[11px] text-slate-500 font-medium">{selfiePreviewUrl ? 'Sécurisé ECC' : 'Non communiqué'}</p>
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
                    <input type="text" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                  </div>
                  <div>
                    <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Nom de famille</label>
                    <input type="text" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Numéro et libellé de voie</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Code postal</label>
                    <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
                  </div>
                  <div>
                    <label className="text-[#0F172A] text-xs font-bold mb-1.5 block">Ville</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-xs font-medium outline-none text-[#0F172A] focus:border-[#006D77] transition-all" />
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
