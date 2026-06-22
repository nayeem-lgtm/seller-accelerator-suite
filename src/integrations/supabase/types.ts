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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_user_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          admin_email: string | null
          admin_user_id: string | null
          created_at: string
          id: string
          note: string
          target_id: string
          target_table: string
        }
        Insert: {
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          id?: string
          note: string
          target_id: string
          target_table: string
        }
        Update: {
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          id?: string
          note?: string
          target_id?: string
          target_table?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          created_by: string | null
          is_active: boolean
          level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          is_active?: boolean
          level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          is_active?: boolean
          level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_leads: {
        Row: {
          conversation_snippet: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          phone: string | null
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          conversation_snippet?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          conversation_snippet?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          phone?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_credentials: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          city: string
          country: string
          created_at: string
          email: string
          full_business_address: string | null
          full_name: string
          id: string
          marketplace_platform: string
          notes: string | null
          phone_country_code: string
          phone_number: string
          seller_account_status: string | null
          state: string
          status: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          city: string
          country: string
          created_at?: string
          email: string
          full_business_address?: string | null
          full_name: string
          id?: string
          marketplace_platform: string
          notes?: string | null
          phone_country_code: string
          phone_number: string
          seller_account_status?: string | null
          state: string
          status?: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          city?: string
          country?: string
          created_at?: string
          email?: string
          full_business_address?: string | null
          full_name?: string
          id?: string
          marketplace_platform?: string
          notes?: string | null
          phone_country_code?: string
          phone_number?: string
          seller_account_status?: string | null
          state?: string
          status?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      contact_queries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone_country_code: string
          phone_number: string
          query_type: string | null
          selected_service: string | null
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone_country_code: string
          phone_number: string
          query_type?: string | null
          selected_service?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone_country_code?: string
          phone_number?: string
          query_type?: string | null
          selected_service?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          agreed_authorization: boolean
          agreed_terms: boolean
          branch: string
          business_credentials_id: string | null
          client_email: string | null
          client_name: string
          created_at: string
          id: string
          plan_selection_id: string | null
          platforms: string[]
          signature_data_url: string
          signed_at: string
          signed_ip: string | null
          status: string
          total_amount: number
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          agreed_authorization?: boolean
          agreed_terms?: boolean
          branch: string
          business_credentials_id?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          id?: string
          plan_selection_id?: string | null
          platforms: string[]
          signature_data_url: string
          signed_at?: string
          signed_ip?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          agreed_authorization?: boolean
          agreed_terms?: boolean
          branch?: string
          business_credentials_id?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          id?: string
          plan_selection_id?: string | null
          platforms?: string[]
          signature_data_url?: string
          signed_at?: string
          signed_ip?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_business_credentials_id_fkey"
            columns: ["business_credentials_id"]
            isOneToOne: false
            referencedRelation: "business_credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_plan_selection_id_fkey"
            columns: ["plan_selection_id"]
            isOneToOne: false
            referencedRelation: "plan_selections"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          contract_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          payment_method: string
          payment_status: string
          plan_selection_id: string | null
          platforms: string[]
          reference_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_email?: string | null
          client_name: string
          contract_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method: string
          payment_status?: string
          plan_selection_id?: string | null
          platforms: string[]
          reference_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          contract_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: string
          plan_selection_id?: string | null
          platforms?: string[]
          reference_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_plan_selection_id_fkey"
            columns: ["plan_selection_id"]
            isOneToOne: false
            referencedRelation: "plan_selections"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_selections: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          payment_choice: string
          phone_country_code: string
          phone_number: string
          plan_selected: string
          platform_selected: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          payment_choice: string
          phone_country_code: string
          phone_number: string
          plan_selected: string
          platform_selected: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          payment_choice?: string
          phone_country_code?: string
          phone_number?: string
          plan_selected?: string
          platform_selected?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_status: string
          payment_status: string
          phone: string | null
          selected_marketplace: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_status?: string
          payment_status?: string
          phone?: string | null
          selected_marketplace?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_status?: string
          payment_status?: string
          phone?: string | null
          selected_marketplace?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      status_history: {
        Row: {
          admin_email: string | null
          admin_user_id: string | null
          created_at: string
          from_status: string | null
          id: string
          target_id: string
          target_table: string
          to_status: string
        }
        Insert: {
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          target_id: string
          target_table: string
          to_status: string
        }
        Update: {
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          target_id?: string
          target_table?: string
          to_status?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_level: { Args: { _uid: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: { _uid: string }; Returns: boolean }
      submit_ai_lead: {
        Args: {
          p_email: string
          p_message: string
          p_name: string
          p_phone: string
          p_snippet: string
          p_source_page: string
        }
        Returns: string
      }
      submit_contact_query: {
        Args: {
          p_country_code: string
          p_email: string
          p_full_name: string
          p_marketplace: string
          p_message: string
          p_phone: string
          p_query_type: string
          p_source_page: string
        }
        Returns: string
      }
      submit_onboarding: { Args: { p: Json }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user"
      lead_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "completed"
        | "rejected"
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
      app_role: ["admin", "user"],
      lead_status: ["new", "contacted", "in_progress", "completed", "rejected"],
    },
  },
} as const
