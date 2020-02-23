#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include "DHT.h"
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
String deviceName = "wemos_temperature_1";

IPAddress ipDevice(192, 168, 1, 120);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  //WiFi.config(ipDevice, dns, gateway, subnet);
  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  String ip = WiFi.localIP().toString();
  Serial.println("");
  Serial.println("");
  Serial.println("");
  Serial.print("IP:");
  Serial.println(ip);

  dht.begin();

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  setIp(ip);

  server.on("/data", sendData);
  server.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){
    server.handleClient();
    }

  Serial.println("Desconnected");

  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
    Serial.println("");
    Serial.print("Connected");
  }
}

void sendData() {
   Serial.printf("Sending data");
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

void setIp(String ip){
   boolean certain = false;
   while(!certain){
     if ((WiFiMulti.run() == WL_CONNECTED)) {
       WiFiClient client;
       HTTPClient http;
       Serial.print("[HTTP] begin...\n");
       Serial.print("http://192.168.1.50:8000/newSensor/temperature/"+deviceName+"/"+ip+":"+port);
       if (http.begin(client, "http://192.168.1.50:8000/newSensor/temperature/"+deviceName+"/"+ip+":"+port)) {
         Serial.print("[HTTP] GET CODE: ");
         // start connection and send HTTP header
         int httpCode = http.GET();

         // httpCode will be negative on error
         if (httpCode > 0) {
           Serial.println(httpCode);
           if (httpCode == 200 ) {
             certain = true;
             Serial.print("[HTTP] GET BODY: ");
             Serial.println(http.getString());
           }
         } else {
           Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
         }

         http.end();
       } else {
         Serial.printf("[HTTP} Unable to connect\n");
       }
     }
     delay(1000);
   }
 }
