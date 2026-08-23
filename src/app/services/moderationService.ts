/**
 * Moteur de modération côté client (Edge & Client filtering)
 * Analyse les messages avant publication et bloque les contenus illicites / frauduleux.
 */

// Liste noire de termes et schémas financiers interdits (anti-phishing / scam / haine)
const FORBIDDEN_PATTERNS = [
  /\b(doubler vos gains|rendement garanti 100%|envoie de l'argent d'abord|gain imm[eé]diat)\b/i,
  /\b(telegram @[a-zA-Z0-9_]+|t\.me\/[a-zA-Z0-9_]+)\b/i, // Liens de recrutement scam externes
  /\b(seed phrase|cl[eé] priv[eé]e|12 mots|private key)\b/i, // Tentatives d'extraction de clés crypto
];

export interface ModerationResult {
  isAllowed: boolean;
  flaggedReason?: string;
  sanitizedText?: string;
}

export class ModerationService {
  /**
   * Analyse préventive du texte
   */
  public static validateTextMessage(text: string): ModerationResult {
    const cleanText = text.trim();

    if (!cleanText) {
      return { isAllowed: false, flaggedReason: "Le message est vide." };
    }

    // 1. Détection de patterns frauduleux / phishing
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(cleanText)) {
        return {
          isAllowed: false,
          flaggedReason:
            "Votre message contient des termes ou liens interdits par notre politique anti-fraude.",
        };
      }
    }

    // 2. Détection de spam répétitif (ex: aaaaaaa...)
    if (/(.)\1{12,}/.test(cleanText)) {
      return {
        isAllowed: false,
        flaggedReason: "Message détecté comme répétition / spam.",
      };
    }

    return {
      isAllowed: true,
      sanitizedText: cleanText,
    };
  }

  /**
   * Analyse préventive d'un fichier média (taille et types MIME autorisés)
   */
  public static validateMediaFile(file: File): ModerationResult {
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
    ];

    const MAX_SIZE_MB = 20; // Limite 20 Mo

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isAllowed: false,
        flaggedReason: "Format de fichier non pris en charge ou potentiellement dangereux.",
      };
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        isAllowed: false,
        flaggedReason: `Le fichier dépasse la taille maximale autorisée (${MAX_SIZE_MB} Mo).`,
      };
    }

    return { isAllowed: true };
  }
}
