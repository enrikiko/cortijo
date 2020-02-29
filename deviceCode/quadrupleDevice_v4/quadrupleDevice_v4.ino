#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";
String deviceName = "Quadruple_device_1";
String wifiName;

int port = 80;
String current14Status = "false";
String current13Status = "false";
String current12Status = "false";
String current4Status = "false";

IPAddress ipDevice(192, 168, 1, 102);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
boolean certain;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {

  //Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  //WiFi.config(ipDevice, dns, gateway, subnet);
  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  wifiName = WiFi.SSID();

  String ip = WiFi.localIP().toString();
  // Serial.println("");
  // Serial.println("");
  // Serial.println("");
  // Serial.print("IP:");
  // Serial.println(ip);

  digitalWrite(LED_BUILTIN, LOW);
  char pins[4] = {4,12,13,14};
  //Serial.println(sizeof(pins));

  for (int i = 0; i < sizeof(pins); i++){
    Serial.println(pins[i]);
    pinMode(pins[i], OUTPUT);
    digitalWrite(pins[i], HIGH);
    setIp(ip, pins[i]);
  }

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }


  server.on("/"+deviceName+"-4/status/true", handleRoot4true);
  server.on("/"+deviceName+"-4/status/false", handleRoot4false);
  server.on("/"+deviceName+"-4/status", handle4Status);
  server.on("/"+deviceName+"-14/status/true", handleRoot14true);
  server.on("/"+deviceName+"-14/status/false", handleRoot14false);
  server.on("/"+deviceName+"-14/status", handle14Status);
  server.on("/"+deviceName+"-12/status/true", handleRoot12true);
  server.on("/"+deviceName+"-12/status/false", handleRoot12false);
  server.on("/"+deviceName+"-12/status", handle12Status);
  server.on("/"+deviceName+"-13/status/true", handleRoot13true);
  server.on("/"+deviceName+"-13/status/false", handleRoot13false);
  server.on("/"+deviceName+"-13/status", handle13Status);


  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){
    server.handleClient();
    }

  Serial.println("Desconnected");

  WiFi.begin();

  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
  }

  wifiName = WiFi.SSID();

}


void setIp(String ip, int pin){
  boolean certain = false;
  while(!certain){
    if ((WiFiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      Serial.print("[HTTP] begin...\n");
      if (http.begin(client, "http://192.168.1.50:8000/new/"+deviceName+"-"+pin+"/false/"+ip+":"+port)) {
        Serial.print("[HTTP] GET CODE: ");
        int httpCode = http.GET();
        Serial.println(httpCode);
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

void handleInfo() {
  server.send(200, "application/json", certain);
}

//16,5,4,0,2,14,12,13,15
void handleRoot13true() {
  digitalWrite(13, true);
  Serial.println("pin 13 true");
  current13Status="true";
  server.send(200, "application/json", "{\"status\": "+current13Status+"}");
}
void handleRoot13false() {
  digitalWrite(13, false);
  Serial.println("pin 13 false");
  current13Status="false";
  server.send(200, "application/json", "{\"status\": "+current13Status "}");
}
void handle13Status() {
  server.send(200, "application/json", "{\"status\": "+current13Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleRoot12true() {
  digitalWrite(12, true);
  Serial.println("pin 12 true");
  current12Status="true";
  server.send(200, "application/json", "{\"status\": "+current12Status+"}");
}
void handleRoot12false() {
  digitalWrite(12, false);
  Serial.println("pin 12 false");
  current12Status="false";
  server.send(200, "application/json", "{\"status\": "+current12Status+"}");
}
void handle12Status() {
  server.send(200, "application/json", "{\"status\": "+current12Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleRoot14true() {
  digitalWrite(14, true);
  Serial.println("pin 14 true");
  current14Status="true";
  server.send(200, "application/json", "{\"status\": "+current14Status+"}");
}
void handleRoot14false() {
  digitalWrite(14, false);
  Serial.println("pin 14 false");
  current14Status="false";
  server.send(200, "application/json", "{\"status\": "+current14Status+"}");
}
void handle14Status() {
  server.send(200, "application/json", "{\"status\": "+current14Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleRoot4true() {
  digitalWrite(4, true);
  Serial.println("pin 4 true");
  current4Status="true";
  server.send(200, "application/json", "{\"status\": "+current4Status+"}");
}
void handleRoot4false() {
  digitalWrite(4, false);
  Serial.println("pin 4 false");
  current4Status="false";
  server.send(200, "application/json", "{\"status\": "+current4Status+"}");
}
void handle4Status() {
  server.send(200, "application/json", "{\"status\": "+current4Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
//void handleStatus() {
//  StaticJsonDocument<100> doc;
//  DeserializationError error = deserializeJson(doc, server.arg(0));
//  setPin(doc);
//  certain=server.arg(0);
//  server.send(200, "application/json", server.arg(0));
//}
//
//void setPin(StaticJsonDocument<100> doc){
//  int pins[9] = {16,5,4,0,2,14,12,13,15};
//  int tmpVal;
//  for (int i = 0; i < 9; i++){
//    tmpVal=doc[String(pins[i])];
//    digitalWrite(pins[i], !tmpVal);
//  }
//}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}
