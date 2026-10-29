export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: number;
          metadata: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: never;
          metadata?: NonNullable<Json>;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: never;
          metadata?: NonNullable<Json>;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          archived_at: string | null;
          cover_media_id: string | null;
          created_at: string;
          description: string;
          id: string;
          is_demo: boolean;
          name: string;
          position: number;
          slug: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          archived_at?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_demo?: boolean;
          name: string;
          position?: number;
          slug: string;
          updated_at?: string;
        };
        Update: {
          archived_at?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_demo?: boolean;
          name?: string;
          position?: number;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_cover_media_fk";
            columns: ["cover_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          author_email_hash: string | null;
          author_name: string;
          body: string;
          created_at: string;
          id: string;
          ip_hash: string | null;
          moderated_at: string | null;
          moderated_by: string | null;
          parent_id: string | null;
          post_id: string;
          report_count: number;
          status: Database["public"]["Enums"]["comment_status"];
        };
        ComputedFields: never;
        Insert: {
          author_email_hash?: string | null;
          author_name: string;
          body: string;
          created_at?: string;
          id?: string;
          ip_hash?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          parent_id?: string | null;
          post_id: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["comment_status"];
        };
        Update: {
          author_email_hash?: string | null;
          author_name?: string;
          body?: string;
          created_at?: string;
          id?: string;
          ip_hash?: string | null;
          moderated_at?: string | null;
          moderated_by?: string | null;
          parent_id?: string | null;
          post_id?: string;
          report_count?: number;
          status?: Database["public"]["Enums"]["comment_status"];
        };
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          body: string;
          created_at: string;
          email: string;
          id: string;
          ip_hash: string | null;
          name: string;
          status: Database["public"]["Enums"]["message_status"];
          subject: string;
        };
        ComputedFields: never;
        Insert: {
          body: string;
          created_at?: string;
          email: string;
          id?: string;
          ip_hash?: string | null;
          name: string;
          status?: Database["public"]["Enums"]["message_status"];
          subject?: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string | null;
          name?: string;
          status?: Database["public"]["Enums"]["message_status"];
          subject?: string;
        };
        Relationships: [];
      };
      homepage_drafts: {
        Row: {
          id: boolean;
          sections: NonNullable<Json>;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          id?: boolean;
          sections: NonNullable<Json>;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: boolean;
          sections?: NonNullable<Json>;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          config: NonNullable<Json>;
          id: string;
          position: number;
          type: Database["public"]["Enums"]["homepage_section_type"];
          updated_at: string;
          visible: boolean;
        };
        ComputedFields: never;
        Insert: {
          config?: NonNullable<Json>;
          id?: string;
          position?: number;
          type: Database["public"]["Enums"]["homepage_section_type"];
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          config?: NonNullable<Json>;
          id?: string;
          position?: number;
          type?: Database["public"]["Enums"]["homepage_section_type"];
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt: string;
          caption: string;
          collection: string | null;
          created_at: string;
          credit: string;
          dominant_color: string | null;
          edit_params: Json | null;
          filename: string;
          focal_x: number;
          focal_y: number;
          height: number;
          id: string;
          is_demo: boolean;
          mime: string;
          original_id: string | null;
          size_bytes: number;
          storage_path: string;
          updated_at: string;
          uploaded_by: string | null;
          width: number;
        };
        ComputedFields: never;
        Insert: {
          alt?: string;
          caption?: string;
          collection?: string | null;
          created_at?: string;
          credit?: string;
          dominant_color?: string | null;
          edit_params?: Json | null;
          filename: string;
          focal_x?: number;
          focal_y?: number;
          height: number;
          id?: string;
          is_demo?: boolean;
          mime: string;
          original_id?: string | null;
          size_bytes: number;
          storage_path: string;
          updated_at?: string;
          uploaded_by?: string | null;
          width: number;
        };
        Update: {
          alt?: string;
          caption?: string;
          collection?: string | null;
          created_at?: string;
          credit?: string;
          dominant_color?: string | null;
          edit_params?: Json | null;
          filename?: string;
          focal_x?: number;
          focal_y?: number;
          height?: number;
          id?: string;
          is_demo?: boolean;
          mime?: string;
          original_id?: string | null;
          size_bytes?: number;
          storage_path?: string;
          updated_at?: string;
          uploaded_by?: string | null;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_original_id_fkey";
            columns: ["original_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      media_variants: {
        Row: {
          asset_id: string;
          format: Database["public"]["Enums"]["media_variant_format"];
          height: number;
          id: string;
          kind: Database["public"]["Enums"]["media_variant_kind"];
          path: string;
          size_bytes: number;
          width: number;
        };
        ComputedFields: never;
        Insert: {
          asset_id: string;
          format: Database["public"]["Enums"]["media_variant_format"];
          height: number;
          id?: string;
          kind: Database["public"]["Enums"]["media_variant_kind"];
          path: string;
          size_bytes: number;
          width: number;
        };
        Update: {
          asset_id?: string;
          format?: Database["public"]["Enums"]["media_variant_format"];
          height?: number;
          id?: string;
          kind?: Database["public"]["Enums"]["media_variant_kind"];
          path?: string;
          size_bytes?: number;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: "media_variants_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      navigation_items: {
        Row: {
          created_at: string;
          href: string;
          id: string;
          label: string;
          location: Database["public"]["Enums"]["nav_location"];
          open_in_new_tab: boolean;
          position: number;
          updated_at: string;
          visible: boolean;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          href: string;
          id?: string;
          label: string;
          location: Database["public"]["Enums"]["nav_location"];
          open_in_new_tab?: boolean;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          href?: string;
          id?: string;
          label?: string;
          location?: Database["public"]["Enums"]["nav_location"];
          open_in_new_tab?: boolean;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          confirmed_at: string | null;
          created_at: string;
          email: string;
          id: string;
          status: Database["public"]["Enums"]["subscriber_status"];
          token_hash: string;
          unsubscribed_at: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          status?: Database["public"]["Enums"]["subscriber_status"];
          token_hash: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          status?: Database["public"]["Enums"]["subscriber_status"];
          token_hash?: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      post_categories: {
        Row: {
          category_id: string;
          post_id: string;
        };
        ComputedFields: never;
        Insert: {
          category_id: string;
          post_id: string;
        };
        Update: {
          category_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_categories_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_media: {
        Row: {
          asset_id: string;
          post_id: string;
          role: Database["public"]["Enums"]["post_media_role"];
        };
        ComputedFields: never;
        Insert: {
          asset_id: string;
          post_id: string;
          role: Database["public"]["Enums"]["post_media_role"];
        };
        Update: {
          asset_id?: string;
          post_id?: string;
          role?: Database["public"]["Enums"]["post_media_role"];
        };
        Relationships: [
          {
            foreignKeyName: "post_media_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_media_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_revisions: {
        Row: {
          content: NonNullable<Json>;
          created_at: string;
          created_by: string | null;
          id: number;
          post_id: string;
          title: string;
        };
        ComputedFields: never;
        Insert: {
          content: NonNullable<Json>;
          created_at?: string;
          created_by?: string | null;
          id?: never;
          post_id: string;
          title: string;
        };
        Update: {
          content?: NonNullable<Json>;
          created_at?: string;
          created_by?: string | null;
          id?: never;
          post_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_revisions_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        ComputedFields: never;
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string | null;
          body_text: string;
          comments_enabled: boolean;
          content: NonNullable<Json>;
          cover_media_id: string | null;
          created_at: string;
          excerpt: string;
          featured: boolean;
          id: string;
          is_demo: boolean;
          location: string;
          mood: Database["public"]["Enums"]["story_mood"] | null;
          publish_at: string | null;
          reading_minutes: number;
          search: unknown;
          seo: NonNullable<Json>;
          show_toc: boolean;
          slug: string;
          status: Database["public"]["Enums"]["post_status"];
          subtitle: string;
          template: Database["public"]["Enums"]["post_template"];
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        ComputedFields: never;
        Insert: {
          author_id?: string | null;
          body_text?: string;
          comments_enabled?: boolean;
          content?: NonNullable<Json>;
          cover_media_id?: string | null;
          created_at?: string;
          excerpt?: string;
          featured?: boolean;
          id?: string;
          is_demo?: boolean;
          location?: string;
          mood?: Database["public"]["Enums"]["story_mood"] | null;
          publish_at?: string | null;
          reading_minutes?: number;
          search?: unknown;
          seo?: NonNullable<Json>;
          show_toc?: boolean;
          slug: string;
          status?: Database["public"]["Enums"]["post_status"];
          subtitle?: string;
          template?: Database["public"]["Enums"]["post_template"];
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          author_id?: string | null;
          body_text?: string;
          comments_enabled?: boolean;
          content?: NonNullable<Json>;
          cover_media_id?: string | null;
          created_at?: string;
          excerpt?: string;
          featured?: boolean;
          id?: string;
          is_demo?: boolean;
          location?: string;
          mood?: Database["public"]["Enums"]["story_mood"] | null;
          publish_at?: string | null;
          reading_minutes?: number;
          search?: unknown;
          seo?: NonNullable<Json>;
          show_toc?: boolean;
          slug?: string;
          status?: Database["public"]["Enums"]["post_status"];
          subtitle?: string;
          template?: Database["public"]["Enums"]["post_template"];
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_cover_media_fk";
            columns: ["cover_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_media_id: string | null;
          bio: string;
          created_at: string;
          display_name: string;
          id: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_media_id?: string | null;
          bio?: string;
          created_at?: string;
          display_name?: string;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_media_id?: string | null;
          bio?: string;
          created_at?: string;
          display_name?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_avatar_media_fk";
            columns: ["avatar_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limits: {
        Row: {
          hits: number;
          key: string;
          window_start: string;
        };
        ComputedFields: never;
        Insert: {
          hits?: number;
          key: string;
          window_start: string;
        };
        Update: {
          hits?: number;
          key?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      redirects: {
        Row: {
          created_at: string;
          from_slug: string;
          post_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          from_slug: string;
          post_id: string;
        };
        Update: {
          created_at?: string;
          from_slug?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "redirects_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          is_public: boolean;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          is_public?: boolean;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: NonNullable<Json>;
        };
        Update: {
          is_public?: boolean;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: NonNullable<Json>;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          is_demo: boolean;
          name: string;
          slug: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          granted_by: string | null;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          granted_by?: string | null;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          granted_by?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      build_post_search: {
        Args: {
          p_body: string;
          p_excerpt: string;
          p_id: string;
          p_location: string;
          p_subtitle: string;
          p_title: string;
        };
        Returns: unknown;
      };
      has_role: { Args: { min_role: Database["public"]["Enums"]["app_role"] }; Returns: boolean };
      hit_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
      is_media_public: { Args: { p_asset_id: string }; Returns: boolean };
      is_post_visible: {
        Args: { p_publish_at: string; p_status: Database["public"]["Enums"]["post_status"] };
        Returns: boolean;
      };
      is_valid_slug: { Args: { value: string }; Returns: boolean };
      log_audit: {
        Args: { p_action: string; p_entity_id?: string; p_entity_type: string; p_metadata?: Json };
        Returns: undefined;
      };
      media_published_references: {
        Args: { p_asset_id: string };
        Returns: {
          post_id: string;
          slug: string;
          title: string;
        }[];
      };
      refresh_post_search: { Args: { p_post_ids: string[] }; Returns: undefined };
    };
    Enums: {
      app_role: "editor" | "admin";
      comment_status: "pending" | "approved" | "rejected" | "spam";
      homepage_section_type:
        | "hero"
        | "intro"
        | "featured"
        | "latest"
        | "categories"
        | "photo_strip"
        | "quote"
        | "about"
        | "newsletter";
      media_variant_format: "avif" | "webp" | "jpeg";
      media_variant_kind: "thumb" | "sm" | "md" | "lg" | "og";
      message_status: "new" | "read" | "archived";
      nav_location: "header" | "footer";
      post_media_role: "cover" | "inline" | "gallery" | "og";
      post_status: "draft" | "scheduled" | "published" | "archived";
      post_template:
        | "cinematic"
        | "travel_journal"
        | "day_in_life"
        | "photo_essay"
        | "reflection"
        | "minimal"
        | "timeline";
      story_mood:
        | "joyful"
        | "dreamy"
        | "adventurous"
        | "mindful"
        | "nostalgic"
        | "reflective"
        | "cozy"
        | "bittersweet";
      subscriber_status: "pending" | "confirmed" | "unsubscribed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["editor", "admin"],
      comment_status: ["pending", "approved", "rejected", "spam"],
      homepage_section_type: [
        "hero",
        "intro",
        "featured",
        "latest",
        "categories",
        "photo_strip",
        "quote",
        "about",
        "newsletter",
      ],
      media_variant_format: ["avif", "webp", "jpeg"],
      media_variant_kind: ["thumb", "sm", "md", "lg", "og"],
      message_status: ["new", "read", "archived"],
      nav_location: ["header", "footer"],
      post_media_role: ["cover", "inline", "gallery", "og"],
      post_status: ["draft", "scheduled", "published", "archived"],
      post_template: [
        "cinematic",
        "travel_journal",
        "day_in_life",
        "photo_essay",
        "reflection",
        "minimal",
        "timeline",
      ],
      story_mood: [
        "joyful",
        "dreamy",
        "adventurous",
        "mindful",
        "nostalgic",
        "reflective",
        "cozy",
        "bittersweet",
      ],
      subscriber_status: ["pending", "confirmed", "unsubscribed"],
    },
  },
} as const;
