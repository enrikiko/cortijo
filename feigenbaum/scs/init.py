from flask import Flask, escape, request, jsonify
growSensibility = float(0.01)
periodeTimes = int(100)
humidity = float(0.01)
grow = float(1)
app = Flask(__name__)

def getHumidity():
    global periodeTimes
    global humidity
    global grow
    global growSensibility
    for n in range(periodeTimes) :
        humidity = grow *  humidity * ( 1 - humidity )
    grow += growSensibility
    return humidity * 1000


@app.route('/data')
def data():
    info = {"name":"feigenbaum","type":"Humidity","content":{"humidity":getHumidity()}}
    return jsonify(info)
