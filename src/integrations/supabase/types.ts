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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          action: Database["public"]["Enums"]["task_action"]
          completed_actions: number
          created_at: string
          estimated_reach: number
          id: string
          link: string
          platform: Database["public"]["Enums"]["platform_type"]
          reward_per_action: number
          status: Database["public"]["Enums"]["campaign_status"]
          title: string
          total_budget: number
          updated_at: string
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["task_action"]
          completed_actions?: number
          created_at?: string
          estimated_reach?: number
          id?: string
          link: string
          platform: Database["public"]["Enums"]["platform_type"]
          reward_per_action: number
          status?: Database["public"]["Enums"]["campaign_status"]
          title: string
          total_budget: number
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["task_action"]
          completed_actions?: number
          created_at?: string
          estimated_reach?: number
          id?: string
          link?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          reward_per_action?: number
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: string
          total_budget?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      manual_payments: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string | null
          id: string
          method: string
          notes: string | null
          status: string
          transaction_ref: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string | null
          id?: string
          method?: string
          notes?: string | null
          status?: string
          transaction_ref?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string | null
          id?: string
          method?: string
          notes?: string | null
          status?: string
          transaction_ref?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          icon: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          campaigns_run: number
          created_at: string
          credits: number
          email: string
          id: string
          joined_date: string
          name: string
          referral_code: string
          tasks_completed: number
          total_earned: number
          trust_score: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          campaigns_run?: number
          created_at?: string
          credits?: number
          email?: string
          id: string
          joined_date?: string
          name?: string
          referral_code?: string
          tasks_completed?: number
          total_earned?: number
          trust_score?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          campaigns_run?: number
          created_at?: string
          credits?: number
          email?: string
          id?: string
          joined_date?: string
          name?: string
          referral_code?: string
          tasks_completed?: number
          total_earned?: number
          trust_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          action: Database["public"]["Enums"]["task_action"]
          advertiser: string
          completed_count: number
          created_at: string
          description: string
          id: string
          is_high_reward: boolean
          link: string
          platform: Database["public"]["Enums"]["platform_type"]
          reward: number
          title: string
          total_slots: number
          updated_at: string
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["task_action"]
          advertiser?: string
          completed_count?: number
          created_at?: string
          description?: string
          id?: string
          is_high_reward?: boolean
          link: string
          platform: Database["public"]["Enums"]["platform_type"]
          reward?: number
          title: string
          total_slots?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["task_action"]
          advertiser?: string
          completed_count?: number
          created_at?: string
          description?: string
          id?: string
          is_high_reward?: boolean
          link?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          reward?: number
          title?: string
          total_slots?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          platform: Database["public"]["Enums"]["platform_type"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          commission: number
          id: string
          method: string
          net_amount: number
          requested_at: string
          status: Database["public"]["Enums"]["withdrawal_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          commission?: number
          id?: string
          method?: string
          net_amount?: number
          requested_at?: string
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          commission?: number
          id?: string
          method?: string
          net_amount?: number
          requested_at?: string
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      campaign_status: "active" | "paused" | "completed" | "pending"
      platform_type:
        | "youtube"
        | "instagram"
        | "tiktok"
        | "facebook"
        | "twitter"
        | "telegram"
      task_action: "like" | "follow" | "subscribe" | "share" | "comment"
      transaction_type: "earned" | "spent" | "purchased" | "withdrawn"
      withdrawal_status: "pending" | "approved" | "rejected" | "processing"
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
      campaign_status: ["active", "paused", "completed", "pending"],
      platform_type: [
        "youtube",
        "instagram",
        "tiktok",
        "facebook",
        "twitter",
        "telegram",
      ],
      task_action: ["like", "follow", "subscribe", "share", "comment"],
      transaction_type: ["earned", "spent", "purchased", "withdrawn"],
      withdrawal_status: ["pending", "approved", "rejected", "processing"],
    },
  },
} as const
