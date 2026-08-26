import { Navigate, useLocation } from "react-router";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AccountTypeGuardProps {
  children: ReactNode;
  allowedType: "particulier" | "professionnel";
}

export function AccountTypeGuard({
  children,
  allowedType,
}: AccountTypeGuardProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/kauri/login" state={{ from: location }} replace />;
  }

  // Type effectif depuis le profil synchronisé Supabase ou localStorage de secours
  const userAccountType =
    profile?.accountType ||
    (localStorage.getItem("kauri_account_type") as
      | "particulier"
      | "professionnel"
      | null) ||
    "particulier";

  if (userAccountType !== allowedType) {
    // Redirection automatique vers l'environnement approprié
    const redirectPath =
      userAccountType === "professionnel"
        ? "/kauri/pro-dashboard"
        : "/kauri/normal-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
