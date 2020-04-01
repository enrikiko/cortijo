from flask import Flask, escape, request
growSensibility = int(0.01)
periodeTimes = int(1000)
humidity = int(1)
grow = int(0.01)
app = Flask(__name__)

def getHumidity():
    global periodeTimes
    global humidity
    global grow
    global growSensibility
    for n in range(periodeTimes) :
        humidity = grow *  humidity * ( 1 - global humidity )
    grow += growSensibility
    return humidity


@app.route('/data')
def data():
    info = {"humidity":getHumidity()}
