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
a1 = 13
a0 = 29
b1 = 31
b0 = 33
c1 = 35
c0 = 37

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
GPIO.setup(a0, GPIO.OUT)
GPIO.setup(a1, GPIO.OUT)
GPIO.setup(b0, GPIO.OUT)
GPIO.setup(b1, GPIO.OUT)
GPIO.setup(c0, GPIO.OUT)
GPIO.setup(c1, GPIO.OUT)

#set to off on init
GPIO.output(gate, GPIO.HIGH)
GPIO.output(w0, GPIO.LOW)
GPIO.output(w1, GPIO.LOW)
GPIO.output(w2, GPIO.LOW)
GPIO.output(w3, GPIO.LOW)
GPIO.output(w4, GPIO.LOW)
GPIO.output(w5, GPIO.LOW)
GPIO.output(w6, GPIO.LOW)
GPIO.output(w7, GPIO.LOW)
GPIO.output(w8, GPIO.LOW)
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
    pathToArea(p)
    return p["area"]

#/************************************
# *           Led function           *
# ************************************/

def pathToArea(p):
    area = p["area"]
    place = p["place"]
    if area == "a":
        GPIO.output(gate, GPIO.LOW)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.LOW)
        GPIO.output(w5, GPIO.LOW)
        GPIO.output(w6, GPIO.LOW)
        GPIO.output(w7, GPIO.LOW)
        GPIO.output(w8, GPIO.LOW)

        if place == "0" :
            GPIO.output(a0, GPIO.HIGH)
            GPIO.output(a1, GPIO.LOW)
        elif place == "1" :
            GPIO.output(a0, GPIO.LOW)
            GPIO.output(a1, GPIO.HIGH)
        else :
            GPIO.output(a0, GPIO.LOW)
            GPIO.output(a1, GPIO.LOW)

    elif area == "b":
        GPIO.output(gate, GPIO.LOW)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.HIGH)
        GPIO.output(w5, GPIO.HIGH)
        GPIO.output(w6, GPIO.HIGH)
        GPIO.output(w7, GPIO.LOW)
        GPIO.output(w8, GPIO.LOW)

        if place == "0" :
            GPIO.output(b0, GPIO.HIGH)
            GPIO.output(b1, GPIO.LOW)
        elif place == "1" :
            GPIO.output(b0, GPIO.LOW)
            GPIO.output(b1, GPIO.HIGH)
        else :
            GPIO.output(b0, GPIO.LOW)
            GPIO.output(b1, GPIO.LOW)

    elif area == "c":
        GPIO.output(gate, GPIO.LOW)
        GPIO.output(w0, GPIO.HIGH)
        GPIO.output(w1, GPIO.HIGH)
        GPIO.output(w2, GPIO.HIGH)
        GPIO.output(w3, GPIO.HIGH)
        GPIO.output(w4, GPIO.HIGH)
        GPIO.output(w5, GPIO.HIGH)
        GPIO.output(w6, GPIO.HIGH)
        GPIO.output(w7, GPIO.HIGH)
        GPIO.output(w8, GPIO.HIGH)

        if place == "0" :
            GPIO.output(c0, GPIO.HIGH)
            GPIO.output(c1, GPIO.LOW)
        elif place == "1" :
            GPIO.output(c0, GPIO.LOW)
            GPIO.output(c1, GPIO.HIGH)
        else :
            GPIO.output(c0, GPIO.LOW)
            GPIO.output(c1, GPIO.LOW)

    else:
        GPIO.output(gate, GPIO.HIGH)
        GPIO.output(w0, GPIO.LOW)
        GPIO.output(w1, GPIO.LOW)
        GPIO.output(w2, GPIO.LOW)
        GPIO.output(w3, GPIO.LOW)
        GPIO.output(w4, GPIO.LOW)
        GPIO.output(w5, GPIO.LOW)
        GPIO.output(w6, GPIO.LOW)
        GPIO.output(w7, GPIO.LOW)
        GPIO.output(w8, GPIO.LOW)
        GPIO.output(a0, GPIO.LOW)
        GPIO.output(a1, GPIO.LOW)
        GPIO.output(b0, GPIO.LOW)
        GPIO.output(b1, GPIO.LOW)
        GPIO.output(c0, GPIO.LOW)
        GPIO.output(c1, GPIO.LOW)


#/************************************
# *             For API              *
# ************************************/

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9090)