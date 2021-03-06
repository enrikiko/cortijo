#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

const char *ssid1 = "cortijo_south_1";
const char *ssid2 = "cortijo_north_1";
const char *ssid3 = "cortijo_east_1";
const char *ssid4 = "cortijo_west_1";
const char *password = "*****";
const String deviceName = "Quadruple_device_1";
const char *deviceNameHost = "Quadruple_device_1";
String wifiName;
boolean useOTA = false;

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
  WiFiMulti.addAP(ssid1, password);
  WiFiMulti.addAP(ssid2, password);
  WiFiMulti.addAP(ssid3, password);
  WiFiMulti.addAP(ssid4, password);
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
  server.on("/"+deviceName+"/ota/true", startOTA);
  server.on("/"+deviceName+"/ota/false", stopOTA);


  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){

    if(useOTA == true) {

      ArduinoOTA.handle();

    }

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
      if (http.begin(client, "http://back.app.cortijodemazas.com/device/"+deviceName+"-"+pin+"/false/"+ip+":"+port)) {
        Serial.print("[HTTP] GET CODE: ");
        int httpCode = http.POST("");
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
  server.send(200, "application/json", "{\"status\": "+current13Status +"}");
}
void handle13Status() {
  server.send(200, "application/json", "{\"status\": "+current13Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
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
  server.send(200, "application/json", "{\"status\": "+current12Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
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
  server.send(200, "application/json", "{\"status\": "+current14Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
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
  server.send(200, "application/json", "{\"status\": "+current4Status + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
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
