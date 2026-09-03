# Performance Management System (PMS)

College project: goals, reviews, and ratings for a ~200-person services company.

**Stack:** Next.js App Router, TypeScript, Tailwind CSS, Clerk (auth), Supabase (Postgres), Resend (email), Vercel.

## One-feature rule

Build one feature per prompt. This repo currently has the **foundation only**: app scaffold, Clerk sign-in, database schema, and server-side access helpers. Goals and reviews are not implemented yet.

## Local setup

1. Copy `env.example` to `.env.local`.
2. Clerk: `clerk init` already wrote development keys into `.env.local` in this environment. On your machine, run `npx clerk@latest init` or paste keys from the Clerk dashboard. `CLERK_SECRET_KEY` must stay server-side.
3. Create a Supabase project. Run `supabase/schema.sql` in the SQL editor. Put the project URL in `NEXT_PUBLIC_SUPABASE_URL` and the **service role** key in `SUPABASE_SERVICE_ROLE_KEY` (server only).
4. Optional: add `RESEND_API_KEY` when email is built.
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then open `/dashboard`. Until an `employees` row exists with your `clerk_user_id`, the dashboard will say the account is not linked.

## How auth and data are split

- **Clerk** proves who is signed in (`await auth()` / `auth.protect()` on each protected page).
- **Supabase** stores employees, cycles, goals, reviews, and goal ratings. RLS is enabled with no public policies. The Next.js server uses the service role and then checks `src/lib/auth/access.ts` so one employee cannot load another employee's data by changing the URL.
- **Do not** put `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, or `RESEND_API_KEY` in Client Components. Only `NEXT_PUBLIC_*` variables are allowed in the browser.

## Core tables

| Table | Purpose |
| --- | --- |
| `employees` | People. `manager_id` points at another employee. No managers table. |
| `review_cycles` | A time-boxed PMS period. |
| `goals` | The **plan** (`draft` → `submitted` → `approved` / `sent_back`). |
| `reviews` | The **outcome** (`not_started` → `self_appraisal_submitted` → `manager_reviewed` → `completed`). |
| `goal_ratings` | Scores and comments for a goal inside a review. Never store ratings on `goals`. |

## Clerk note

Clerk setup used the current documented CLI (`npx clerk@latest init`) for Next.js 16: `src/proxy.ts` with a bare `clerkMiddleware()`, and resource-level protection via `auth.protect()` on the dashboard layout. `createRouteMatcher` is deprecated; this project does not use it.

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- `npm run lint` — ESLint
