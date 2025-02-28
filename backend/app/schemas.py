from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    price: float

class CarResponse(CarCreate):
    id: int

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

class Config:
    from_attributes = True
