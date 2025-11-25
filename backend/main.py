from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from routers import auth, tasks, ai
import os

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="TaskFlow API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to TaskFlow API"}
