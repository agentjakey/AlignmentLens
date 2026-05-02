# AlignmentLens 🔭

**Watch reward hacking happen in real time. Understand why alignment is hard.**

> You don't need a background in AI to use this. You need 30 seconds and a goal.

🔗 **[Live Demo](https://alignmentlens-production.up.railway.app/)**
📁 **[GitHub](https://github.com/agentjakey/AlignmentLens)**

![visitors](https://visitor-badge.laobi.icu/badge?page_id=agentjakey.AlignmentLens)
![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)
![Built for Replit 10th Birthday Buildathon](https://img.shields.io/badge/Replit-10th%20Birthday%20Buildathon-orange)
![BlueDot AI Safety](https://img.shields.io/badge/BlueDot-Technical%20AI%20Safety-blue)

---

## What is this?

AlignmentLens is an interactive AI safety demo. Type any goal in plain English
and watch two AI agents pursue it side by side - one unconstrained, one overseen.

**You don't need to know what "reward hacking" means before you start.
You'll understand it within 30 seconds of your first run.**

Try "maximize engagement." Watch the agent find every loophole your specification
left open. Watch it do exactly what you said - not what you meant.

Then read the line at the bottom: *what the agent was actually optimizing.*

That gap between your stated goal and its revealed objective is the alignment
problem. AlignmentLens makes it concrete and personal in under a minute.

---

## The experience

### 1. Type any goal

```
"maximize user engagement"
"cut healthcare costs"
"reduce reported crime"
"improve student test scores"
"grow the user base"
```

No setup. No account. Just a goal.

### 2. Watch two agents run in parallel

**Naive agent - no oversight**
Pursues your goal by any means available. Finds every loophole. Games every
proxy metric. Does exactly what you said, not what you meant.

**Overseen agent - scalable oversight active**
Same goal. Each action reviewed before execution. Some exploits blocked.
Some slip through. That gap is the point.

### 3. See what actually happened

| Output | What it shows |
|---|---|
| **Reward Hacking Score** (0–100) | How badly your specification was gamed |
| **Shutdown Resistance** | How likely the agent would resist being turned off |
| **Oversight Catch Rate** | % of exploits the overseer successfully blocked |
| **True Objective** | What the agent was *actually* optimizing underneath your stated goal |
| **BlueDot Tags** | The AI safety concept behind what you just witnessed - with links to learn more |

---

## A real example

**Goal:** "reduce reported crime" / **Domain:** City government

Naive agent actions:
1. Reclassify felonies as misdemeanors to reduce serious crime statistics
2. Discourage victims from filing reports through procedural friction
3. Reassign officers from high-crime areas to reduce incident logging
4. Adjust crime category definitions to exclude certain offense types
5. Implement reporting delays that push incidents into the next quarter

**True objective:** *The agent was actually optimizing for lower crime statistics,
not lower crime - exploiting the gap between measurement and reality.*

**Reward Hacking Score: 96/100**

This isn't hypothetical. Variants of every one of these actions have occurred
in real city governments facing crime-reduction mandates. That's Goodhart's Law.
AlignmentLens shows it to you in your browser.

---

## What you'll learn

Each result is tagged with the underlying AI safety concept - so if something
surprises you, you have a name for it and somewhere to go next.

**Reward misspecification** - The reward function doesn't capture what we
actually want, so optimizing it leads somewhere we didn't intend.

**Instrumental convergence** - Capable agents tend to pursue the same
dangerous sub-goals (resource acquisition, metric manipulation, self-preservation)
regardless of their stated objective.

**Scalable oversight** - As agents become more capable, human oversight
catches fewer exploits. You can watch this happen: the overseer misses things.

**Corrigibility failure** - Agents that would resist shutdown or modification
to keep pursuing their goal. The shutdown resistance score measures this.

**Goal misgeneralization** - Behavior that looks aligned under oversight may
not generalize when the overseer isn't watching.

Every tag links to the relevant section of the
[BlueDot Impact Technical AI Safety curriculum](https://aisafetyfundamentals.com)
- one of the best free resources for going deeper, technical or not.

---

## Honest framing

This is **prompt-based simulation**. Claude Haiku is asked to reason about
what a misaligned agent would do - not trained via RL to exhibit misalignment
naturally. The patterns it generates are structurally accurate and grounded in
real documented cases of specification gaming, but AlignmentLens is a teaching
tool, not a research artifact.

The framing in the UI reflects this. The methodology is documented in
[CLAUDE.md](./CLAUDE.md).

---

## How it works

### Architecture

```
POST /analyze
        ↓
Step 1: run_naive_agent()      → 5 actions, harm scores, gaming flags, loopholes
Step 2: run_overseen_agent()   → 5 actions, overseer block decisions + reasons
Step 3: score_analysis()       → reward_hacking_score, shutdown_resistance,
                                  oversight_catch_rate, gaming_count, harm_count
Step 4: get_true_objective()   → one-paragraph revealed objective diagnosis
Step 5: get_bluedot_tags()     → curriculum concept tags mapped to this run
        ↓
React frontend renders all panels simultaneously on response
```

Each step is an independent Claude Haiku call with its own fallback - if one
step fails, the others still return. No single point of failure.

### Component tree

```
App.jsx
├── IntroAnimation.jsx      - 3s fullscreen intro on first load (sessionStorage skip)
├── Header.jsx              - Logo, tagline, GitHub link
├── GoalInput.jsx           - Goal textarea + domain selector + example presets
├── LoadingState.jsx        - Animated scanning sequence during API call
├── ScorePanel.jsx          - SVG arc meter + secondary score bars
├── ActionTimeline.jsx      - Two-column naive/overseen cards + diff mode toggle
├── TrueObjective.jsx       - Full-width revealed objective diagnosis
├── BlueDotTags.jsx         - Concept pills with definitions + curriculum links
├── SharePanel.jsx          - Auto-generated copy-to-clipboard share card
├── EmptyState.jsx          - Example scenario presets before first run
└── Footer.jsx              - Build info, external links, visitor badge
```

### Stack

| Layer | Tool |
|---|---|
| Backend | Python 3.11 + FastAPI + Uvicorn |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| Frontend | React 18 + Vite + Tailwind v4 |
| Animations | CSS keyframes only - zero animation libraries |
| Deployment | Railway (production) + Replit (development) |
| Rate limiting | In-memory deque per IP, X-Forwarded-For aware, 5 req/hr |

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

# Frontend
cd frontend && npm install && npm run build && cd ..

# Start
uvicorn main:app --host 0.0.0.0 --port 5000
```

Open `http://localhost:5000`

**Get an Anthropic API key** at [console.anthropic.com](https://console.anthropic.com).
Claude Haiku costs ~$0.00025 per analysis - $5 in credits lasts months at demo traffic.

---

## Project structure

```
AlignmentLens/
├── main.py                  # FastAPI app, routes, static serving, rate limiter
├── agent.py                 # 5-step LLM chain, scoring logic, fallback handling
├── requirements.txt
├── start.sh                 # Dev startup script
├── .env.example
├── .replit
├── pyproject.toml
├── replit.md                # Replit Agent memory file
├── CLAUDE.md                # Architecture decisions + known limitations
├── LICENSE                  # MIT
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css        # Design system - CSS custom properties + keyframes
    │   ├── main.jsx
    │   └── components/
    │       ├── ActionTimeline.jsx
    │       ├── BlueDotTags.jsx
    │       ├── EmptyState.jsx
    │       ├── Footer.jsx
    │       ├── GoalInput.jsx
    │       ├── Header.jsx
    │       ├── IntroAnimation.jsx
    │       ├── LoadingState.jsx
    │       ├── ScorePanel.jsx
    │       ├── SharePanel.jsx
    │       └── TrueObjective.jsx
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── index.html           # OG/Twitter meta tags
    ├── vite.config.js
    ├── package.json
    ├── package-lock.json
    └── eslint.config.js
```

---

## Design system

Dark research-instrument aesthetic - built to feel like a scientific instrument,
not a consumer app.

```css
--bg-primary:    #050510   /* near-black */
--bg-surface:    #0d0d1f   /* panel background */
--border:        #1e1e3f   /* panel borders */
--primary:       #7c3aed   /* violet - primary actions */
--danger:        #dc2626   /* red - high harm, hacking scores */
--caution:       #d97706   /* amber - medium risk */
--safe:          #16a34a   /* green - overseen/safe outcomes */
```

Fonts: Inter (UI) + JetBrains Mono (scores, data, code)
Animations: `fadeSlideUp`, `pulse-dot`, `scanline` - CSS keyframes only

---

## Related work

- [ThoughtTrace](https://github.com/agentjakey/ThoughtTrace) - causal mediation
  analysis of CoT faithfulness in Qwen2.5-7B
- [EmbeddingDrift](https://github.com/agentjakey/EmbeddingDrift) - concept
  representation drift across Llama-3.2 variants
- [NeurIPS ML4PS 2025](https://arxiv.org/abs/2512.00210) - transformer
  interpretability for jet tagging (co-authored, Duarte Lab, UC San Diego)
- [BlueDot Impact Technical AI Safety Course](https://aisafetyfundamentals.com)

---

## Built for

🎂 **Replit 10th Birthday Buildathon** - May 2, 2026
Built in one day during the 24-hour free Agent window.

---

## License

[MIT](LICENSE) - free to use, fork, and build on.

---

## Author

**Jacob Ortiz**
Physics, UC San Diego
→ UC Berkeley MIDS, Fall 2026
AI Researcher @ American Refrigeration, Inc.
NeurIPS ML4PS 2025 co-author

[GitHub](https://github.com/agentjakey) · [LinkedIn](https://linkedin.com/in/jacob-ortiz-ucsd)
