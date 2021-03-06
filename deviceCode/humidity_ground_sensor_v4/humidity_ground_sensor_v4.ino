#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

const int analogInPin = A0;

const char *ssid1 = "cortijo_south_1";
const char *ssid2 = "cortijo_north_1";
const char *ssid3 = "cortijo_east_1";
const char *ssid4 = "cortijo_west_1";
const char *password = "*****";
String deviceName = "Ground_sensor_frontyard";
const char *deviceNameHost = "Ground_sensor_frontyard";
const String lapse = "599000";
const String minValue = "10000";
const String maxValue = "60000";
const String linkDevices = "Watering_frontyard";
String wifiName;
boolean useOTA = false;

IPAddress ipDevice(192, 168, 1, 120);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
String certain;
int port = 80;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);

void setup() {

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid1, password);
  WiFiMulti.addAP(ssid2, password);
  WiFiMulti.addAP(ssid3, password);
  WiFiMulti.addAP(ssid4, password);
  WiFi.begin();
  WiFi.hostname(deviceName);

  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
  }

  wifiName = WiFi.SSID();

  String ip = WiFi.localIP().toString();

  if (MDNS.begin("esp8266")) {
  }

  setIp(ip);

  server.on("/data", sendData);
  server.on("/"+deviceName+"/status", handleStatus);
  server.on("/"+deviceName+"/ota/true", startOTA);
  server.on("/"+deviceName+"/ota/false", stopOTA);
  server.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){

    if(useOTA == true) {
      ArduinoOTA.handle();
    }

    server.handleClient();

    }

  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
  }

  wifiName = WiFi.SSID();

}

int getInfo(){
  float total = 0;
  int measureNumbers = 1500;
  int sensorValue;
  int mapValue;
  for (int i = 0; i < measureNumbers; i++) {
    total += analogRead(analogInPin);
  }
  sensorValue = total/measureNumbers;
  mapValue = map(sensorValue,0, 1024, 600000, 0);
  return mapValue;
}

 void setIp(String ip){
   boolean certain = false;
   while(!certain){
     if ((WiFiMulti.run() == WL_CONNECTED)) {
       WiFiClient client;
       HTTPClient http;
       if (http.begin(client, "http://back.app.cortijodemazas.com/sensor/humidity/"+deviceName+"/"+ip+":"+port+"?devices="+linkDevices+"&min="+minValue+"&max="+maxValue+"&lapse="+lapse)) {
         int httpCode = http.POST("");
         if (httpCode > 0) {
           if (httpCode == 200 ) {
             certain = true;
           }
         }
         http.end();
       }
     }
     delay(1000);
   }
 }

 void sendData() {
   int data = getInfo();
   blinkLight();
   server.send(200, "application/json", "{\"name\":\"" + deviceName + "\",\"type\":\"Humidity\",\"content\":{\"humidity\": " + String(data) + "}}");
 }

 void blinkLight(){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
 }

 void handleStatus() {
   server.send(200, "application/json", "{\"status\":true,\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
   blinkLight();
 }

 void stopOTA(){
   server.send(200, "application/json", "{\"OTA\": false}");
   useOTA = false;
 }

 void startOTA(){
   //
   server.send(200, "application/json", "{\"OTA\": true}");
   delay(1000);
   ArduinoOTA.setHostname(deviceNameHost);
   ArduinoOTA.setPassword(deviceNameHost);
   ArduinoOTA.onStart([]() {
     String type;
     if (ArduinoOTA.getCommand() == U_FLASH) {
       type = "sketch";
     } else { // U_SPIFFS
       type = "filesystem";
     }

     // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
     //Serial.println("Start updating " + type);
   });
   ArduinoOTA.onEnd([]() {
     //Serial.println("\nEnd");
     useOTA = false;
   });
   ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
     //Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
   });
   ArduinoOTA.onError([](ota_error_t error) {
     //Serial.printf("Error[%u]: ", error);
     if (error == OTA_AUTH_ERROR) {
       //Serial.println("Auth Failed");
     } else if (error == OTA_BEGIN_ERROR) {
       //Serial.println("Begin Failed");
     } else if (error == OTA_CONNECT_ERROR) {
       //Serial.println("Connect Failed");
     } else if (error == OTA_RECEIVE_ERROR) {
       //Serial.println("Receive Failed");
     } else if (error == OTA_END_ERROR) {
       //Serial.println("End Failed");
     }
   });
   ArduinoOTA.begin();
   useOTA = true;
 }
