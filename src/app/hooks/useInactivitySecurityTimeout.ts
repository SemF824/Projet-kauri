import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getSupabase } from "../../utils/supabase";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes d'inactivité avant verrouillage

/**
 * Hook qui surveille l'inactivité de l'utilisateur (sécurité bancaire / financière)
 */
export function useInactivitySecurityTimeout() {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      // Déconnexion ou verrouillage de sécurité
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        toast.error("Session verrouillée pour cause d'inactivité.", {
          description: "Pour votre sécurité financière, veuillez vous réauthentifier.",
        });
        await supabase.auth.signOut();
        navigate("/kauri/login");
      }
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    const handleUserActivity = () => {
      resetTimer();
    };

    // Démarrer l'écoute des événements
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Initialiser le timer
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);
}
