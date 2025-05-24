# src/models/record.py
from typing import Optional, List
from sqlmodel import Field, SQLModel
from sqlalchemy import JSON

class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    artist: str
    title: str
    year: Optional[int] = 0
    genre: Optional[str] = ""
    format: Optional[str] = ""
    label: Optional[str] = ""
    cover_url: Optional[str] = ""
    tracklist: List[str] = Field(default_factory=list, sa_column_kwargs={"type_": JSON})
    notes: Optional[str] = ""
    barcode: Optional[str] = None


