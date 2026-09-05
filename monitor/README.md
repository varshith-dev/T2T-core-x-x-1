# T2T Monitor (Windows GUI)

A native desktop app to watch the T2T pipeline live — no browser, no guessing.

## Tabs

- **Overview** — service health (backend / ml / db) + live counts (users, submissions
  by status, eco-points issued vs spent, coupons, pending redemptions).
- **Live Pipeline** — every submission and where it is: `pending → ML guess → approved / needs_review`,
  with the model's category + confidence and points awarded.
- **API Calls** — every request hitting the backend (method, path, status, latency).
- **DB Tables** — raw rows of any table (submissions, users, point_ledger, coupons, …).

Reads Postgres directly + the backend `/debug/events` feed. Auto-refreshes every 2s.
Everything is local.

## Run (dev)

```bash
uv sync
uv run python app.py
```

## Build the .exe

```bash
uv run pyinstaller --onefile --windowed --name T2T-Monitor \
  --collect-all psycopg --collect-all psycopg_binary app.py
# -> dist/T2T-Monitor.exe   (double-click to run)
```

## Config (optional env overrides)

| Var | Default |
|---|---|
| `T2T_DB_URL` | `postgres://postgres:postgres@localhost:5433/t2t` |
| `T2T_BACKEND` | `http://localhost:3000` |
| `T2T_ML` | `http://localhost:8000` |

Requires the local Postgres + backend to be running (the monitor is read-only —
it never writes).
