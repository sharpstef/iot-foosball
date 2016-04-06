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


def main_function():

  # setup IoT Foundation information
  devorg = "ORG"
  devtype = "table"
  devid = "ID"
  devtoken="AUTH-TOKEN"
  
  options = {"org":devorg,"type":devtype,"id":devid,"auth-method":"token","auth-token":devtoken}
  table = ibmiotf.device.Client(options)
  table.connect()
  table.setMessageEncoderModule('json',jsonIotfCodec)
  table.logger.setLevel(logging.INFO)

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
    data = {"d":1}
    table.publishEventOverHTTP("status",data)    
    sleep(2)

  def sensor2_callback(gpio_id):
    data = {"d":2}
    table.publishEventOverHTTP("status",data)
    sleep(2)

  def button_callback(gpio_id):
    data = {"d":0}
    table.publishEventOverHTTP("status",data)

  # Set up rising edge detection on pins
  GPIO.add_event_detect(inputPin1, GPIO.RISING, callback=sensor1_callback, bouncetime=1000)
  GPIO.add_event_detect(inputPin2, GPIO.RISING, callback=sensor2_callback, bouncetime=1000)
  GPIO.add_event_detect(inputButtonPin, GPIO.RISING, callback=button_callback, bouncetime=1000)

if __name__ == "__main__":
  main_function()

