from flask import Flask, escape, request, jsonify
import random
growSensibility = float(0.005)
periodeTimes = int(1000)
humidity = float(0.01)
grow = float(1)
times = 10
app = Flask(__name__)

def getHumidity():
    global periodeTimes
    humidity = random.uniform(0, 1)
    global grow
    global growSensibility
    global times
    for n in range(periodeTimes) :
        humidity = grow *  humidity * ( 1 - humidity )
    times -= 1
    if times<=0:
        times = 10
        grow += growSensibility
    return humidity * 1000

def getHumidity():
    global grow
    return grow * 1000


@app.route('/data')
def data():
    info = {"name":"feigenbaum","type":"Humidity","content":{"humidity":getHumidity(),"temperature":}}
    return jsonify(info)
