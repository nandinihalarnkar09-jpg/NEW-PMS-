-- Performance Management System schema
-- Run this in the Supabase SQL editor (or as a migration).
--
-- Auth is Clerk, not Supabase Auth. Row Level Security is ON with no
-- public policies, so the anon/authenticated roles cannot read data.
-- The Next.js server uses SUPABASE_SERVICE_ROLE_KEY (never sent to the
-- browser) and enforces who can see whose records in application code.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('employee', 'manager', 'hr_admin');

create type public.goal_status as enum (
  'draft',
  'submitted',
  'approved',
  'sent_back'
);

create type public.review_status as enum (
  'not_started',
  'self_appraisal_submitted',
  'manager_reviewed',
  'completed'
);

-- A manager is an employee who has reports (manager_id points at them).
-- There is no separate managers table.
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text unique not null,
  full_name text not null,
  job_title text,
  department text,
  role public.app_role not null default 'employee',
  manager_id uuid references public.employees (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employees_no_self_manager check (manager_id is distinct from id)
);

create index employees_manager_id_idx on public.employees (manager_id);
create index employees_role_idx on public.employees (role);

create table public.review_cycles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  goal_setting_deadline date,
  self_appraisal_deadline date,
  manager_review_deadline date,
  is_active boolean not null default false,
  created_by uuid references public.employees (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_cycles_dates_ok check (end_date >= start_date)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  cycle_id uuid not null references public.review_cycles (id) on delete cascade,
  title text not null,
  description text,
  success_criteria text,
  weight numeric(5, 2) not null default 0
    check (weight >= 0 and weight <= 100),
  status public.goal_status not null default 'draft',
  sent_back_reason text,
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.employees (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index goals_employee_cycle_idx on public.goals (employee_id, cycle_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  cycle_id uuid not null references public.review_cycles (id) on delete cascade,
  status public.review_status not null default 'not_started',
  self_overall_comments text,
  manager_overall_comments text,
  self_submitted_at timestamptz,
  manager_reviewed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, cycle_id)
);

create index reviews_employee_cycle_idx on public.reviews (employee_id, cycle_id);

-- Outcome of a goal inside a review. Do not store ratings on goals.
create table public.goal_ratings (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  goal_id uuid not null references public.goals (id) on delete restrict,
  self_rating integer check (self_rating is null or (self_rating >= 1 and self_rating <= 5)),
  self_comments text,
  manager_rating integer check (manager_rating is null or (manager_rating >= 1 and manager_rating <= 5)),
  manager_comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_id, goal_id)
);

create index goal_ratings_review_id_idx on public.goal_ratings (review_id);
create index goal_ratings_goal_id_idx on public.goal_ratings (goal_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger employees_set_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

create trigger review_cycles_set_updated_at
  before update on public.review_cycles
  for each row execute function public.set_updated_at();

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

create trigger goal_ratings_set_updated_at
  before update on public.goal_ratings
  for each row execute function public.set_updated_at();

alter table public.employees enable row level security;
alter table public.review_cycles enable row level security;
alter table public.goals enable row level security;
alter table public.reviews enable row level security;
alter table public.goal_ratings enable row level security;

-- No policies on purpose: browser clients must not query these tables.
-- The service role used on the server bypasses RLS.
