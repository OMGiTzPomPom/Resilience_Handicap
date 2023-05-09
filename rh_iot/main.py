#/************************************
# *              imports             *
# ************************************/

import uvicorn
import RPi.GPIO as GPIO

from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

#/************************************
# *                API               *
# ************************************/

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_methods=[""],
    allow_headers=["*"],
    allow_credentials=True,
)

#/************************************
# *               LEDS               *
# ************************************/

gate = 12
w0 = 16
w1 = 18
w2 = 22
w3 = 32
w4 = 36
w5 = 38
w6 = 40
w7 = 7
w8 = 11
w9 = 13
a0 = 15
a1 = 29
b0 = 31
b1 = 33
c0 = 35
c1 = 37

#/************************************
# *               GPIO               *
# ************************************/

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

#pin mapping
GPIO.setup(gate, GPIO.OUT)
GPIO.setup(w0, GPIO.OUT)
GPIO.setup(w1, GPIO.OUT)
GPIO.setup(w2, GPIO.OUT)
GPIO.setup(w3, GPIO.OUT)
GPIO.setup(w4, GPIO.OUT)
GPIO.setup(w5, GPIO.OUT)
GPIO.setup(w6, GPIO.OUT)
GPIO.setup(w7, GPIO.OUT)
GPIO.setup(w8, GPIO.OUT)
GPIO.setup(w9, GPIO.OUT)
GPIO.setup(a0, GPIO.OUT)
GPIO.setup(a1, GPIO.OUT)
GPIO.setup(b0, GPIO.OUT)
GPIO.setup(b1, GPIO.OUT)
GPIO.setup(c0, GPIO.OUT)
GPIO.setup(c1, GPIO.OUT)

#set to off on init
GPIO.output(gate, GPIO.LOW)
GPIO.output(w0, GPIO.LOW)
GPIO.output(w1, GPIO.LOW)
GPIO.output(w2, GPIO.LOW)
GPIO.output(w3, GPIO.LOW)
GPIO.output(w4, GPIO.LOW)
GPIO.output(w5, GPIO.LOW)
GPIO.output(w6, GPIO.LOW)
GPIO.output(w7, GPIO.LOW)
GPIO.output(w8, GPIO.LOW)
GPIO.output(w9, GPIO.LOW)
GPIO.output(a0, GPIO.LOW)
GPIO.output(a1, GPIO.LOW)
GPIO.output(b0, GPIO.LOW)
GPIO.output(b1, GPIO.LOW)
GPIO.output(c0, GPIO.LOW)
GPIO.output(c1, GPIO.LOW)

#/************************************
# *           Parking Class          *
# ************************************/

class Parking(BaseModel):
    area: str
    place: str

#/************************************
# *             API route            *
# ************************************/

@app.post("/place")
def toto(parking: Parking):
    p = parking.dict()
    return p["area"]

#/************************************
# *           Led function           *
# ************************************/

def pathToArea(p):
    area = p["area"]
    if area == "a":
        print(area)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.LOW)
        GPIO.output(w5, GPIO.LOW)
        GPIO.output(w6, GPIO.LOW)
        GPIO.output(w7, GPIO.LOW)
        GPIO.output(w8, GPIO.LOW)
        GPIO.output(w9, GPIO.LOW)
    elif area == "b":
        print(area)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.HIGH)
        GPIO.output(w5, GPIO.HIGH)
        GPIO.output(w6, GPIO.HIGH)
        GPIO.output(w7, GPIO.LOW)
        GPIO.output(w8, GPIO.LOW)
        GPIO.output(w9, GPIO.LOW)
    elif area == "c":
        print(area)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.HIGH)
        GPIO.output(w5, GPIO.HIGH)
        GPIO.output(w6, GPIO.HIGH)
        GPIO.output(w7, GPIO.HIGH)
        GPIO.output(w8, GPIO.HIGH)
        GPIO.output(w9, GPIO.HIGH)

#/************************************
# *             For API              *
# ************************************/

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9090)