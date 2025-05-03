
from sqlmodel import SQLModel, Field
from typing import Optional

class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    artist: str
    year: int
    genre: str
    format: str
    label: str
    cover_url: str
    notes: str
