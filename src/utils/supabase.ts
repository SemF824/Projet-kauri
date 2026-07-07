import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vikuvrkhxxwigoyoihlf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa3V2cmtoeHh3aWdveW9paGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjExMzgsImV4cCI6MjA5NzY5NzEzOH0.Nl4dq7IBJRv_0eoZeYnWJI3kIB8tt7DFhfrJT73oSUs";

export const projectId = "vikuvrkhxxwigoyoihlf";
export const publicAnonKey = SUPABASE_ANON_KEY;
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3612691c`;

let supabaseInstance: ReturnType<typeof createClient> | null =
  null;

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
  }
  return supabaseInstance;
}

export async function authHeaders(): Promise<
  Record<string, string>
> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? publicAnonKey;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function phoneToEmail(phone: string): string {
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  const normalized = clean.startsWith("+")
    ? clean
    : `+33${clean.replace(/^0/, "")}`;
  return `${normalized}@kauri.app`;
}

// Supabase requires 6+ character passwords — pad short PINs with a fixed salt
export function pinToPassword(pin: string): string {
  return `${pin}_kauri`;
}

// ── Cryptographie & Chiffrement Asymétrique Client-Side (KYC) ──────────────────

// Clé publique RSA de Kauri (Format SPKI encodé en Base64)
// REMPLACE CETTE CLÉ PAR TA PROPRE CLÉ PUBLIQUE RSA 2048 PRODUCTION
const KAURI_RSA_PUBLIC_KEY_B64 =
  `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8ur5G69kIhRoKMax0kr+Xn60dzeviG9BxtwZMNluOAKjQiPbyDrnhem7zvB4BMRsywP8GB3lnz3dyegiQJUYtdj6stKNl3oAgWCYvcj2o+VhU6se35YqGixeog4rcIdmzj3DTOLvdubWf14eR4q9+pkOVWiGexJrDRf72na6f04jXIiL58G5grx7rPUiYSki5T4gwqXz/L8JO1Eg7b0XTr/FnQdG320uN7L1KAF56R2dmt/XnJTotnsL0sJwxeHf97BtoFtIGqdFCzBHcbEBh+OUooG1o/3me86Vw/KwjbPwlt3DXB/Y1YiV2xrKueJDbhYNhtbKJw9o1cxRckobEQIDAQAB`.replace(
    /\s+/g,
    "",
  );

// Convertisseur Base64 vers ArrayBuffer
function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binaryString = window.atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Chiffre localement un document en utilisant le mécanisme d'enveloppe hybride :
 * Clé de session éphémère AES-GCM 256 + Clé publique RSA-OAEP 2048 Kauri.
 */
export async function encryptFileAsymmetric(
  file: File,
): Promise<Blob> {
  // 1. Génération d'une clé symétrique éphémère AES-GCM
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"],
  );

  // 2. Exportation de la clé AES brute pour pouvoir la chiffrer en RSA
  const rawAesKey = await window.crypto.subtle.exportKey(
    "raw",
    aesKey,
  );

  // 3. Importation de la clé publique de Kauri
  const publicKeyBuffer = base64ToArrayBuffer(
    KAURI_RSA_PUBLIC_KEY_B64,
  );
  const rsaPublicKey = await window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  // 4. Chiffrement de la clé AES avec la clé publique RSA
  const encryptedAesKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    rawAesKey,
  );

  // 5. Chiffrement du fichier avec la clé AES
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();
  const encryptedFileContent =
    await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      fileBuffer,
    );

  // 6. Assemblage de l'enveloppe : [Clé AES Chiffrée (256 octets)] + [IV (12 octets)] + [Fichier Chiffré]
  return new Blob([encryptedAesKey, iv, encryptedFileContent], {
    type: "application/octet-stream",
  });
}

/**
 * Gère le chiffrement complet et l'envoi sécurisé vers le bucket de stockage de Supabase
 */
export async function uploadKYCDocument(
  userId: string,
  stepName: string,
  file: File,
): Promise<string> {
  const supabase = getSupabase();

  // Exécuter le chiffrement côté client avant l'envoi
  const encryptedBlob = await encryptFileAsymmetric(file);

  const fileExt = file.name.split(".").pop() || "bin";
  const filePath = `kyc-vault/${userId}/${stepName}_${Date.now()}.${fileExt}.enc`;

  const { data, error } = await supabase.storage
    .from("secure-kyc") // Assure-toi que ce bucket existe dans Supabase
    .upload(filePath, encryptedBlob, {
      contentType: "application/octet-stream",
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(
      `Erreur de téléversement Supabase Storage: ${error.message}`,
    );
  }

  return data.path;
}

// ── Social helpers ────────────────────────────────────────────────────────────

export async function addComment(
  postId: string,
  text: string,
  author: string,
  initials: string,
) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return supabase.from("social_comments").insert({
    post_id: postId,
    user_id: user?.id ?? null,
    author,
    initials,
    text,
  });
}

export async function getComments(postId: string) {
  const supabase = getSupabase();
  return supabase
    .from("social_comments")
    .select("id, post_id, author, initials, text, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function setFollowPro(
  proId: string,
  follow: boolean,
) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (follow) {
    await supabase
      .from("social_follows")
      .upsert({ user_id: user.id, pro_id: proId });
  } else {
    await supabase
      .from("social_follows")
      .delete()
      .match({ user_id: user.id, pro_id: proId });
  }
}

export async function checkFollowingPro(
  proId: string,
): Promise<boolean> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("social_follows")
    .select("pro_id")
    .eq("user_id", user.id)
    .eq("pro_id", proId)
    .maybeSingle();
  return !!data;
}
