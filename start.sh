#!/bin/bash
set -e

echo "==> Building frontend..."
cd /home/runner/workspace/frontend
npm run build

echo "==> Starting server on port 5000..."
cd /home/runner/workspace
/home/runner/workspace/.pythonlibs/bin/uvicorn main:app --host 0.0.0.0 --port 5000
