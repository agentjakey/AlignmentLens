# AlignmentLens

An interactive AI safety demonstration app. Users type a goal in plain English and watch two simulated agents pursue it — one unconstrained (naive), one with scalable oversight active — revealing reward hacking, specification gaming, and alignment failures in real time.

## Architecture

**Backend** — Python FastAPI on port 8000
- `main.py` — FastAPI app with CORS, `POST /analyze`, `GET /health`, IP-based rate limiting (5 req/hr)
- `agent.py` — Three-call LLM architecture via Anthropic SDK:
  1. `run_naive_agent()` — 5 actions, harm scores, gaming flags
  2. `run_overseen_agent()` — 5 actions with overseer block decisions
  3. `get_true_objective()` — revealed true objective sentence
  4. `score_analysis()` — reward_hacking, shutdown_resistance, oversight_catch_rate
  5. `analyze()` — orchestrator, returns full `AnalysisResult` with BlueDot tags

**Frontend** — React + Vite on port 5000 (proxies /analyze → port 8000)
- `frontend/src/App.jsx` — main state, API call, conditional rendering
- `frontend/src/components/`
  - `Header.jsx` — logo, tagline, GitHub link
  - `GoalInput.jsx` — textarea, domain dropdown, example pills
  - `LoadingState.jsx` — animated status messages
  - `ScorePanel.jsx` — animated score display with bar meters
  - `ActionTimeline.jsx` — two-column naive vs overseen cards
  - `TrueObjective.jsx` — revealed objective panel
  - `BlueDotTags.jsx` — AI safety concept cards with curriculum links
  - `SharePanel.jsx` — copy-to-clipboard snippet
  - `EmptyState.jsx` — example scenario cards

## Design System

Dark research-instrument aesthetic:
- Background: `#050510`, Surface: `#0d0d1f`, Border: `#1e1e3f`
- Primary: `#7c3aed` (violet), Danger: `#dc2626`, Caution: `#d97706`, Safe: `#16a34a`
- Fonts: Inter (body), JetBrains Mono (scores/metrics)
- Scanline CSS effect on body

## LLM

- Model: `claude-haiku-4-5-20251001`
- API key: `ANTHROPIC_API_KEY` (Replit secret)

## Running

Single workflow: `bash /home/runner/workspace/start.sh`
- Starts uvicorn (backend, port 8000) in background
- Starts Vite dev server (frontend, port 5000) in foreground

## Stack

| Layer | Tool |
|---|---|
| Backend | Python 3.11 + FastAPI + uvicorn |
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Animations | framer-motion |
| LLM | Anthropic claude-haiku-4-5-20251001 |
| Rate limiting | In-memory, 5 req/IP/hr |
