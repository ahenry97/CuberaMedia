create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  full_name text not null,
  email text unique not null,
  phone text not null default '',
  business_name text not null default '',
  preferred_language text not null default 'en' check (preferred_language in ('en', 'es')),
  role text not null default 'customer' check (role in ('customer', 'developer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  plan_name text not null,
  status text not null check (status in ('active', 'pending', 'past_due', 'cancelled')),
  renewal_date date,
  included_services jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  service_type text not null,
  status text not null,
  description text not null default '',
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_questions (
  id uuid primary key default gen_random_uuid(),
  label_en text not null,
  label_es text not null,
  help_text_en text not null default '',
  help_text_es text not null default '',
  question_type text not null,
  required boolean not null default false,
  display_order integer not null default 0,
  active boolean not null default true,
  archived boolean not null default false,
  options_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.intake_submissions(id) on delete cascade,
  question_id uuid not null references public.intake_questions(id),
  answer_json jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id),
  intake_submission_id uuid references public.intake_submissions(id),
  title text not null,
  source_type text not null,
  status text not null,
  priority text not null default 'normal',
  assigned_to uuid references public.profiles(id),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_item_notes (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.work_items(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  note text not null,
  visibility text not null check (visibility in ('internal', 'customer_visible')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  business_name text not null,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'es')),
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  business_display_name text not null default 'Cubera Digital Solutions',
  contact_email text not null default '',
  phone_number text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  default_language text not null default 'en' check (default_language in ('en', 'es')),
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.is_developer()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid()
    and role = 'developer'
  );
$$;

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.intake_questions enable row level security;
alter table public.intake_submissions enable row level security;
alter table public.intake_answers enable row level security;
alter table public.work_items enable row level security;
alter table public.work_item_notes enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "profiles-own-or-developer-select" on public.profiles
for select using (auth_user_id = auth.uid() or public.is_developer());

create policy "profiles-own-update" on public.profiles
for update using (auth_user_id = auth.uid() and role = 'customer') with check (auth_user_id = auth.uid() and role = 'customer');

create policy "profiles-developer-update" on public.profiles
for update using (public.is_developer()) with check (public.is_developer());

create policy "customer-owned-subscriptions" on public.subscriptions
for select using (public.is_developer() or customer_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "developer-manage-subscriptions" on public.subscriptions
for all using (public.is_developer()) with check (public.is_developer());

create policy "customer-owned-projects" on public.projects
for select using (public.is_developer() or customer_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "developer-manage-projects" on public.projects
for all using (public.is_developer()) with check (public.is_developer());

create policy "active-intake-questions-visible" on public.intake_questions
for select using (active = true and archived = false or public.is_developer());

create policy "developer-manage-intake-questions" on public.intake_questions
for all using (public.is_developer()) with check (public.is_developer());

create policy "customer-submissions-own-select" on public.intake_submissions
for select using (public.is_developer() or customer_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "customer-submissions-own-insert" on public.intake_submissions
for insert with check (customer_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "answers-own-or-developer-select" on public.intake_answers
for select using (
  public.is_developer()
  or submission_id in (
    select s.id from public.intake_submissions s
    join public.profiles p on p.id = s.customer_id
    where p.auth_user_id = auth.uid()
  )
);

create policy "answers-own-insert" on public.intake_answers
for insert with check (
  submission_id in (
    select s.id from public.intake_submissions s
    join public.profiles p on p.id = s.customer_id
    where p.auth_user_id = auth.uid()
  )
);

create policy "work-items-own-or-developer" on public.work_items
for select using (public.is_developer() or customer_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "customers-create-own-work-items" on public.work_items
for insert with check (customer_id in (select id from public.profiles where auth_user_id = auth.uid()) or public.is_developer());

create policy "developer-manage-work-items" on public.work_items
for update using (public.is_developer()) with check (public.is_developer());

create policy "notes-visible-by-role" on public.work_item_notes
for select using (
  public.is_developer()
  or (
    visibility = 'customer_visible'
    and work_item_id in (
      select w.id from public.work_items w
      join public.profiles p on p.id = w.customer_id
      where p.auth_user_id = auth.uid()
    )
  )
);

create policy "notes-customer-or-developer-insert" on public.work_item_notes
for insert with check (public.is_developer() or author_id in (select id from public.profiles where auth_user_id = auth.uid()));

create policy "public-contact-insert" on public.contact_messages
for insert with check (true);

create policy "developer-contact-read" on public.contact_messages
for select using (public.is_developer());

create policy "developer-contact-update" on public.contact_messages
for update using (public.is_developer()) with check (public.is_developer());

create policy "site-settings-public-read" on public.site_settings
for select using (true);

create policy "developer-site-settings-manage" on public.site_settings
for all using (public.is_developer()) with check (public.is_developer());
