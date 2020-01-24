
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
String deviceName = "Watering";
String currentStatus = "false";

int port = 80;

IPAddress ipDevice(192, 168, 1, 102);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
String certain;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {
  pinMode(5, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
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


  String ip = WiFi.localIP().toString();
  Serial.println("");
  Serial.println("");
  Serial.println("");
  Serial.print("IP:");
  Serial.println(ip);

  digitalWrite(LED_BUILTIN, LOW);

  setIp(ip);



  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  digitalWrite(LED_BUILTIN, LOW);
  server.on("/"+deviceName+"/status/true", handleRoot5true);
  server.on("/"+deviceName+"/status/false", handleRoot5false);
  server.on("/"+deviceName+"/status", handleStatus);
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
    Serial.print(".");
    delay(1000);
    Serial.println("");
    Serial.print("Connected");
  }

}


void setIp(String ip){
  boolean certain = false;
  while(!certain){
    if ((WiFiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      Serial.print("[HTTP] begin...\n");
      if (http.begin(client, "http://192.168.1.50:8000/new/"+deviceName+"/"+currentStatus+"/"+ip+":"+port)) {
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

void handleStatus() {
  server.send(200, "application/json", "{\"status\": "+currentStatus+"}");
}

void handleRoot5true() {
  digitalWrite(5, true);
  digitalWrite(LED_BUILTIN, true);
  Serial.println("pin 5 true");
  currentStatus="true";
  server.send(200, "application/json", "{\"status\": "+currentStatus+"}");
}
void handleRoot5false() {
  digitalWrite(5, false);
  digitalWrite(LED_BUILTIN, false);
  Serial.println("pin 5 false");
  currentStatus="false";
  server.send(200, "application/json", "{\"status\": "+currentStatus+"}");
}

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