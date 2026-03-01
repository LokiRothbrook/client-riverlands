-- =============================================================
-- Riverlands Database Schema
-- Run this in the Supabase SQL Editor to set up the database
-- =============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================================
-- ENUMS
-- =============================================================

create type user_role as enum ('admin', 'editor', 'viewer');
create type post_status as enum ('draft', 'published', 'archived');
create type partner_request_status as enum ('pending', 'approved', 'rejected');
create type event_status as enum ('draft', 'published', 'cancelled');
create type partner_status as enum ('active', 'inactive');

-- =============================================================
-- TABLES
-- =============================================================

-- Profiles (extends Supabase Auth users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'viewer',
  assigned_counties text[] not null default '{}',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Counties
create table counties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  seat text not null,
  description text not null,
  short_description text not null,
  hero_image text,
  lat double precision,
  lng double precision,
  meta_title text,
  meta_description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index counties_slug_idx on counties(slug);

-- Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index categories_slug_idx on categories(slug);

-- Posts
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null,
  content text not null,
  excerpt text not null,
  featured_image text,
  county_id uuid not null references counties(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  is_featured boolean not null default false,
  show_cover_image boolean not null default true,
  status post_status not null default 'draft',
  meta_title text,
  meta_description text,
  og_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(county_id, slug)
);

create index posts_county_idx on posts(county_id);
create index posts_author_idx on posts(author_id);
create index posts_category_idx on posts(category_id);
create index posts_status_idx on posts(status);
create index posts_published_at_idx on posts(published_at desc);
create index posts_slug_idx on posts(slug);
create index posts_featured_idx on posts(is_featured) where is_featured = true;

-- Events
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  location text not null,
  county_id uuid not null references counties(id) on delete cascade,
  category text not null default 'general',
  status event_status not null default 'draft',
  start_date timestamptz not null,
  end_date timestamptz,
  recurring text, -- 'weekly', 'monthly', 'annual', or null
  external_link text,
  featured_image text,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_county_idx on events(county_id);
create index events_start_date_idx on events(start_date);
create index events_status_idx on events(status);

-- Partners (approved business listings)
create table partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null,
  logo text,
  website text,
  email text,
  phone text,
  address text,
  county_id uuid not null references counties(id) on delete cascade,
  category text not null,
  is_featured boolean not null default false,
  status partner_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partners_county_idx on partners(county_id);
create index partners_slug_idx on partners(slug);
create index partners_featured_idx on partners(is_featured) where is_featured = true;

-- Partner Requests (self-service submissions)
create table partner_requests (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  website text,
  address text,
  county_id uuid not null references counties(id) on delete cascade,
  category text not null,
  description text not null,
  additional_info text,
  status partner_request_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index partner_requests_status_idx on partner_requests(status);

-- Ad Placements
create table ad_placements (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  image_url text not null,
  link_url text not null,
  placement_zone text not null, -- 'homepage_banner', 'county_sidebar', 'post_inline', 'footer'
  county_id uuid references counties(id) on delete set null, -- null = site-wide
  is_active boolean not null default true,
  priority integer not null default 1, -- Higher priority = shown more often (1-10 scale)
  start_date date not null,
  end_date date not null,
  impressions integer not null default 0,
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ad_placements_zone_idx on ad_placements(placement_zone);
create index ad_placements_active_idx on ad_placements(is_active, start_date, end_date);

-- Newsletter frequency enum
create type newsletter_frequency as enum ('weekly', 'biweekly', 'monthly');

-- Newsletter Subscribers
create table newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  first_name text,
  last_name text,
  counties_subscribed text[] not null default '{}',
  topics_subscribed text[] not null default '{}', -- 'events', 'business_news'
  frequency newsletter_frequency not null default 'weekly',
  verified boolean not null default false,
  verification_token text unique,
  unsubscribe_token text not null unique default uuid_generate_v4()::text,
  manage_token text not null unique default uuid_generate_v4()::text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index newsletter_email_idx on newsletter_subscribers(email);
create index newsletter_verified_idx on newsletter_subscribers(verified) where verified = true;

-- Contact Messages
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_read_idx on contact_messages(read) where read = false;
create index contact_messages_archived_idx on contact_messages(archived);

-- Site Settings (key-value store for admin-configurable settings)
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text not null default '',
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id)
);

create index site_settings_key_idx on site_settings(key);

-- =============================================================
-- TRIGGERS: auto-update updated_at
-- =============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger counties_updated_at before update on counties
  for each row execute function update_updated_at();

create trigger posts_updated_at before update on posts
  for each row execute function update_updated_at();

create trigger events_updated_at before update on events
  for each row execute function update_updated_at();

create trigger partners_updated_at before update on partners
  for each row execute function update_updated_at();

create trigger ad_placements_updated_at before update on ad_placements
  for each row execute function update_updated_at();

create trigger newsletter_updated_at before update on newsletter_subscribers
  for each row execute function update_updated_at();

create trigger site_settings_updated_at before update on site_settings
  for each row execute function update_updated_at();

-- =============================================================
-- TRIGGER: Auto-create profile on auth.users signup
-- =============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table profiles enable row level security;
alter table counties enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
alter table events enable row level security;
alter table partners enable row level security;
alter table partner_requests enable row level security;
alter table ad_placements enable row level security;
alter table newsletter_subscribers enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- Helper: get current user's role
create or replace function get_user_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer stable;

-- Helper: get current user's assigned counties
create or replace function get_user_counties()
returns text[] as $$
  select assigned_counties from profiles where id = auth.uid();
$$ language sql security definer stable;

-- Helper: check if user can manage a county
create or replace function can_manage_county(county_slug text)
returns boolean as $$
  select
    get_user_role() = 'admin'
    or county_slug = any(get_user_counties());
$$ language sql security definer stable;

-- ----- PROFILES -----
-- Everyone can read profiles (for author display)
create policy "profiles_select" on profiles
  for select using (true);
-- Users can update their own profile
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
-- Admins can update any profile
create policy "profiles_update_admin" on profiles
  for update using (get_user_role() = 'admin');

-- ----- COUNTIES -----
-- Public read
create policy "counties_select" on counties
  for select using (true);
-- Admins can insert/update/delete
create policy "counties_manage_admin" on counties
  for all using (get_user_role() = 'admin');

-- ----- CATEGORIES -----
-- Public read
create policy "categories_select" on categories
  for select using (true);
-- Admins can manage
create policy "categories_manage_admin" on categories
  for all using (get_user_role() = 'admin');

-- ----- POSTS -----
-- Public can read published posts
create policy "posts_select_published" on posts
  for select using (status = 'published');
-- Authenticated users can read all posts they can manage
create policy "posts_select_staff" on posts
  for select using (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Admins and editors can insert posts for their counties
create policy "posts_insert" on posts
  for insert with check (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Admins and editors can update posts for their counties
create policy "posts_update" on posts
  for update using (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Only admins can delete posts
create policy "posts_delete_admin" on posts
  for delete using (get_user_role() = 'admin');

-- ----- EVENTS -----
-- Public can read published events
create policy "events_select_published" on events
  for select using (status = 'published');
-- Staff can read all events they manage
create policy "events_select_staff" on events
  for select using (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Staff can insert events
create policy "events_insert" on events
  for insert with check (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Staff can update events they manage
create policy "events_update" on events
  for update using (
    get_user_role() = 'admin'
    or (
      get_user_role() = 'editor'
      and county_id in (select id from counties where slug = any(get_user_counties()))
    )
  );
-- Only admins can delete events
create policy "events_delete_admin" on events
  for delete using (get_user_role() = 'admin');

-- ----- PARTNERS -----
-- Public can read active partners
create policy "partners_select_active" on partners
  for select using (status = 'active');
-- Staff can read all partners
create policy "partners_select_staff" on partners
  for select using (
    get_user_role() in ('admin', 'editor')
  );
-- Admins can manage all partners
create policy "partners_manage_admin" on partners
  for all using (get_user_role() = 'admin');

-- ----- PARTNER REQUESTS -----
-- Anyone can insert a request (public form)
create policy "partner_requests_insert" on partner_requests
  for insert with check (true);
-- Admins can read and manage requests
create policy "partner_requests_manage_admin" on partner_requests
  for all using (get_user_role() = 'admin');

-- ----- AD PLACEMENTS -----
-- Public can read active ads
create policy "ad_placements_select_active" on ad_placements
  for select using (
    is_active = true
    and start_date <= current_date
    and end_date >= current_date
  );
-- Admins can manage ads
create policy "ad_placements_manage_admin" on ad_placements
  for all using (get_user_role() = 'admin');

-- ----- NEWSLETTER SUBSCRIBERS -----
-- Anyone can insert (public signup)
create policy "newsletter_insert" on newsletter_subscribers
  for insert with check (true);
-- Subscribers can update their own preferences (via unsubscribe_token)
-- This is handled via API routes with service role
-- Admins can read and manage
create policy "newsletter_manage_admin" on newsletter_subscribers
  for all using (get_user_role() = 'admin');

-- ----- CONTACT MESSAGES -----
-- Anyone can insert a message (public form)
create policy "contact_messages_insert" on contact_messages
  for insert with check (true);
-- Admins can read and manage messages
create policy "contact_messages_manage_admin" on contact_messages
  for all using (get_user_role() = 'admin');

-- ----- SITE SETTINGS -----
-- Public can read settings (needed for footer social links etc.)
create policy "site_settings_select" on site_settings
  for select using (true);
-- Only admins can update settings
create policy "site_settings_manage_admin" on site_settings
  for all using (get_user_role() = 'admin');
