-- Media table for tracking uploaded images (asset library)
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  public_id text not null unique,
  filename text not null,
  width integer,
  height integer,
  size_bytes integer,
  format text,
  folder text not null default 'riverlands',
  alt_text text,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index media_public_id_idx on media(public_id);
create index media_folder_idx on media(folder);
create index media_created_at_idx on media(created_at desc);

alter table media enable row level security;

-- Admin and editors can read media
create policy "media_select_staff" on media
  for select using (get_user_role() in ('admin', 'editor'));

-- Admin and editors can insert media
create policy "media_insert_staff" on media
  for insert with check (get_user_role() in ('admin', 'editor'));

-- Only admins can delete media
create policy "media_delete_admin" on media
  for delete using (get_user_role() = 'admin');
