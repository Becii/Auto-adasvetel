from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, cars, users
from app.database import engine, Base

# Adatbázis inicializálás
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS engedélyezés
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API végpontok
app.include_router(auth.router, prefix="/auth")
app.include_router(cars.router, prefix="/cars")
app.include_router(users.router, prefix="/users")

@app.get("/")
def root():
    return {"message": "Üdv az autókereskedés API-ban!"}
