# backend/main.py
print("🔥 Running main.py from backend")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from database import engine, init_db, add_mock_records
from routes import auth
from models.record import Record
from dotenv import load_dotenv
from typing import List
from sqlmodel import Session, select
import os
import requests

load_dotenv()
DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")

app = FastAPI()

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://record-frontend.onrender.com"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

# --- Routers ---
app.include_router(auth.router)

# --- Startup DB creation ---
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    init_db()
    add_mock_records()

# --- Collection Endpoints ---
@app.get("/records", response_model=List[Record])
def get_records():
    with Session(engine) as session:
        return session.exec(select(Record)).all()

@app.post("/records")
def add_record(record: Record):
    with Session(engine) as session:
        session.add(record)
        session.commit()
        session.refresh(record)
        return record

@app.put("/records/{record_id}")
def update_record(record_id: int, updated: Record):
    with Session(engine) as session:
        record = session.get(Record, record_id)
        if record:
            for key, value in updated.dict(exclude_unset=True).items():
                setattr(record, key, value)
            session.commit()
            session.refresh(record)
            return record
        raise HTTPException(status_code=404, detail="Record not found")

@app.delete("/records/{record_id}")
def delete_record(record_id: int):
    with Session(engine) as session:
        record = session.get(Record, record_id)
        if record:
            session.delete(record)
            session.commit()
        return {"ok": True}

# --- Discogs Search ---
@app.get("/discogs/search")
def search_discogs(q: str = None, barcode: str = None):
    url = "https://api.discogs.com/database/search"
    params = {
        "token": DISCOGS_TOKEN,
        "type": "release"
    }
    if barcode:
        params["barcode"] = barcode
    elif q:
        params["q"] = q
    else:
        return {"error": "Provide query or barcode"}
    res = requests.get(url, params=params)
    results = res.json().get("results", [])
    return [{
        "id": r["id"],
        "title": r.get("title", "Unknown Title"),
        "artist": ", ".join(r.get("title", "").split(" - ")[:-1]) or "Unknown Artist",
        "year": r.get("year", 0),
        "genre": ", ".join(r.get("genre", [])) or "Unknown",
        "format": ", ".join(r.get("format", [])) or "Unknown",
        "label": ", ".join(r.get("label", [])) or "Unknown",
        "cover_url": r.get("cover_image", ""),
        "notes": "",
    } for r in results]

# --- Health Check ---
@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is healthy"}

# ✅ Patch: handle both GET + HEAD to keep Render happy
@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "Record Collection Backend is live"}


