import uvicorn

from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_methods=[""],
    allow_headers=["*"],
    allow_credentials=True,
)

class Parking(BaseModel):
    area: str
    place: str

@app.post("/place")
def toto(parking: Parking):
    p = parking.dict()
    return {"Parking ": p}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9090)