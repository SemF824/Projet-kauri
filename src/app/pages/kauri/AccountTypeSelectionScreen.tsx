import { useState } from 'react';
import { ArrowRight, User, Briefcase, Eye, EyeOff, ChevronLeft, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getSupabase, SERVER_URL, publicAnonKey } from '../../../utils/supabase';
import { toast } from 'sonner';

type Step = 'choose' | 'register';

// ── 🛡️ PIPELINE DE STOCKAGE DE L'ENCLAVE MATÉRIELLE CLIENT (ECC V2) ──
const DB_NAME = "KauriSecureEnclave";
const STORE_NAME = "client_keys";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
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

function arrayBufferToBase64(blob: ArrayBuffer): string {
  const bytes = new Uint8Array(blob);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function AccountTypeSelectionScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('choose');
  const [accountType, setAccountType] = useState<'particulier' | 'professionnel'>('particulier');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectType = (type: 'particulier' | 'professionnel') => {
    setAccountType(type);
    setStep('register');
  };

  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  const isPasswordRobust = (pass: string) => pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (!validateEmail(form.email)) e.email = 'Adresse e-mail invalide';
    if (!isPasswordRobust(form.password)) e.password = 'Mot de passe trop faible';
    if (accountType === 'professionnel' && !form.businessName.trim()) e.businessName = "Nom d'entreprise requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const supabase = getSupabase();

      // 🎯 1. ARCHITECTURE HYBRIDE ECC (P-256) : Génération des deux couples de clés indépendants
      const ecdhKeyPair = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveKey"]
      );

      const ecdsaKeyPair = await window.crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"]
      );

      // 🎯 2. SCELLAGE CHIRURGICAL DANS L'ENCLAVE LOCALE NON-EXTRACTIBLE
      await saveKeysToEnclave('kauri_client', {
        ecdhPriv: ecdhKeyPair.privateKey,
        ecdsaPriv: ecdsaKeyPair.privateKey
      });

      // 🎯 3. EXPORTATION SPKI POUR LE REGISTRE PUBLIC DES ADMINISTRATEURS
      const ecdhPubBuf = await window.crypto.subtle.exportKey("spki", ecdhKeyPair.publicKey);
      const ecdsaPubBuf = await window.crypto.subtle.exportKey("spki", ecdsaKeyPair.publicKey);

      const ecdhPubPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(ecdhPubBuf)}\n-----END PUBLIC KEY-----`;
      const ecdsaPubPem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(ecdsaPubBuf)}\n-----END PUBLIC KEY-----`;

      const publicKeysJSON = JSON.stringify({
        ecdh: ecdhPubPem,
        ecdsa: ecdsaPubPem
      });

      // 🎯 4. INSCRIPTION UNIQUE ET SÉCURISÉE AVEC TRANSMISSION MATRICIELLE
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
            user_public_key: publicKeysJSON // Correction du commentaire SQL défaillant ici
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message;
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
          toast.error('Cette adresse e-mail est déjà associée à un compte. Connectez-vous !', { duration: 6000 });
          navigate('/kauri/login');
          return;
        }
        throw signUpError;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        toast.error('Erreur lors de la création du compte. Réessayez.', { duration: 6000 });
        return;
      }

      // Initialisation des serveurs de portefeuille
      const accessToken = signUpData.session?.access_token ?? publicAnonKey;
      
      await fetch(`${SERVER_URL}/wallet/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).catch(e => console.error('Wallet seed error (non-blocking):', e));

      await fetch(`${SERVER_URL}/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).catch(e => console.error('Demo data seed error (non-blocking):', e));

      toast.success('Votre compte KAURI a été initialisé !');
      navigate(`/kauri/kyc-verification?type=${accountType}`);
    } catch (e: any) {
      console.error('[Signup Transaction Error]:', e);
      toast.error(`Erreur d'infrastructure : ${e?.message || String(e)}`, { duration: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name: keyof typeof form, label: string, placeholder: string, type = 'text', icon: any) => {
    const IconComponent = icon;
    return (
      <div>
        <label className="text-xs font-semibold mb-1.5 block text-gray-500">{label}</label>
        <div className="relative">
          <IconComponent className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 text-xs outline-none transition-all text-[#0F172A]"
            style={{ borderColor: errors[name] ? '#B05B3B' : '#E2E8F0', background: 'white' }}
          />
        </div>
        {errors[name] && <p className="text-[10px] font-medium mt-1 text-[#B05B3B]">{errors[name]}</p>}
      </div>
    );
  };

  if (step === 'register') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(165deg, #006D77 0%, #003A42 100%)' }}>
        <div className="px-6 pt-12 pb-4">
          <button onClick={() => setStep('choose')} className="flex items-center gap-1 text-white/80 mb-4 cursor-pointer bg-transparent border-none">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <h1 className="text-white text-2xl font-bold mb-1">Créer votre compte</h1>
          <p className="text-white/70 text-xs">
            {accountType === 'professionnel' ? 'Espace Professionnel KAURI (Levées de fonds)' : 'Espace Particulier KAURI (Épargne & Tontines)'}
          </p>
        </div>

        <div className="mx-4 mb-6 bg-white rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field('firstName', 'Prénom', 'Marie', 'text', User)}
              {field('lastName', 'Nom', 'Dupont', 'text', User)}
            </div>
            
            {accountType === 'professionnel' && field('businessName', "Nom de l'entreprise", 'Kauri Enterprise SDK', 'text', Briefcase)}
            
            {field('email', 'Adresse e-mail active', 'marie.dupont@gmail.com', 'email', Mail)}

            <div>
              <label className="text-xs font-semibold mb-1.5 block text-gray-500">Numéro de téléphone (Optionnel)</label>
              <div className="flex items-center gap-2 rounded-xl border-2 px-4 py-3 bg-white" style={{ borderColor: errors.phone ? '#B05B3B' : '#E2E8F0' }}>
                <span className="text-xs shrink-0 text-gray-600 font-bold">🇫🇷 +33</span>
                <div className="w-px h-5 bg-gray-200" />
                <input
                  type="tel"
                  placeholder="6 12 34 56 78"
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }}
                  className="flex-1 outline-none bg-transparent text-xs text-[#0F172A]"
                />
              </div>
              {errors.phone && <p className="text-[10px] font-medium mt-1 text-[#B05B3B]">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block text-gray-500">Mot de passe sécurisé</label>
              <div className="flex items-center gap-2 rounded-xl border-2 px-4 py-3 bg-white" style={{ borderColor: errors.password ? '#B05B3B' : '#E2E8F0' }}>
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  className="flex-1 outline-none bg-transparent text-xs text-[#0F172A]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 bg-transparent border-none cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && !isPasswordRobust(form.password) && (
                <p className="text-[10px] text-red-500 mt-1 font-medium leading-relaxed">
                  Exigence : Au moins 8 caractères, 1 Majuscule et 1 Chiffre.
                </p>
              )}
              {errors.password && <p className="text-[10px] font-medium mt-1 text-[#B05B3B]">{errors.password}</p>}
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-all active:scale-[0.95] text-white text-xs font-bold shadow-lg cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', opacity: isLoading ? 0.8 : 1 }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Génération des enclaves ECC (P-256)…
              </>
            ) : 'Créer mon compte Kauri →'}
          </button>

          <p className="text-center text-[10px] mt-4 text-gray-400">
            En continuant, vous acceptez nos CGU et notre Politique de Confidentialité
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006D77] to-[#0A5C7A] px-6 py-12 flex flex-col">
      <div className="text-center mb-12">
        <div className="w-20 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-white">
            <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-white text-3xl font-bold mb-2 tracking-wide">KAURI</h1>
        <p className="text-[#E0F2FE] text-xs px-4">L'union de la communauté, la force de l'investissement</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h2 className="text-white text-center text-sm font-medium mb-2">Choisissez votre type de compte</h2>

        <button
          onClick={() => selectType('particulier')}
          className="bg-white rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition-transform text-left cursor-pointer border-none"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-[#006D77]" />
          </div>
          <h3 className="text-[#0F172A] text-lg font-bold mb-1">Compte Particulier</h3>
          <p className="text-[#4A4A4A] text-xs mb-4 leading-relaxed">Rejoignez des tontines privées, investissez dans des projets communautaires, et gérez vos rendements.</p>
          <div className="flex flex-wrap gap-1.5">
            {['Tontines', 'Investissement', 'Diaspora'].map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-[#006D77]/10 text-[#006D77] text-[10px] font-bold rounded-full">{tag}</span>
            ))}
          </div>
        </button>

        <button
          onClick={() => selectType('professionnel')}
          className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition-transform text-left cursor-pointer border-none"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white text-lg font-bold mb-1">Compte Professionnel</h3>
          <p className="text-white/90 text-xs mb-4 leading-relaxed">Lancez des levées de fonds pour vos projets d'entreprise, et accédez à un réseau d'investisseurs qualifiés.</p>
          <div className="flex flex-wrap gap-1.5">
            {["Levée de fonds", 'Statistiques', 'B2B'].map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">{tag}</span>
            ))}
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[#E0F2FE] text-[10px] px-6 leading-relaxed">En continuant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité</p>
        <button onClick={() => navigate('/kauri/login')} className="text-[#D4AF37] text-xs mt-4 underline font-bold cursor-pointer block mx-auto bg-transparent border-none">
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}
