export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          contact_info: string | null
          created_at: string
          created_by: string | null
          date: string | null
          description: string
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          notes: string | null
          organizer: string | null
          status: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          description: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          notes?: string | null
          organizer?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          description?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          notes?: string | null
          organizer?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          is_read: boolean | null
          message: string
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          is_read?: boolean | null
          message: string
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          is_read?: boolean | null
          message?: string
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      content_reactions: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          reaction_type: string
          session_id: string
        }
        Insert: {
          content_id: string
          content_type?: string
          created_at?: string
          id?: string
          reaction_type?: string
          session_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          reaction_type?: string
          session_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          availability: string | null
          created_at: string
          description: string | null
          donation_type: string
          donor_name: string | null
          email: string | null
          id: string
          message: string | null
          phone: string | null
          quantity: string | null
          status: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          description?: string | null
          donation_type?: string
          donor_name?: string | null
          email?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          quantity?: string | null
          status?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          description?: string | null
          donation_type?: string
          donor_name?: string | null
          email?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          quantity?: string | null
          status?: string | null
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          category: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      library_content: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          id: string
          read_time: string | null
          thumbnail_url: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          read_time?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          read_time?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_notes: string | null
          attachments: string[] | null
          college: string
          contact_info: string
          created_at: string
          description: string
          id: string
          is_anonymous: boolean | null
          reporter_name: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          attachments?: string[] | null
          college: string
          contact_info: string
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean | null
          reporter_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          attachments?: string[] | null
          college?: string
          contact_info?: string
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean | null
          reporter_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      safety_surveys: {
        Row: {
          college: string | null
          created_at: string
          feels_safe: boolean | null
          harassed: boolean | null
          id: string
          knows_rights: boolean | null
          rating: number | null
        }
        Insert: {
          college?: string | null
          created_at?: string
          feels_safe?: boolean | null
          harassed?: boolean | null
          id?: string
          knows_rights?: boolean | null
          rating?: number | null
        }
        Update: {
          college?: string | null
          created_at?: string
          feels_safe?: boolean | null
          harassed?: boolean | null
          id?: string
          knows_rights?: boolean | null
          rating?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          birth_date: string | null
          college: string
          created_at: string
          department: string | null
          email: string | null
          gender: string | null
          id: string
          is_approved: boolean | null
          name: string
          national_id: string | null
          phone: string | null
          photo_url: string | null
          reason: string | null
          role_title: string | null
          skills: string | null
          status: string | null
          volunteer_section: string | null
        }
        Insert: {
          birth_date?: string | null
          college: string
          created_at?: string
          department?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          national_id?: string | null
          phone?: string | null
          photo_url?: string | null
          reason?: string | null
          role_title?: string | null
          skills?: string | null
          status?: string | null
          volunteer_section?: string | null
        }
        Update: {
          birth_date?: string | null
          college?: string
          created_at?: string
          department?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          national_id?: string | null
          phone?: string | null
          photo_url?: string | null
          reason?: string | null
          role_title?: string | null
          skills?: string | null
          status?: string | null
          volunteer_section?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "moderator"
        | "editor"
        | "viewer"
        | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "moderator",
        "editor",
        "viewer",
        "user",
      ],
    },
  },
} as const
