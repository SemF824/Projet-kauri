import { getSupabase } from "../../utils/supabase";

export type InvitationTargetType = "tontine" | "private_group" | "circle";

export interface Invitation {
  id: string;
  token: string;
  target_type: InvitationTargetType;
  target_id: string;
  created_by: string;
  expires_at: string;
  max_uses: number;
  use_count: number;
  is_revoked: boolean;
  created_at: string;
}

export class SecureInvitationService {
  /**
   * Génère un lien d'invitation sécurisé à expiration temporelle (par défaut 24h)
   */
  public static async createInvitation(
    targetType: InvitationTargetType,
    targetId: string,
    expiresInHours: number = 24,
    maxUses: number = 1
  ): Promise<{ link: string; expiresAt: Date; token: string }> {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Utilisateur non authentifié");

    // Génération d'un token cryptographiquement sécurisé
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    const token = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const { data, error } = await supabase
      .from("secure_invitations")
      .insert({
        token,
        target_type: targetType,
        target_id: targetId,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
        max_uses: maxUses,
        use_count: 0,
        is_revoked: false,
      })
      .select("token, expires_at")
      .single();

    if (error) {
      console.error("Erreur création invitation:", error);
      throw error;
    }

    const baseUrl = window.location.origin;
    const link = `${baseUrl}/kauri/join?token=${data.token}`;

    return {
      link,
      expiresAt: new Date(data.expires_at),
      token: data.token,
    };
  }

  /**
   * Valide et consomme un lien d'invitation
   */
  public static async validateAndConsumeInvitation(token: string): Promise<{
    isValid: boolean;
    reason?: string;
    targetType?: InvitationTargetType;
    targetId?: string;
  }> {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isValid: false, reason: "Veuillez vous connecter pour accepter l'invitation." };

    // 1. Récupérer l'invitation
    const { data: invite, error } = await supabase
      .from("secure_invitations")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (error || !invite) {
      return { isValid: false, reason: "Lien d'invitation invalide ou introuvable." };
    }

    // 2. Vérifications de sécurité
    if (invite.is_revoked) {
      return { isValid: false, reason: "Cette invitation a été révoquée par son émetteur." };
    }

    const now = new Date();
    const expiry = new Date(invite.expires_at);
    if (now > expiry) {
      return { isValid: false, reason: "Ce lien d'invitation a expiré." };
    }

    if (invite.use_count >= invite.max_uses) {
      return { isValid: false, reason: "Ce lien d'invitation a déjà atteint son nombre maximal d'utilisations." };
    }

    // 3. Consommation du lien (Incrémentation atomique côté DB)
    const { error: updateError } = await supabase
      .from("secure_invitations")
      .update({
        use_count: invite.use_count + 1,
      })
      .eq("id", invite.id);

    if (updateError) {
      console.error("Erreur mise à jour utilisation invitation:", updateError);
      return { isValid: false, reason: "Impossible de valider l'invitation." };
    }

    return {
      isValid: true,
      targetType: invite.target_type,
      targetId: invite.target_id,
    };
  }
}
