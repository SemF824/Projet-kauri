export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          profession: string | null
          account_type: "particulier" | "professionnel" | null
          kyc_status: "pending" | "verified" | "rejected" | "unverified" | null
          kyc_completed: boolean | null
          trust_score: number | null
          street: string | null
          zip: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          profession?: string | null
          account_type?: "particulier" | "professionnel" | null
          kyc_status?: "pending" | "verified" | "rejected" | "unverified" | null
          kyc_completed?: boolean | null
          trust_score?: number | null
          street?: string | null
          zip?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          profession?: string | null
          account_type?: "particulier" | "professionnel" | null
          kyc_status?: "pending" | "verified" | "rejected" | "unverified" | null
          kyc_completed?: boolean | null
          trust_score?: number | null
          street?: string | null
          zip?: string | null
          city?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          content: string
          media_url: string | null
          media_type: string | null
          reply_to_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          content: string
          media_url?: string | null
          media_type?: string | null
          reply_to_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          content?: string
          media_url?: string | null
          media_type?: string | null
          reply_to_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_room_members: {
        Row: {
          room_id: string
          user_id: string
          role: "admin" | "moderator" | "member"
          joined_at: string
          last_read_at: string
        }
        Insert: {
          room_id: string
          user_id: string
          role?: "admin" | "moderator" | "member"
          joined_at?: string
          last_read_at?: string
        }
        Update: {
          room_id?: string
          user_id?: string
          role?: "admin" | "moderator" | "member"
          joined_at?: string
          last_read_at?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string | null
          description: string | null
          type: "direct" | "private_group" | "public_forum"
          avatar_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          description?: string | null
          type?: "direct" | "private_group" | "public_forum"
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          description?: string | null
          type?: "direct" | "private_group" | "public_forum"
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      moderation_reports: {
        Row: {
          id: string
          reporter_id: string
          content_type: "message" | "user" | "room" | "media"
          content_id: string
          reported_user_id: string | null
          reason: "harassment" | "hate_speech" | "fraud_scam" | "inappropriate_media" | "illegal_content" | "other"
          details: string | null
          plain_text_snapshot: string | null
          status: "pending" | "in_review" | "resolved_sanctioned" | "dismissed"
          moderator_notes: string | null
          resolved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          content_type: "message" | "user" | "room" | "media"
          content_id: string
          reported_user_id?: string | null
          reason: "harassment" | "hate_speech" | "fraud_scam" | "inappropriate_media" | "illegal_content" | "other"
          details?: string | null
          plain_text_snapshot?: string | null
          status?: "pending" | "in_review" | "resolved_sanctioned" | "dismissed"
          moderator_notes?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          content_type?: "message" | "user" | "room" | "media"
          content_id?: string
          reported_user_id?: string | null
          reason?: "harassment" | "hate_speech" | "fraud_scam" | "inappropriate_media" | "illegal_content" | "other"
          details?: string | null
          plain_text_snapshot?: string | null
          status?: "pending" | "in_review" | "resolved_sanctioned" | "dismissed"
          moderator_notes?: string | null
          resolved_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      secure_invitations: {
        Row: {
          id: string
          token: string
          target_type: "tontine" | "private_group" | "circle"
          target_id: string
          created_by: string
          expires_at: string
          max_uses: number
          use_count: number
          is_revoked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          target_type: "tontine" | "private_group" | "circle"
          target_id: string
          created_by: string
          expires_at: string
          max_uses?: number
          use_count?: number
          is_revoked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          target_type?: "tontine" | "private_group" | "circle"
          target_id?: string
          created_by?: string
          expires_at?: string
          max_uses?: number
          use_count?: number
          is_revoked?: boolean
          created_at?: string
        }
      }
      social_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string | null
          author: string
          initials: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id?: string | null
          author: string
          initials: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string | null
          author?: string
          initials?: string
          text?: string
          created_at?: string
        }
      }
      social_follows: {
        Row: {
          id: string
          user_id: string
          pro_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pro_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pro_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
