# backend/database.py

from sqlmodel import SQLModel, Session, create_engine
from models.record import Record
from dotenv import load_dotenv
import os

# --- Load environment ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback to SQLite (optional for local dev)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///records.db"

engine = create_engine(DATABASE_URL, echo=True)

# --- Session Dependency ---
def get_session():
    with Session(engine) as session:
        yield session

# --- Database Initialization ---
def init_db():
    SQLModel.metadata.create_all(engine)


