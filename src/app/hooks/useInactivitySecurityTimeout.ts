import { useEffect } from "react";

/**
 * Hook qui surveille l'inactivité de l'utilisateur.
 * Désactivé pour la déconnexion brutale afin d'éviter les coupures intempestives
 * et les renvois automatiques à la page d'accueil pendant la navigation.
 */
export function useInactivitySecurityTimeout() {
  useEffect(() => {
    // Maintien actif de la session utilisateur sans coupure inattendue
  }, []);
}
