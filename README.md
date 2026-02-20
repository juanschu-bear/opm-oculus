# OPM Oculus Frontend

React + Vite + TypeScript frontend for the OPM (Onioko Perception Module) interface.

## Stack

- React 19
- Vite 5
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 20+
- npm 10+

## Local Development

1. Install dependencies:

```bash
npm ci
```

2. Create env file:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Environment Variables

The frontend expects:

- `VITE_API_BASE` (usually `/api` for Vite proxy usage)
- `VITE_API_PROXY_TARGET` (backend base URL, e.g. Cloudflare tunnel)
- `VITE_API_ASSET_BASE` (asset/video/thumbnail base URL)

Example is in `.env.example`.

## Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Docker

### Build image

```bash
docker build -t opm-oculus-frontend .
```

### Run container

```bash
docker run --rm -p 5173:5173 --env-file .env opm-oculus-frontend
```

### Docker Compose

```bash
docker compose up --build
```

The container runs Vite in host mode on port `5173`.

## Backend Connectivity Notes

- Backend is expected to expose endpoints like `/sessions`, `/analyze`, `/status/{job_id}`, `/results/{session_id}`, `/ask`, `/videos/{filename}`, `/thumbnails/{session_id}/person_{n}.jpg`.
- If session lists fail or show `502`, refresh the Cloudflare tunnel URL and update `.env`.

## Security

- `.env` is intentionally ignored in Git and must not be committed.
- Use `.env.example` as the shared template.
