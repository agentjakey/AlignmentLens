#!/bin/bash
# Start backend on port 8000 (background)
/home/runner/workspace/.pythonlibs/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start frontend dev server on port 5000 (foreground, this is what Replit watches)
cd /home/runner/workspace/frontend
npm run dev

# If frontend exits, kill backend too
kill $BACKEND_PID
