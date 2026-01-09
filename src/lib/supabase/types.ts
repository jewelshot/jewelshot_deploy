/**
 * Supabase Database Types
 * Auto-generated types for type-safe database queries
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_plan: string | null;
          subscription_status: string | null;
          subscription_renewal_date: string | null;
          creem_customer_id: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_plan?: string | null;
          subscription_status?: string | null;
          subscription_renewal_date?: string | null;
          creem_customer_id?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_plan?: string | null;
          subscription_status?: string | null;
          subscription_renewal_date?: string | null;
          creem_customer_id?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      subscription_history: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          action: string;
          credits_granted: number;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          action: string;
          credits_granted?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          action?: string;
          credits_granted?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      images: {
        Row: {
          id: string;
          user_id: string;
          original_url: string;
          generated_url: string;
          name: string;
          size: number;
          file_type: string | null;
          prompt: string | null;
          style: string | null;
          preset_id: string | null;
          preset_name: string | null;
          batch_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_url: string;
          generated_url: string;
          name: string;
          size: number;
          file_type?: string | null;
          prompt?: string | null;
          style?: string | null;
          preset_id?: string | null;
          preset_name?: string | null;
          batch_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_url?: string;
          generated_url?: string;
          name?: string;
          size?: number;
          file_type?: string | null;
          prompt?: string | null;
          style?: string | null;
          preset_id?: string | null;
          preset_name?: string | null;
          batch_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Image = Database['public']['Tables']['images']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
