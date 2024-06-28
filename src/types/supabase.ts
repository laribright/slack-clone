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
      channels: {
        Row: {
          id: string
          members: string[] | null
          name: string
          regulators: string[] | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          members?: string[] | null
          name: string
          regulators?: string[] | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          members?: string[] | null
          name?: string
          regulators?: string[] | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string | null
          created_at: string
          file_url: string | null
          id: number
          is_deleted: boolean
          updated_at: string
          user: string
          user_one: string
          user_two: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: number
          is_deleted?: boolean
          updated_at?: string
          user: string
          user_one: string
          user_two: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: number
          is_deleted?: boolean
          updated_at?: string
          user?: string
          user_one?: string
          user_two?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_message_user_one_fkey"
            columns: ["user_one"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_message_user_two_fkey"
            columns: ["user_two"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string | null
          created_at: string
          file_url: string | null
          id: string
          is_deleted: boolean
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          channel_id: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          channel_id?: string
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string
          channels: string[] | null
          created_at: string | null
          email: string
          id: string
          is_away: boolean
          name: string | null
          phone: string | null
          type: string | null
          workspaces: string[] | null
        }
        Insert: {
          avatar_url: string
          channels?: string[] | null
          created_at?: string | null
          email: string
          id: string
          is_away?: boolean
          name?: string | null
          phone?: string | null
          type?: string | null
          workspaces?: string[] | null
        }
        Update: {
          avatar_url?: string
          channels?: string[] | null
          created_at?: string | null
          email?: string
          id?: string
          is_away?: boolean
          name?: string | null
          phone?: string | null
          type?: string | null
          workspaces?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          channels: string[] | null
          created_at: string
          id: string
          image_url: string | null
          invite_code: string
          members: string[] | null
          name: string
          regulators: string[] | null
          slug: string
          super_admin: string
        }
        Insert: {
          channels?: string[] | null
          created_at?: string
          id?: string
          image_url?: string | null
          invite_code: string
          members?: string[] | null
          name: string
          regulators?: string[] | null
          slug: string
          super_admin?: string
        }
        Update: {
          channels?: string[] | null
          created_at?: string
          id?: string
          image_url?: string | null
          invite_code?: string
          members?: string[] | null
          name?: string
          regulators?: string[] | null
          slug?: string
          super_admin?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_super_admin_fkey"
            columns: ["super_admin"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_channel_to_workspace: {
        Args: {
          channel_id: string
          workspace_id: string
        }
        Returns: undefined
      }
      add_member_to_workspace: {
        Args: {
          user_id: string
          workspace_id: string
        }
        Returns: undefined
      }
      add_workspace_to_user: {
        Args: {
          user_id: string
          new_workspace: string
        }
        Returns: undefined
      }
      update_channel_members: {
        Args: {
          new_member: string
          channel_id: string
        }
        Returns: undefined
      }
      update_channel_regulators: {
        Args: {
          new_regulator: string
          channel_id: string
        }
        Returns: undefined
      }
      update_user_channels: {
        Args: {
          user_id: string
          channel_id: string
        }
        Returns: undefined
      }
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
