@echo off
title Record Collection App Starter
echo === Starting Record Collection App ===

:: 1. Start Backend in new window
echo [*] Starting Backend (FastAPI)...
start cmd /k "cd backend && env\Scripts\activate && uvicorn main:app --reload"

:: 2. Start Frontend in current window
echo [*] Starting Frontend (Vite)...
cd frontend
npm run dev

pause
