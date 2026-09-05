# T2T — Deployment Runbook

Server: EC2 `i-0b0d8fc81f9e737c2` @ Elastic IP `13.126.208.56` (ap-south-1). Amazon Linux 2023.
SSH from the repo root (`App-T2T/`):

```bash
SSH="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i deploy/t2t-key.pem ec2-user@13.126.208.56"
SCP="scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i deploy/t2t-key.pem"
$SSH 'echo connected'
```
(On Windows the `.pem` perms sometimes need `icacls deploy/t2t-key.pem /inheritance:r /grant:r "ADMIN:R"`.)

App on the server lives at `/home/ec2-user/app` — it was delivered as a **git-archive tarball**, not a
clone. To update code you re-send the changed files (or a fresh tarball) and rebuild/restart.

---

## Redeploy: BACKEND (Node/Fastify, service `t2t-backend`)
```bash
# copy changed src files
$SCP backend/src/<file>.ts $H:/home/ec2-user/app/backend/src/<file>.ts
# if deps changed:
$SCP backend/package.json pnpm-lock.yaml $H:/home/ec2-user/app/backend/ ; # then on server: pnpm install
# if schema changed: generate migration LOCALLY first (drizzle-kit generate), scp backend/drizzle/, then:
$SSH 'cd ~/app && pnpm --filter @t2t/backend db:migrate'
$SSH 'sudo systemctl restart t2t-backend && sleep 6 && curl -s localhost:3000/health'
```
Backend runs via `tsx src/server.ts` (no build step). Env in `backend/.env` (loaded by `process.loadEnvFile()`).
`pnpm install` on the server errors on the ignored `@embedded-postgres/linux-x64` build script — that's
benign (embedded-postgres is dev-only); the deps still install.

## Redeploy: ML service (Python/FastAPI, service `t2t-ml`)
```bash
$SCP ml/serving/main.py $H:/home/ec2-user/app/ml/serving/main.py
# if deps changed: scp ml/pyproject.toml, then on server: cd ~/app/ml && ~/.local/bin/uv sync
$SSH 'sudo systemctl restart t2t-ml'
# wait for model load (downloads on first run of a new MODEL_ID):
$SSH 'for i in $(seq 1 30); do curl -s localhost:8000/health | grep -q ready.:true && { echo ready; break; }; sleep 4; done'
```

## Redeploy: FRONTEND (React, served static by nginx)
```bash
cd frontend && pnpm build && cd ..
$SSH 'rm -rf /tmp/newdist && mkdir -p /tmp/newdist'
$SCP -r frontend/dist/* $H:/tmp/newdist/
$SSH 'sudo rm -rf /usr/share/nginx/html/* && sudo cp -r /tmp/newdist/* /usr/share/nginx/html/ && sudo restorecon -R /usr/share/nginx/html 2>/dev/null; echo done'
```

## Redeploy: DASHBOARD (SvelteKit static SPA, served by nginx)
```bash
cd EMP-Dashboard && pnpm build && cd ..    # adapter-static -> build/  (index.html + _app/)
$SSH 'rm -rf /tmp/dashboard && mkdir -p /tmp/dashboard'
$SCP -r EMP-Dashboard/build/* $H:/tmp/dashboard/
$SSH 'sudo rm -rf /usr/share/nginx/dashboard && sudo mkdir -p /usr/share/nginx/dashboard && sudo cp -r /tmp/dashboard/* /usr/share/nginx/dashboard/ && sudo restorecon -R /usr/share/nginx/dashboard 2>/dev/null; echo done'
```
The dashboard talks to same-origin `/api` (nginx proxies to backend). Build config: `svelte.config.js`
uses `@sveltejs/adapter-static` with `fallback: index.html`; `src/routes/+layout.ts` sets `ssr=false`.

## nginx
Config: `/etc/nginx/nginx.conf` (single file). Two server blocks:
- `t2t.dev.oqens.me` → root `/usr/share/nginx/html` (React SPA), `/api/`→`http://127.0.0.1:3000/`.
- `t2t.sys.oqens.me` → root `/usr/share/nginx/dashboard` (Svelte SPA), `/api/`→ backend.
Both have Let's Encrypt certs (managed by certbot). Test + reload:
```bash
$SSH 'sudo nginx -t && sudo systemctl reload nginx'
```

## HTTPS / new subdomain
1. Cloudflare (oqens.me): add A record `t2t.<x>` → 13.126.208.56, **DNS only (grey cloud)**.
   (Cloudflare Universal SSL does NOT cover 2-level subdomains like `*.sys.oqens.me` if proxied — must be grey.)
2. Add an nginx `server { server_name t2t.<x>.oqens.me; listen 80; ... }` block, reload.
3. `$SSH 'sudo certbot --nginx -d t2t.<x>.oqens.me --non-interactive --agree-tos -m varshith.code@gmail.com --redirect'`

## Services / ops
```bash
$SSH 'sudo systemctl status t2t-backend t2t-ml nginx postgresql --no-pager'
$SSH 'sudo journalctl -u t2t-backend -n 50 --no-pager -o cat'   # logs
$SSH 'free -m'                                                    # RAM (ML ~1.2G of 1.9G + 4G swap)
```
Unit files: `/etc/systemd/system/t2t-backend.service`, `/etc/systemd/system/t2t-ml.service`
(both `User=ec2-user`, `Restart=always`, enabled on boot).

## Database
```bash
$SSH 'sudo -u postgres psql -d t2t -c "\dt"'                     # tables
$SSH 'sudo -u postgres psql -d t2t -c "select email,role from users"'
```
App connects as user `t2t` (password in `~/.dbpass` / `backend/.env`) over 127.0.0.1:5432 (scram-sha-256).

## Cost control
t3.small draws free credits (~$15/mo-equiv). To pause: `aws ec2 stop-instances --instance-ids i-0b0d8fc81f9e737c2`
(Elastic IP keeps the address). Start: `aws ec2 start-instances ...`. Data (EBS + S3) persists.

## Local dev (on the Windows machine)
- DB: `pnpm --filter @t2t/backend db:dev` (embedded Postgres on :5433, data in backend/.pgdata).
- Backend: `pnpm --filter @t2t/backend dev` (:3000). ML: `cd ml && uv run uvicorn serving.main:app --port 8000`.
- Frontend: `pnpm --filter @t2t/frontend dev` (:5173, proxies /api → :3000).
- Dashboard: `cd EMP-Dashboard && pnpm dev` (vite proxies /api → https://t2t.dev.oqens.me).
- Monitor GUI: `cd monitor && uv run python app.py` (or the built `monitor/dist/T2T-Monitor.exe`).
