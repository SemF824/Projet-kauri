import { useState, useRef, useEffect, useCallback } from "react";

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number; // Progression entre 0 et 1
  currentTime: number; // Temps actuel en secondes
  duration: number; // Durée totale en secondes
  currentTrackUrl: string | null;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    progress: 0,
    currentTime: 0,
    duration: 0,
    currentTrackUrl: null,
  });

  const updateState = (updates: Partial<AudioPlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(
    async (url: string) => {
      try {
        // Si on demande à lire la même URL qui est déjà en cours ou en pause
        if (audioRef.current && state.currentTrackUrl === url) {
          if (!state.isPlaying) {
            await audioRef.current.play();
          }
          return;
        }

        // Si une autre piste est en cours, on l'arrête proprement
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        } else {
          // Initialisation du lecteur natif
          audioRef.current = new Audio();
          // Lecture automatique en boucle comme requis
          audioRef.current.loop = true;
        }

        const audio = audioRef.current;
        audio.src = url;

        updateState({
          currentTrackUrl: url,
          isLoading: true,
          error: null,
          progress: 0,
          currentTime: 0,
          duration: 0,
        });

        // --- Enregistrement des événements natifs de l'élément Audio ---
        audio.onwaiting = () => updateState({ isLoading: true });
        audio.onplaying = () =>
          updateState({ isLoading: false, isPlaying: true, error: null });
        audio.onpause = () => updateState({ isPlaying: false });

        audio.onloadedmetadata = () => {
          updateState({ duration: audio.duration });
        };

        audio.ontimeupdate = () => {
          if (audio.duration) {
            updateState({
              currentTime: audio.currentTime,
              progress: audio.currentTime / audio.duration,
            });
          }
        };

        audio.onerror = () => {
          updateState({
            error:
              "Impossible de lire cet extrait audio. Le fichier est peut-être indisponible.",
            isLoading: false,
            isPlaying: false,
          });
        };

        // Démarrage effectif de la lecture
        await audio.play();
      } catch (err: any) {
        updateState({
          error:
            err.message || "Erreur inconnue lors du démarrage de la lecture.",
          isLoading: false,
          isPlaying: false,
        });
      }
    },
    [state.currentTrackUrl, state.isPlaying],
  );

  const pause = useCallback(() => {
    if (audioRef.current && state.isPlaying) {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  const toggle = useCallback(
    (url: string) => {
      if (state.currentTrackUrl === url && state.isPlaying) {
        pause();
      } else {
        play(url);
      }
    },
    [state.currentTrackUrl, state.isPlaying, play, pause],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      updateState({
        isPlaying: false,
        progress: 0,
        currentTime: 0,
        currentTrackUrl: null,
      });
    }
  }, []);

  const seek = useCallback((timeInSeconds: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const safeTime = Math.max(
        0,
        Math.min(timeInSeconds, audioRef.current.duration),
      );
      audioRef.current.currentTime = safeTime;
      updateState({
        currentTime: safeTime,
        progress: safeTime / audioRef.current.duration,
      });
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    toggle,
    stop,
    seek,
  };
}
