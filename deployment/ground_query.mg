db.sensors.remove({"_id" : ObjectId("5f04b7a8cb2bf5474c224c3e")})
db.sensors.insert({ "_id" : ObjectId("5f04b7a8cb2bf5474c224c3e"), "devices" : [ "Wemos_watering" ], "name" : "wemos_ground_humidity_1", "ip" : "192.168.1.51:80", "type" : "humidity", "min" : 350000, "max" : 360000, "lapse" : 60000, "block" : false, "__v" : 0, "increasing" : false, "lastValue" : 295781, "count" : 0 })
db.sensors.find({"_id" : ObjectId("5f04b7a8cb2bf5474c224c3e")})
