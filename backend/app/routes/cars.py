from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Car
from app.schemas import CarCreate, CarResponse
import app.dependencies as deps
get_current_user = deps.get_current_user


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CarResponse)
def create_car(car_data: CarCreate, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    new_car = Car(
        brand=car_data.brand,
        model=car_data.model,
        year=car_data.year,
        price=car_data.price,
        owner_email=user
    )
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.get("/", response_model=list[CarResponse])
def get_all_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()

@router.get("/{car_id}", response_model=CarResponse)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.delete("/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    car = db.query(Car).filter(Car.id == car_id, Car.owner_email == user).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found or unauthorized")
    
    db.delete(car)
    db.commit()
    return {"message": "Car deleted"}
