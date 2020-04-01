from flask import Flask, escape, request, jsonify
growSensibility = int(0.01)
periodeTimes = int(1000)
humidity = int(0.5)
grow = int(1)
app = Flask(__name__)

def getHumidity():
    global periodeTimes
    global humidity
    global grow
    global growSensibility
    for n in range(periodeTimes) :
        humidity = grow *  humidity * ( 1 - humidity )
    grow += growSensibility
    return humidity


@app.route('/data')
def data():
    info = {"name":"feigenbaum","type":"Humidity","content":{"humidity":getHumidity()}}
    return jsonify(info)
