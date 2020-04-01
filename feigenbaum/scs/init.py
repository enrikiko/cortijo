from flask import Flask, escape, request
growSensibility=int(0.01)
periodeTimes=int(1000)
humidity=int(1)
grow=growSensibility
periode=periodeTimes
app = Flask(__name__)

def getHumidity():
    periode -= 1
    if periode <= 0:
        grow += growSensibility
        periode = periodeTimes
    humidity = grow * humidity * ( 1 - humidity )
    return humidity

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/data')
def data():
    info = {"humidity":getHumidity()}
