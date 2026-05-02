#!/bin/bash
set -e
pip install -r requirements.txt
echo "==> Building frontend..."
cd frontend && npm install && npm run build && cd ..
echo "==> Starting server on port 5000..."
exec uvicorn main:app --host 0.0.0.0 --port 5000
