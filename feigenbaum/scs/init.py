from flask import Flask, escape, request
growSensibility=int(0.01)
periodeTimes=int(1000)
humidity=int(1)
grow=growSensibility
app = Flask(__name__)

def getHumidity():
    for n in periodeTimes :
        humidity = grow * humidity * ( 1 - humidity )
    grow += growSensibility
    return humidity


@app.route('/data')
def data():
    info = {"humidity":getHumidity()}
