import { useState, useRef, useEffect } from 'react';
import { ArrowRight, User, Briefcase, Eye, EyeOff, ChevronLeft, Mail, Lock, Upload, CheckCircle2, Camera, Video, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getSupabase, SERVER_URL, publicAnonKey } from '../../../utils/supabase';
import { toast } from 'sonner';

type Step = 'choose' | 'name' | 'business' | 'email' | 'password' | 'phone' | 'documents';

// ── 🔒 CLÉ PUBLIQUE ADMINISTRATIVE ECC (P-256) POUR LE KYC ──
const ADMIN_ECDH_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErBf4GgqGXvYZGn7qZQlGZ0ogz9d4
vsrPLUye3cZWTtALPQ9WxSSqwJMmPbp0U04+PdgAqICBBLg4OfuXrvMpCw==
-----END PUBLIC KEY-----`;

// ── 🛡️ PIPELINE DE STOCKAGE DE L'ENCLAVE MATÉRIELLE ──
const DB_NAME = "KauriSecureEnclave";
const STORE_NAME = "client_keys";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
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

function arrayBufferToBase64(blob: ArrayBuffer): string {
  const bytes = new Uint8Array(blob);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem.replace(/-----\s*BEGIN[^-]*-----\s*/g, "").replace(/-----\s*END[^-]*-----\s*/g, "").replace(/\s/g, "");
  const binaryString = window.atob(b64Lines);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

export function AccountTypeSelectionScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('choose');
  const [accountType, setAccountType] = useState<'particulier' | 'professionnel'>('particulier');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // ── ÉTATS DU FORMULAIRE ──
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', businessName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // ── ÉTATS KYC & MÉDIAS ──
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreviewUrl, setIdPreviewUrl] = useState<string | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);

  // ── ÉTATS LIVENESS VIDÉO ──
  const [showCamera, setShowCamera] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'front' | 'left' | 'right' | 'processing'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<BlobPart[]>([]);
  const keyframesRef = useRef<ImageData[]>([]);

  // ── NAVIGATION ET VALIDATION ──
  const getStepsSequence = (): Step[] => accountType === 'professionnel' ? ['name', 'business', 'email', 'password', 'phone', 'documents'] : ['name', 'email', 'password', 'phone', 'documents'];
  const stepsSequence = getStepsSequence();
  const currentStepIndex = stepsSequence.indexOf(step);
  const progressPercentage = step === 'choose' ? 0 : Math.round(((currentStepIndex + 1) / stepsSequence.length) * 100);

  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  const isPasswordRobust = (pass: string) => pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);

  const validateCurrentStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 'name') {
      if (!form.firstName.trim()) e.firstName = 'Prénom requis';
      if (!form.lastName.trim()) e.lastName = 'Nom requis';
    }
    if (step === 'business' && accountType === 'professionnel' && !form.businessName.trim()) e.businessName = "Nom d'entreprise requis";
    if (step === 'email' && !validateEmail(form.email)) e.email = 'Adresse e-mail invalide';
    if (step === 'password' && !isPasswordRobust(form.password)) e.password = 'Mot de passe non conforme';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step === 'name') setStep(accountType === 'professionnel' ? 'business' : 'email');
    else if (step === 'business') setStep('email');
    else if (step === 'email') setStep('password');
    else if (step === 'password') setStep('phone');
    else if (step === 'phone') handleCreateAccount(); // Création du compte avant le KYC
  };

  const handleBack = () => {
    setErrors({});
    if (step === 'name') setStep('choose');
    else if (step === 'business') setStep('name');
    else if (step === 'email') setStep(accountType === 'professionnel' ? 'business' : 'name');
    else if (step === 'password') setStep('email');
    else if (step === 'phone') setStep('password');
    else if (step === 'documents') setStep('phone');
  };

  // ── LOGIQUE SOCIALE (OAuth) ──
  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const supabase = getSupabase();
      const ecdhKeyPair = await window.crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
      const ecdsaKeyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
      await saveKeysToEnclave('kauri_client', { ecdhPriv: ecdhKeyPair.privateKey, ecdsaPriv: ecdsaKeyPair.privateKey });

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/kauri/normal-dashboard`, queryParams: { account_type: accountType } }
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(`Connexion ${provider} échouée : Vérifiez l'activation dans le dashboard Supabase.`);
    } finally {
      setIsLoading(false);
    }
  };

  // ── ÉTAPE CLÉ : CRÉATION DU COMPTE AVANT LE KYC ──
  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabase();

      const ecdhKeyPair = await window.crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
      const ecdsaKeyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
      await saveKeysToEnclave('kauri_client', { ecdhPriv: ecdhKeyPair.privateKey, ecdsaPriv: ecdsaKeyPair.privateKey });

      const ecdhPubBuf = await window.crypto.subtle.exportKey("spki", ecdhKeyPair.publicKey);
      const ecdsaPubBuf = await window.crypto.subtle.exportKey("spki", ecdsaKeyPair.publicKey);

      const publicKeysJSON = JSON.stringify({ 
        ecdh: `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(ecdhPubBuf)}\n-----END PUBLIC KEY-----`, 
        ecdsa: `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(ecdsaPubBuf)}\n-----END PUBLIC KEY-----` 
      });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
            phone: form.phone.trim() || null,
            account_type: accountType,
            business_name: accountType === 'professionnel' ? form.businessName.trim() : null,
            user_public_key: publicKeysJSON
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already')) {
          toast.error('Email déjà utilisé. Connectez-vous.');
          navigate('/kauri/login');
          return;
        }
        throw signUpError;
      }

      if (!signUpData.user?.id) throw new Error("ID utilisateur non généré.");
      setActiveUserId(signUpData.user.id);
      
      // Passage à l'écran KYC une fois authentifié
      setStep('documents');
      toast.success('Profil sécurisé créé. Passons à la vérification.');
    } catch (e: any) {
      toast.error(`Erreur d'enregistrement : ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ── MOTEUR LIVENESS VIDÉO ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      mediaStreamRef.current = stream;
      setShowCamera(true);
      setRecordingState('idle');
    } catch (err) {
      toast.error("Accès caméra refusé.");
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [showCamera]);

  const stopCamera = () => {
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;
    setShowCamera(false);
    setRecordingState('idle');
  };

  const captureKeyframe = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 100; canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 100, 100);
      keyframesRef.current.push(ctx.getImageData(0, 0, 100, 100));
    }
  };

  const evaluateMotionVariance = () => {
    const frames = keyframesRef.current;
    if (frames.length < 3) return false;
    let totalDiff = 0;
    for (let i = 0; i < frames.length - 1; i++) {
      const curr = frames[i].data;
      const next = frames[i+1].data;
      let frameDiff = 0;
      for (let j = 0; j < curr.length; j += 4) {
        frameDiff += Math.abs(curr[j] - next[j]) + Math.abs(curr[j+1] - next[j+1]) + Math.abs(curr[j+2] - next[j+2]);
      }
      totalDiff += frameDiff / (curr.length / 4);
    }
    return totalDiff > 15; 
  };

  const startVideoLivenessSequence = () => {
    if (!mediaStreamRef.current) return;
    videoChunksRef.current = [];
    keyframesRef.current = [];
    
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => { if (e.data.size > 0) videoChunksRef.current.push(e.data); };
    recorder.onstop = async () => {
      setRecordingState('processing');
      const videoBlob = new Blob(videoChunksRef.current, { type: recorder.mimeType || 'video/mp4' });
      videoChunksRef.current = [];

      if (!evaluateMotionVariance()) {
        toast.error("Échec Anti-Fraude : Aucun mouvement détecté.");
        setRecordingState('idle');
        return;
      }

      stopCamera();
      await handleUploadAndEncrypt("selfie", videoBlob);
    };

    recorder.start();
    setRecordingState('front');
    captureKeyframe();
    setTimeout(() => { setRecordingState('left'); captureKeyframe(); }, 2000);
    setTimeout(() => { setRecordingState('right'); captureKeyframe(); }, 4000);
    setTimeout(() => { captureKeyframe(); recorder.stop(); }, 6000);
  };

  // ── MOTEUR DE CHIFFREMENT KYC ──
  const handleUploadAndEncrypt = async (type: "identity" | "selfie", fileData?: File | Blob) => {
    if (!fileData || !activeUserId) return;
    setIsLoading(true);
    const toastId = toast.loading(`Chiffrement ECC du module ${type}...`);

    try {
      const supabase = getSupabase();
      const enclaveKeys = await getKeysFromEnclave('kauri_client');
      if (!enclaveKeys) throw new Error("Clés cryptographiques introuvables.");

      const { data: dbProfile } = await supabase.from('profiles').select('user_public_key').eq('id', activeUserId).single();
      if (!dbProfile?.user_public_key) throw new Error("Trousseau public manquant.");
      const userPublicKeys = JSON.parse(dbProfile.user_public_key);

      const fileBuffer = await fileData.arrayBuffer();
      const ephKey = await window.crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]);
      const ephPubRaw = await window.crypto.subtle.exportKey("raw", ephKey.publicKey);

      const fek = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
      const fileIV = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedFileContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: fileIV }, fek, fileBuffer);
      const exportedFek = await window.crypto.subtle.exportKey("raw", fek);
      const wrapIV = window.crypto.getRandomValues(new Uint8Array(12));

      // Enclave Admin
      const adminPubKey = await window.crypto.subtle.importKey("spki", pemToArrayBuffer(ADMIN_ECDH_PUBLIC_KEY_PEM), { name: "ECDH", namedCurve: "P-256" }, false, []);
      const adminWrapKey = await window.crypto.subtle.deriveKey({ name: "ECDH", public: adminPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
      const adminEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, adminWrapKey, exportedFek);

      // Enclave Client
      const userPubKey = await window.crypto.subtle.importKey("spki", pemToArrayBuffer(userPublicKeys.ecdh), { name: "ECDH", namedCurve: "P-256" }, false, []);
      const userWrapKey = await window.crypto.subtle.deriveKey({ name: "ECDH", public: userPubKey }, ephKey.privateKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
      const userEncFEK = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIV }, userWrapKey, exportedFek);

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

      const { error: uploadError } = await supabase.storage.from('secure-kyc').upload(`${activeUserId}/${type}.enc`, new Blob([packedBytes], { type: "application/octet-stream" }), { upsert: true });
      if (uploadError) throw uploadError;

      const localUrl = URL.createObjectURL(fileData instanceof Blob ? fileData : new Blob([fileData]));
      if (type === 'identity') {
        setIdFile(fileData as File);
        setIdPreviewUrl(localUrl);
      } else {
        setSelfiePreviewUrl(localUrl);
      }
      toast.success("Document sécurisé avec succès !", { id: toastId });
    } catch (err: any) {
      toast.error(`Échec: ${err.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!idPreviewUrl || !selfiePreviewUrl) {
      toast.error("La pièce d'identité et la vérification Liveness sont obligatoires.");
      return;
    }
    setIsLoading(true);
    try {
      const supabase = getSupabase();
      await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', activeUserId);
      toast.success("Dossier KYC transmis. Bienvenue sur KAURI !");
      navigate('/kauri/normal-dashboard');
    } catch (e) {
      toast.error("Erreur de finalisation.");
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name: keyof typeof form, label: string, placeholder: string, type = 'text', icon: any) => {
    const IconComponent = icon;
    return (
      <div>
        <label className="text-xs font-bold mb-1.5 block text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
          <IconComponent className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 text-sm outline-none transition-all text-[#0F172A] bg-white"
            style={{ borderColor: errors[name] ? '#B05B3B' : '#E2E8F0' }}
          />
        </div>
        {errors[name] && <p className="text-[10px] font-bold mt-1 text-[#B05B3B]">{errors[name]}</p>}
      </div>
    );
  };

  // ── RENDER : TUNNEL MULTI-ÉTAPES (RESPONSIVE W-FULL MAX-W-MD) ──
  if (step !== 'choose') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
        <input type="file" ref={identityInputRef} onChange={(e) => handleUploadAndEncrypt("identity", e.target.files?.[0])} accept="image/*,application/pdf" className="hidden" />

        <div className="bg-gradient-to-br from-[#006D77] to-[#0D9488] px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl w-full">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handleBack} disabled={step === 'documents'} className="text-white flex items-center gap-1 bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-semibold">Retour</span>
              </button>
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Étape {currentStepIndex + 1} / {stepsSequence.length}
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>

            <h1 className="text-white text-2xl font-black tracking-tight">
              {step === 'name' && 'Vos informations personnelles'}
              {step === 'business' && 'Votre identité professionnelle'}
              {step === 'email' && 'Votre adresse e-mail'}
              {step === 'password' && 'Sécurisez votre compte'}
              {step === 'phone' && 'Contact téléphonique'}
              {step === 'documents' && 'Vérification Réglementaire'}
            </h1>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 w-full max-w-md mx-auto flex flex-col justify-between">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5">
            {step === 'name' && (
              <>
                {field('firstName', 'Prénom légal', 'Marie', 'text', User)}
                {field('lastName', 'Nom de famille', 'Dupont', 'text', User)}
              </>
            )}
            
            {step === 'business' && field('businessName', "Nom de l'entreprise", 'Kauri Corp', 'text', Briefcase)}
            {step === 'email' && field('email', 'E-mail principal', 'marie@example.com', 'email', Mail)}
            
            {step === 'password' && (
              <div>
                <label className="text-xs font-bold mb-1.5 block text-gray-500 uppercase tracking-wider">Mot de passe robuste</label>
                <div className="relative rounded-xl border-2 px-4 py-3.5 bg-white flex items-center gap-2" style={{ borderColor: errors.password ? '#B05B3B' : '#E2E8F0' }}>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }} className="flex-1 outline-none text-sm text-[#0F172A] bg-transparent" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 bg-transparent border-none cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password.length > 0 && !isPasswordRobust(form.password) && <p className="text-[10px] text-red-500 mt-1 font-bold">⚠️ Requis: 8 caractères, 1 Majuscule, 1 Chiffre.</p>}
                {errors.password && <p className="text-[10px] font-bold mt-1 text-[#B05B3B]">{errors.password}</p>}
              </div>
            )}

            {step === 'phone' && (
              <div>
                <label className="text-xs font-bold mb-1.5 block text-gray-500 uppercase tracking-wider">Téléphone (Optionnel)</label>
                <div className="flex items-center gap-2 rounded-xl border-2 px-4 py-3.5 bg-white border-[#E2E8F0]">
                  <span className="text-xs text-gray-600 font-bold">🇫🇷 +33</span>
                  <div className="w-px h-5 bg-gray-200" />
                  <input type="tel" placeholder="6 12 34 56 78" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="flex-1 outline-none bg-transparent text-sm text-[#0F172A]" />
                </div>
              </div>
            )}

            {step === 'documents' && (
              <div className="space-y-5">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-[11px] text-amber-700/80 font-bold">Compte créé ! Veuillez fournir vos documents réglementaires pour activer les fonctionnalités financières.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">1. Pièce d'identité officielle</label>
                  <div onClick={() => identityInputRef.current?.click()} className="flex items-center justify-between border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                        {idPreviewUrl ? <img src={idPreviewUrl} alt="ID" className="w-full h-full object-cover" /> : <Upload className="w-5 h-5 text-slate-400" />}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{idPreviewUrl ? 'Document chargé' : 'Importer le document'}</span>
                    </div>
                    {idPreviewUrl ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">Requis</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">2. Preuve de vie (Liveness)</label>
                  <div onClick={startCamera} className="flex items-center justify-between border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                        {selfiePreviewUrl ? <video src={selfiePreviewUrl} className="w-full h-full object-cover" /> : <Video className="w-5 h-5 text-slate-400" />}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{selfiePreviewUrl ? 'Séquence validée' : 'Démarrer la capture 3D'}</span>
                    </div>
                    {selfiePreviewUrl ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">Requis</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={step === 'documents' ? handleFinalize : handleNext}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white text-sm font-bold shadow-xl cursor-pointer border-none transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 'documents' ? 'Finaliser l\'inscription ✓' : 'Continuer →')}
            </button>
            
            {step === 'email' && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Ou continuer avec</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleSocialSignup('google')} className="py-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer shadow-sm">Google</button>
                  <button onClick={() => handleSocialSignup('apple')} className="py-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer shadow-sm">Apple</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🎥 MODALE DE CAPTURE VIDÉO */}
        {showCamera && (
          <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center">
            <div className="absolute top-6 left-6 z-20">
              <button onClick={stopCamera} disabled={recordingState !== 'idle'} className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer border-none">
                <ChevronLeft className="w-4 h-4" /> Annuler
              </button>
            </div>
            
            <div className="text-center z-10 relative mb-8 px-6">
              <h2 className="text-white font-black text-xl tracking-tight">
                {recordingState === 'idle' && "Placez votre visage dans le cadre"}
                {recordingState === 'front' && "Regardez l'objectif..."}
                {recordingState === 'left' && "Tournez la tête à GAUCHE"}
                {recordingState === 'right' && "Tournez la tête à DROITE"}
                {recordingState === 'processing' && "Analyse en cours..."}
              </h2>
            </div>
            
            <div className="relative w-[280px] h-[380px] rounded-[140px] overflow-hidden border-4 border-white/20 shadow-[0_0_0_9999px_rgba(15,23,42,0.85)] z-10 flex-shrink-0">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay />
            </div>

            <div className="mt-12 z-20 w-full px-8 max-w-sm">
              <button onClick={startVideoLivenessSequence} disabled={recordingState !== 'idle'} className="w-full bg-[#D4AF37] text-white py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50">
                {recordingState === 'idle' ? <><Camera className="w-5 h-5" /> Démarrer la capture</> : <><Loader2 className="w-5 h-5 animate-spin" /> Analyse...</>}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ÉTAPE 1 : CHOIX DU COMPTE (RESPONSIVE) ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] flex flex-col font-sans">
      <div className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center mb-10">
          <div className="w-20 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-white"><path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" /></svg>
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">KAURI</h1>
          <p className="text-[#E0F2FE] text-xs mt-2">L'union de la communauté, la force de l'investissement</p>
        </div>

        <div className="space-y-4">
          <button onClick={() => selectType('particulier')} className="w-full bg-white rounded-3xl p-6 shadow-2xl text-left cursor-pointer border-none outline-none active:scale-[0.98] transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center"><User className="w-6 h-6 text-white" /></div>
              <ArrowRight className="w-5 h-5 text-[#006D77]" />
            </div>
            <h3 className="text-[#0F172A] text-lg font-bold mb-1">Compte Particulier</h3>
            <p className="text-[#4A4A4A] text-xs mb-3">Rejoignez des tontines privées, investissez dans des projets et gérez vos rendements.</p>
          </button>

          <button onClick={() => selectType('professionnel')} className="w-full bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-3xl p-6 shadow-2xl text-left cursor-pointer border-none outline-none active:scale-[0.98] transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><Briefcase className="w-6 h-6 text-white" /></div>
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white text-lg font-bold mb-1">Compte Professionnel</h3>
            <p className="text-white/90 text-xs mb-3">Lancez des levées de fonds pour vos projets et accédez à un réseau d'investisseurs.</p>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/kauri/login')} className="text-[#D4AF37] text-sm font-bold bg-transparent border-none cursor-pointer">Déjà un compte ? Se connecter</button>
        </div>
      </div>
    </div>
  );
}

export default AccountTypeSelectionScreen;
