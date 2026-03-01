export type UserRole = "admin" | "editor" | "viewer";

export type PostStatus = "draft" | "published" | "archived";

export type PartnerRequestStatus = "pending" | "approved" | "rejected";

export type EventStatus = "draft" | "published" | "cancelled";

export type NewsletterFrequency = "weekly" | "biweekly" | "monthly";

export type NewsletterTopic = "events" | "business_news";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          assigned_counties: string[];
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          assigned_counties?: string[];
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          assigned_counties?: string[];
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      counties: {
        Row: {
          id: string;
          name: string;
          slug: string;
          seat: string;
          description: string;
          short_description: string;
          hero_image: string | null;
          lat: number | null;
          lng: number | null;
          meta_title: string | null;
          meta_description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          seat: string;
          description: string;
          short_description: string;
          hero_image?: string | null;
          lat?: number | null;
          lng?: number | null;
          meta_title?: string | null;
          meta_description?: string | null;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          seat?: string;
          description?: string;
          short_description?: string;
          hero_image?: string | null;
          lat?: number | null;
          lng?: number | null;
          meta_title?: string | null;
          meta_description?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image: string | null;
          county_id: string;
          author_id: string;
          category_id: string;
          is_featured: boolean;
          show_cover_image: boolean;
          status: PostStatus;
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image?: string | null;
          county_id: string;
          author_id: string;
          category_id: string;
          is_featured?: boolean;
          show_cover_image?: boolean;
          status?: PostStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          featured_image?: string | null;
          county_id?: string;
          category_id?: string;
          is_featured?: boolean;
          show_cover_image?: boolean;
          status?: PostStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_county_id_fkey";
            columns: ["county_id"];
            isOneToOne: false;
            referencedRelation: "counties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          location: string;
          county_id: string;
          category: string;
          status: EventStatus;
          start_date: string;
          end_date: string | null;
          recurring: string | null;
          external_link: string | null;
          featured_image: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          location: string;
          county_id: string;
          category?: string;
          status?: EventStatus;
          start_date: string;
          end_date?: string | null;
          recurring?: string | null;
          external_link?: string | null;
          featured_image?: string | null;
          created_by: string;
        };
        Update: {
          title?: string;
          description?: string;
          location?: string;
          county_id?: string;
          category?: string;
          status?: EventStatus;
          start_date?: string;
          end_date?: string | null;
          recurring?: string | null;
          external_link?: string | null;
          featured_image?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_county_id_fkey";
            columns: ["county_id"];
            isOneToOne: false;
            referencedRelation: "counties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      partners: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          logo: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          county_id: string;
          category: string;
          is_featured: boolean;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description: string;
          logo?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          county_id: string;
          category: string;
          is_featured?: boolean;
          status?: "active" | "inactive";
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          logo?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          county_id?: string;
          category?: string;
          is_featured?: boolean;
          status?: "active" | "inactive";
        };
        Relationships: [
          {
            foreignKeyName: "partners_county_id_fkey";
            columns: ["county_id"];
            isOneToOne: false;
            referencedRelation: "counties";
            referencedColumns: ["id"];
          },
        ];
      };
      partner_requests: {
        Row: {
          id: string;
          business_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          website: string | null;
          address: string | null;
          county_id: string;
          category: string;
          description: string;
          additional_info: string | null;
          status: PartnerRequestStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          business_name: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          address?: string | null;
          county_id: string;
          category: string;
          description: string;
          additional_info?: string | null;
        };
        Update: {
          status?: PartnerRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "partner_requests_county_id_fkey";
            columns: ["county_id"];
            isOneToOne: false;
            referencedRelation: "counties";
            referencedColumns: ["id"];
          },
        ];
      };
      ad_placements: {
        Row: {
          id: string;
          business_name: string;
          image_url: string;
          link_url: string;
          placement_zone: string;
          county_id: string | null;
          is_active: boolean;
          priority: number;
          start_date: string;
          end_date: string;
          impressions: number;
          clicks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          business_name: string;
          image_url: string;
          link_url: string;
          placement_zone: string;
          county_id?: string | null;
          is_active?: boolean;
          priority?: number;
          start_date: string;
          end_date: string;
        };
        Update: {
          business_name?: string;
          image_url?: string;
          link_url?: string;
          placement_zone?: string;
          county_id?: string | null;
          is_active?: boolean;
          priority?: number;
          start_date?: string;
          end_date?: string;
          impressions?: number;
          clicks?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ad_placements_county_id_fkey";
            columns: ["county_id"];
            isOneToOne: false;
            referencedRelation: "counties";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          counties_subscribed: string[];
          topics_subscribed: string[];
          frequency: NewsletterFrequency;
          verified: boolean;
          verification_token: string | null;
          unsubscribe_token: string;
          manage_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          counties_subscribed?: string[];
          topics_subscribed?: string[];
          frequency?: NewsletterFrequency;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          counties_subscribed?: string[];
          topics_subscribed?: string[];
          frequency?: NewsletterFrequency;
          verified?: boolean;
          verification_token?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
        };
        Update: {
          read?: boolean;
          archived?: boolean;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          url: string;
          public_id: string;
          filename: string;
          width: number | null;
          height: number | null;
          size_bytes: number | null;
          format: string | null;
          folder: string;
          alt_text: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          url: string;
          public_id: string;
          filename: string;
          width?: number | null;
          height?: number | null;
          size_bytes?: number | null;
          format?: string | null;
          folder?: string;
          alt_text?: string | null;
          uploaded_by: string;
        };
        Update: {
          alt_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          description: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: string;
          description?: string | null;
        };
        Update: {
          value?: string;
          description?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      post_status: PostStatus;
      event_status: EventStatus;
      partner_request_status: PartnerRequestStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
