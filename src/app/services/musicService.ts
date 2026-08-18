import { UnifiedTrack, ITunesResponse, DeezerResponse } from "../types/music";

export class MusicService {
  private static readonly ITUNES_API_URL = "https://itunes.apple.com/search";
  private static readonly DEEZER_API_URL = "https://api.deezer.com/search";

  /**
   * Orchestre la recherche musicale : tente iTunes en priorité, puis bascule
   * automatiquement sur Deezer en cas d'erreur ou d'absence de résultats avec aperçu.
   */
  public static async searchMusic(
    query: string,
    limit: number = 20,
    country: string = "FR",
  ): Promise<UnifiedTrack[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const itunesResults = await this.searchItunes(query, limit, country);

      // Si iTunes retourne des résultats exploitables (avec previewUrl), on les utilise
      if (itunesResults.length > 0) {
        return itunesResults;
      }

      // Si 0 résultat exploitable, on force le passage dans le catch pour déclencher le fallback
      throw new Error("Aucune piste avec extrait audio trouvée sur iTunes.");
    } catch (itunesError) {
      console.warn(
        "Échec de la recherche iTunes ou aucun résultat exploitable. Basculement sur Deezer...",
        itunesError,
      );

      try {
        const deezerResults = await this.searchDeezer(query, limit);
        return deezerResults;
      } catch (deezerError) {
        console.error(
          "L'API de secours (Deezer) a également échoué :",
          deezerError,
        );
        // En cas d'échec des deux APIs, on retourne un tableau vide
        return [];
      }
    }
  }

  /**
   * Recherche sur iTunes Search API et normalise les résultats
   */
  private static async searchItunes(
    query: string,
    limit: number,
    country: string,
  ): Promise<UnifiedTrack[]> {
    const url = `${this.ITUNES_API_URL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&country=${country}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP iTunes : ${response.status} ${response.statusText}`,
      );
    }

    const data: ITunesResponse = await response.json();

    return data.results
      .filter((track) => track.previewUrl && track.previewUrl.trim() !== "")
      .map((track) => ({
        id: `itunes_${track.trackId}`,
        source: "itunes",
        title: track.trackName || "Titre inconnu",
        artist: track.artistName || "Artiste inconnu",
        album: track.collectionName || "Album inconnu",
        coverUrl: track.artworkUrl100
          ? track.artworkUrl100.replace("100x100bb.jpg", "600x600bb.jpg")
          : "",
        previewUrl: track.previewUrl as string,
        duration: Math.floor((track.trackTimeMillis || 0) / 1000),
      }));
  }

  /**
   * Recherche sur Deezer Public API et normalise les résultats
   */
  private static async searchDeezer(
    query: string,
    limit: number,
  ): Promise<UnifiedTrack[]> {
    const url = `${this.DEEZER_API_URL}?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP Deezer : ${response.status} ${response.statusText}`,
      );
    }

    const data: DeezerResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data
      .filter((track) => track.preview && track.preview.trim() !== "")
      .map((track) => ({
        id: `deezer_${track.id}`,
        source: "deezer",
        title: track.title || "Titre inconnu",
        artist: track.artist?.name || "Artiste inconnu",
        album: track.album?.title || "Album inconnu",
        coverUrl: track.album?.cover_big || "",
        previewUrl: track.preview as string,
        duration: track.duration || 0,
      }));
  }
}
