export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          icon: string | null
          id: number
          label: string
          search_text: unknown | null
        }
        Insert: {
          icon?: string | null
          id?: number
          label: string
          search_text?: unknown | null
        }
        Update: {
          icon?: string | null
          id?: number
          label?: string
          search_text?: unknown | null
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
          email: string | null
          featured_image: string | null
          google_maps: string | null
          id: number
          location: unknown
          phone: string | null
          search_text: unknown | null
          show_address: boolean
          status: Database["public"]["Enums"]["posting_status"]
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          email?: string | null
          featured_image?: string | null
          google_maps?: string | null
          id?: number
          location: unknown
          phone?: string | null
          search_text?: unknown | null
          show_address?: boolean
          status?: Database["public"]["Enums"]["posting_status"]
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          email?: string | null
          featured_image?: string | null
          google_maps?: string | null
          id?: number
          location?: unknown
          phone?: string | null
          search_text?: unknown | null
          show_address?: boolean
          status?: Database["public"]["Enums"]["posting_status"]
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_postings_v7: {
        Args: {
          lat: number
          long: number
          max_distance?: number
          category?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          rows: Json[]
          total: number
        }[]
      }
      get_nearby_postings_v8: {
        Args: {
          lat: number
          long: number
          max_distance?: number
          category?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          rows: Json[]
          total: number
        }[]
      }
      get_posting: {
        Args: { posting_id: number; lat?: number; long?: number }
        Returns: {
          id: number
          created_at: string
          updated_at: string
          title: string
          description: string
          address: string
          featured_image: string
          distance: number
          status: Database["public"]["Enums"]["posting_status"]
          categories: Database["public"]["CompositeTypes"]["category_detail"][]
          links: Database["public"]["CompositeTypes"]["link_detail"][]
          media: Database["public"]["CompositeTypes"]["media_detail"][]
        }[]
      }
      get_posting_data: {
        Args: { posting_id: number }
        Returns: {
          id: number
          title: string
          description: string
          lat: number
          long: number
          categories: Database["public"]["CompositeTypes"]["category_detail"][]
          media: Database["public"]["CompositeTypes"]["media_detail"][]
          links: Database["public"]["CompositeTypes"]["link_detail"][]
        }[]
      }
      get_posting_details: {
        Args: { posting_ids: number[] }
        Returns: {
          posting_id: number
          categories: Database["public"]["CompositeTypes"]["category_detail"][]
          links: Database["public"]["CompositeTypes"]["link_detail"][]
          media: Database["public"]["CompositeTypes"]["media_detail"][]
        }[]
      }
      get_posting_v2: {
        Args: { posting_id: number; lat?: number; long?: number }
        Returns: {
          id: number
          created_at: string
          updated_at: string
          title: string
          description: string
          address: string
          featured_image: string
          distance: number
          status: Database["public"]["Enums"]["posting_status"]
          website: string
          email: string
          phone: string
          google_maps: string
          categories: Json
        }[]
      }
      get_recent_postings_v7: {
        Args: {
          lat?: number
          long?: number
          category?: number
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          rows: Json[]
          total: number
        }[]
      }
      insert_posting: {
        Args: {
          title: string
          description: string
          lat: number
          long: number
          address: string
          category_ids?: number[]
          featured_image?: string
          website?: string
          email?: string
          phone?: string
          google_maps?: string
          show_address?: boolean
          status?: Database["public"]["Enums"]["posting_status"]
        }
        Returns: number
      }
      search_content: {
        Args: { search_query: string }
        Returns: {
          categories: Json
          postings: Json
        }[]
      }
    }
    Enums: {
      media_type_enum: "image" | "video"
      posting_status: "active" | "inactive" | "deleted"
    }
    CompositeTypes: {
      category_detail: {
        id: number | null
        label: string | null
        icon: string | null
      }
      link_detail: {
        id: number | null
        url: string | null
        type: Database["public"]["CompositeTypes"]["link_type_detail"] | null
      }
      link_type_detail: {
        id: number | null
        label: string | null
        icon: string | null
        prefix: string | null
      }
      media_detail: {
        id: number | null
        url: string | null
        media_type: Database["public"]["Enums"]["media_type_enum"] | null
      }
      paginated_postings: {
        rows: Database["public"]["CompositeTypes"]["posting_details"][] | null
        count: number | null
      }
      posting_details: {
        id: number | null
        created_at: string | null
        updated_at: string | null
        title: string | null
        description: string | null
        address: string | null
        featured_image: string | null
        distance: number | null
        status: Database["public"]["Enums"]["posting_status"] | null
        categories:
          | Database["public"]["CompositeTypes"]["category_detail"][]
          | null
        links: Database["public"]["CompositeTypes"]["link_detail"][] | null
        media: Database["public"]["CompositeTypes"]["media_detail"][] | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      media_type_enum: ["image", "video"],
      posting_status: ["active", "inactive", "deleted"],
    },
  },
} as const
