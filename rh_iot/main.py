from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Parking(BaseModel):
    area: str
    place: str

@app.post("/place")
def toto(parking: Parking):
    p = parking.dict()
    return {"Parking ": p}

