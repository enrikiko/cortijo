#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
//#include <WiFiClientSecureBearSSL.h>
//#include <WiFiClientSecure.h>
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
const String tenant = "cortijo";
const String deviceName = "Watering_frontyard";
const char *deviceNameHost = "Watering_frontyard";
const String defaultTimeOut = "1200000";
String currentStatus = "false";
int saveTime = 1000; //1seg
String wifiName;
long timeout;
boolean checkTimeout = false;
boolean useOTA = false;

int port = 80;

IPAddress ipDevice(192, 168, 1, 102);
IPAddress dns(80, 58, 61, 250);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
boolean certain;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(port);

void setup() {

  Serial.begin(115200);
  
  pinMode(5, OUTPUT);
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
  Serial.println("");
  Serial.println("");
  Serial.println("");
  Serial.print("IP:");
  Serial.println(ip);
  digitalWrite(LED_BUILTIN, LOW);

  setIp(ip);

  //if (MDNS.begin("esp8266")) {
  //  Serial.println("MDNS responder started");
  //}

  server.on("/"+deviceName+"/status/true", handleRoot5true);
  server.on("/"+deviceName+"/status/false", handleRoot5false);
  server.on("/"+deviceName+"/status", handleStatus);
  server.on("/"+deviceName+"/ota/true", startOTA);
  server.on("/"+deviceName+"/ota/false", stopOTA);
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){
    if(useOTA == true) {
      ArduinoOTA.handle();
    }
    server.handleClient();
    checkTime();
  }
    
  WiFi.begin();
  
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
    checkTime();
  }
  
  wifiName = WiFi.SSID();

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
    delay(5000);
    if ((WiFiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      Serial.print("[HTTP] begin...\n");
      if (http.begin(client, "http://back.app.cortijodemazas.com/device/"+tenant+"/"+deviceName+"/"+currentStatus+"/"+ip+":"+port)) {
        Serial.println("[HTTP] POST CODE: ");
        int httpCode = http.POST("");
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
  }
}

void handleStatus() {
  server.send(200, "application/json", "{\"status\":" + currentStatus + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" +  WiFi.RSSI() + ",\"OTA\":" + useOTA + "}");
}

void handleRoot5true() {
  swich(true);
  settimeout(defaultTimeOut);
  for (uint8_t i = 0; i < server.args(); i++) {
    if(server.argName(i)=="time"){settimeout(server.arg(i));}
  }
  Serial.println("handleRoot5true");
}
void handleRoot5false() {
  swich(false);
  Serial.println("handleRoot5false");
}
void swich(boolean state){
  digitalWrite(5, state);
  light(state);
  if(state){currentStatus="true";}
  else{currentStatus="false";};
  server.send(200, "application/json", "{\"status\": "+currentStatus+"}");
}
void settimeout(String lapse){
  int lapseTime=lapse.toInt();
  timeout=millis()+lapseTime+saveTime;
  checkTimeout=true;
  //Serial.println(timeout);
  }
void checkTime(){
  if(checkTimeout){
    //Serial.println("Checkin...");
    //Serial.println(timeout-millis());
    if(timeout<=millis()){
      Serial.println("auto swich off");
      swich(false);
      checkTimeout=false;
     }
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
