import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabase } from "../../utils/supabase";

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  media_url?: string | null;
  media_type?: string | null;
  reply_to_id?: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function useChatRoom(roomId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const activeChannelRef = useRef<any>(null);

  // 1. Récupération de l'utilisateur connecté
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  // 2. Chargement initial des messages
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    setIsLoading(true);
    setError(null);

    const supabase = getSupabase();
    const { data, error: fetchErr } = await supabase
      .from<any, any>("chat_messages")
      .select(`
        id,
        room_id,
        sender_id,
        content,
        media_url,
        media_type,
        reply_to_id,
        created_at
      `)
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (fetchErr) {
      console.error("Erreur récupération messages:", fetchErr);
      setError(fetchErr.message);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  }, [roomId]);

  // 3. Abonnement Supabase Realtime
  useEffect(() => {
    if (!roomId) return;

    fetchMessages();

    const supabase = getSupabase();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    activeChannelRef.current = channel;

    return () => {
      if (activeChannelRef.current) {
        supabase.removeChannel(activeChannelRef.current);
      }
    };
  }, [roomId, fetchMessages]);

  // 4. Action d'envoi de message
  const sendMessage = async (
    content: string,
    mediaUrl?: string,
    mediaType?: string,
    replyToId?: string
  ) => {
    if (!roomId || !content.trim()) return;

    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Vous devez être connecté pour envoyer un message.");
    }

    const { error: insertErr } = await supabase.from<any, any>("chat_messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content: content.trim(),
      media_url: mediaUrl || null,
      media_type: mediaType || null,
      reply_to_id: replyToId || null,
    });

    if (insertErr) {
      console.error("Erreur lors de l'envoi du message :", insertErr);
      throw insertErr;
    }
  };

  return {
    messages,
    isLoading,
    error,
    currentUserId,
    sendMessage,
    refresh: fetchMessages,
  };
}
