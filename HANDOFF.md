# T2T (Trash 2 Treasure) — Agent Handoff

> Master context doc for an AI agent continuing this project. Read this + `DEPLOY.md`.
> **Secrets are NOT in git** — they're in `deploy/CREDENTIALS.local.md` (gitignored, local only).
> Repo: `github.com/varshith-dev/T2T-core-x-x-1`

## What the app is
Reward users for correctly segregating trash: user photographs waste → ML classifies it
(with an "is this actually waste?" gate) → user earns **eco-points** → redeems admin-managed
coupons. Employees/admins review flagged photos and run the platform via dashboards.

## Monorepo layout
```
App-T2T/
├─ backend/        Fastify + TypeScript + PostgreSQL (Drizzle ORM). The one API. Runs on :3000.
│   ├─ src/routes/ auth, submissions, images, wallet, coupons, review, admin, dashboards
│   ├─ src/worker.ts    in-process poll loop: classifies pending submissions via ML, awards/reviews
│   ├─ src/ml.ts        calls the ML service; falls back to human review if it errors
│   ├─ src/storage.ts   S3 (via EC2 instance role) or local disk fallback
│   ├─ src/db/schema.ts Drizzle schema (users, submissions, point_ledger, coupons, redemptions, point_rules)
│   └─ drizzle/         SQL migrations (0000..0003)
├─ ml/             Python 3.12 (uv) + FastAPI. Serves the classifier. Runs on :8000.
│   └─ serving/main.py  2-stage: CLIP waste-gate + item naming → ViT category classifier
├─ frontend/       React + Vite + Tailwind + shadcn/ui. THE USER APP. Served at t2t.dev.oqens.me
├─ EMP-Dashboard/  SvelteKit 5 (runes) + shadcn-svelte. ADMIN/EMPLOYEE dashboards. t2t.sys.oqens.me
├─ shared/         Shared TS types + Zod schemas (used by backend + frontend)
├─ monitor/        Windows Tkinter GUI (.exe via PyInstaller) — local dev DB/pipeline viewer
└─ deploy/         SSH key (t2t-key.pem, gitignored), .state (gitignored), CREDENTIALS.local.md (gitignored)
```

## Live URLs
- **User app:** https://t2t.dev.oqens.me  (React)
- **Dashboards:** https://t2t.sys.oqens.me  (SvelteKit; login at `/staff-login`)
- **API:** same-origin `/api/*` on both domains → proxied by nginx to backend :3000
- All HTTPS via Let's Encrypt (certbot, auto-renew). DNS on Cloudflare (grey cloud / DNS-only).

## The ML model (all local on the server, no paid API)
- **Classifier:** `watersplash/waste-classification` (ViT, 12 classes → mapped to our 8: organic,
  plastic, paper, cardboard, metal, glass, ewaste, trash).
- **Waste-gate + item naming:** `openai/clip-vit-base-patch32` (zero-shot). Rejects non-waste
  (laptops, keyboards, screens, people) so they never auto-approve; also names the item
  ("plastic water bottle"). Gate threshold `GATE_MIN_SCORE` env (default 0.28).
- Swap models via `MODEL_ID` / `GATE_MODEL` env in the ml systemd unit. Label mapping in main.py.
- **Known limit:** a single photo where the dustbin fills the frame is classified as the bin.
  Durable fix = object-detection crop + fine-tune on reviewed photos (the flywheel). Not built yet.

## Key backend concepts
- **Auth:** argon2 + JWT (`@fastify/jwt`). Roles: `user, reviewer, catalog_manager, admin, super_admin`.
  `super_admin` passes every role check + is the only one who can grant admin/super_admin.
- **Wallet is an append-only ledger** (`point_ledger`): balance = SUM(delta). Idempotency keys
  prevent double-award/double-spend. Never store a balance column.
- **Submission flow:** upload (multipart, sha256 dedup) → S3 → `pending` → worker polls → ML gate+classify
  → auto-approve (award via ledger) if waste & confident & under daily cap, else → `needs_review`.
- **Bootstrap on boot (seed.ts):** default point rules per category; admin from `ADMIN_EMAIL/PASSWORD`;
  super_admin from `SUPER_ADMIN_EMAIL/PASSWORD` (env in backend/.env on server).
- **8 dashboard data endpoints** (admin-gated): `/admin/analytics`, `/admin/ml`, `/admin/fraud`,
  `/admin/coupon-stats`, `/admin/audit`, `/admin/users-detail`, `/admin/db/tables` + `/admin/db/:table`,
  `/leaderboard`. Plus `/admin/reprocess` (re-queue needs_review), `/admin/point-rules`, role grant.

## Status / what's done
- ✅ Full backend (auth, ledger, submissions, review, coupons, admin, 8 dashboard endpoints) — deployed.
- ✅ ML service (ViT + CLIP gate + item naming) — deployed, running on the box (~1.2 GB RAM).
- ✅ React user app — live: live camera, animated classify flow, rich result cards, wallet, coupons,
  submission detail modal (product/category/confidence/time/location). HugeIcons.
- ✅ S3 image storage via instance role; old local images migrated to S3.
- ✅ Two-subdomain split with HTTPS (t2t.dev user app, t2t.sys dashboards).
- ✅ SvelteKit dashboard app: real auth/login/guard, access-filtered switcher (super_admin sees all 6),
  deployed. **super-admin main page (`/super-admin`) is wired to REAL data** (KPIs, editable point rules,
  redemptions approve/reject, reprocess, real chart).
- ✅ Database cleaned of test-junk accounts (kept real gmail users + admin + super_admin).

## IN PROGRESS / TODO (important)
1. **Dashboard pages still show FAKE data** except `super-admin/+page.svelte`. The other pages
   (`admin-analytics`, `reviewer`, `ml-analyst`, `fraud-compliance`, `coupon-manager` + their
   `+layout.svelte` sidebars + ~37 sub-pages under each) contain hardcoded mock data (e.g. "8x H100",
   "₹50 Amazon", fake EXIF/telemetry). **Pattern to follow:** keep the rich markup, replace the
   hardcoded `$state`/`const` arrays with data fetched `onMount` from `$lib/api.ts`, wire buttons to the
   API. See `super-admin/+page.svelte` as the reference implementation. Fake concepts with no backend
   equivalent (GPU/Redis/MRR/EXIF load-cell/geofence) should be removed, not invented.
   - ⚠️ A previous attempt DELETED all sub-pages to force this — the user hated it. **Do NOT delete the
     design/pages.** Wire real data IN-PLACE, preserving the UI.
2. **SES email** — domain identity `dev.oqens.me` created in SES (ap-south-1), send permission on the
   instance role. **Pending:** user must add 3 DKIM CNAME records to Cloudflare (values were printed in
   chat; re-fetch with `aws sesv2 get-email-identity --email-identity dev.oqens.me`). Then verify + wire
   a mailer (backend, `@aws-sdk/client-ses` or nodemailer-SES, uses instance role). SES is in **sandbox**
   (only sends to verified addresses) — request production access to email real users.
3. **AWS access key was pasted in chat → ROTATE IT** (IAM → user `cli-deploy` → delete access key →
   create new → `aws configure`). Not yet done.
4. Optional: object-detection crop + fine-tune pipeline for real ML accuracy; nightly retrain.

## AWS resources (IDs — not secrets)
- Account `543777713273`, region **ap-south-1**.
- EC2 instance `i-0b0d8fc81f9e737c2` (t3.small, Amazon Linux 2023, 2 GB RAM + 4 GB swap).
- Elastic IP **13.126.208.56** (alloc `eipalloc-0666cf582183d0088`).
- Security group `sg-030f3794c16e002b0` (t2t-sg: 22/80/443). VPC `vpc-0596227eb16296814`.
- Key pair `t2t-key` → private key at `deploy/t2t-key.pem` (gitignored).
- S3 bucket `t2t-images-543777713273` (private, block-public-access on).
- IAM: user `cli-deploy` (AdministratorAccess); role `t2t-ec2-role` + instance profile
  `t2t-ec2-profile` (policies: `t2t-s3`, `t2t-ses`) attached to the instance.
- SES domain identity `dev.oqens.me` (DKIM pending, sandbox).
- DNS: Cloudflare zone `oqens.me`; A records `t2t.dev` + `t2t.sys` → 13.126.208.56 (DNS-only/grey).

## On the server (Amazon Linux 2023, user ec2-user)
- App at `/home/ec2-user/app` (a `git archive` tarball; NOT a git clone — update by re-tarball+scp, see DEPLOY.md).
- systemd: **t2t-backend** (`tsx src/server.ts`), **t2t-ml** (`uv run uvicorn serving.main:app`). Plus nginx, postgresql.
- nginx serves React from `/usr/share/nginx/html`, dashboard from `/usr/share/nginx/dashboard`, proxies `/api`→:3000.
- Postgres 15 (system), db `t2t`, user `t2t` (password in `~/.dbpass` and `backend/.env`).
- Node 20 (via nodesource) + pnpm; Python 3.12 + uv (`~/.local/bin/uv`) for the ml venv.

## Credentials
See **`deploy/CREDENTIALS.local.md`** (gitignored, on this machine). The AWS CLI is already
configured in `~/.aws` — run `aws sts get-caller-identity` to confirm. SSH:
`ssh -i deploy/t2t-key.pem ec2-user@13.126.208.56`.
