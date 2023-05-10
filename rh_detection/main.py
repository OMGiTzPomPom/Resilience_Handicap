import cv2
cv2.ocl.setUseOpenCL(False)
import numpy
import pytesseract
import os
import time
import threading
from time import time
from time import sleep
import requests
import numpy as np
import re
import base64
from cryptography.fernet import Fernet
from decouple import config
webcam = cv2.VideoCapture(0, cv2.CAP_V4L)
carplate_haar_cascade = cv2.CascadeClassifier('./car_plates.xml')
#pip install python-decouple
#pip install opencv-python
#pip install requests
#pip install cryptography
#to run this script in background
#cd /etc
#sudo nano rc.local
#python /home/iut/main.py &
#sudo reboot
try:
    f = Fernet(config("KEY"))
except:
    print("failed")
    
def enlarge_img(image, scale_percent):
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    resized_image = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
    return resized_image

def carplate_extract(image):
    carplate_rects = carplate_haar_cascade.detectMultiScale(image,scaleFactor=1.1, minNeighbors=5) 
    for x,y,w,h in carplate_rects: 
        carplate_img = image[y+15:y+h-10 ,x+15:x+w-20] 
    return carplate_img

def capture():
    while 1:
        try:
            frame = cv2.imread(r"/home/iut/test.jpg")
            if os.path.exists("/home/iut/test.jpg"):
                carplate_extract_img = carplate_extract(frame)
                carplate_extract_img = enlarge_img(carplate_extract_img, 150)
                imgchar = pytesseract.image_to_string(carplate_extract_img, lang = 'eng', config = '--oem 3 --psm 6')
                text = "".join(imgchar.split())
                text = text.replace("-","").replace(">>","").replace("|","").replace("*","").replace("]","").replace(")","").replace("}","").replace("!","").replace(",","").replace(":","").replace(".","")
                i = 0
                for letter in text:
                    if letter == "-":
                        text = text.replace(letter, "")
                    if i == 2 and letter == "O" or i == 3 and letter == "O" or i == 4 and letter == "O":
                        text = text.replace(letter, "0")
                    if i == 0 and letter == "0" or i == 1 and letter == "0" or i == 5 and letter == "0" or i == 6 and letter == "0":
                        text = text.replace(letter, "O")
                    i+=1
                if len(text) == 7:
                    # AB 777 CD
                    print(text)
                    #r = requests.get("https://agilenegativemiddleware.extremety1989.repl.co/user/license/"+text)
                    try:
                        text = text.encode("UTF-8")
                    
                        token = f.encrypt(text)
                        token = token.decode()
                        r = requests.post("http://134.59.143.110:3300/api/parking", json={"plate": token})
                        if r.status_code == 204:
                            print(r.json())
                        elif r.status_code == 404:
                            print("not found")
                        else:
                            print(r.status_code)
                            print(r.json())
                    except requests.exceptions.ConnectionError:
                        print("Connection refused")
        except:
            pass

def run_camera():
    previous = time()
    delta = 0
    while 1:
        current = time()
        delta += current - previous
        previous = current
        try:
            _, frame = webcam.read()
            cv2.imshow("video", frame)
            cv2.waitKey(1)
            if delta > 3:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                frame = cv2.medianBlur(frame, 3)
                thresh, frame = cv2.threshold(frame, 127, 255, cv2.THRESH_BINARY)
                cv2.imwrite("test.jpg", frame)
                delta = 0
        except:
            pass
        
        
   
threading.Thread(target=run_camera).start()
threading.Thread(target=capture).start()




