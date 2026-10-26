import { Navigate } from "react-router";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-[#0a5c7a] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/kauri/login" replace />;
  }

  // Vérification stricte des droits administrateur (metadata, email ou profil)
  const isAdmin =
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin" ||
    user.email?.endsWith("@kauri.app") ||
    (profile as any)?.role === "admin";

  if (!isAdmin) {
    toast.error("Accès refusé", {
      description: "Vous devez disposer des droits d'administrateur pour accéder à cette zone.",
    });
    return <Navigate to="/kauri/normal-dashboard" replace />;
  }

  return <>{children}</>;
}

