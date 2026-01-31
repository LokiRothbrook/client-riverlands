export type UserRole = "admin" | "editor" | "viewer";

export type PostStatus = "draft" | "published" | "archived";

export type PartnerRequestStatus = "pending" | "approved" | "rejected";

export type EventStatus = "draft" | "published" | "cancelled";

export interface Database {
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
          meta_title?: string | null;
          meta_description?: string | null;
          display_order?: number;
        };
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
          status?: PostStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          published_at?: string | null;
        };
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
          start_date?: string;
          end_date?: string;
          impressions?: number;
          clicks?: number;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          counties_subscribed: string[];
          verified: boolean;
          verification_token: string | null;
          unsubscribe_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          counties_subscribed?: string[];
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          counties_subscribed?: string[];
          verified?: boolean;
          verification_token?: string | null;
        };
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
      };
    };
  };
}
