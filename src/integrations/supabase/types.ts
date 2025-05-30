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
      cart_items: {
        Row: {
          color: string | null
          created_at: string | null
          customization_details: string | null
          customized: boolean | null
          id: string
          image_url: string
          name: string
          price: number
          product_id: string
          quantity: number
          size: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url: string
          name: string
          price: number
          product_id: string
          quantity?: number
          size?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url?: string
          name?: string
          price?: number
          product_id?: string
          quantity?: number
          size?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          customization_details: string | null
          customized: boolean | null
          id: string
          image_url: string
          name: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url: string
          name: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url?: string
          name?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          estimated_delivery: string | null
          id: string
          payment_method: string
          shipping_info: Json
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          payment_method: string
          shipping_info: Json
          status?: string
          total: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          payment_method?: string
          shipping_info?: Json
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          colors: Json | null
          created_at: string | null
          description: string
          id: string
          image_url: string
          in_stock: boolean | null
          is_customizable: boolean | null
          name: string
          original_price: number | null
          price: number
          quantity: number | null
          rating: number | null
          review_count: number | null
          sizes: Json | null
        }
        Insert: {
          category: string
          colors?: Json | null
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          in_stock?: boolean | null
          is_customizable?: boolean | null
          name: string
          original_price?: number | null
          price: number
          quantity?: number | null
          rating?: number | null
          review_count?: number | null
          sizes?: Json | null
        }
        Update: {
          category?: string
          colors?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          in_stock?: boolean | null
          is_customizable?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          quantity?: number | null
          rating?: number | null
          review_count?: number | null
          sizes?: Json | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          color: string | null
          created_at: string | null
          customization_details: string | null
          customized: boolean | null
          id: string
          image_url: string
          name: string
          price: number
          product_id: string
          size: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url: string
          name: string
          price: number
          product_id: string
          size?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          customization_details?: string | null
          customized?: boolean | null
          id?: string
          image_url?: string
          name?: string
          price?: number
          product_id?: string
          size?: string | null
          user_id?: string
        }
        Relationships: []
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
