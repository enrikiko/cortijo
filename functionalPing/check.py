import requests
devices = []
URL = "http://88.8.38.4:8000/all/device"
response = requests.get(url=URL)
response = response.json()
for device in response:
    devices.append(device['name'])
    URL = "http://88.8.38.4:8000/status/" + str(device['name'])
    res = requests.get(url=URL)
    print(res)
    res = res.json
    print(res)
    print(res)
print(devices)