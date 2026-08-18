export interface UnifiedTrack {
  id: string; // Format: "itunes_{id}" ou "deezer_{id}"
  source: "itunes" | "deezer";
  title: string; // Titre du morceau
  artist: string; // Nom de l'artiste
  album: string; // Nom de l'album
  coverUrl: string; // URL de la pochette haute résolution
  previewUrl: string; // URL directe du flux audio 30s (.m4a ou .mp3)
  duration: number; // Durée du morceau en secondes
}

// ── Types pour l'API iTunes ─────────────────────────────────────────────────

export interface ITunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackTimeMillis: number;
}

export interface ITunesResponse {
  resultCount: number;
  results: ITunesResult[];
}

// ── Types pour l'API Deezer ─────────────────────────────────────────────────

export interface DeezerResult {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_big: string;
  };
  preview?: string;
  duration: number;
}

export interface DeezerResponse {
  data: DeezerResult[];
  total: number;
}
