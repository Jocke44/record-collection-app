# backend/routes/auth.py

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models.user import User
from database import engine
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_reset_token,
    decode_token,
    get_current_user
)
from pydantic import BaseModel
from datetime import datetime, timedelta
from models.reset_token import ResetToken
from jose import jwt
from auth import SECRET_KEY, ALGORITHM
from config import RESET_TOKEN_EXPIRE_MINUTES



router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

# --- Schemas ---

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ResetRequest(BaseModel):
    email: str

# --- Routes ---

@router.post("/register")
def register(data: RegisterRequest, session: Session = Depends(get_session)):
    user_exists = session.exec(select(User).where(User.email == data.email)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=data.email, hashed_password=get_password_hash(data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/reset-password")
def reset_password(request: ResetRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    reset_token = create_reset_token({"sub": user.email})
    return {"reset_token": reset_token}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email}

@router.post("/request-password-reset")
def request_password_reset(email: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode(
        {"sub": user.email, "exp": expires_at},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    reset_entry = ResetToken(user_id=user.id, token=token, expires_at=expires_at)
    session.add(reset_entry)
    session.commit()

    return {
        "message": "Reset token generated",
        "token": token  # 🔒 in production, remove this and send via email
    }

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password/confirm")
def reset_password_confirm(data: ResetPasswordRequest, session: Session = Depends(get_session)):
    # Look up token in DB
    token_entry = session.exec(
        select(ResetToken).where(ResetToken.token == data.token)
    ).first()

    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    if datetime.utcnow() > token_entry.expires_at:
        raise HTTPException(status_code=400, detail="Reset token expired")

    # Fetch user and update password
    user = session.get(User, token_entry.user_id)
    user.hashed_password = get_password_hash(data.new_password)

    # Commit changes and delete token
    session.add(user)
    session.delete(token_entry)
    session.commit()

    return {"message": "Password updated successfully"}

    
