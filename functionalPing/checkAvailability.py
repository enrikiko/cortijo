import requests


getURLLink = "https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/get_ip"


def getURL():
    return requests.get(url=getURLLink).json()


def getDevice(url):
    return requests.get(url=url).json()


devices = getDevice("http://" + getURL() + ":8000/all/device")

for device in devices:
    print(device['name'])
    URL = "http://" + getURL() + ":8000/status/" + device['name']
    res = requests.get(url=URL)
    if res.status_code == 200:
        res = res.json()
        print(res["status"])
    elif res.status_code == 404:
        URL = "http://" + getURL() + ":8000/remove/" + device['name']
        res = requests.get(url=URL)
        print(res.json())
