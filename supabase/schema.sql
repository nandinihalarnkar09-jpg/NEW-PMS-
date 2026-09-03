-- Performance Management System — Postgres schema for Supabase
-- Paste this into the SQL editor. If you already ran an older version,
-- the DROP statements below reset those tables (this deletes their data).

create extension if not exists "pgcrypto";

drop table if exists public.goal_ratings cascade;
drop table if exists public.reviews cascade;
drop table if exists public.goals cascade;
drop table if exists public.review_cycles cascade;
drop table if exists public.employees cascade;

drop type if exists public.app_role cascade;
drop type if exists public.cycle_status cascade;
drop type if exists public.goal_status cascade;
drop type if exists public.review_status cascade;

create type public.app_role as enum ('employee', 'manager', 'hr_admin');
create type public.cycle_status as enum ('draft', 'open', 'closed');
create type public.goal_status as enum ('draft', 'submitted', 'approved', 'sent_back');
create type public.review_status as enum (
  'not_started',
  'self_appraisal_submitted',
  'manager_reviewed',
  'completed'
);

-- A manager is an employee with reports. There is no managers table.
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  full_name text not null,
  email text unique not null,
  designation text,
  department text,
  date_of_joining date,
  -- FK: manager_id → employees.id — this employee's manager (another row in the same table).
  manager_id uuid references public.employees (id) on delete set null,
  role public.app_role not null default 'employee',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint employees_no_self_manager check (manager_id is distinct from id)
);

create index employees_manager_id_idx on public.employees (manager_id);

create table public.review_cycles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  status public.cycle_status not null default 'draft',
  -- FK: created_by → employees.id — the HR/admin employee who created this cycle.
  created_by uuid references public.employees (id) on delete set null,
  constraint review_cycles_dates_ok check (end_date >= start_date)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  -- FK: employee_id → employees.id — the person this goal belongs to (the plan).
  employee_id uuid not null references public.employees (id) on delete cascade,
  -- FK: cycle_id → review_cycles.id — which review period this goal is for.
  cycle_id uuid not null references public.review_cycles (id) on delete cascade,
  title text not null,
  description text,
  weightage numeric(5, 2) not null default 0
    check (weightage >= 0 and weightage <= 100),
  target_date date,
  status public.goal_status not null default 'draft',
  manager_comment text
);

create index goals_employee_id_idx on public.goals (employee_id);
create index goals_cycle_id_idx on public.goals (cycle_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  -- FK: employee_id → employees.id — the person being reviewed (the outcome).
  employee_id uuid not null references public.employees (id) on delete cascade,
  -- FK: manager_id → employees.id — the manager writing the review (still an employee).
  manager_id uuid not null references public.employees (id) on delete restrict,
  -- FK: cycle_id → review_cycles.id — which cycle this review belongs to.
  cycle_id uuid not null references public.review_cycles (id) on delete cascade,
  status public.review_status not null default 'not_started',
  overall_self_rating numeric(3, 1)
    check (overall_self_rating is null or (overall_self_rating >= 1 and overall_self_rating <= 5)),
  overall_manager_rating numeric(3, 1)
    check (overall_manager_rating is null or (overall_manager_rating >= 1 and overall_manager_rating <= 5)),
  manager_summary text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  unique (employee_id, cycle_id)
);

create index reviews_employee_id_idx on public.reviews (employee_id);
create index reviews_manager_id_idx on public.reviews (manager_id);
create index reviews_cycle_id_idx on public.reviews (cycle_id);

-- Ratings live here, not on goals. Goals = plan; this table = outcome.
create table public.goal_ratings (
  id uuid primary key default gen_random_uuid(),
  -- FK: review_id → reviews.id — which review these scores belong to.
  review_id uuid not null references public.reviews (id) on delete cascade,
  -- FK: goal_id → goals.id — which planned goal is being scored.
  goal_id uuid not null references public.goals (id) on delete restrict,
  self_comment text,
  self_rating integer
    check (self_rating is null or (self_rating >= 1 and self_rating <= 5)),
  manager_comment text,
  manager_rating integer
    check (manager_rating is null or (manager_rating >= 1 and manager_rating <= 5)),
  unique (review_id, goal_id)
);

create index goal_ratings_review_id_idx on public.goal_ratings (review_id);
create index goal_ratings_goal_id_idx on public.goal_ratings (goal_id);
