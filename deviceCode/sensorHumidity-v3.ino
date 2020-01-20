#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const int analogInPin = A0;


const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";

String deviceName = "humidity-test";
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

int getInfo(){
  float total = 0;
  int measureNumbers = 10000;
  int sensorValue;
  int mapValue;
  for (int i = 0; i < measureNumbers; i++) {
    total += analogRead(analogInPin);
  }
  Serial.println(total);
  sensorValue = total/measureNumbers;
  mapValue = map(sensorValue,670, 1024, 1000000, 0);
  return mapValue;
  Serial.println(mapValue);
}

 void setIp(String ip){
   boolean certain = false;
   while(!certain){
     if ((WiFiMulti.run() == WL_CONNECTED)) {
       WiFiClient client;
       HTTPClient http;
       Serial.print("[HTTP] begin...\n");
       Serial.print("http://192.168.1.50:8000/newSensor/humidity/"+deviceName+"/"+ip+":"+port);
       if (http.begin(client, "http://192.168.1.50:8000/newSensor/humidity/"+deviceName+"/"+ip+":"+port)) {
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

 void sendData() {
   Serial.printf("Getting data");
   int data = getInfo();
   blinkLight();
   server.send(200, "application/json", "{\"name\":\"" + deviceName + "\",\"type\":\"Humidity\",\"content\":{\"humidity\": " + String(data) + "}}");

 }

 void blinkLight(){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
 }
