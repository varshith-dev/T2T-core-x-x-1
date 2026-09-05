# T2T — Trash 2 Treasure

Reward users for correctly segregating trash. Photo → ML classification → eco-points
wallet → redeem admin-managed coupons.

## Architecture

- `backend/` — Fastify (TypeScript) API + database: auth, RBAC, wallet ledger, submissions, coupons, review, admin. The submission worker runs in-process.
- `frontend/` — Vite + React SPA: user app + role-gated employee dashboard.
- `ml/` — Python/FastAPI service + pipelines: serves (and later fine-tunes) the trash classifier.
- `shared/` — shared TS types + Zod schemas (used by frontend + mobile).

Postgres (local embedded in dev / any Postgres in prod) · Cloudflare R2 storage (prod) ·
no Docker (PM2 + Caddy in prod).

## Run it locally (4 processes)

One-time setup:

```bash
pnpm install                                  # JS deps (backend, frontend, shared)
cd ml && uv sync && cd ..                      # Python deps for the ML service
pnpm --filter @t2t/backend db:migrate          # create tables (DB must be running, see below)
```

Then run each in its own terminal:

```bash
# 1. Local Postgres (embedded — no install/admin). Keep running.
pnpm --filter @t2t/backend db:dev

# 2. Backend API  ->  http://localhost:3000
pnpm --filter @t2t/backend dev

# 3. ML service   ->  http://localhost:8000   (downloads the model on first run)
cd ml && uv run uvicorn serving.main:app --port 8000

# 4. Frontend     ->  http://localhost:5173
pnpm --filter @t2t/frontend dev
```

Open **http://localhost:5173**. Log in as the seeded admin (`admin@t2t.local` /
`admin12345`) or register a normal user. Admin can promote users to
reviewer / catalog_manager from the Admin page.

Config lives in `backend/.env` (see `.env.example`). Swap `MODEL_ID` in the ML
service env to try a different pre-trained classifier.
