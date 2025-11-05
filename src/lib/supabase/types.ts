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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
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
          prompt: string | null;
          style: string | null;
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
          prompt?: string | null;
          style?: string | null;
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
          prompt?: string | null;
          style?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Image = Database['public']['Tables']['images']['Row'];
