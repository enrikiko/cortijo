#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include "DHT.h"
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int port = 80;

float h;
float t;

const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";
const char *ssid3 = "Cuarto2.4G_2";
const char *password3 = "Lunohas13steps";
const String deviceName = "Temperature_1";
const char *deviceNameHost = "Temperature_1";
String wifiName;
boolean useOTA = false;

IPAddress ipDevice(192, 168, 1, 120);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid3, password3);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  //WiFi.config(ipDevice, dns, gateway, subnet);
  WiFi.begin();
  WiFi.hostname(deviceName);

  while (WiFiMulti.run() != WL_CONNECTED) {
    //Serial.print(".");
    delay(1000);
  }

  wifiName = WiFi.SSID();

  String ip = WiFi.localIP().toString();
  // //Serial.println("");
  // //Serial.println("");
  // //Serial.println("");
  // //Serial.print("IP:");
  // //Serial.println(ip);

  dht.begin();

  if (MDNS.begin("esp8266")) {
    // //Serial.println("MDNS responder started");
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

  //Serial.println("Desconnected");

  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    //Serial.print(".");
    delay(1000);
    //Serial.println("");
    //Serial.print("Connected");
  }

  wifiName = WiFi.SSID();
}

void sendData() {
   //Serial.printf("Sending data");
   blinkLight();
   server.send(200, "application/json", "{\"name\":\"" + deviceName + "\",\"type\":\"Temperature\",\"content\":{\"temperature\": " + getTemperature() + ",\"humidity\": " + getHumidity() + "}}");
}

String getTemperature(){
    float val = dht.readTemperature();
    if(!isnan(val)){return String(val);}else{return "0";}
}

String getHumidity(){
    float val = dht.readHumidity();
    if(!isnan(val)){return String(val);}else{return "0";}
}

void blinkLight(){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
}

void handleStatus() {
  server.send(200, "application/json", "{\"status\":true,\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "\"OTA\":" + useOTA + "}");
  blinkLight();
}

void setIp(String ip){
   boolean certain = false;
   while(!certain){
     if ((WiFiMulti.run() == WL_CONNECTED)) {
       WiFiClient client;
       HTTPClient http;
       if (http.begin(client, "http://back.app.cortijodemazas.com/sensor/temperature/"+deviceName+"/"+ip+":"+port)) {
         int httpCode = http.POST("");
         if (httpCode > 0) {
           if (httpCode == 200 ) {
             certain = true;
           }
         } else {
         }

         http.end();
       } else {
       }
     }
     delay(1000);
   }
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
