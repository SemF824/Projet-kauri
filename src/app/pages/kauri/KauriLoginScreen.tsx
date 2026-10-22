import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Fingerprint,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { getSupabase } from "../../../utils/supabase";

export function KauriLoginScreen() {
  const navigate = useNavigate();
  const { signIn, resendConfirmation, user, profile, loading } = useAuth();

  const [step, setStep] = useState<"welcome" | "email">(
    "welcome",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Détection de la clé d'accès sans déclenchement automatique
  useEffect(() => {
    const savedEmail = localStorage.getItem(
      "kauri_rememberED_email",
    );
    if (savedEmail) {
      setEmail(savedEmail);
      const isBioActive = localStorage.getItem(
        `kauri_bio_active_${savedEmail}`,
      );
      if (isBioActive === "true") {
        setHasPasskey(true);
      }
    }
  }, []);

  // Redirection automatique dès que le profil utilisateur est validé
  useEffect(() => {
    if (!loading && user && profile) {
      localStorage.setItem(
        "kauri_account_type",
        profile.accountType,
      );
      if (profile.accountType === "professionnel") {
        navigate("/kauri/pro-dashboard");
      } else {
        navigate("/kauri/normal-dashboard");
      }
    }
  }, [user, profile, loading, navigate]);

  const validateEmail = (emailStr: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  const isFormValid =
    validateEmail(email) && password.length > 0;

  // ── 🎯 AUTHENTIFICATION SOCIALE OAUTH (GOOGLE, APPLE, FACEBOOK) ──
  const handleSocialLogin = async (
    provider: "google" | "apple" | "facebook",
  ) => {
    setIsSocialLoading(true);
    setError("");
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/kauri/normal-dashboard`,
          scopes:
            provider === "facebook"
              ? "email,public_profile"
              : undefined,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      console.error("Social login error:", e);
      setError(`Connexion via ${provider} impossible.`);
      toast.error(`Échec de l'authentification ${provider}`);
    } finally {
      setIsSocialLoading(false);
    }
  };

  // Soumission du formulaire d'authentification classique
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    // 🛡️ DÉTECTION GOOGLE INSTANTANÉE : Si le compte a été créé avec Google, pas de mot de passe !
    if (localStorage.getItem(`kauri_provider_${normalizedEmail}`) === "google") {
      toast.info("Compte Google détecté. Connexion en 1 clic...");
      await handleSocialLogin("google");
      return;
    }

    if (!isFormValid || isLoading) return;

    setError("");
    setNeedsConfirmation(false);
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);

      localStorage.setItem("kauri_rememberED_email", email.trim());
      // Sécurité : suppression des reliquats de mots de passe stockés en clair/base64
      localStorage.removeItem(`kauri_token_vault_${email.trim()}`);
    } catch (e: any) {
      console.error("Login error:", e);
      if (e.message === "EMAIL_NOT_CONFIRMED_OR_WRONG_CREDS") {
        setNeedsConfirmation(true);
        setError("E-mail non confirmé ou identifiants incorrects. Vérifiez votre boîte mail ou renvoyez l'e-mail de confirmation.");
        toast.error("Connexion échouée");
      } else {
        setError("Adresse e-mail ou mot de passe incorrect.");
        toast.error("Échec de la connexion");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Défi biométrique système
  const triggerBiometricAuth = async (targetEmail: string) => {
    if (isBioLoading) return;
    setError("");

    if (!window.PublicKeyCredential) {
      toast.error(
        "Votre matériel ne prend pas en charge les spécifications Passkey.",
      );
      return;
    }

    setIsBioLoading(true);

    try {
      // Nettoyage de tout token vault base64 résiduel
      localStorage.removeItem(`kauri_token_vault_${targetEmail}`);

      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const options: CredentialRequestOptions = {
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: "required",
          timeout: 60000,
        },
      };

      const assertion = await navigator.credentials.get(options);

      if (!assertion) {
        throw new Error("Authentification matérielle refusée.");
      }

      const supabase = getSupabase();
      const normalizedEmail = targetEmail.trim().toLowerCase();
      const isGoogleAccount = localStorage.getItem(`kauri_provider_${normalizedEmail}`) === "google";

      // 1. Vérifier si une session Supabase active existe déjà pour ce compte
      let { data: { session } } = await supabase.auth.getSession();

      // 2. Si aucune session active en mémoire, restaurer la session via le coffre-fort Passkey sécurisé
      if (!session || session.user.email?.toLowerCase() !== normalizedEmail) {
        const vaultRaw = localStorage.getItem(`kauri_passkey_vault_${normalizedEmail}`);
        if (vaultRaw) {
          try {
            const vault = JSON.parse(vaultRaw);
            if (vault.refresh_token) {
              const { data: refreshed, error: refreshErr } = await supabase.auth.setSession({
                refresh_token: vault.refresh_token,
                access_token: "",
              });
              if (!refreshErr && refreshed.session) {
                session = refreshed.session;
              }
            }
          } catch (err) {
            console.warn("Erreur restauration session passkey:", err);
          }
        }
      }

      if (session) {
        toast.success("Authentification biométrique réussie !");
        navigate("/kauri/normal-dashboard");
        return;
      }

      // 3. 🛡️ GESTION COMPTE GOOGLE : Ne JAMAIS demander de mot de passe à un compte Google !
      if (isGoogleAccount) {
        toast.info("Compte Google détecté. Connexion automatique...");
        await handleSocialLogin("google");
        return;
      }

      // Si c'est un compte par e-mail sans Google
      toast.info("Veuillez saisir votre mot de passe pour renouveler la session sécurisée.");
      setStep("email");
      setEmail(targetEmail);
    } catch (e: any) {
      console.error("Biometric authentication error:", e);
      setError(
        "Vérification biométrique annulée ou clé d'accès introuvable.",
      );
      toast.error("Authentification biométrique annulée");
    } finally {
      setIsBioLoading(false);
    }
  };

  const handleBiometricLoginClick = () => {
    const target =
      email.trim() ||
      localStorage.getItem("kauri_rememberED_email");
    if (!target) {
      toast.error(
        "Veuillez renseigner votre e-mail pour initier la vérification.",
      );
      return;
    }
    triggerBiometricAuth(target);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(165deg, #006D77 0%, #004E57 55%, #003A42 100%)",
        }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden font-sans"
      style={{
        background:
          "linear-gradient(165deg, #006D77 0%, #004E57 55%, #003A42 100%)",
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 100 100"
            style={{
              position: "absolute",
              width: `${30 + (i % 5) * 12}px`,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 13 + 8) % 100}%`,
              opacity: 0.06 + (i % 3) * 0.03,
              animation: `cowrieFloat ${5 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <path
              d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
              fill="white"
            />
          </svg>
        ))}
      </div>

      {/* Brand Header */}
      <div
        className="relative z-10 flex flex-col items-center pt-14 pb-8 px-6"
        style={{
          opacity: animateIn ? 1 : 0,
          transform: animateIn
            ? "translateY(0)"
            : "translateY(-20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="relative mb-4">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "#D4AF37",
              opacity: 0.25,
              transform: "scale(1.35)",
              animation: "pulse 2.5s ease-in-out infinite",
            }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #D4AF37, #F59E0B)",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 text-white"
            >
              <path
                d="M50 20 Q30 30 25 50 Q30 70 50 80 Q70 70 75 50 Q70 30 50 20 M50 35 Q60 40 62 50 Q60 60 50 65 Q40 60 38 50 Q40 40 50 35"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <h1
          className="text-white tracking-widest mb-1"
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
          }}
        >
          KAURI
        </h1>
        <p className="text-white/70 text-sm">
          L'Unité dans la Finance
        </p>
      </div>

      {/* Container Card */}
      <div
        className="relative z-10 flex-1 mx-4 mb-6 rounded-3xl overflow-hidden max-w-md w-full sm:mx-auto"
        style={{
          background: "#F9F9F9",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.3)",
          opacity: animateIn ? 1 : 0,
          transform: animateIn
            ? "translateY(0)"
            : "translateY(30px)",
          transition:
            "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            {step !== "welcome" && (
              <button
                onClick={() => {
                  setStep("welcome");
                  setError("");
                }}
                className="flex items-center gap-1 mb-4 cursor-pointer bg-transparent border-none outline-none"
                style={{ color: "#006D77" }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Retour
                </span>
              </button>
            )}

            {step === "welcome" ? (
              <div className="flex flex-col">
                <h2
                  className="mb-1"
                  style={{
                    color: "#0F172A",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                  }}
                >
                  Bon retour ! 👋
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "#4A4A4A" }}
                >
                  Connectez-vous à votre espace sécurisé KAURI.
                </p>

                {/* ── 🚀 MODULE DE CONNEXION SOCIALE RAPIDE ── */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Connexion rapide via Réseaux
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        handleSocialLogin("google")
                      }
                      disabled={isSocialLoading}
                      className="py-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      Google
                    </button>
                    <button
                      onClick={() => handleSocialLogin("apple")}
                      disabled={isSocialLoading}
                      className="py-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      Apple
                    </button>
                    <button
                      onClick={() =>
                        handleSocialLogin("facebook")
                      }
                      disabled={isSocialLoading}
                      className="py-3 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      Facebook
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 my-2 mb-4">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#E2E8F0" }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "#94A3B8" }}
                  >
                    ou autres méthodes
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#E2E8F0" }}
                  />
                </div>

                {/* Clé d'accès biométrique */}
                <button
                  onClick={handleBiometricLoginClick}
                  disabled={isBioLoading}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 border-2 transition-all active:scale-95 text-white cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #006D77, #0D9488)",
                    borderColor: "#006D77",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 shrink-0">
                    {isBioLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Fingerprint className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                      className="truncate"
                    >
                      Clé d'accès biométrique
                    </p>
                    <p className="text-white/80 text-[11px] truncate">
                      {isBioLoading
                        ? "Interrogation du capteur..."
                        : hasPasskey
                          ? "Face ID • Empreinte digitale"
                          : "Non configurée sur cet appareil"}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70 shrink-0" />
                </button>

                {/* Option Identifiants Classiques */}
                <button
                  onClick={() => setStep("email")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl mb-4 border-2 transition-all active:scale-95 bg-white cursor-pointer"
                  style={{ borderColor: "#006D77" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#E6F4F5" }}
                  >
                    <Mail
                      className="w-5 h-5"
                      style={{ color: "#006D77" }}
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#0F172A",
                      }}
                      className="truncate"
                    >
                      E-mail & Mot de passe
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      Connexion manuelle
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#006D77" }}
                  />
                </button>

                {error && (
                  <p className="text-xs text-center text-[#B05B3B] font-medium mb-4">
                    {error}
                  </p>
                )}
              </div>
            ) : (
              /* Formulaire classique */
              <form
                onSubmit={handleEmailLogin}
                className="flex flex-col space-y-5"
              >
                <h2
                  style={{
                    color: "#0F172A",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                  }}
                >
                  Identifiants
                </h2>
                <p className="text-sm text-gray-500">
                  Renseignez vos accès pour ouvrir votre
                  session.
                </p>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-gray-500">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="marie.dupont@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm outline-none text-[#0F172A] bg-white"
                      style={{ borderColor: "#E2E8F0" }}
                      required
                    />
                  </div>
                </div>

                {localStorage.getItem(`kauri_provider_${email.trim().toLowerCase()}`) === "google" ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3 my-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Compte associé à Google</p>
                      <p className="text-[11px] text-slate-500">
                        Ce compte ne possède pas de mot de passe. Connectez-vous directement via Google.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("google")}
                      className="w-full py-3 px-4 rounded-xl bg-white border-2 border-slate-200 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continuer avec Google</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block text-gray-500">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="w-full pl-11 pr-10 py-3 rounded-xl border-2 text-sm outline-none text-[#0F172A] bg-white"
                        style={{ borderColor: "#E2E8F0" }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-3.5 text-gray-400 bg-transparent border-none cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#B05B3B] font-medium">
                      {error}
                    </p>
                    {needsConfirmation && (
                      <button
                        type="button"
                        disabled={resendCooldown > 0}
                        onClick={async () => {
                          try {
                            await resendConfirmation(email.trim());
                            setResendCooldown(60);
                            const interval = setInterval(() => {
                              setResendCooldown((c) => {
                                if (c <= 1) { clearInterval(interval); return 0; }
                                return c - 1;
                              });
                            }, 1000);
                            toast.success("E-mail de confirmation renvoyé !");
                          } catch {
                            toast.error("Impossible de renvoyer l'e-mail.");
                          }
                        }}
                        className="w-full py-2 rounded-xl text-xs font-semibold border border-[#006D77] text-[#006D77] bg-white/60 transition-opacity disabled:opacity-50"
                      >
                        {resendCooldown > 0
                          ? `Renvoyer dans ${resendCooldown}s`
                          : "Renvoyer l'e-mail de confirmation"}
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full py-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
                  style={{
                    background: isFormValid
                      ? "linear-gradient(135deg, #006D77, #0D9488)"
                      : "#CBD5E1",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Accéder au Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div
            className="pt-4 mt-4"
            style={{ borderTop: "1px solid #F1F5F9" }}
          >
            <p
              className="text-center text-sm mb-3"
              style={{ color: "#4A4A4A" }}
            >
              Pas encore de compte KAURI ?
            </p>
            <button
              onClick={() => navigate("/kauri")}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 cursor-pointer border-none"
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37, #F59E0B)",
              }}
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>

      <p
        className="relative z-10 text-center text-[10px] pb-6"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
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