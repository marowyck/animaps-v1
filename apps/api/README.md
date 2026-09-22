# @animaps/api

NestJS modular monolith (Wave 2). Clients never talk to Postgres.

## Endpoints (scaffold)

| Method | Path | Status |
|---|---|---|
| `GET` | `/health` | Live (reports `database: up|down`) |
| `POST` | `/marketing/waitlist` | Needs Postgres |
| `GET` | `/auth/status` | Stub — auth not implemented yet |

Contract: [`docs/api/overview.md`](../../docs/api/overview.md).

## Setup

1. **Start Docker Desktop**, then from repo root:

```bash
docker compose up -d
```

If you see `open //./pipe/dockerDesktopLinuxEngine`, Docker Desktop is not running.

2. Env (either place works — Prisma loads both):

```bash
cp .env.example .env
# optional convenience copy for the API cwd:
cp .env apps/api/.env
```

3. Install + generate + migrate:

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
```

4. Dev server (port **3001**):

```bash
pnpm dev:api
```

`GET http://localhost:3001/health` should return `"database":"up"` once PostGIS is healthy.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Environment variable not found: DATABASE_URL` on migrate | Prisma only saw `apps/api/` and no `.env` there | Keep root `.env` (scripts load `../../.env`) or `cp .env apps/api/.env` |
| `Authentication failed` / `P1000` | Nothing on 5432, or another Postgres rejecting `animaps`/`animaps` | Start `docker compose up -d`; confirm `docker ps` shows `animaps-postgres` |
| API crashed on boot before soft-connect | Old build | Restart `pnpm dev:api` after pull |

## Notes

- Prisma schema: `prisma/schema.prisma` (docs mirror under `docs/database/schema.prisma`).
- Web still uses Next `POST /api/waitlist` until cutover to `NEXT_PUBLIC_API_BASE_URL`.
- Do not scaffold empty `packages/*` until web + api share DTOs.
