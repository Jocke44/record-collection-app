# backend/main.py
print("🔥 Running main.py from backend")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, HTTPException
from database import get_session
from sqlmodel import SQLModel, Session, select
from database import engine, init_db
from routes import auth
from models.record import Record
from dotenv import load_dotenv
from typing import List, Union
import os
import requests

load_dotenv()
DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Development
        "https://record-frontend.onrender.com" # Production
    ],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    init_db()

# --- Helpers ---
def clean_string(value: Union[str, None]) -> str:
    return value.strip() if value else ""

def clean_tracklist(data) -> List[str]:
    if isinstance(data, list):
        return [t.strip() for t in data if t.strip()]
    elif isinstance(data, str):
        return [t.strip() for t in data.split("\n") if t.strip()]
    return []

# --- Collection ---
@app.get("/records", response_model=List[Record])
def get_records():
    with Session(engine) as session:
        return session.exec(select(Record)).all()

@app.post("/records")
def add_record(record: Record, session: Session = Depends(get_session)):
    try:
        record.artist = clean_string(record.artist).title()
        record.title = clean_string(record.title)
        record.genre = clean_string(record.genre)
        record.format = clean_string(record.format)
        record.label = clean_string(record.label)
        record.tracklist = clean_tracklist(record.tracklist)

        session.add(record)
        session.commit()
        session.refresh(record)
        return record
    except Exception as e:
        print("❌ Failed to insert record:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/records/{record_id}")
def update_record(record_id: int, updated: Record):
    with Session(engine) as session:
        record = session.get(Record, record_id)
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        data = updated.dict(exclude_unset=True)

        if "artist" in data:
            data["artist"] = clean_string(data["artist"]).title()
        if "title" in data:
            data["title"] = clean_string(data["title"])
        if "genre" in data:
            data["genre"] = clean_string(data["genre"])
        if "format" in data:
            data["format"] = clean_string(data["format"])
        if "label" in data:
            data["label"] = clean_string(data["label"])
        if "tracklist" in data:
            data["tracklist"] = clean_tracklist(data["tracklist"])

        for key, value in data.items():
            setattr(record, key, value)

        session.commit()
        session.refresh(record)
        return record

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
    params = {"token": DISCOGS_TOKEN, "type": "release"}
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
        "tracklist": [],
    } for r in results]

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is healthy"}

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "Record Collection Backend is live"}



