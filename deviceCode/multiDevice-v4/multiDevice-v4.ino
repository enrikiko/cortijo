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
const char *ssid3 = "Cuarto2.4G_2";
const char *password3 = "Lunohas13steps";
String deviceName = "Multi_device_1";
String wifiName;

int port = 80;
IPAddress ipDevice(192, 168, 1, 100);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 0, 0, 0);
boolean certain;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);

String gateway16 = "false";
String gateway5 = "false";
String gateway4 = "false";
String gateway0 = "false";
String gateway2 = "false";
String gateway14 = "false";
String gateway12 = "false";
String gateway13 = "false";
String gateway15 = "false";



void setup() {

  //Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid3, password3);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  //WiFi.config(ipDevice, dns, gateway, subnet);
  WiFi.begin();
  WiFi.hostname(deviceName);

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
  char pins[9] = {16,5,4,0,2,14,12,13,15};
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

  server.on("/"+deviceName+"-16/status/true", handleRoot16true);
  server.on("/"+deviceName+"-16/status/false", handleRoot16false);
  server.on("/"+deviceName+"-16/status", handleStatusGateway16);
  server.on("/"+deviceName+"-5/status/true", handleRoot5true);
  server.on("/"+deviceName+"-5/status/false", handleRoot5false);
  server.on("/"+deviceName+"-5/status", handleStatusGateway5);
  server.on("/"+deviceName+"-4/status/true", handleRoot4true);
  server.on("/"+deviceName+"-4/status/false", handleRoot4false);
  server.on("/"+deviceName+"-4/status", handleStatusGateway4);
  server.on("/"+deviceName+"-0/status/true", handleRoot0true);
  server.on("/"+deviceName+"-0/status/false", handleRoot0false);
  server.on("/"+deviceName+"-0/status", handleStatusGateway0);
  server.on("/"+deviceName+"-2/status/true", handleRoot2true);
  server.on("/"+deviceName+"-2/status/false", handleRoot2false);
  server.on("/"+deviceName+"-2/status", handleStatusGateway2);
  server.on("/"+deviceName+"-14/status/true", handleRoot14true);
  server.on("/"+deviceName+"-14/status/false", handleRoot14false);
  server.on("/"+deviceName+"-14/status", handleStatusGateway14);
  server.on("/"+deviceName+"-12/status/true", handleRoot12true);
  server.on("/"+deviceName+"-12/status/false", handleRoot12false);
  server.on("/"+deviceName+"-12/status", handleStatusGateway12);
  server.on("/"+deviceName+"-13/status/true", handleRoot13true);
  server.on("/"+deviceName+"-13/status/false", handleRoot13false);
  server.on("/"+deviceName+"-13/status", handleStatusGateway13);
  server.on("/"+deviceName+"-15/status/true", handleRoot15true);
  server.on("/"+deviceName+"-15/status/false", handleRoot15false);
  server.on("/"+deviceName+"-15/status", handleStatusGateway15);

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
      if (http.begin(client, "http://192.168.1.50:8000/new/"+deviceName+"-"+pin+"/true/"+ip+":"+port)) {
        Serial.print("[HTTP] GET CODE: ");
        int httpCode = http.GET();
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


//16,5,4,0,2,14,12,13,15
void handleRoot15true() {
  gateway15 = "true";
  digitalWrite(15, true);
  Serial.println("pin 15 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot15false() {
  gateway15 = "false";
  digitalWrite(15, false);
  Serial.println("pin 15 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot13true() {
  gateway13 = "true";
  digitalWrite(13, true);
  Serial.println("pin 13 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot13false() {
  gateway13 = "false";
  digitalWrite(13, false);
  Serial.println("pin 13 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot12true() {
  gateway12 = "true";
  digitalWrite(12, true);
  Serial.println("pin 12 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot12false() {
  gateway12 = "false";
  digitalWrite(12, false);
  Serial.println("pin 12 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot14true() {
  gateway14 = "true";
  digitalWrite(14, true);
  Serial.println("pin 14 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot14false() {
  gateway14 = "false";
  digitalWrite(14, false);
  Serial.println("pin 14 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot2true() {
  gateway2 = "true";
  digitalWrite(2, true);
  Serial.println("pin 2 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot2false() {
  gateway2 = "false";
  digitalWrite(2, false);
  Serial.println("pin 2 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot0true() {
  gateway0 = "true";
  digitalWrite(0, true);
  Serial.println("pin 0 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot0false() {
  gateway0 = "false";
  digitalWrite(0, false);
  Serial.println("pin 0 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot4true() {
  gateway4 = "true";
  digitalWrite(4, true);
  Serial.println("pin 4 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot4false() {
  gateway4 = "false";
  digitalWrite(4, false);
  Serial.println("pin 4 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot16true() {
  gateway16 = "true";
  digitalWrite(16, true);
  Serial.println("pin 16 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot16false() {
  gateway16 = "false";
  digitalWrite(16, false);
  Serial.println("pin 16 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleRoot5true() {
  gateway5 = "true";
  digitalWrite(5, true);
  Serial.println("pin 5 true");
  server.send(200, "application/json", "{\"status\": true}");
}
void handleRoot5false() {
  gateway5 = "false";
  digitalWrite(5, false);
  Serial.println("pin 5 false");
  server.send(200, "application/json", "{\"status\": false}");
}
void handleStatusGateway0() {
 server.send(200, "application/json", "{\"status\": " + gateway0 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway2() {
 server.send(200, "application/json", "{\"status\": " + gateway2 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway4() {
 server.send(200, "application/json", "{\"status\": " + gateway4 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway5() {
 server.send(200, "application/json", "{\"status\": " + gateway5 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway12() {
 server.send(200, "application/json", "{\"status\": " + gateway12 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway13() {
 server.send(200, "application/json", "{\"status\": " + gateway13 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway15() {
 server.send(200, "application/json", "{\"status\": " + gateway15 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway16() {
 server.send(200, "application/json", "{\"status\": " + gateway16 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
void handleStatusGateway14() {
 server.send(200, "application/json", "{\"status\": " + gateway14 + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}
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
