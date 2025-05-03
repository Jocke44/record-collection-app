#!/bin/bash

echo "=== Starting Record Collection App ==="

# 1. Start backend
echo "[*] Starting Backend (FastAPI)..."
cd backend
source env/bin/activate

# Start backend in new terminal/tab
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "uvicorn main:app --reload; exec bash"
elif command -v x-terminal-emulator &> /dev/null; then
    x-terminal-emulator -e bash -c "uvicorn main:app --reload; exec bash"
elif command -v open &> /dev/null; then
    # macOS (iTerm or Terminal.app)
    osascript -e 'tell application "Terminal" to do script "cd backend; source env/bin/activate; uvicorn main:app --reload"'
else
    echo "[!] Could not open new terminal for backend. Please open manually."
fi

# 2. Start frontend
echo "[*] Starting Frontend (Vite)..."
cd ../frontend
npm run dev
