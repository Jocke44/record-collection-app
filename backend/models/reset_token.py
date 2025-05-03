# backend/models/reset_token.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class ResetToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    token: str
    expires_at: datetime
