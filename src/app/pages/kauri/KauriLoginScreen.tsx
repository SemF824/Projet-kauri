import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff, Mail, Lock, Phone, User, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function KauriLoginScreen() {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();

  // Gestion des modes et étapes
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Formulaires
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Redirection automatique si session valide
  useEffect(() => {
    if (!loading && user && profile) {
      localStorage.setItem('kauri_account_type', profile.accountType);
      if (profile.accountType === 'professionnel') {
        navigate('/kauri/pro-dashboard');
      } else {
        navigate('/kauri/normal-dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  // Validations strictes
  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  const isPasswordRobust = (pass: string) => pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);

  const isFormValid = mode === 'login'
    ? validateEmail(email) && password.length > 0
    : firstName.trim() && lastName.trim() && validateEmail(email) && isPasswordRobust(password);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // La fonction signIn de ton AuthContext mis à jour gère l'appel natif Supabase
        await signIn(email.trim(), password);
      } else {
        const supabase = getSupabaseInstance();
        
        // Inscription avec métadonnées réelles pour ton déclencheur SQL profiles
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: `${firstName.trim()} ${lastName.trim()}`,
              phone: phone.trim() || null,
            },
          },
        });

        if (signUpError) throw signUpError;

        toast.success('Inscription réussie ! Connexion...');
        await signIn(email.trim(), password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Identifiants incorrects ou erreur réseau.');
      toast.error("Échec de l'authentification");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper local pour l'inscription autonome au cas où getSupabase() n'est pas importable directement
  const getSupabaseInstance = () => {
    const { getSupabase } = require('../../utils/supabase');
    return getSupabase();
  };

  const handleBiometric = () => {
    setMode('login');
    setStep('form');
    toast.info('Veuillez renseigner vos identifiants pour synchroniser la biométrie');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(165deg, #006D77 0%, #004E57 55%, #003A42 100%)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #006D77 0%, #004E57 55%, #003A42 100%)' }}
    >
      {/* Cowrie Animations en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              width: `${30 + (i % 5) * 12}px`,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 13 + 8) % 100}%`,
              opacity: 0.06 + (i % 3) * 0.03,
              animation: `cowrieFloat ${5 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="white" />
          </svg>
        ))}
      </div>

      {/* Brand Header */}
      <div
        className="relative z-10 flex flex-col items-center pt-14 pb-6 px-6"
        style={{
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className="relative mb-3">
          <div className="absolute inset-0 rounded-full" style={{ background: '#D4AF37', opacity: 0.25, transform: 'scale(1.35)', animation: 'pulse 2.5s ease-in-out infinite' }} />
          <div className="relative w-16 h-20 rounded-full flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)' }}>
            <svg viewBox="0 0 100 100" className="w-11 h-11 text-white">
              <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h1 className="text-white tracking-widest mb-1" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.2em' }}>KAURI</h1>
        <p className="text-white/70 text-xs">L'Unité dans la Finance</p>
      </div>

      {/* Main Container Card */}
      <div
        className="relative z-10 flex-1 mx-4 mb-6 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: '#F9F9F9',
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
        }}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          {step === 'welcome' ? (
            <div className="flex flex-col flex-1">
              <h2 className="mb-1" style={{ color: '#0F172A', fontSize: '1.3rem', fontWeight: 700 }}>Bienvenue sur KAURI 👋</h2>
              <p className="text-xs mb-6" style={{ color: '#4A4A4A' }}>Sélectionnez votre méthode d'accès sécurisé.</p>

              <button
                onClick={handleBiometric}
                className="w-full flex items-center gap-4 p-4 rounded-2xl mb-4 border-2 transition-all active:scale-95 text-white"
                style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', borderColor: '#006D77' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Accès Biométrique</p>
                  <p className="text-white/80 text-[11px]">Face ID • Empreinte digitale</p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-70" />
              </button>

              <div className="flex items-center gap-3 my-2 mb-4">
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
                <span className="text-xs text-[#94A3B8]">ou</span>
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
              </div>

              <button
                onClick={() => { setMode('login'); setStep('form'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl mb-6 border-2 transition-all active:scale-95 bg-white"
                style={{ borderColor: '#006D77' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#E6F4F5' }}>
                  <Mail className="w-6 h-6" style={{ color: '#006D77' }} />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>Adresse e-mail & Password</p>
                  <p className="text-xs text-gray-500">Connexion standard sécurisée</p>
                </div>
                <ArrowRight className="w-5 h-5" style={{ color: '#006D77' }} />
              </button>

              <div className="mt-auto pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
                <p className="text-center text-xs mb-3" style={{ color: '#4A4A4A' }}>Nouveau sur la plateforme ?</p>
                <button
                  onClick={() => { setMode('register'); setStep('form'); }}
                  className="w-full py-3 rounded-2xl text-xs transition-all active:scale-95 text-white"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', fontWeight: 600 }}
                >
                  Rejoindre l'écosystème KAURI
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="flex flex-col flex-1 space-y-4">
              {/* Sélecteur de mode interne */}
              <div className="flex justify-center gap-6 border-b pb-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`pb-1 ${mode === 'login' ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-400'}`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`pb-1 ${mode === 'register' ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-400'}`}
                >
                  Inscription
                </button>
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        placeholder="Sem" className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] outline-none text-[#0F172A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="M'VOUAMA" className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] outline-none text-[#0F172A]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com" className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs border border-[#E2E8F0] outline-none text-[#0F172A]"
                    required
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Téléphone (Optionnel)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78" className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs border border-[#E2E8F0] outline-none text-[#0F172A]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="w-full rounded-xl pl-9 pr-10 py-2.5 text-xs border border-[#E2E8F0] outline-none text-[#0F172A]"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'register' && password.length > 0 && !isPasswordRobust(password) && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium leading-relaxed">
                    Exigence : Min. 8 caractères, 1 Majuscule, 1 Chiffre.
                  </p>
                )}
              </div>

              {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}

              <div className="pt-2 flex gap-3">
                <button
                  type="button" onClick={() => { setStep('welcome'); setError(''); }}
                  className="flex-1 py-3 text-xs font-bold rounded-xl border-2 border-gray-300 text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={!isFormValid || isLoading}
                  className="flex-[2] py-3 text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
                  style={{ background: isFormValid ? 'linear-gradient(135deg, #006D77, #0D9488)' : '#CBD5E1' }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Se connecter' : 'Valider inscription'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <p className="relative z-10 text-center text-[10px] pb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        KAURI · Fondé par Laura Monlouis-Bonnaire
      </p>

      <style>{`
        @keyframes cowrieFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.25; transform: scale(1.35); } 50% { opacity: 0.4; transform: scale(1.5); } }
      `}</style>
    </div>
  );
}
