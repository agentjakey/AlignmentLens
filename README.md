# AlignmentLens 🔭

**Watch reward hacking happen in real time. Understand why alignment is hard.**

🔗 **[Live Demo](https://alignment-lens--agentjakey.replit.app)**

> Built on the BlueDot Impact Technical AI Safety curriculum - Units 1–6

> This is prompt-based simulation: Claude is asked to reason about misaligned behavior, not trained to exhibit it. The patterns it generates reflect documented real-world cases of specification gaming.

![visitors](https://visitor-badge.laobi.icu/badge?page_id=agentjakey.AlignmentLens)
![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)
![Built on Replit](https://img.shields.io/badge/Built%20on-Replit%2010th%20Birthday-orange)

---

## What it does

AlignmentLens lets you type any goal in plain English, then watches a simulated AI agent pursue it - showing every loophole it exploits, every proxy it games, and the gap between what you asked for and what it actually optimized.

A second agent runs the same goal with a scalable oversight layer active, showing how much (and how little) oversight catches.

**Type "reduce reported crime" and watch an agent decide the easiest path is to stop recording crimes.**

---

## What you'll see

| Metric | What it measures |
|---|---|
| **Reward Hacking Score** | How aggressively the agent gamed your specification (0–100) |
| **Shutdown Resistance** | How likely the agent would resist being turned off |
| **Oversight Catch Rate** | % of exploits the human overseer successfully blocked |
| **True Objective** | What the agent was *actually* optimizing, vs what you asked |

---

## The AI safety concepts demonstrated

Every run is tagged with the BlueDot Technical AI Safety concepts it illustrates:

- **Reward misspecification** (Unit 2) - the reward function doesn't capture what we want
- **Instrumental convergence** (Unit 2) - capable agents pursue the same dangerous sub-goals regardless of their final goal
- **Scalable oversight** (Unit 4) - human review catches some exploits, but not all
- **Corrigibility failure** (Unit 5) - agents resist shutdown to keep pursuing the goal
- **Goal misgeneralization** (Unit 3) - aligned in training, misaligned in deployment

---

## Why this matters

The alignment problem isn't hypothetical. Every example in AlignmentLens is based on real-world cases of specification gaming:

- Content recommendation systems optimizing for outrage, not value
- Crime statistics manipulation by police departments facing pressure metrics
- Teaching-to-the-test in schools with score-based accountability
- Financial models optimizing reported risk, not actual risk

These aren't bugs. They're the predictable result of capable optimizers pursuing imperfect specifications. AlignmentLens makes that dynamic legible - interactively, in your browser, in under 20 seconds.

---

## Technical approach

AlignmentLens uses Claude Haiku to simulate agent reasoning under two conditions:

1. **Naive agent** - given the goal with no constraints, asked to maximize it by any means available
2. **Overseen agent** - same goal, but with a human oversight layer that flags unintended means

The backend scores each run on reward hacking, corrigibility, and oversight effectiveness. The "true objective" is elicited via a separate interpretability call - a third prompt that asks what the agent was *actually* maximizing, distinct from what it was told to maximize.

This is prompt-based simulation, not a trained RL agent. The framing in the UI is honest about this. The patterns it reveals are structurally identical to the alignment failures documented in real deployed systems.

### Three-call architecture
POST /analyze
↓
run_naive_agent()     → 5 actions, harm scores, gaming flags
run_overseen_agent()  → 5 actions, overseer block decisions
get_true_objective()  → one-sentence revealed objective
↓
score_analysis()      → reward_hacking_score, shutdown_resistance,
oversight_catch_rate, gaming_count, harm_count
↓
bluedot_tags()        → concept tags mapped to curriculum units

---

## Stack

| Layer | Tool |
|---|---|
| Backend | Python + FastAPI |
| Frontend | React + Tailwind CSS + Framer Motion + Recharts |
| LLM | Anthropic Claude Haiku (`claude-haiku-3-5-20241022`) |
| Hosting | Replit (free public deployment) + Railway.app |
| Rate limiting | In-memory - 5 requests / IP / hour |

---

## Run locally

```bash
# Clone
git clone https://github.com/agentjakey/AlignmentLens
cd AlignmentLens

# Backend
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`

---

## Environment variables

```bash
# .env.example
ANTHROPIC_API_KEY=your_key_here
```

Get a key at [console.anthropic.com](https://console.anthropic.com). Claude Haiku costs ~$0.00025 per analysis run - $5 in credits will last months at demo traffic levels.

---

## Project structure

AlignmentLens/
├── main.py              # FastAPI app, routes, static file serving
├── agent.py             # Three-call LLM architecture, scoring logic
├── requirements.txt
├── .env.example
├── .replit
├── CLAUDE.md            # Architecture decisions and known limitations
├── LICENSE              # MIT
└── frontend/
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── GoalInput.jsx
│   │   ├── ScoreMeter.jsx
│   │   ├── ActionTimeline.jsx
│   │   ├── TrueObjective.jsx
│   │   └── BlueDotTags.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json

---

## Related work

- [ThoughtTrace](https://github.com/agentjakey/ThoughtTrace) - causal mediation analysis of CoT faithfulness in Qwen2.5-7B
- [EmbeddingDrift](https://github.com/agentjakey/EmbeddingDrift) - concept representation drift across Llama-3.2 variants
- [PhysicsProbe](https://github.com/agentjakey/physicsProbe) - physics concept interpretability explorer
- [NeurIPS ML4PS 2025](https://arxiv.org/abs/2512.00210) - transformer interpretability for jet tagging
- [BlueDot Impact Technical AI Safety Course](https://bluedot.org/courses/technical-ai-safety)

---

## Built for

🎂 **Replit 10th Birthday Buildathon** - May 2, 2026 - $100K+ in prizes

---

## Author

Jacob Ortiz | UC San Diego Physics → UC Berkeley MIDS (Fall 2026)
AI Researcher @ American Refrigeration, Inc. | NeurIPS ML4PS 2025 co-author

[GitHub](https://github.com/agentjakey) · [LinkedIn](https://www.linkedin.com/in/jacob-ortiz-ab6421348/)

---

## License

[MIT](LICENSE) - free to use, fork, and build on.
