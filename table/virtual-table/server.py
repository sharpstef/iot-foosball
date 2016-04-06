from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
import os
from time import sleep
import signal
import sys
import logging
from iotClient import iotClient
import traceback

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

try:
  options = {
    "org": "YOUR CUSTOM CREDENTIALS GO HERE",
    "type": "YOUR CUSTOM CREDENTIALS GO HERE",
    "id": "YOUR CUSTOM CREDENTIALS GO HERE",
    "auth-method": "token",
    "auth-token": "YOUR CUSTOM CREDENTIALS GO HERE"
  }
  table = iotClient(options)
  table.connect()
except:
  print(traceback.format_exc())

@app.route("/")
def index():
  return app.send_static_file("index.html")


@app.route("/send/1")
def send1():
  table.send(1)
  return jsonify(result={"status": 200})

@app.route("/send/2")
def send2():
  table.send(2)
  return jsonify(result={"status": 200})

@app.route("/send/reset")
def sendReset():
  table.send(0)
  return jsonify(result={"status": 200})


port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
      app.run(host='0.0.0.0', port=int(port))


