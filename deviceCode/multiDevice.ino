#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>


const char *ssid = "iPhone";
const char *password = "123443211";
String deviceName = "Enrique1";
int port = 80;
IPAddress ipDevice(10, 0, 0, 200);
IPAddress gateway(10, 0, 0, 138);
IPAddress subnet(255, 0, 0, 0);
boolean certain;





ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {

  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);
  //WiFi.config(ipDevice, gateway, subnet);
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

int pins[] = {16,5,4,0,2,14,12,13,15}
for (int i = 0; i < sizeof(pins); i++){
  pinMode(pins[i], OUTPUT);
  digitalWrite(pins[i], HIGH);
}
// pinMode(16, OUTPUT);
// pinMode(5, OUTPUT);
// pinMode(4, OUTPUT);
// pinMode(0, OUTPUT);
// pinMode(2, OUTPUT);
// pinMode(14, OUTPUT);
// pinMode(12, OUTPUT);
// pinMode(13, OUTPUT);
// pinMode(15, OUTPUT);
// // pinMode(TX, OUTPUT);
// // pinMode(RX, OUTPUT);
//
// digitalWrite(16, HIGH);
// digitalWrite(5, HIGH);
// digitalWrite(4, HIGH);
// digitalWrite(0, HIGH);
// digitalWrite(2, LOW);
// digitalWrite(14, HIGH);
// digitalWrite(12, HIGH);
// digitalWrite(13, HIGH);
// digitalWrite(15, HIGH);
// // digitalWrite(TX, HIGH);
// // digitalWrite(RX, HIGH);

  setIp(ip);

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/set/multi", handleStatus);
  //server.on("/status/false", handleRootOff);
  server.on("/info", handleInfo);

//  server.on("/inline", []() {
//    server.send(200, "text/plain", "this works as well");
//  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {

  server.handleClient();
  //MDNS.update();

}


void setIp(String ip){
  boolean certain = false;
  while(!certain){
    if ((WiFiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      Serial.print("[HTTP] begin...\n");
      if (http.begin(client, "http://88.8.67.178:3371/new/"+deviceName+"/true/"+ip+":"+port)) {
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

void handleInfo() {
  String state;
  if(certain){
    server.send(200, "application/json", "{\"status\": true}");
  }else{
    server.send(200, "application/json", "{\"status\": false}");
  };

}

void types(String a){Serial.println("it's a String");}
void types(int a)   {Serial.println("it's an int");}
void types(char* a) {Serial.println("it's a char*");}
void types(float a) {Serial.println("it's a float");}

void handleStatus() {
  for (uint8_t i = 0; i < server.args(); i++) {
    //Serial.print( " " + server.argName(i) + ": " + server.arg(i) + "\n");
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, server.arg(i));
    setPin(doc);
  }
  server.send(200, "application/json", "{\"status\": true}");
}

void setPin(StaticJsonDocument<200> doc){
  for (int i = 0; i < sizeof(pins); i++){
    digitalWrite(pins[i], doc[pins[i].toString());
  }

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
