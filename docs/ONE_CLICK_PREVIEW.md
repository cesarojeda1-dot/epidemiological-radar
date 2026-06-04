# ONE-CLICK PREVIEW

You can preview the static demo (one-click) here:

- GitHub page (file view): https://github.com/cesarojeda1-dot/epidemiological-radar/blob/main/frontend/LexiPet_unicorn_FIXED.html
- Raw file (direct open in browser): https://raw.githubusercontent.com/cesarojeda1-dot/epidemiological-radar/main/frontend/LexiPet_unicorn_FIXED.html

Quick local dev (frontend):

1. cd frontend
2. npm install
3. npm run dev

Full stack with Docker (local):

1. cp .env.example .env and edit variables
2. ./scripts/preview_local.sh

Notes:
- No API keys or secrets are committed. Fill .env from .env.example before running integrations.
- The backend exposes endpoints under /api (cases, alerts, providers, government, commissions).
