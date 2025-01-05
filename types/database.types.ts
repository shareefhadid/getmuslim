export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          icon: string | null
          id: number
          label: string
        }
        Insert: {
          icon?: string | null
          id?: number
          label: string
        }
        Update: {
          icon?: string | null
          id?: number
          label?: string
        }
        Relationships: []
      }
      link_types: {
        Row: {
          icon: string | null
          id: number
          label: string
          prefix: string | null
        }
        Insert: {
          icon?: string | null
          id?: number
          label: string
          prefix?: string | null
        }
        Update: {
          icon?: string | null
          id?: number
          label?: string
          prefix?: string | null
        }
        Relationships: []
      }
      posting_categories: {
        Row: {
          category_id: number
          id: number
          posting_id: number
        }
        Insert: {
          category_id: number
          id?: number
          posting_id: number
        }
        Update: {
          category_id?: number
          id?: number
          posting_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "posting_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posting_categories_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
        ]
      }
      posting_links: {
        Row: {
          created_at: string
          id: number
          link_type_id: number
          posting_id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          link_type_id: number
          posting_id: number
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          link_type_id?: number
          posting_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "posting_links_link_type_id_fkey"
            columns: ["link_type_id"]
            isOneToOne: false
            referencedRelation: "link_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posting_links_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
        ]
      }
      posting_media: {
        Row: {
          created_at: string
          id: number
          media_type: Database["public"]["Enums"]["media_type_enum"]
          posting_id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_type?: Database["public"]["Enums"]["media_type_enum"]
          posting_id: number
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          media_type?: Database["public"]["Enums"]["media_type_enum"]
          posting_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "posting_media_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
        ]
      }
      postings: {
        Row: {
          address: string
          created_at: string
          description: string
          featured_image: string | null
          id: number
          location: unknown
          show_address: boolean
          status: Database["public"]["Enums"]["posting_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          featured_image?: string | null
          id?: number
          location: unknown
          show_address?: boolean
          status?: Database["public"]["Enums"]["posting_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          featured_image?: string | null
          id?: number
          location?: unknown
          show_address?: boolean
          status?: Database["public"]["Enums"]["posting_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_postings: {
        Args: {
          lat: number
          long: number
          max_distance?: number
          category?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number
          created_at: string
          title: string
          description: string
          address: string
          featured_image: string
          distance: number
          categories: Json[]
          links: Json[]
          media: Json[]
        }[]
      }
      get_posting_data: {
        Args: {
          posting_id: number
        }
        Returns: Json
      }
      get_posting_details: {
        Args: {
          posting_ids: number[]
        }
        Returns: {
          posting_id: number
          categories: Json[]
          links: Json[]
          media: Json[]
        }[]
      }
      get_recent_postings: {
        Args: {
          lat?: number
          long?: number
          category?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number
          created_at: string
          title: string
          description: string
          address: string
          featured_image: string
          distance: number
          categories: Json[]
          links: Json[]
          media: Json[]
        }[]
      }
    }
    Enums: {
      media_type_enum: "image" | "video"
      posting_status: "active" | "inactive" | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
