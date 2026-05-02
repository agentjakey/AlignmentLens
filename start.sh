#!/bin/bash
set -e

pip install -r requirements.txt

echo "==> Building frontend..."
cd frontend && npm install && npm run build && cd ..

echo "==> Starting server..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-5000}
