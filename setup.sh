#!/bin/bash

echo "=== Record Collection App Setup ==="

# 1. Check Python
if ! command -v python3 &> /dev/null
then
    echo "[!] Python 3 is not installed. Please install it first."
    exit
fi

# 2. Create Python Virtual Environment
cd backend
if [ ! -d "env" ]; then
  echo "[*] Creating Python virtual environment..."
  python3 -m venv env
fi

source env/bin/activate

# 3. Install Python Requirements
echo "[*] Installing backend requirements..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Check Node.js and npm
if ! command -v npm &> /dev/null
then
    echo "[!] Node.js and npm are not installed. Please install Node.js LTS first."
    exit
fi

# 5. Install Frontend Dependencies
cd ../frontend
if [ ! -d "node_modules" ]; then
  echo "[*] Installing frontend dependencies..."
  npm install
fi

echo "[*] Setup complete!"
echo "---------------------------------"
echo "To run the app manually:"
echo "Backend: cd backend && source env/bin/activate && uvicorn main:app --reload"
echo "Frontend: cd frontend && npm run dev"
echo "---------------------------------"
