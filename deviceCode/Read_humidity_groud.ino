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

const int analogInPin = A0;
int mapValue;

const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";

IPAddress ipDevice(192, 168, 1, 120);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
String certain;
int port = 80;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {

  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
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

}

void loop() {
  getWeatherInfo();
  sendInfo();
  delay(3590000);
  certain=true;
}

void getWeatherInfo(){
  float total = 0;
  int nMeasure = 200;
  for (int i = 0; i < nMeasure; i++) {
    total += analogRead(analogInPin);
    delay(500);
  }
  Serial.println(total);
  int sensorValue = total/nMeasure;
  Serial.println(sensorValue);
  mapValue = map(sensorValue,670, 1024, 1000000, 0);
  Serial.println(mapValue);
}



 void sendInfo(){
 Serial.print(F("Humidity: "));
 Serial.println(mapValue);
 WiFiClient client;
 HTTPClient http;
 if (http.begin(client, "http://192.168.1.50:8000/set/humidity/"+String(mapValue))){
  int httpCode = http.GET();
  if (httpCode > 0) {
     Serial.println("HTTP request sent");};
  }
 }