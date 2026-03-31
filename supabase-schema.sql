-- Run this in Supabase Dashboard → SQL Editor → New Query

-- Tables
create table study_objects (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table disciplines (
  id text primary key,
  study_object_id text references study_objects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  notes text default '',
  total_minutes integer default 0,
  created_at timestamptz default now()
);

create table study_files (
  id text primary key,
  discipline_id text references disciplines(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('pdf', 'text')),
  url text,
  storage_path text,
  uploaded_at timestamptz default now()
);

create table study_logs (
  id text primary key,
  discipline_id text not null,
  study_object_id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  minutes integer default 0,
  notes text default '',
  created_at timestamptz default now()
);

create table focus_sessions (
  id text primary key,
  discipline_id text not null,
  study_object_id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer default 0,
  is_active boolean default false
);

-- Enable Row Level Security
alter table study_objects enable row level security;
alter table disciplines enable row level security;
alter table study_files enable row level security;
alter table study_logs enable row level security;
alter table focus_sessions enable row level security;

-- RLS: each user only sees their own data
create policy "own data" on study_objects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own data" on disciplines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own data" on study_files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own data" on study_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own data" on focus_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage: update policy to use auth
-- (run after creating bucket if you want per-user file isolation)
