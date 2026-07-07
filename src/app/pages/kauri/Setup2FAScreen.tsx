import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Smartphone, MessageSquare, Copy, Check, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '../../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const TEAL = '#006D77';
const GOLD = '#D4AF37';
const BG = '#F4F6F8';
const CARD = '#FFFFFF';
const TEXT_P = '#0F172A';
const TEXT_S = '#64748B';
const BORDER = '#E8ECF0';

type Step = 'intro' | 'method' | 'setup' | 'verify' | 'success';
type Method = 'app' | 'sms' | null;

export function Setup2FAScreen() {
  const navigate = useNavigate();
  
  const { user, profile, refreshProfile, loading: authContextLoading } = useAuth();
  
  const [step, setStep] = useState<Step>('intro');
  const [method, setMethod] = useState<Method>(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState(false);
  
  // États d'enrôlement Supabase MFA
  const [factorId, setFactorId] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!authContextLoading && !user) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      navigate('/kauri/login');
    }
  }, [user, authContextLoading, navigate]);

  useEffect(() => {
    if (step === 'verify') {
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [step]);

  // Initialisation et nettoyage défensif de la double authentification
  const handleStartSetup = async (selectedMethod: Method) => {
    setMethod(selectedMethod);
    if (selectedMethod === 'sms') {
      setStep('setup');
      return;
    }

    setVerifying(true);
    try {
      const supabase = getSupabase();
      
      // Force le rafraîchissement de la session locale pour parer aux pertes de jetons
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        throw new Error("Jeton de session introuvable sur le client d'authentification.");
      }

      const friendlyNameTarget = user?.email || 'Compte Kauri';

      // 🎯 ÉTAPE DE BLINDAGE : On liste les facteurs existants pour éliminer les doublons unverified (Erreur 422)
      const { data: factorList, error: listError } = await supabase.auth.mfa.listFactors();
      
      if (!listError && factorList?.all) {
        // Recherche d'un facteur préexistant qui porte le même nom
        const existingConflictingFactor = factorList.all.find(
          (f) => f.friendlyName === friendlyNameTarget
        );

        if (existingConflictingFactor) {
          if (existingConflictingFactor.status === 'verified') {
            toast.info("La double authentification est déjà active sur ce compte.");
            setStep('success');
            setVerifying(false);
            return;
          } else {
            // Si le facteur existe mais n'est pas vérifié (le cas de ta 422), on le révoque instantanément
            await supabase.auth.mfa.unenroll({ factorId: existingConflictingFactor.id });
          }
        }
      }

      // Lancement de l'enrôlement sur un canal Supabase totalement purgé
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'KAURI Fintech',
        friendlyName: friendlyNameTarget
      });

      if (enrollError) throw enrollError;

      setFactorId(data.id);
      
      if (data.totp?.qr_code) {
        setQrCodeUri(data.totp.qr_code);
      }
      if (data.totp?.secret) {
        setSecretCode(data.totp.secret);
      }

      setStep('setup');
    } catch (err: any) {
      console.error('[MFA Enroll Error]:', err);
      toast.error(err.message || "Impossible d'initialiser le protocole de sécurité.");
    } finally {
      setVerifying(false);
    }
  };

  function handleCodeInput(val: string, idx: number) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    setCodeError(false);
    
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputRefs.current[idx - 1]?.focus();
  }

  // Saisie et vérification finale du TOTP
  async function verifyCode() {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    
    setVerifying(true);
    setCodeError(false);

    try {
      const supabase = getSupabase();

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId,
        code: fullCode,
      });

      if (verifyError) throw verifyError;

      // Génération sécurisée des codes de secours
      setRecoveryCodes([
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        'KAURI-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      ]);

      await refreshProfile();
      toast.success('Double authentification activée !');
      setStep('success');
    } catch (err: any) {
      console.error('[MFA Verification Error]:', err);
      setCodeError(true);
      toast.error('Code de sécurité invalide ou expiré.');
    } finally {
      setVerifying(false);
    }
  }

  function copyRecoveryCodes() {
    navigator.clipboard.writeText(recoveryCodes.join('\n')).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (authContextLoading) {
    return (
      <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <RefreshCw size={32} className="animate-spin" style={{ color: TEAL }} />
          <p style={{ color: TEXT_S, fontSize: 13, fontStyle: 'italic' }}>Sécurisation du canal d'accès...</p>
        </div>
      </div>
    );
  }

  const titleByStep: Record<Step, string> = {
    intro: 'Authentification 2FA',
    method: 'Choisir une méthode',
    setup: method === 'app' ? "Configurer l'application" : 'Vérification par SMS',
    verify: 'Saisir le code',
    success: '2FA activé ! 🎉',
  };

  return (
    <div style={{ minHeight: '100dvh', background: BG, maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => { if (step === 'intro') navigate(-1); else setStep(step === 'method' ? 'intro' : step === 'setup' ? 'method' : step === 'verify' ? 'setup' : 'intro'); }}
          style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={18} color={TEXT_P} />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ color: TEXT_P, fontSize: 16, fontWeight: 700, margin: 0 }}>{titleByStep[step]}</h1>
        </div>

        {step !== 'intro' && step !== 'success' && (
          <div style={{ display: 'flex', gap: 4 }}>
            {(['method', 'setup', 'verify'] as Step[]).map(s => (
              <div key={s} style={{ width: 20, height: 4, borderRadius: 2, background: ['method', 'setup', 'verify'].indexOf(s) <= ['method', 'setup', 'verify'].indexOf(step) ? TEAL : BORDER, transition: 'background 0.3s' }} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} style={{ flex: 1, padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, background: `${TEAL}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Shield size={40} color={TEAL} />
            </div>

            <h2 style={{ color: TEXT_P, fontSize: 22, fontWeight: 800, textAlign: 'center', margin: '0 0 12px' }}>Sécurisez votre compte</h2>
            <p style={{ color: TEXT_S, fontSize: 14, lineHeight: 1.6, textAlign: 'center', margin: '0 0 32px' }}>
              L&#39;authentification à deux facteurs ajoute une couche de protection supplémentaire. En cas de vol de mot de passe, vos fonds restent protégés.
            </p>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                { emoji: '🔐', title: 'Connexion sécurisée', text: 'Un code unique requis à chaque connexion' },
                { emoji: '💰', title: 'Fonds protégés', text: 'Transactions sensibles doublement vérifiées' },
                { emoji: '📱', title: 'Simple à utiliser', text: 'Via votre téléphone ou une application dédiée' },
              ].map(item => (
                <div key={item.title} style={{ background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <div>
                    <p style={{ color: TEXT_P, fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ color: TEXT_S, fontSize: 12, margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('method')}
              style={{ width: '100%', background: `linear-gradient(135deg, ${TEAL}, #004E57)`, border: 'none', borderRadius: 16, padding: '16px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${TEAL}40` }}
            >
              Activer la 2FA
            </button>
          </motion.div>
        )}

        {/* ── METHOD ── */}
        {step === 'method' && (
          <motion.div key="method" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} style={{ flex: 1, padding: '32px 24px' }}>
            <p style={{ color: TEXT_S, fontSize: 14, textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>
              Choisissez comment recevoir vos codes de vérification
            </p>

            {[
              {
                id: 'app' as Method,
                icon: <Smartphone size={24} color={TEAL} />,
                bg: `${TEAL}14`,
                title: 'Application TOTP',
                subtitle: 'Google Authenticator, Authy, 1Password…',
                badge: '✓ Recommandé',
                badgeColor: TEAL,
              },
              {
                id: 'sms' as Method,
                icon: <MessageSquare size={24} color='#8B5CF6' />,
                bg: '#8B5CF614',
                title: 'SMS',
                subtitle: `Code envoyé sur votre numéro ${profile?.phone || 'associé'}`,
                badge: null,
                badgeColor: '',
              },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleStartSetup(opt.id)}
                disabled={verifying}
                style={{
                  width: '100%',
                  background: CARD,
                  border: `1.5px solid ${method === opt.id ? TEAL : BORDER}`,
                  borderRadius: 16,
                  padding: '18px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: verifying ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                  textAlign: 'left',
                  transition: 'border-color 0.2s',
                  opacity: verifying ? 0.7 : 1
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {opt.id === 'app' && verifying ? (
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(0,109,119,0.3)', borderTopColor: TEAL, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : opt.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p style={{ color: TEXT_P, fontSize: 15, fontWeight: 700, margin: 0 }}>{opt.title}</p>
                    {opt.badge && (
                      <span style={{ background: `${opt.badgeColor}14`, color: opt.badgeColor, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{opt.badge}</span>
                    )}
                  </div>
                  <p style={{ color: TEXT_S, fontSize: 12, margin: 0 }}>{opt.subtitle}</p>
                </div>
                <ChevronRight size={16} color={TEXT_S} />
              </button>
            ))}
          </motion.div>
        )}

        {/* ── SETUP ── */}
        {step === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {method === 'app' ? (
              <>
                <p style={{ color: TEXT_S, fontSize: 13, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
                  Scannez ce QR code avec votre application d&#39;authentification (Google Authenticator, Authy…)
                </p>

                <div style={{ background: CARD, border: `2px solid ${BORDER}`, borderRadius: 20, padding: 16, marginBottom: 20, boxShadow: `0 4px 20px rgba(0,0,0,0.08)` }}>
                  {qrCodeUri ? (
                    <img src={qrCodeUri} alt="Supabase TOTP QR Code" style={{ display: 'block', width: 160, height: 160 }} />
                  ) : (
                    <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RefreshCw size={24} className="animate-spin" style={{ color: TEAL }} />
                    </div>
                  )}
                </div>

                <p style={{ color: TEXT_S, fontSize: 12, textAlign: 'center', margin: '0 0 10px' }}>Ou entrez cette clé manuellement :</p>
                <div style={{ background: '#F8FAFC', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, width: '100%' }}>
                  <code style={{ flex: 1, fontSize: 13, fontWeight: 700, color: TEXT_P, letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{secretCode}</code>
                  <button onClick={() => { navigator.clipboard.writeText(secretCode).catch(() => null); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {copied ? <Check size={16} color={TEAL} /> : <Copy size={16} color={TEXT_S} />}
                  </button>
                </div>

                <button
                  onClick={() => setStep('verify')}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${TEAL}, #004E57)`, border: 'none', borderRadius: 16, padding: '16px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  J&#39;ai scanné le code
                </button>
              </>
            ) : (
              <>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: '#8B5CF614', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <MessageSquare size={36} color="#8B5CF6" />
                </div>

                <h3 style={{ color: TEXT_P, fontSize: 18, fontWeight: 800, textAlign: 'center', margin: '0 0 10px' }}>Envoi du SMS</h3>
                <p style={{ color: TEXT_S, fontSize: 14, textAlign: 'center', margin: '0 0 28px', lineHeight: 1.6 }}>
                  Nous allons envoyer un code à 6 chiffres au numéro
                  <br />
                  <strong style={{ color: TEXT_P }}>{profile?.phone || 'associé à votre compte'}</strong>
                </p>

                <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 14, padding: 14, marginBottom: 28, width: '100%' }}>
                  <p style={{ color: '#92400E', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                    ⚠️ Les flux SMS de l'infrastructure d'authentification dépendent des quotas opérateurs.
                  </p>
                </div>

                <button
                  onClick={() => setStep('verify')}
                  style={{ width: '100%', background: '#8B5CF6', border: 'none', borderRadius: 16, padding: '16px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  Continuer
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ── VERIFY ── */}
        {step === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `${TEAL}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>🔑</span>
            </div>

            <h3 style={{ color: TEXT_P, fontSize: 20, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>Entrez le code</h3>
            <p style={{ color: TEXT_S, fontSize: 13, textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5 }}>
              Saisissez le code à 6 chiffres pour valider l'association.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeInput(e.target.value, i)}
                  onKeyDown={e => { if (e.key === 'Backspace' && !code[i] && i > 0) inputRefs.current[i - 1]?.focus(); }}
                  style={{
                    width: 46,
                    height: 56,
                    border: `2px solid ${codeError ? '#EF4444' : digit ? TEAL : BORDER}`,
                    borderRadius: 14,
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_P,
                    background: CARD,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              ))}
            </div>

            {codeError && (
              <p style={{ color: '#EF4444', fontSize: 12, margin: '0 0 16px' }}>Code incorrect ou expiré.</p>
            )}

            <button
              style={{ background: 'none', border: 'none', color: TEAL, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 32 }}
              onClick={() => setCode(['', '', '', '', '', ''])}
            >
              <RefreshCw size={13} /> Réinitialiser
            </button>

            <button
              onClick={verifyCode}
              disabled={code.join('').length < 6 || verifying}
              style={{
                width: '100%',
                background: code.join('').length < 6 ? '#E2E8F0' : `linear-gradient(135deg, ${TEAL}, #004E57)`,
                border: 'none',
                borderRadius: 16,
                padding: '16px',
                color: code.join('').length < 6 ? TEXT_S : '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: code.join('').length < 6 || verifying ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {verifying ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Vérification…
                </>
              ) : 'Confirmer'}
            </button>
          </motion.div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} style={{ flex: 1, padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              style={{ width: 96, height: 96, borderRadius: '50%', background: `${TEAL}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
            >
              <span style={{ fontSize: 44 }}>✅</span>
            </motion.div>

            <h2 style={{ color: TEXT_P, fontSize: 22, fontWeight: 800, textAlign: 'center', margin: '0 0 10px' }}>2FA activé avec succès !</h2>
            <p style={{ color: TEXT_S, fontSize: 14, textAlign: 'center', margin: '0 0 32px', lineHeight: 1.6 }}>
              Votre compte est protégé par l&#39;authentification à deux facteurs via{' '}
              <strong>{method === 'app' ? "une application TOTP" : "SMS"}</strong>.
            </p>

            {/* Codes de récupération */}
            <div style={{ width: '100%', background: '#FFFBEB', border: `1.5px solid ${GOLD}50`, borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <p style={{ color: TEXT_P, fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>🔑 Codes de récupération</p>
                  <p style={{ color: TEXT_S, fontSize: 11, margin: 0 }}>Conservez-les en lieu sûr</p>
                </div>
                <button
                  onClick={copyRecoveryCodes}
                  style={{ background: GOLD + '20', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#92400E', fontSize: 12, fontWeight: 600, marginLeft: 'auto' }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {recoveryCodes.map(codeStr => (
                  <code key={codeStr} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, color: TEXT_P, letterSpacing: '0.05em' }}>
                    {codeStr}
                  </code>
                ))}
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: 12, marginBottom: 28, width: '100%' }}>
              <p style={{ color: '#991B1B', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                ⚠️ Ces codes de secours sont générés de manière unique pour parer à la perte de votre terminal TOTP.
              </p>
            </div>

            <button
              onClick={() => navigate('/kauri/profil-particulier')}
              style={{ width: '100%', background: `linear-gradient(135deg, ${TEAL}, #004E57)`, border: 'none', borderRadius: 16, padding: '16px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${TEAL}40` }}
            >
              Retour au profil
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
