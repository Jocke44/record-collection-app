# 🎵 Record Collection App

A full-stack web application for browsing, searching, and managing your personal record collection.

This is my **very first full-stack project** — created while learning modern web development through [Zero to Mastery Academy](https://zerotomastery.io/). I'm still early in my journey, focusing on the fundamentals of web development, and building this app was a hands-on way to practice and learn.

I had support from **Code Copilot (OpenAI LLM)** throughout this project, helping me brainstorm, debug, and implement features while I learned new concepts.

---

## 📚 Features

- 🔐 User authentication (register, login, logout, JWT)
- 🔁 Password reset via secure token (email not yet wired)
- 🪪 Session-protected routes and pages
- 💿 Add, group, search, delete, and annotate records
- 📦 Export collection to CSV or download full DB
- 📡 Discogs API search + barcode autofill
- 🎨 Dark/light theme toggle with persistent state
- 📱 Fully responsive layout (mobile & desktop)
- 🚀 Deployable to Render (or similar)

---

## ⚙️ Tech Stack

**Frontend**  

- React (Vite + React Router)
- Axios, Tailwind CSS, shadcn/ui
- lucide-react, sonner (toasts)

**Backend**  

- FastAPI + SQLModel (SQLAlchemy core)
- PostgreSQL (or SQLite fallback)
- JWT auth, secure token handling
- Discogs API for lookups

---

## 📦 Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Create .env in /backend

DISCOGS_TOKEN=your_discogs_api_token
SECRET_KEY=your_very_secret_key
DATABASE_URL=postgresql://user:pass@host:port/db

Start development server:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit <http://localhost:5173>

## 🛠 Deployment

- Frontend: Vercel, Netlify, or Render (static hosting)

- Backend: Render (FastAPI, PostgreSQL)

- Set production .env values in Render dashboard

## 🤝 Acknowledgements

- Zero To Mastery Academy

- Discogs API

- FastAPI

- SQLModel

- Code Copilot (LLM) — AI pair programmer from OpenAI (me!)

## 👋 About Me

I'm a beginner web developer — learning every day and applying what I learn by building real projects. This app is a personal milestone and a huge learning opportunity.
Thanks for checking it out! 🙌
