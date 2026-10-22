import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

declare const process: {
  env: Record<string, string | undefined>;
};

const env =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string>);

const procEnv =
  typeof process !== "undefined" && process.env
    ? process.env
    : ({} as Record<string, string | undefined>);

export const projectId =
  env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ||
  env.VITE_SUPABASE_PROJECT_ID ||
  env.SUPABASE_PROJECT_ID ||
  procEnv.NEXT_PUBLIC_SUPABASE_PROJECT_ID ||
  procEnv.VITE_SUPABASE_PROJECT_ID ||
  procEnv.SUPABASE_PROJECT_ID ||
  "";

const SUPABASE_URL =
  env.NEXT_PUBLIC_SUPABASE_URL ||
  env.VITE_SUPABASE_URL ||
  env.SUPABASE_URL ||
  procEnv.NEXT_PUBLIC_SUPABASE_URL ||
  procEnv.VITE_SUPABASE_URL ||
  procEnv.SUPABASE_URL ||
  (projectId ? `https://${projectId}.supabase.co` : "");

const SUPABASE_ANON_KEY =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  env.SUPABASE_ANON_KEY ||
  procEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  procEnv.VITE_SUPABASE_ANON_KEY ||
  procEnv.SUPABASE_ANON_KEY ||
  "";

export const publicAnonKey = SUPABASE_ANON_KEY;
export const SERVER_URL = projectId
  ? `https://${projectId}.supabase.co/functions/v1/make-server-3612691c`
  : "";

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const url = SUPABASE_URL.trim();
    const key = SUPABASE_ANON_KEY.trim();

    if (!url || !key) {
      console.warn(
        "Variables d'environnement Supabase manquantes : veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }

    supabaseInstance = createClient<Database>(
      url || "https://unconfigured-supabase-url.invalid",
      key || "unconfigured-supabase-key",
    );
  }
  return supabaseInstance;
}

export async function authHeaders(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token =
    session?.access_token ?? SUPABASE_ANON_KEY;
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

export function pinToPassword(pin: string): string {
  return `${pin}_kauri`;
}

// ── Cryptographie & Chiffrement Asymétrique ECC P-256 (KYC Vault) ───────────

export const ADMIN_ECDH_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErBf4GgqGXvYZGn7qZQlGZ0ogz9d4
vsrPLUye3cZWTtALPQ9WxSSqwJMmPbp0U04+PdgAqICBBLg4OfuXrvMpCw==
-----END PUBLIC KEY-----`;

export function arrayBufferToBase64(blob: ArrayBuffer): string {
  const bytes = new Uint8Array(blob);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem
    .replace(/-----\s*BEGIN[^-]*-----\s*/g, "")
    .replace(/-----\s*END[^-]*-----\s*/g, "")
    .replace(/\s/g, "");
  const binaryString = window.atob(b64Lines);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Chiffre un document avec le protocole ECIES hybride (ECC P-256 + AES-GCM 256 + Signature ECDSA)
 * et le téléverse dans le dossier kyc-vault/<userId>/<type>.enc du bucket secure-kyc.
 */
export async function uploadKYCDocument(
  userId: string,
  type: "identity" | "selfie",
  file: File | Blob,
  enclaveKeys: {
    ecdhPriv: CryptoKey;
    ecdsaPriv: CryptoKey;
    ecdhPubPEM?: string;
    ecdsaPubPEM?: string;
  },
  userPublicKeysJSON?: string,
): Promise<string> {
  const supabase = getSupabase();

  let userEcdhPubPEM = enclaveKeys.ecdhPubPEM;

  if (!userEcdhPubPEM && userPublicKeysJSON) {
    try {
      const parsed = JSON.parse(userPublicKeysJSON);
      userEcdhPubPEM = parsed.ecdh;
    } catch (_) {}
  }

  if (!userEcdhPubPEM) {
    const { data: dbProfile } = await (supabase as any)
      .from("profiles")
      .select("user_public_key")
      .eq("id", userId)
      .maybeSingle();

    if (dbProfile?.user_public_key) {
      try {
        const parsed = JSON.parse(dbProfile.user_public_key);
        userEcdhPubPEM = parsed.ecdh;
      } catch (_) {}
    }
  }

  if (!userEcdhPubPEM) {
    throw new Error("Clé publique utilisateur introuvable pour le chiffrement.");
  }

  const fileBuffer = await file.arrayBuffer();

  const ephKey = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"],
  );
  const ephPubRaw = await window.crypto.subtle.exportKey("raw", ephKey.publicKey);

  const fek = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"],
  );
  const fileIV = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedFileContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: fileIV },
    fek,
    fileBuffer,
  );
  const exportedFek = await window.crypto.subtle.exportKey("raw", fek);
  const wrapIV = window.crypto.getRandomValues(new Uint8Array(12));

  const adminPubKey = await window.crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(ADMIN_ECDH_PUBLIC_KEY_PEM),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const adminWrapKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: adminPubKey },
    ephKey.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const adminEncFEK = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: wrapIV },
    adminWrapKey,
    exportedFek,
  );

  const userPubKey = await window.crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(userEcdhPubPEM),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const userWrapKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: userPubKey },
    ephKey.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const userEncFEK = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: wrapIV },
    userWrapKey,
    exportedFek,
  );

  const dataToSign = new Uint8Array(
    ephPubRaw.byteLength + fileIV.byteLength + encryptedFileContent.byteLength,
  );
  dataToSign.set(new Uint8Array(ephPubRaw), 0);
  dataToSign.set(fileIV, ephPubRaw.byteLength);
  dataToSign.set(
    new Uint8Array(encryptedFileContent),
    ephPubRaw.byteLength + fileIV.byteLength,
  );

  const signatureBuffer = await window.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    enclaveKeys.ecdsaPriv,
    dataToSign,
  );

  const totalLength =
    101 +
    adminEncFEK.byteLength +
    userEncFEK.byteLength +
    signatureBuffer.byteLength +
    encryptedFileContent.byteLength;

  const packedBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(packedBuffer);
  view.setUint32(0, adminEncFEK.byteLength, false);
  view.setUint32(4, userEncFEK.byteLength, false);
  view.setUint32(8, signatureBuffer.byteLength, false);

  const packedBytes = new Uint8Array(packedBuffer);
  packedBytes.set(new Uint8Array(ephPubRaw), 12);
  packedBytes.set(wrapIV, 77);
  packedBytes.set(fileIV, 89);

  let offset = 101;
  packedBytes.set(new Uint8Array(adminEncFEK), offset);
  offset += adminEncFEK.byteLength;
  packedBytes.set(new Uint8Array(userEncFEK), offset);
  offset += userEncFEK.byteLength;
  packedBytes.set(new Uint8Array(signatureBuffer), offset);
  offset += signatureBuffer.byteLength;
  packedBytes.set(new Uint8Array(encryptedFileContent), offset);

  const filePath = `kyc-vault/${userId}/${type}.enc`;

  const { data, error } = await supabase.storage
    .from("secure-kyc")
    .upload(
      filePath,
      new Blob([packedBytes], { type: "application/octet-stream" }),
      {
        contentType: "application/octet-stream",
        cacheControl: "3600",
        upsert: true,
      },
    );

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
  return (supabase as any).from("social_comments").insert({
    post_id: postId,
    user_id: user?.id ?? null,
    author,
    initials,
    text,
  });
}

export async function getComments(postId: string) {
  const supabase = getSupabase();
  return (supabase as any)
    .from("social_comments")
    .select("id, post_id, author, initials, text, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function setFollowPro(proId: string, follow: boolean) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  if (follow) {
    await (supabase as any)
      .from("social_follows")
      .upsert({ user_id: user.id, pro_id: proId });
  } else {
    await (supabase as any)
      .from("social_follows")
      .delete()
      .match({ user_id: user.id, pro_id: proId });
  }
}

export async function checkFollowingPro(proId: string): Promise<boolean> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await (supabase as any)
    .from("social_follows")
    .select("pro_id")
    .eq("user_id", user.id)
    .eq("pro_id", proId)
    .maybeSingle();
  return !!data;
}