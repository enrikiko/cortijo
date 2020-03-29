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
String deviceName = "Wemos-watering";
String currentStatus = "false";
int saveTime = 1000; //1seg
String wifiName;
long timeout;
boolean checkTimeout = false;

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
  WiFiMulti.addAP(ssid3, password3);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  //WiFi.config(ipDevice, dns, gateway, subnet);
  WiFi.begin();
  WiFi.hostname(deviceName);

  while (WiFiMulti.run() != WL_CONNECTED) {
    //Serial.print(".");
    delay(1000);
  }

  wifiName = WiFi.SSID();

  String ip = WiFi.localIP().toString();
  //Serial.println("");
  //Serial.println("");
  //Serial.println("");
  //Serial.print("IP:");
  //Serial.println(ip);

  digitalWrite(LED_BUILTIN, LOW);

  setIp(ip);



  if (MDNS.begin("esp8266")) {
    //Serial.println("MDNS responder started");
  }

  server.on("/"+deviceName+"/status/true", handleRoot5true);
  server.on("/"+deviceName+"/status/false", handleRoot5false);
  server.on("/"+deviceName+"/status", handleStatus);
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop() {

  while(WiFiMulti.run() == WL_CONNECTED){
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
void checkTime(){
  if(checkTimeout){
    Serial.println("Checkin...");
    Serial.println(timeout-millis());
    if(timeout<=millis()){
      Serial.println("auto swich off");
      swich(false);
     }
   }
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
      //Serial.print("[HTTP] begin...\n");
      if (http.begin(client, "http://192.168.1.50:8000/device/"+deviceName+"/"+currentStatus+"/"+ip+":"+port)) {
        //Serial.print("[HTTP] GET CODE: ");
        int httpCode = http.POST();
        if (httpCode > 0) {
          //Serial.println(httpCode);
          if (httpCode == 200 ) {
            certain = true;
            //Serial.print("[HTTP] GET BODY: ");
            //Serial.println(http.getString());
          }
        } else {
          //Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
        http.end();
      } else {
        //Serial.printf("[HTTP} Unable to connect\n");
      }
    }
    delay(1000);
  }
}

void handleStatus() {
  server.send(200, "application/json", "{\"status\":" + currentStatus + ",\"SSID\":\"" + wifiName + "\",\"SIGNAL\":" + WiFi.RSSI() + "}");
}

void handleRoot5true() {
  swich(true);
  for (uint8_t i = 0; i < server.args(); i++) {
    if(server.argName(i)=="time"){settimeout(server.arg(i));}
  }
}
void handleRoot5false() {
  swich(false);
}
void swich(boolean state){
  digitalWrite(5, state);
  light(state);
  certain=state;
  checkTimeout=state;
  if(certain){currentStatus="true";}
  else{currentStatus="false";};
  server.send(200, "application/json", "{\"status\": "+currentStatus+"}");
}
void settimeout(String lapse){
  int lapseTime=lapse.toInt();
  timeout=millis()+lapseTime+saveTime;
  Serial.println(timeout);
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