import { useState } from 'react';
import { ArrowRight, User, Briefcase, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getSupabase, SERVER_URL, publicAnonKey, pinToPassword } from '../../../utils/supabase';
import { toast } from 'sonner';

type Step = 'choose' | 'register';

export function AccountTypeSelectionScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('choose');
  const [accountType, setAccountType] = useState<'particulier' | 'professionnel'>('particulier');
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    pin: '',
    businessName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectType = (type: 'particulier' | 'professionnel') => {
    setAccountType(type);
    setStep('register');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (form.phone.replace(/\s/g, '').length < 8) e.phone = 'Numéro invalide';
    if (form.pin.length < 4) e.pin = 'PIN doit contenir 4 chiffres minimum';
    if (accountType === 'professionnel' && !form.businessName.trim()) e.businessName = "Nom d'entreprise requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);

    // Build email from phone
    const clean = form.phone.replace(/[\s\-\(\)]/g, '');
    const normalized = clean.startsWith('+') ? clean : `+33${clean.replace(/^0/, '')}`;
    const email = `${normalized}@kauri.app`;
    const password = pinToPassword(form.pin);

    try {
      // Step 1: create the Supabase auth account directly from the client
      const supabase = getSupabase();
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            accountType,
            phone: normalized,
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message;
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
          toast.error('Ce numéro est déjà associé à un compte. Connectez-vous !', { duration: 6000 });
          navigate('/kauri/login');
          return;
        }
        toast.error(msg, { duration: 6000 });
        return;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        toast.error('Erreur lors de la création du compte. Réessayez.', { duration: 6000 });
        return;
      }

      // Step 2: save the profile in the KV store via the server
      const accessToken = signUpData.session?.access_token ?? publicAnonKey;
      await fetch(`${SERVER_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          phone: normalized,
          firstName: form.firstName,
          lastName: form.lastName,
          accountType,
          businessName: form.businessName || null,
          trustScore: 3.5,
          balance: 0,
          currency: 'EUR',
          kycCompleted: false,
          createdAt: new Date().toISOString(),
        }),
      }).catch(e => console.error('Profile save error (non-blocking):', e));

      // Step 3: seed wallet in KV store
      await fetch(`${SERVER_URL}/wallet/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).catch(() => {}); // Non-blocking

      // Seed demo data (projects/public tontine) if needed
      await fetch(`${SERVER_URL}/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }).catch(() => {});

      // Step 4: navigate into the onboarding flow
      navigate(`/kauri/kyc-verification?type=${accountType}`);
    } catch (e: any) {
      console.error('[Signup] Error:', e);
      toast.error(`Erreur : ${e?.message || String(e)}`, { duration: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name: keyof typeof form, label: string, placeholder: string, type = 'text') => (
    <div>
      <label className="text-sm mb-1 block" style={{ color: '#0F172A', fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none"
        style={{ borderColor: errors[name] ? '#B05B3B' : '#E2E8F0', background: 'white', color: '#0F172A' }}
        inputMode={name === 'phone' ? 'tel' : 'text'}
      />
      {errors[name] && <p className="text-xs mt-1" style={{ color: '#B05B3B' }}>{errors[name]}</p>}
    </div>
  );

  if (step === 'register') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(165deg, #006D77 0%, #003A42 100%)' }}>
        <div className="px-6 pt-12 pb-6">
          <button onClick={() => setStep('choose')} className="flex items-center gap-1 text-white/80 mb-6">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
          <h1 className="text-white text-2xl mb-1">Créer votre compte</h1>
          <p className="text-white/70 text-sm">
            {accountType === 'professionnel' ? 'Compte Professionnel KAURI' : 'Compte Particulier KAURI'}
          </p>
        </div>

        <div className="mx-4 mb-6 bg-white rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field('firstName', 'Prénom', 'Marie')}
              {field('lastName', 'Nom', 'Dupont')}
            </div>
            {accountType === 'professionnel' && field('businessName', "Nom de l'entreprise", 'SARL Exemple')}
            <div>
              <label className="text-sm mb-1 block" style={{ color: '#0F172A', fontWeight: 500 }}>Numéro de téléphone</label>
              <div className="flex items-center gap-2 rounded-xl border-2 px-4 py-3" style={{ borderColor: errors.phone ? '#B05B3B' : '#E2E8F0' }}>
                <span className="text-sm shrink-0" style={{ color: '#4A4A4A', fontWeight: 600 }}>🇫🇷 +33</span>
                <div className="w-px h-5" style={{ background: '#E2E8F0' }} />
                <input
                  type="tel"
                  placeholder="6 12 34 56 78"
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })); }}
                  className="flex-1 outline-none bg-transparent text-sm"
                  style={{ color: '#0F172A' }}
                />
              </div>
              {errors.phone && <p className="text-xs mt-1" style={{ color: '#B05B3B' }}>{errors.phone}</p>}
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: '#0F172A', fontWeight: 500 }}>Code PIN (4-6 chiffres)</label>
              <div className="flex items-center gap-2 rounded-xl border-2 px-4 py-3" style={{ borderColor: errors.pin ? '#B05B3B' : '#E2E8F0' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="••••••"
                  value={form.pin}
                  inputMode="numeric"
                  maxLength={6}
                  onChange={e => { const val = e.target.value.replace(/\D/g, ''); setForm(f => ({ ...f, pin: val })); setErrors(er => ({ ...er, pin: '' })); }}
                  className="flex-1 outline-none bg-transparent text-sm tracking-widest"
                  style={{ color: '#0F172A' }}
                />
                <button type="button" onClick={() => setShowPin(!showPin)}>
                  {showPin ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              {errors.pin && <p className="text-xs mt-1" style={{ color: '#B05B3B' }}>{errors.pin}</p>}
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', color: 'white', fontWeight: 600, opacity: isLoading ? 0.8 : 1 }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.8s linear infinite' }} />
                Création du compte…
              </>
            ) : 'Créer mon compte →'}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#94A3B8' }}>
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
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-14 h-14 text-white">
            <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-white text-3xl mb-3">Bienvenue sur KAURI</h1>
        <p className="text-[#E0F2FE] text-sm px-4">L'union de la communauté, la force de l'investissement</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h2 className="text-white text-center mb-2">Choisissez votre type de compte</h2>

        <button
          onClick={() => selectType('particulier')}
          className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#0D9488] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-[#006D77]" />
          </div>
          <h3 className="text-[#0F172A] text-xl mb-2">Compte Particulier</h3>
          <p className="text-[#4A4A4A] text-sm mb-4">Rejoignez des tontines privées, investissez dans des projets communautaires, et connectez-vous avec la diaspora.</p>
          <div className="flex flex-wrap gap-2">
            {['Tontines', 'Investissement', 'Social'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#006D77]/10 text-[#006D77] text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </button>

        <button
          onClick={() => selectType('professionnel')}
          className="bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white text-xl mb-2">Compte Professionnel</h3>
          <p className="text-white/90 text-sm mb-4">Lancez des levées de fonds pour vos projets d'entreprise, accédez à un réseau d'investisseurs et développez votre activité.</p>
          <div className="flex flex-wrap gap-2">
            {["Levée de fonds", 'Analytics', 'Réseau Pro'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[#E0F2FE] text-xs">En continuant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité</p>
        <button onClick={() => navigate('/kauri/login')} className="text-[#D4AF37] text-sm mt-3 underline">
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}
