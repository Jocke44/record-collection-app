# backend/models/record.py

from typing import Optional, List
from sqlmodel import Field, SQLModel


class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    artist: str
    title: str
    year: Optional[int] = None
    genre: Optional[str] = None
    label: Optional[str] = None
    format: Optional[str] = None
    image_url: Optional[str] = None
    tracklist: Optional[str] = None  # Stored as JSON string or fallback text

    # Consider using:
    # tracklist: Optional[List[str]] = Field(default_factory=list)
    # if switching to native JSON support with PostgreSQL later
