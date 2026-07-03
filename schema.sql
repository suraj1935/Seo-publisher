-- ============================================================
-- SEO Publisher — Supabase Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New Query)
-- ============================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. seo_pages — the core content table
-- ------------------------------------------------------------
create table if not exists seo_pages (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,

  -- Meta / SEO fields
  meta_title        text not null,
  meta_description  text not null,
  meta_keywords     text,
  og_title          text,
  og_description    text,
  og_image_url      text,

  -- Raw content payload
  html_content      text not null,
  css_content        text default '',
  js_content         text default '',
  json_ld           jsonb default '{}'::jsonb,

  -- Quality / dedup
  content_hash      text not null,
  quality_passed    boolean default false,
  quality_report    jsonb default '{}'::jsonb,

  -- Lifecycle
  status            text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at      timestamptz,

  -- Housekeeping
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  created_by        uuid references auth.users(id)
);

create index if not exists idx_seo_pages_slug on seo_pages(slug);
create index if not exists idx_seo_pages_status on seo_pages(status);
create index if not exists idx_seo_pages_content_hash on seo_pages(content_hash);

-- ------------------------------------------------------------
-- 2. gsc_metrics — daily Search Console pulls per slug
-- ------------------------------------------------------------
create table if not exists gsc_metrics (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null references seo_pages(slug) on delete cascade,
  date          date not null,
  clicks        integer default 0,
  impressions   integer default 0,
  ctr           numeric(6,4) default 0,
  position      numeric(6,2) default 0,
  created_at    timestamptz default now(),
  unique (slug, date)
);

create index if not exists idx_gsc_metrics_slug_date on gsc_metrics(slug, date);

-- ------------------------------------------------------------
-- 3. reserved_slugs — prevents shadowing app routes
-- ------------------------------------------------------------
create table if not exists reserved_slugs (
  slug text primary key
);

insert into reserved_slugs (slug) values
  ('admin'), ('api'), ('sitemap.xml'), ('robots.txt'), ('_next'), ('favicon.ico')
on conflict do nothing;

-- ------------------------------------------------------------
-- 4. updated_at trigger
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_seo_pages_updated_at on seo_pages;
create trigger trg_seo_pages_updated_at
  before update on seo_pages
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 5. Row Level Security
-- ------------------------------------------------------------
alter table seo_pages enable row level security;
alter table gsc_metrics enable row level security;
alter table reserved_slugs enable row level security;

-- Public (anon) can only READ published pages — needed for the SSR route
create policy "Public can read published pages"
  on seo_pages for select
  to anon
  using (status = 'published');

-- Authenticated users (you, the admin) have full access
create policy "Authenticated full access to seo_pages"
  on seo_pages for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated full access to gsc_metrics"
  on gsc_metrics for all
  to authenticated
  using (true)
  with check (true);

create policy "Public can read reserved_slugs"
  on reserved_slugs for select
  to anon
  using (true);
