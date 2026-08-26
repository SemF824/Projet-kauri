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

  // Type de compte garanti et vérifié depuis l'enregistrement BDD Supabase lié à l'ID utilisateur (user.id)
  const userAccountType = profile?.accountType;

  // Si le profil n'a pas encore pu être chargé ou est indéfini
  if (!userAccountType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  if (userAccountType !== allowedType) {
    // Redirection automatique stricte basée sur la valeur en BDD pour cet ID
    const redirectPath =
      userAccountType === "professionnel"
        ? "/kauri/pro-dashboard"
        : "/kauri/normal-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
