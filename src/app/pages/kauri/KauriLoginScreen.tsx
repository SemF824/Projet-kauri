import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Fingerprint, Eye, EyeOff, Phone, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function KauriLoginScreen() {
  const navigate = useNavigate();
  const { signIn, user, profile, loading } = useAuth();
  const [step, setStep] = useState<'welcome' | 'phone' | 'pin'>('welcome');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Redirect authenticated users
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

  const handlePhoneNext = () => {
    if (phone.replace(/\s/g, '').length < 8) {
      setError('Numéro de téléphone invalide');
      return;
    }
    setError('');
    setStep('pin');
  };

  const handlePinLogin = async () => {
    if (pin.length < 4) {
      setError('Le code PIN doit contenir au moins 4 chiffres');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signIn(phone, pin);
      // Navigation handled by the useEffect above after profile loads
    } catch (e: any) {
      console.error('Login error:', e);
      setError('Numéro ou code PIN incorrect. Vérifiez vos informations.');
      toast.error('Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometric = () => {
    // Biometric requires prior login — redirect to phone flow
    setStep('phone');
    toast.info('Entrez votre numéro pour vous connecter');
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

      <div
        className="relative z-10 flex flex-col items-center pt-14 pb-8 px-6"
        style={{
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full" style={{ background: '#D4AF37', opacity: 0.25, transform: 'scale(1.35)', animation: 'pulse 2.5s ease-in-out infinite' }} />
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)' }}>
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-white">
              <path d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h1 className="text-white tracking-widest mb-1" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.2em' }}>KAURI</h1>
        <p className="text-white/70 text-sm">L'Unité dans la Finance</p>
      </div>

      <div
        className="relative z-10 flex-1 mx-4 mb-6 rounded-3xl overflow-hidden"
        style={{
          background: '#F9F9F9',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.3)',
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
        }}
      >
        <div className="p-6 flex flex-col h-full">
          {step !== 'welcome' && (
            <button onClick={() => { setStep(step === 'pin' ? 'phone' : 'welcome'); setError(''); }} className="flex items-center gap-1 mb-4" style={{ color: '#006D77' }}>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
          )}

          {step === 'welcome' && (
            <div className="flex flex-col flex-1">
              <h2 className="mb-1" style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 700 }}>Bon retour ! 👋</h2>
              <p className="text-sm mb-8" style={{ color: '#4A4A4A' }}>Connectez-vous à votre compte KAURI pour continuer.</p>

              <button
                onClick={handleBiometric}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-4 rounded-2xl mb-4 border-2 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', borderColor: '#006D77', color: 'white' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Connexion biométrique</p>
                  <p className="text-white/80 text-xs">Face ID • Empreinte digitale</p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-70" />
              </button>

              <div className="flex items-center gap-3 my-2 mb-4">
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
                <span className="text-xs" style={{ color: '#94A3B8' }}>ou</span>
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
              </div>

              <button
                onClick={() => setStep('phone')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl mb-6 border-2 transition-all active:scale-95"
                style={{ borderColor: '#006D77', background: 'white' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#E6F4F5' }}>
                  <Phone className="w-6 h-6" style={{ color: '#006D77' }} />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>Numéro de téléphone</p>
                  <p className="text-xs" style={{ color: '#4A4A4A' }}>Connexion par code PIN</p>
                </div>
                <ArrowRight className="w-5 h-5" style={{ color: '#006D77' }} />
              </button>

              <div className="mt-auto pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
                <p className="text-center text-sm mb-3" style={{ color: '#4A4A4A' }}>Pas encore de compte KAURI ?</p>
                <button
                  onClick={() => navigate('/kauri')}
                  className="w-full py-3 rounded-2xl text-sm transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)', color: 'white', fontWeight: 600 }}
                >
                  Créer un compte
                </button>
              </div>
            </div>
          )}

          {step === 'phone' && (
            <div className="flex flex-col flex-1">
              <h2 className="mb-1" style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 700 }}>Votre numéro</h2>
              <p className="text-sm mb-6" style={{ color: '#4A4A4A' }}>Entrez votre numéro de téléphone enregistré sur KAURI.</p>

              <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-3 border-2" style={{ borderColor: error ? '#B05B3B' : '#006D77', background: 'white' }}>
                <span className="text-sm shrink-0" style={{ color: '#4A4A4A', fontWeight: 600 }}>🇫🇷 +33</span>
                <div className="w-px h-5 mx-1" style={{ background: '#E2E8F0' }} />
                <input
                  type="tel"
                  placeholder="6 12 34 56 78"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  className="flex-1 outline-none bg-transparent text-sm"
                  style={{ color: '#0F172A' }}
                  autoFocus
                />
              </div>

              {error && <p className="text-xs mb-3" style={{ color: '#B05B3B' }}>{error}</p>}

              <button
                onClick={handlePhoneNext}
                className="w-full py-4 rounded-2xl mt-2 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #006D77, #0D9488)', color: 'white', fontWeight: 600 }}
              >
                Continuer
              </button>
            </div>
          )}

          {step === 'pin' && (
            <div className="flex flex-col flex-1">
              <h2 className="mb-1" style={{ color: '#0F172A', fontSize: '1.4rem', fontWeight: 700 }}>Code PIN</h2>
              <p className="text-sm mb-6" style={{ color: '#4A4A4A' }}>Entrez votre code PIN KAURI à 4–6 chiffres.</p>

              <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-3 border-2" style={{ borderColor: error ? '#B05B3B' : '#006D77', background: 'white' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="••••••"
                  value={pin}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  onChange={e => { const val = e.target.value.replace(/\D/g, ''); setPin(val); setError(''); }}
                  className="flex-1 outline-none bg-transparent text-sm tracking-widest"
                  style={{ color: '#0F172A' }}
                  autoFocus
                />
                <button onClick={() => setShowPin(!showPin)}>
                  {showPin ? <EyeOff className="w-4 h-4" style={{ color: '#94A3B8' }} /> : <Eye className="w-4 h-4" style={{ color: '#94A3B8' }} />}
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full transition-all" style={{ background: i < pin.length ? '#006D77' : '#E2E8F0', transform: i < pin.length ? 'scale(1.2)' : 'scale(1)' }} />
                ))}
              </div>

              {error && <p className="text-xs mb-3" style={{ color: '#B05B3B' }}>{error}</p>}

              <button
                onClick={handlePinLogin}
                disabled={isLoading || pin.length < 4}
                className="w-full py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: pin.length < 4 ? '#CBD5E1' : 'linear-gradient(135deg, #006D77, #0D9488)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: pin.length < 4 ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.8s linear infinite' }} />
                    Connexion en cours…
                  </>
                ) : 'Se connecter'}
              </button>

              <button className="text-center text-xs mt-4" style={{ color: '#006D77' }}>
                Code PIN oublié ?
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="relative z-10 text-center text-xs pb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
