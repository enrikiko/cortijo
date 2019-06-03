#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>


const char *ssid = "<ssid>";
const char *password = "<password>";
String deviceName = "Device-1";
int port = 80;
IPAddress ipDevice(10, 0, 0, 200);
IPAddress gateway(10, 0, 0, 138);
IPAddress subnet(255, 255, 255, 0);
boolean certain;


ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);


void setup() {

  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);
  WiFi.config(ipDevice, gateway, subnet);
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


  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  setIp(ip);

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/status/true", handleRootOn);
  server.on("/status/false", handleRootOff);
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
  MDNS.update();

}

void light(boolean val){
  if(val){
    digitalWrite(LED_BUILTIN, LOW);
    }else{
      digitalWrite(LED_BUILTIN, HIGH);
      }
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
  Serial.print(digitalRead(LED_BUILTIN));
  if(certain){state="true";}
  else{state="false";};
  server.send(200, "application/json", "{\"status\": " + state + "}");
}

void handleRootOn() {
  certain=true;
  light(true);
  server.send(200, "application/json", "{\"status\": true}");
}

void handleRootOff() {
  certain=false;
  light(false);
  server.send(200, "application/json", "{\"status\": false}");
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
