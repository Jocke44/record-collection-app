@echo off
setlocal

echo === Record Collection App Setup ===

:: 1. Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Python is NOT installed! Please install Python 3.11+ first.
    pause
    exit /b
)

:: 2. Create Python Virtual Environment
cd backend
if not exist env (
    echo [*] Creating Python virtual environment...
    python -m venv env
)
call env\Scripts\activate.bat

:: 3. Install Python Requirements
echo [*] Installing backend requirements...
pip install --upgrade pip
pip install -r requirements.txt

:: 4. Check Node.js + npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js and npm are NOT installed! Please install Node.js LTS version first.
    pause
    exit /b
)

:: 5. Install Frontend
cd ..\frontend
if not exist node_modules (
    echo [*] Installing frontend dependencies...
    npm install
)

echo [*] Setup complete!
echo ---------------------------------
echo To run the app:
echo 1. Open a new terminal
echo 2. cd backend && activate env && uvicorn main:app --reload
echo 3. cd frontend && npm run dev
echo ---------------------------------
pause
exit /b
