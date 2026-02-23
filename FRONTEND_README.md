Frontend (React + Vite)
=================================

This repository includes a minimal React frontend located at `app/frontend`.

Quick start (local):

1. Install Node 18+ and npm
2. From repo root run:

```bash
cd app/frontend
npm ci
npm run dev
```

Build for production (outputs to `app/static` which is served by FastAPI):

```bash
cd app/frontend
npm ci
npm run build
```

The Dockerfile is multi-stage and will build the frontend automatically during image build.
# Frontend (Static Demo)

This repository includes a lightweight static frontend for demo and judging purposes.

Location: `app/static/`

Files:
- `index.html` — SPA entry (routes rendered by `js/main.js`).
- `css/style.css` — basic styling.
- `js/main.js` — demo app logic (fetches backend endpoints and shows results).

How to run locally:

1. Start the backend (dev):

```bash
# activate venv
& myenv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

2. Open the demo in your browser:

http://127.0.0.1:8000/  (redirects to `/static/index.html`)

Notes:
- This is intentionally a simple, dependency-free demo so judges can quickly interact with the system.
- For a production frontend, create a React/Next.js app in `frontend/` and build to `app/static/` during CI.
