create extension if not exists pgcrypto;
do $$ begin create type public.user_role as enum ('USER','CREATOR','ADMIN'); exception when duplicate_object then null; end $$;
do $$ begin create type public.question_status as enum ('PAYMENT_PENDING','ANSWER_PENDING','ANSWERED','REFUNDED','CANCELED','REPORTED'); exception when duplicate_object then null; end $$;
do $$ begin create type public.product_type as enum ('TEXT','VOICE','VIDEO','BUSINESS'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 role public.user_role not null default 'USER',
 display_name text not null default '',
 avatar_url text,
 created_at timestamptz not null default now()
);
create table if not exists public.creator_profiles(
 user_id uuid primary key references public.profiles(id) on delete cascade,
 slug text unique not null, bio text, intro text, is_verified boolean not null default false,
 platform_fee_bps integer not null default 1500, answer_deadline_days integer not null default 7,
 created_at timestamptz not null default now()
);
create table if not exists public.products(
 id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.creator_profiles(user_id) on delete cascade,
 title text not null, description text, product_type public.product_type not null, price integer not null check(price>=100),
 is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.questions(
 id uuid primary key default gen_random_uuid(), buyer_email text not null,
 creator_id uuid not null references public.creator_profiles(user_id) on delete cascade, product_id uuid not null references public.products(id),
 question_text text not null, is_anonymous boolean not null default true, public_answer_allowed boolean not null default true,
 status public.question_status not null default 'PAYMENT_PENDING', amount integer not null, expires_at timestamptz, answered_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.answers(
 id uuid primary key default gen_random_uuid(), question_id uuid unique not null references public.questions(id) on delete cascade,
 answer_text text, media_url text, is_public boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.payments(
 id uuid primary key default gen_random_uuid(), question_id uuid unique not null references public.questions(id) on delete cascade,
 provider text not null default 'TOSS', order_id text unique not null, payment_key text, amount integer not null,
 status text not null default 'READY', approved_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.settlements(
 id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.creator_profiles(user_id),
 question_id uuid unique not null references public.questions(id), gross_amount integer not null, platform_fee integer not null,
 net_amount integer not null, status text not null default 'PENDING', paid_at timestamptz, created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.products enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.payments enable row level security;
alter table public.settlements enable row level security;

drop policy if exists "creator profiles public read" on public.creator_profiles;
create policy "creator profiles public read" on public.creator_profiles for select using(true);
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using(is_active=true);
drop policy if exists "creator owns questions" on public.questions;
create policy "creator owns questions" on public.questions for select to authenticated using(creator_id=auth.uid());
drop policy if exists "creator updates questions" on public.questions;
create policy "creator updates questions" on public.questions for update to authenticated using(creator_id=auth.uid()) with check(creator_id=auth.uid());
drop policy if exists "creator inserts answer" on public.answers;
create policy "creator inserts answer" on public.answers for insert to authenticated with check(
 exists(select 1 from public.questions q where q.id=question_id and q.creator_id=auth.uid())
);
drop policy if exists "public answers read" on public.answers;
create policy "public answers read" on public.answers for select using(is_public=true);
