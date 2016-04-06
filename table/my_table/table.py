#!/usr/bin/env python
# Modified from python program written by Vance Morris for IoT Foosball table

import RPi.GPIO as GPIO
import os,json
import ibmiotf.application
import ibmiotf.device
from ibmiotf.codecs import jsonIotfCodec
import uuid
from time import sleep
import signal
import sys
import logging

# setup IoT Foundation information
org = "cgmncc"
type = "table"
id = "austinrasppi"
method="token"
token="Oi2Ieq&V985Fy1kSsY"  

# setup sensor input pins
inputPin1 = 11 #Board 11
inputPin2 = 13 #Board 13
inputButtonPin = 15 #Board 15

GPIO.setmode(GPIO.BOARD)
GPIO.setup(inputPin1,GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(inputPin2,GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(inputButtonPin,GPIO.IN,pull_up_down=GPIO.PUD_UP)

# setup SIGINT handler
def signal_handler(signal, frame):
  print '\nExiting.'
  GPIO.cleanup()
  table.disconnect()
  sys.exit(0)
signal.signal(signal.SIGINT, signal_handler)

# setup callbacks for sensors
def sensor1_callback(gpio_id):
  data = 1
  print "Goal Team 1"
  table.publishEventOverHTTP("status",data)    
  sleep(0.4)

def sensor2_callback(gpio_id):
  data = 2
  print "Goal Team 2"
  table.publishEventOverHTTP("status",data)
  sleep(0.4)

def button_callback(gpio_id):
  data = 0
  print "Reset button pushed"
  table.publishEventOverHTTP("status",data)

try:
    options = {"org":org,"type":type,"id":id,"auth-method":method,"auth-token":token}
    table = ibmiotf.device.Client(options)
    table.connect()
    table.setMessageEncoderModule('json',jsonIotfCodec)
    table.logger.setLevel(logging.INFO)

    # Set up rising edge detection on pins
    GPIO.add_event_detect(inputPin1, GPIO.FALLING, callback=sensor1_callback, bouncetime=1000)
    GPIO.add_event_detect(inputPin2, GPIO.FALLING, callback=sensor2_callback, bouncetime=1000)
    GPIO.add_event_detect(inputButtonPin, GPIO.FALLING, callback=button_callback, bouncetime=1000)
    
    while True:
        sleep(1)

except ibmiotf.ConnectionException as e:
    print e
