# backend/auth.py

from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from models.user import User
from sqlmodel import Session, select
from database import get_session, engine 
from models.reset_token import ResetToken
from datetime import datetime, timedelta
import uuid
import os

# --- Settings ---
SECRET_KEY = os.getenv("SECRET_KEY", "fallbacksecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
RESET_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# --- Password utilities ---

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# --- Token utilities ---

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_reset_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token: str = Depends(lambda: None)):
    from fastapi.security import OAuth2PasswordBearer
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
    token = oauth2_scheme()
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        with Session(engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/request-password-reset")
def request_reset(email: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # generate token
    token = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(minutes=15)

    session.add(ResetToken(id=token, email=email, expires_at=expiry))
    session.commit()

    # simulate email
    print(f"[DEBUG] Reset link: http://localhost:5173/reset-password?token={token}")

    return {"message": "Reset link generated. Check console."}

@router.post("/reset-password")
def reset_password(token: str, new_password: str, session: Session = Depends(get_session)):
    reset = session.get(ResetToken, token)
    if not reset or reset.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = session.exec(select(User).where(User.email == reset.email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(new_password)
    session.delete(reset)
    session.commit()

    return {"message": "Password updated successfully"}
