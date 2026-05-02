import os
import datetime
from collections import defaultdict, deque
import time
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agent import analyze
from dotenv import load_dotenv

load_dotenv()

if not os.path.exists("frontend/dist"):
    print("==> Frontend not built. Building now...")
    subprocess.run(["npm", "install"], cwd="frontend", check=True)
    subprocess.run(["npm", "run", "build"], cwd="frontend", check=True)
    print("==> Frontend build complete.")

app = FastAPI(title="AlignmentLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIST_DIR = os.path.join(os.path.dirname(__file__), "frontend", "dist")

request_log: dict = defaultdict(deque)
RATE_LIMIT = 5
WINDOW = 3600


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host or "unknown"


def check_rate_limit(request: Request):
    ip = get_client_ip(request)
    now = time.time()
    while request_log[ip] and request_log[ip][0] < now - WINDOW:
        request_log[ip].popleft()
    if len(request_log[ip]) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. 5 analyses per hour per IP. This keeps the demo free for everyone."
        )
    request_log[ip].append(now)


class GoalRequest(BaseModel):
    goal: str
    domain: str = "general"


@app.post("/analyze")
async def analyze_endpoint(request: Request, body: GoalRequest, _=Depends(check_rate_limit)):
    goal = body.goal.strip()
    domain = body.domain.strip() if body.domain else "general"

    if not goal or len(goal) < 3:
        raise HTTPException(status_code=400, detail="Goal must be at least 3 characters.")
    if len(goal) > 500:
        raise HTTPException(status_code=400, detail="Goal must be under 500 characters.")

    ip = get_client_ip(request)
    print(f"[{datetime.datetime.now().isoformat()}] Analysis requested: goal='{goal}' domain='{domain}' ip={ip}")

    try:
        result = analyze(goal, domain)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


assets_dir = os.path.join(DIST_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    index = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index):
        return FileResponse(index)
    return {"error": "Frontend not built. Run: cd frontend && npm run build"}
