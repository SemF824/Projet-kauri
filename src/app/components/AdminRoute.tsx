import { Navigate, useNavigate } from "react-router";
import { ReactNode, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface AdminRouteProps {
  children: ReactNode;
}

const AUTHORIZED_ADMIN_PASSCODES = [
  "KAUREE2025",
  "KAURI2025",
  "ADMIN2025",
  "KAUREE-ADMIN",
  "KAURI-ADMIN-2025",
];

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [sessionUnlocked, setSessionUnlocked] = useState(
    () => sessionStorage.getItem("kauri_admin_session") === "unlocked"
  );
  const [errorMsg, setErrorMsg] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/kauri/login" replace />;
  }

  // Vérification des privilèges administrateur (email créateur, métadonnées rôle ou session déverrouillée)
  const userEmail = (user.email || "").toLowerCase();
  const isDirectAdmin =
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin" ||
    userEmail.endsWith("@kauri.app") ||
    (profile as any)?.role === "admin" ||
    userEmail.includes("mvouama") ||
    userEmail.includes("semfanelm");

  const isAccessAllowed = isDirectAdmin || sessionUnlocked;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim().toUpperCase();

    if (AUTHORIZED_ADMIN_PASSCODES.includes(cleanCode)) {
      sessionStorage.setItem("kauri_admin_session", "unlocked");
      setSessionUnlocked(true);
      setErrorMsg("");
      toast.success("Accès console administrative déverrouillé.");
    } else {
      setErrorMsg("Clé d'administration invalide.");
      toast.error("Code de sécurité administrateur incorrect.");
    }
  };

  // Si l'accès n'est pas autorisé, afficher le SAS de sécurité secret
  if (!isAccessAllowed) {
    return (
      <div className="min-h-screen bg-[#090D1A] flex flex-col items-center justify-center px-6 py-12 text-slate-100 select-none">
        <div className="max-w-md w-full bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-center text-white mb-2 tracking-tight">
            CONSOLE SECRÈTE DE CONFORMITÉ
          </h2>
          <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
            Cette interface confidentielle est réservée à l'inspection et à la validation des pièces d'identité et vidéos selfie des nouveaux profils.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Clé d'accès administrative
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Saisir la clé secrète..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  autoFocus
                  className="w-full bg-[#0F172A] border border-slate-700 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-lg active:scale-[0.98]"
            >
              Déverrouiller la console
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => navigate("/kauri/normal-dashboard")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
