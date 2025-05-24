# src/models/record.py
# from typing import Optional, List
# from sqlmodel import Field, SQLModel
# from sqlalchemy import JSON

from typing import List, Optional
from sqlmodel import Field, SQLModel, JSON

class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    artist: str
    title: str
    genre: Optional[str] = None
    label: Optional[str] = None
    year: Optional[int] = None
    format: Optional[str] = None
    tracklist: List[str] = Field(default_factory=list, sa_column=Field(sa_column_kwargs={"type_": JSON}))

    barcode: Optional[str] = None


