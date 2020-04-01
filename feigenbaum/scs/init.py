from flask import Flask, escape, request
growSensibility = int(0.01)
periodeTimes = int(1000)
humidity = int(1)
grow = int(0.01)
app = Flask(__name__)

def getHumidity():
    for n in range(global periodeTimes) :
        global humidity = global grow * global humidity * ( 1 - global humidity )
    global grow += global growSensibility
    return humidity


@app.route('/data')
def data():
    info = {"humidity":getHumidity()}
