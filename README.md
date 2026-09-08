# FactoryRoster 2.0

Production-oriented Next.js application for verified China factory intelligence.

## Local application

```bash
npm install
cp .env.example .env.local
npm run dev -- --port 3107
```

The public UI can run without external credentials. Backend endpoints return a clear `503 SERVICE_NOT_CONFIGURED` response until Supabase or Stripe is configured; they never fall back to exposing sample contact details.

## Supabase

The reproducible database setup lives in:

- `supabase/migrations/20260908061918_create_factoryroster_schema.sql`
- `supabase/seed.sql`
- `supabase/tests/factoryroster.test.sql`

With Docker running:

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:test
```

Copy the local credentials printed by Supabase into `.env.local`. For a hosted project, link the Supabase CLI to the intended FactoryRoster project before pushing the migration. Do not use `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## Stripe

Create four Stripe prices and write their IDs into the matching rows in `public.pricing_plans`:

| Plan | Amount | Credits | Mode |
| --- | ---: | ---: | --- |
| `starter` | $9.90 | 3 | payment |
| `business` | $29.90 | 15 | payment |
| `pro` | $99.00 | 60 | payment |
| `sourcing-membership` | $199/month | 100/month | subscription |

Register `/api/webhooks/stripe` for `checkout.session.completed`, `invoice.payment_succeeded`, and `customer.subscription.deleted`. The handler verifies the raw-body signature and fulfills each Stripe event once.

## Backend routes

- `GET /api/factories` — verified public search only
- `GET /api/factories/[slug]` — public intelligence, never locked contact fields
- `POST /api/factories/[slug]/unlock` — authenticated, atomic one-credit unlock
- `GET /api/me` — profile and credit balance
- `POST /api/auth/sign-in`, `/sign-up`, `/sign-out`
- `POST /api/contact`
- `POST /api/verification-requests`
- `POST /api/checkout`
- `POST /api/webhooks/stripe`
- `/api/admin/[resource]` — server-verified admin CRUD/read APIs

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before deployment.
