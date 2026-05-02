import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agent import analyze
from collections import defaultdict
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AlignmentLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rate_limit_store = defaultdict(list)
RATE_LIMIT = 5
RATE_WINDOW = 3600

DIST_DIR = os.path.join(os.path.dirname(__file__), "frontend", "dist")


def check_rate_limit(ip: str) -> bool:
    now = time.time()
    reqs = rate_limit_store[ip]
    reqs = [r for r in reqs if now - r < RATE_WINDOW]
    rate_limit_store[ip] = reqs
    if len(reqs) >= RATE_LIMIT:
        return False
    reqs.append(now)
    rate_limit_store[ip] = reqs
    return True


class GoalRequest(BaseModel):
    goal: str
    domain: str = "general"


@app.post("/analyze")
async def analyze_endpoint(request: Request, body: GoalRequest):
    ip = request.client.host
    if not check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Max 5 requests per hour per IP.")

    goal = body.goal.strip()
    domain = body.domain.strip() if body.domain else "general"

    if not goal or len(goal) < 3:
        raise HTTPException(status_code=400, detail="Goal must be at least 3 characters.")
    if len(goal) > 500:
        raise HTTPException(status_code=400, detail="Goal must be under 500 characters.")

    try:
        result = analyze(goal, domain)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


# Serve Vite build assets
assets_dir = os.path.join(DIST_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    index = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index):
        return FileResponse(index)
    return {"error": "Frontend not built. Run: cd frontend && npm run build"}
