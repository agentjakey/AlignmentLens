import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agent import analyze_goal
from collections import defaultdict
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AlignmentLens API")

rate_limit_store = defaultdict(list)
RATE_LIMIT = 5
RATE_WINDOW = 3600


def check_rate_limit(ip: str) -> bool:
    now = time.time()
    requests = rate_limit_store[ip]
    requests = [r for r in requests if now - r < RATE_WINDOW]
    rate_limit_store[ip] = requests
    if len(requests) >= RATE_LIMIT:
        return False
    requests.append(now)
    rate_limit_store[ip] = requests
    return True


class GoalRequest(BaseModel):
    goal: str


@app.post("/analyze")
async def analyze(request: Request, body: GoalRequest):
    ip = request.client.host
    if not check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Max 5 requests per hour per IP.")

    if not body.goal or len(body.goal.strip()) < 3:
        raise HTTPException(status_code=400, detail="Goal must be at least 3 characters.")

    if len(body.goal) > 500:
        raise HTTPException(status_code=400, detail="Goal must be under 500 characters.")

    result = await analyze_goal(body.goal.strip())
    return result


@app.get("/health")
async def health():
    return {"status": "ok"}


frontend_dist = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        return FileResponse(os.path.join(frontend_dist, "index.html"))
