# SSH Library — Deployment Guide (SSH-19)

## Architecture

| Layer | Service | Suggested host |
|-------|---------|----------------|
| Frontend (React/Vite) | Static SPA | [Netlify](https://www.netlify.com/) |
| Backend (Express API) | Node.js web service | [Render](https://render.com/) |
| Database | MySQL | PlanetScale, Railway, or campus MySQL |

## Frontend (Netlify)

1. Connect the GitHub repo in Netlify.
2. Set **base directory** to `frontend`.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Environment variable:
   - `VITE_BASE_URL` = `https://your-api.onrender.com/api`

`netlify.toml` in the repo root configures this automatically.

## Backend (Render)

1. Create a **Web Service** from the repo.
2. Set **root directory** to `backend`.
3. Build: `npm install` | Start: `npm start`
4. Add environment variables from `backend/.env.example`.
5. Set `CLIENT_URL` to your Netlify site URL (for CORS).

`render.yaml` in the repo root provides a starter Blueprint.

## Database

1. Provision MySQL and note host, user, password, database name.
2. Import `db/schema.sql`.
3. Point backend `DB_*` variables to the instance.

## Post-deploy smoke test

```bash
curl https://your-api.onrender.com/api/health
```

Expected: `{"status":"ok"}`
