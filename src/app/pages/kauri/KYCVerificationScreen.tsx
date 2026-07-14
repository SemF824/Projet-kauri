import { ArrowLeft, Camera, User, FileText, Loader2, CheckCircle2, RotateCw, Check, Clock, X, Video } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";
import { toast } from "sonner";

// ── 🔒 CLÉ PUBLIQUE ADMINISTRATIVE ECC (P-256) ENREGISTRÉE ──
const ADMIN_ECDH_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErBf4GgqGXvYZGn7qZQlGZ0ogz9d4
vsrPLUye3cZWTtALPQ9WxSSqwJMmPbp0U04+PdgAqICBBLg4OfuXrvMpCw==
-----END PUBLIC KEY-----`;

// ── 🛡️ UTILITAIRES WEBCRYPTO & INDEXED-DB ──
const DB_NAME = "KauriSecureEnclave";
const STORE_NAME = "client_keys";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      } else {
        db.deleteObjectStore(STORE_NAME);
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
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

// Support étendu aux vidéos WebM et MP4
function detectMimeType(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer).slice(0, 12);
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) return "video/webm";
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "video/mp4";
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
  const [identityType, setIdentityFileType] = useState<'image' | 'pdf' | 'video'>('image');
  const [selfieType, setSelfieFileType] = useState<'image' | 'pdf' | 'video'>('image');

  const [hasFileChanges, setHasFileChanges] = useState(false);
  const [address, setAddress] = useState({
    firstName: "", lastName: "", street: "", zip: "", city: "", country: "France",
  });
  const [initialAddress, setInitialAddress] = useState({
    firstName: "", lastName: "", street: "", zip: "", city: "", country: "France",
  });

  const identityInputRef = useRef<HTMLInputElement>(null);

  // ── 🎥 ÉTATS DU MOTEUR D'ENREGISTREMENT VIDÉO (LIVENESS SEQUENCE) ──
  const [showCamera, setShowCamera] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'front' | 'left' | 'right' | 'processing'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<BlobPart[]>([]);
  const keyframesRef = useRef<ImageData[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false // KYC silencieux
      });
      mediaStreamRef.current = stream;
      setShowCamera(true);
      setRecordingState('idle');
    } catch (err) {
      toast.error("Accès caméra refusé. Vérifiez vos permissions.");
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(e => console.error("Erreur de flux:", e));
    }
  }, [showCamera]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    mediaStreamRef.current = null;
    setShowCamera(false);
    setRecordingState('idle');
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Capture discrète pour le moteur d'Optical Flow
  const captureKeyframe = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 100; // Résolution basse pour calcul matriciel instantané
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 100, 100);
      keyframesRef.current.push(ctx.getImageData(0, 0, 100, 100));
    }
  };

  // Le moteur anti-fraude statique
  const evaluateMotionVariance = () => {
    const frames = keyframesRef.current;
    if (frames.length < 3) return false;

    let totalDiff = 0;
    for (let i = 0; i < frames.length - 1; i++) {
      const curr = frames[i].data;
      const next = frames[i+1].data;
      let frameDiff = 0;
      for (let j = 0; j < curr.length; j += 4) {
        // Variation des canaux RGB
        frameDiff += Math.abs(curr[j] - next[j]) + Math.abs(curr[j+1] - next[j+1]) + Math.abs(curr[j+2] - next[j+2]);
      }
      totalDiff += frameDiff / (curr.length / 4);
    }
    
    // Si la moyenne de déplacement des pixels est inférieure à 15, c'est une image statique (fraude).
    return totalDiff > 15; 
  };

  const startVideoLivenessSequence = () => {
    if (!mediaStreamRef.current) return;
    
    videoChunksRef.current = [];
    keyframesRef.current = [];
    
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) videoChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      setRecordingState('processing');
      const videoBlob = new Blob(videoChunksRef.current, { type: recorder.mimeType || 'video/mp4' });
      videoChunksRef.current = [];

      const isLive = evaluateMotionVariance();
      if (!isLive) {
        toast.error("Échec Anti-Fraude : Aucun mouvement facial détecté. Veuillez suivre les instructions.");
        setRecordingState('idle');
        return;
      }

      const file = new File([videoBlob], "liveness_record.webm", { type: videoBlob.type });
      stopCamera();
      await handleUploadAndEncrypt("selfie", file);
    };

    // Le Séquençage Chronométré (6 Secondes)
    recorder.start();
    setRecordingState('front');
    captureKeyframe();

    setTimeout(() => {
      setRecordingState('left');
      captureKeyframe();
    }, 2000);

    setTimeout(() => {
      setRecordingState('right');
      captureKeyframe();
    }, 4000);

    setTimeout(() => {
      captureKeyframe();
      recorder.stop();
    }, 6000);
  };

  // ── 🧠 CHIFFREMENT & DECHIFFREMENT ECC ──
  const decryptUserFile = async (packedBuffer: ArrayBuffer, ecdhPriv: CryptoKey): Promise<{ url: string; type: 'image' | 'pdf' | 'video' }> => {
    const packedBytes = new Uint8Array(packedBuffer);
    const view = new DataView(packedBytes.buffer);
    
    const adminFekLen = view.getUint32(0, false);
    const userFekLen = view.getUint32(4, false);
    const sigLen = view.getUint32(8, false);
    
    const ephPubRaw = packedBytes.slice(12, 77);
    const wrapIV = packedBytes.slice(77, 89);
    const fileIV = packedBytes.slice(89, 101);
    
    const userFekStart = 101 + adminFekLen;
    const encryptedAesKeyUser = packedBytes.slice(userFekStart, userFekStart + userFekLen);
    
    const cipherStart = 101 + adminFekLen + userFekLen + sigLen;
    const ciphertext = packedBytes.slice(cipherStart);

    const ephPubKey = await window.crypto.subtle.importKey("raw", ephPubRaw, { name: "ECDH", namedCurve: "P-256" }, false, []);
    const userWrapKey = await window.crypto.subtle.deriveKey({ name: "ECDH", public: ephPubKey }, ecdhPriv, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const decryptedFekRaw = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: wrapIV }, userWrapKey, encryptedAesKeyUser);
    const fek = await window.crypto.subtle.importKey("raw", decryptedFekRaw, { name: "AES-GCM" }, false, ["decrypt"]);
    const decryptedFileBuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: fileIV }, fek, ciphertext);

    const mime = detectMimeType(decryptedFileBuffer);
    return {
      url: URL.createObjectURL(new Blob([decryptedFileBuffer], { type: mime })),
      type: mime.startsWith('video') ? 'video' : mime === "application/pdf" ? 'pdf' : 'image'
    };
  };

  useEffect(() => {
    const loadAndDecryptKycHub = async () => {
      if (!profile?.id) return;
      setIsLoadingDocuments(true);

      try {
        const enclaveKeys = await getKeysFromEnclave('kauri_client');
        if (!enclaveKeys) { setIsLoadingDocuments(false); return; }

        const { data: files, error } = await supabase.storage.from('secure-kyc').list(profile.id);

        if (!error && files) {
          const idFile = files.find(f => f.name.startsWith('identity'));
          const sfFile = files.find(f => f.name.startsWith('selfie'));

          if (idFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${idFile.name}`);
            if (blob) {
              const arrayBuf = await blob.arrayBuffer();
              const dec = await decryptUserFile(arrayBuf, enclaveKeys.ecdhPriv);
              setIdentityFileType(dec.type);
              setIdentityPreviewUrl(dec.url);
            }
          }

          if (sfFile) {
            const { data: blob } = await supabase.storage.from('secure-kyc').download(`${profile.id}/${sfFile.name}`);
            if (blob) {
              const arrayBuf = await blob.arrayBuffer();
              const dec = await decryptUserFile(arrayBuf, enclaveKeys.ecdhPriv);
              setSelfieFileType(dec.type);
              setSelfiePreviewUrl(dec.url);
            }
          }
        }
      } catch (err) {
        console.error("Déchiffrement local échoué:", err);
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    loadAndDecryptKycHub();
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const extractedAddress = {
        firstName: profile.first_name && profile.first_name !== 'Prénom' ? profile.first_name : "",
        lastName: profile.last_name && profile.last_name !== 'Nom' ? profile.last_name : "",
        street: profile.street || "",
        zip: profile.zip || "",
        city: profile.city || "",
        country: "France",
      };
      setAddress(extractedAddress);
      setInitialAddress(extractedAddress);
    }
  }, [profile]);

  const handleUploadAndEncrypt = async (type: "identity" | "selfie", fileFromParam?: File) => {
    const file = fileFromParam;
    if (!file) return;

    setIsActionLoading(true);
    const toastId = toast.loading(`Scellage asymétrique (ECC P-256) du module ${type}...`);

    try {
      const enclaveKeys = await getKeysFromEnclave('kauri_client');
      if (!enclaveKeys) throw new Error("Enclave non armée pour la cryptographie ECC.");

      const { data: dbProfile, error: profileFetchError } = await supabase.from('profiles').select('user_public_key').eq('id', profile?.id).single();
      if (profileFetchError || !dbProfile?.user_public_key) throw new Error("Trousseau public manquant sur le serveur.");

      const userPublicKeys = JSON.parse(dbProfile.user_public_key);
      const fileBuffer = await file.arrayBuffer();

      const ephKey = await window.crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
      const ephPubRaw = await window.crypto.subtle.exportKey("raw", ephKey.publicKey);

      const fek = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
      const fileIV = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: fileIV }, fek, fileBuffer);
      const exportedFek = await window.crypto.subtle.exportKey("raw", fek);
      const wrapIV = window.crypto.getRandomValues(new Uint8Array(12));

      // Admin Enclave
      const adminPubKey = await window.crypto.subtle.importKey("spki", pemToArrayBuffer(ADMIN_ECDH_PUBLIC_KEY_PEM), { name: "ECDH", namedCurve: "P-256" }, false, []);
      const adminWrapKey = await window.crypto.subtle.deriveKey({ name: "ECDH", public: adminPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
      const adminEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, adminWrapKey, exportedFek);

      // Client Enclave
      const userPubKey = await window.crypto.subtle.importKey("spki", pemToArrayBuffer(userPublicKeys.ecdh), { name: "ECDH", namedCurve: "P-256" }, false, []);
      const userWrapKey = await window.crypto.subtle.deriveKey({ name: "ECDH", public: userPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
      const userEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, userWrapKey, exportedFek);

      // Signature (Preuve d'origine)
      const dataToSign = new Uint8Array(ephPubRaw.byteLength + fileIV.byteLength + encryptedFileContent.byteLength);
      dataToSign.set(new Uint8Array(ephPubRaw), 0);
      dataToSign.set(fileIV, ephPubRaw.byteLength);
      dataToSign.set(new Uint8Array(encryptedFileContent), ephPubRaw.byteLength + fileIV.byteLength);
      const signatureBuffer = await window.crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, enclaveKeys.ecdsaPriv, dataToSign);

      const totalLength = 101 + adminEncFEK.byteLength + userEncFEK.byteLength + signatureBuffer.byteLength + encryptedFileContent.byteLength;
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

      const { error: uploadError } = await supabase.storage.from('secure-kyc').upload(`${profile?.id}/${type}.enc`, new Blob([packedBytes], { type: "application/octet-stream" }), { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;

      const localUrl = URL.createObjectURL(file);
      if (type === "identity") {
        setIdentityFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
        setIdentityPreviewUrl(localUrl);
      } else {
        setSelfieFileType(file.type.startsWith('video') ? 'video' : 'image');
        setSelfiePreviewUrl(localUrl);
      }

      setHasFileChanges(true);
      toast.success("Package vidéo chiffré et transmis !", { id: toastId });
    } catch (err: any) {
      toast.error("Échec de l'opération cryptographique.", { id: toastId });
    } finally {
      setIsActionLoading(false);
    }
  };

  const isAddressChanged =
    address.firstName.trim() !== initialAddress.firstName ||
    address.lastName.trim() !== initialAddress.lastName ||
    address.street.trim() !== initialAddress.street ||
    address.zip.trim() !== initialAddress.zip ||
    address.city.trim() !== initialAddress.city;

  const hasAnyMutation = isAddressChanged || hasFileChanges;

  const handleMainAction = async () => {
    if (!hasAnyMutation) {
      navigate(`/kauri/biometric-setup?type=${accountType}`);
      return;
    }

    if (!identityPreviewUrl || !selfiePreviewUrl) {
      toast.warning("Vos pièces justificatives d'identité et de selfie de présence doivent être complétées.");
      return;
    }
    if (!address.firstName.trim() || !address.lastName.trim() || !address.street.trim() || !address.zip.trim() || !address.city.trim()) {
      toast.warning("Le formulaire d'attestation de domicile doit être intégralement renseigné.");
      return;
    }

    setIsActionLoading(true);
    const toastId = toast.loading("Actualisation globale de votre dossier de conformité...");
    
    try {
      const { error } = await supabase.from('profiles').update({
          first_name: address.firstName.trim(),
          last_name: address.lastName.trim(),
          street: address.street.trim(),
          city: address.city.trim(),
          zip: address.zip.trim(),
          kyc_status: 'pending'
        }).eq('id', profile?.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Registre mis à jour avec succès !", { id: toastId });
      navigate(`/kauri/biometric-setup?type=${accountType}`);
    } catch (err) {
      toast.error("Erreur de synchronisation réseau.", { id: toastId });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans select-none">
      <input 
        type="file" 
        ref={identityInputRef} 
        onChange={(e) => handleUploadAndEncrypt("identity", e.target.files?.[0])} 
        accept="image/*,application/pdf" 
        className="hidden" 
      />

      <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-4 text-white flex items-center gap-2 bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Retour</span>
        </button>

        <h1 className="text-white text-2xl font-black tracking-tight">Kauri KYC Hub</h1>
        <p className="text-[#E0F2FE] text-xs opacity-90">Analyse de Liveness Vidéo & ECIES</p>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto w-full space-y-6">
        
        {profile?.kyc_status === 'pending' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex gap-3 items-start">
            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-600">Dossier en cours d'analyse</h4>
              <p className="text-[11px] text-amber-700/80 font-medium leading-normal mt-0.5">Vos pièces sont en cours d'analyse par le registre central.</p>
            </div>
          </div>
        )}

        {profile?.kyc_status === 'verified' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-600">Identité Certifiée</h4>
              <p className="text-[11px] text-emerald-700/80 font-medium leading-normal mt-0.5">Votre compte possède le statut vérifié de conformité.</p>
            </div>
          </div>
        )}

        {isLoadingDocuments ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-md">
            <Loader2 className="w-8 h-8 animate-spin text-[#006D77]" />
            <p className="text-xs text-slate-500 font-medium">Synchronisation de l'enclave matérielle...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Justificatifs Matériels</h3>

              {/* CARD 1 : PIÈCE D'IDENTITÉ */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100">
                    {identityPreviewUrl ? (
                      identityType === 'pdf' ? <FileText className="w-6 h-6 text-red-400" /> : <img src={identityPreviewUrl} alt="Identity Cache" className="w-full h-full object-cover" />
                    ) : <FileText className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">Pièce d'identité officielle</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${identityPreviewUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p className="text-[11px] text-slate-500 font-medium">{identityPreviewUrl ? 'Sécurisé ECC' : 'Non communiqué'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => identityInputRef.current?.click()} className="px-4 py-2.5 bg-[#006D77]/10 hover:bg-[#006D77]/20 text-[#006D77] font-bold text-xs rounded-xl border-none transition-all cursor-pointer flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> {identityPreviewUrl ? "Modifier" : "Ajouter"}
                </button>
              </div>

              {/* CARD 2 : SÉQUENCE LIVENESS VIDÉO */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100">
                    {selfiePreviewUrl ? (
                      selfieType === 'video' ? (
                        <video src={selfiePreviewUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                      ) : (
                        <img src={selfiePreviewUrl} alt="Selfie Cache" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <Video className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">Liveness Vidéo 3D</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${selfiePreviewUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <p className="text-[11px] text-slate-500 font-medium">{selfiePreviewUrl ? 'Vidéo Enregistrée & Scellée' : 'Preuve de vie requise'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={startCamera} className="px-4 py-2.5 bg-gradient-to-br from-[#D4AF37]/10 to-[#FEF3C7]/20 text-[#B8860B] font-bold text-xs rounded-xl border-none transition-all cursor-pointer flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" /> {selfiePreviewUrl ? "Refaire" : "Démarrer"}
                </button>
              </div>
            </div>

            {/* FORMULAIRE DE RÉSIDENCE */}
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

            <button 
              onClick={handleMainAction} 
              disabled={isActionLoading} 
              className={`w-full py-4 rounded-2xl mt-4 shadow-lg font-bold text-sm tracking-wide transition-all active:scale-[0.99] border-none cursor-pointer flex items-center justify-center gap-2 ${hasAnyMutation ? "bg-gradient-to-r from-[#006D77] to-[#0D9488] text-white shadow-[#006D77]/20" : "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10"}`}
            >
              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{hasAnyMutation ? "Appliquer les modifications et re-soumettre" : "Passer / Étape suivante"}</span>
            </button>
          </>
        )}
      </div>

      {/* 🎥 MODALE DE SÉQUENCE VIDÉO (STYLE YOTI + INSTRUCTIONS TEMPORELLES) */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-[#F4F4F5] flex flex-col items-center justify-center p-4 md:p-8">
          
          <div className="absolute top-6 left-6 z-20">
            <button onClick={stopCamera} disabled={recordingState !== 'idle'} className="bg-white border border-slate-200 text-[#2B6CB0] px-4 py-2 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50">
              <ArrowLeft className="w-4 h-4" /> Annuler
            </button>
          </div>

          <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-slate-100">
            
            <div className="p-5 text-center z-10 bg-white shadow-sm relative min-h-[72px] flex items-center justify-center">
              <h2 className="text-[#0F172A] font-extrabold text-[15px] tracking-tight transition-all">
                {recordingState === 'idle' && "Placez votre visage dans le cadre"}
                {recordingState === 'front' && "Regardez fixement l'objectif..."}
                {recordingState === 'left' && "Tournez la tête à GAUCHE..."}
                {recordingState === 'right' && "Tournez la tête à DROITE..."}
                {recordingState === 'processing' && "Analyse en cours..."}
              </h2>
            </div>
            
            <div className="relative w-full h-[60vh] min-h-[400px] bg-slate-200 flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                playsInline 
                muted 
              />
              
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className={`relative w-[260px] h-[360px] rounded-[130px] border-4 transition-colors duration-300 shadow-[0_0_0_9999px_rgba(255,255,255,0.85)] ${recordingState !== 'idle' && recordingState !== 'processing' ? 'border-[#2B6CB0]' : 'border-[#64748B]'}`}></div>
              </div>
            </div>
            
            <div className="p-6 bg-[#F8FAFC] flex flex-col gap-3 z-10 border-t border-slate-200">
              <button 
                onClick={startVideoLivenessSequence} 
                disabled={recordingState !== 'idle'}
                className="w-full bg-[#2B6CB0] hover:bg-[#1E4E8C] text-white py-4 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recordingState === 'idle' ? (
                  <> <Video className="w-5 h-5" /> Démarrer l'enregistrement </>
                ) : (
                  <> <Loader2 className="w-5 h-5 animate-spin" /> Ne quittez pas le cadre... </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default KYCVerificationScreen;
