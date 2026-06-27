create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('quote', 'contact', 'consultation')),
  data jsonb not null,
  locale text not null check (locale in ('ar', 'en')),
  email_sent boolean default false,
  email_error text,
  created_at timestamptz default now()
);

alter table public.submissions enable row level security;

-- No RLS policies are defined because Phase 1 submissions are accessed only
-- through the server-side Supabase service role client. Browser clients must
-- not read or write this table directly.

create index if not exists submissions_type_created_at_idx
  on public.submissions (type, created_at desc);

create index if not exists submissions_email_sent_created_at_idx
  on public.submissions (email_sent, created_at desc);
