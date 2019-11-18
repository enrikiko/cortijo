import requests
devices = []
URL = "http://88.8.38.4:8000/all/device"
response = requests.get(url=URL)
response = response.json()
for device in response:
    devices.append(device['name'])
    URL = "http://88.8.38.4:8000/status/" + device['name']
    res = requests.get(url=URL)
    if res.status_code == 200:
        res = res.json()
        print(res["status"])
    elif res.status_code == 404:
        URL = "http://88.8.38.4:8000/remove/" + device['name']
        res = requests.get(url=URL)
        print(res.json())