import { getSupabase } from "../../utils/supabase";

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  profession?: string;
  account_type?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: "direct" | "private_group" | "public_forum";
  avatar_url?: string;
  description?: string;
}

export class SocialDiscoveryService {
  /**
   * Recherche d'utilisateurs par nom ou prénom dans la table profiles
   */
  public static async searchUsers(query: string): Promise<UserProfile[]> {
    if (!query.trim()) return [];

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from<any>("profiles")
      .select("id, full_name, avatar_url, profession, account_type")
      .ilike("full_name", `%${query.trim()}%`)
      .limit(15);

    if (error) {
      console.error("Erreur recherche utilisateurs:", error);
      throw error;
    }
    return (data as unknown as UserProfile[]);
  }

  /**
   * Récupère ou crée une conversation directe (1-to-1) entre deux utilisateurs
   */
  public static async getOrCreateDirectChatRoom(
    currentUserId: string,
    targetUserId: string
  ): Promise<string> {
    if (!currentUserId || !targetUserId) {
      throw new Error("Identifiants utilisateur manquants");
    }

    const supabase = getSupabase();

    // 1. Chercher si une room directe existe déjà entre ces 2 utilisateurs
    const { data: memberRooms, error: memberError } = await supabase
      .from<any>("chat_room_members")
      .select("room_id, user_id")
      .in("user_id", [currentUserId, targetUserId]);

    if (memberError) {
      console.error("Erreur vérification membres room:", memberError);
      throw memberError;
    }

    // Regrouper par room_id pour vérifier si les deux utilisateurs partagent une room
    const roomCounts: Record<string, number> = {};
    for (const row of memberRooms || []) {
      roomCounts[row.room_id] = (roomCounts[row.room_id] || 0) + 1;
    }

    // Trouver les room_id où les 2 utilisateurs sont tous les deux membres
    const commonRoomIds = Object.keys(roomCounts).filter(
      (roomId) => roomCounts[roomId] === 2
    );

    if (commonRoomIds.length > 0) {
      const { data: directRoom } = await supabase
        .from<any>("chat_rooms")
        .select("id")
        .in("id", commonRoomIds)
        .eq("type", "direct")
        .maybeSingle();

      if (directRoom) {
        return directRoom.id;
      }
    }

    // 2. Si aucune room n'existe, création d'une nouvelle room
    const { data: newRoom, error: createError } = await supabase
      .from<any>("chat_rooms")
      .insert({
        type: "direct",
        created_by: currentUserId,
      })
      .select("id")
      .single();

    if (createError || !newRoom) {
      console.error("Erreur création room:", createError);
      throw createError;
    }

    // 3. Ajouter les deux membres
    const { error: addMembersError } = await supabase
      .from<any>("chat_room_members")
      .insert([
        { room_id: newRoom.id, user_id: currentUserId, role: "member" },
        { room_id: newRoom.id, user_id: targetUserId, role: "member" },
      ]);

    if (addMembersError) {
      console.error("Erreur ajout membres:", addMembersError);
      throw addMembersError;
    }

    return newRoom.id;
  }

  /**
   * Récupère la liste des salons publics disponibles
   */
  public static async listPublicRooms(): Promise<ChatRoom[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from<any>("chat_rooms")
      .select("id, name, description, avatar_url, type")
      .eq("type", "public_forum")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur liste salons publics:", error);
      throw error;
    }
    return (data as unknown as ChatRoom[]);
  }
}
