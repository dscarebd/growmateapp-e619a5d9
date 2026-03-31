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
      advertiser_reviews: {
        Row: {
          advertiser_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          reviewer_id: string
          submission_id: string
          task_id: string
        }
        Insert: {
          advertiser_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          reviewer_id: string
          submission_id: string
          task_id: string
        }
        Update: {
          advertiser_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          submission_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "task_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertiser_reviews_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
      payment_methods: {
        Row: {
          created_at: string
          detail: string
          icon_url: string | null
          id: string
          instructions: string
          is_active: boolean
          name: string
          note: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail?: string
          icon_url?: string | null
          id?: string
          instructions?: string
          is_active?: boolean
          name: string
          note?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          detail?: string
          icon_url?: string | null
          id?: string
          instructions?: string
          is_active?: boolean
          name?: string
          note?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          campaigns_run: number
          created_at: string
          credits: number
          device_fingerprint: string | null
          email: string
          id: string
          joined_date: string
          name: string
          referral_bonus_awarded: boolean
          referral_code: string
          referred_by: string | null
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
          device_fingerprint?: string | null
          email?: string
          id: string
          joined_date?: string
          name?: string
          referral_bonus_awarded?: boolean
          referral_code?: string
          referred_by?: string | null
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
          device_fingerprint?: string | null
          email?: string
          id?: string
          joined_date?: string
          name?: string
          referral_bonus_awarded?: boolean
          referral_code?: string
          referred_by?: string | null
          tasks_completed?: number
          total_earned?: number
          trust_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      referral_bonuses: {
        Row: {
          bonus_amount: number
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
          trigger_type: string
        }
        Insert: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
          trigger_type: string
        }
        Update: {
          bonus_amount?: number
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          trigger_type?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      task_submissions: {
        Row: {
          advertiser_id: string
          id: string
          proof_images: string[] | null
          proof_text: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string
          task_id: string
          user_id: string
        }
        Insert: {
          advertiser_id: string
          id?: string
          proof_images?: string[] | null
          proof_text?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          task_id: string
          user_id: string
        }
        Update: {
          advertiser_id?: string
          id?: string
          proof_images?: string[] | null
          proof_text?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
          proof_requirements: string | null
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
          proof_requirements?: string | null
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
          proof_requirements?: string | null
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
      approve_submission: {
        Args: { _submission_id: string }
        Returns: undefined
      }
      award_referral_bonus: {
        Args: { _trigger: string; _user_id: string }
        Returns: undefined
      }
      check_device_fingerprint: {
        Args: { _fingerprint: string }
        Returns: boolean
      }
      get_min_campaign_budget_referral: { Args: never; Returns: number }
      get_referral_bonus_amount: { Args: never; Returns: number }
      get_usd_to_bdt_rate: { Args: never; Returns: number }
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
        | "app_download"
        | "website_visit"
      submission_status: "pending" | "approved" | "rejected"
      task_action:
        | "like"
        | "follow"
        | "subscribe"
        | "share"
        | "comment"
        | "view"
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
        "app_download",
        "website_visit",
      ],
      submission_status: ["pending", "approved", "rejected"],
      task_action: ["like", "follow", "subscribe", "share", "comment", "view"],
      transaction_type: ["earned", "spent", "purchased", "withdrawn"],
      withdrawal_status: ["pending", "approved", "rejected", "processing"],
    },
  },
} as const
