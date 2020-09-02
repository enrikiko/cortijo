#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

const char* ssid = "Cuarto2.4G"; //Enter SSID
const char* password = "Lunohas13steps"; //Enter Password
const char* websockets_server_host = "88.18.59.194"; //Enter server adress
const String path = "/";
const uint16_t websockets_server_port = 3000; // Enter server port
const String deviceName = "Wemos_001";
bool certain = false;

using namespace websockets;
WebsocketsClient client;
ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  WiFiMulti.addAP(ssid, password);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop() {
  while(WiFi.status() == WL_CONNECTED) {
    while(client.available()) {
    client.poll();
    }
    delay(500);
    web_reconnect();
    }
  WiFi.begin();
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("No Wifi!");
    delay(1000);
  }
}

void web_reconnect() {
  //Serial.println("Connected to Wifi, Connecting to server.");
  // try to connect to Websockets server
  //bool connected = client.connect(websockets_server_host, websockets_server_port, path);
  if(client.connect(websockets_server_host, websockets_server_port, path)) {
    Serial.println("Connecetd!");
    client.send("{\"name\":\""+deviceName+"\"}");
  } else {
    Serial.println("Not Connected!");
  }
    // run callback when messages are received
  client.onMessage([&](WebsocketsMessage message) {

      logic(message.data());

  });
}

void logic(String data){
  if (data.length() > 0) {
    Serial.println(data);
    //Serial.println(data.length());
    //show(data);
    if ( data=="true" ){led(true);}
    else if ( data=="false" ){led(false);}
    else {blink();}
    }
  }

void led(boolean statu){
  certain=statu;
  digitalWrite(LED_BUILTIN, !statu);
  }

void blink(){
  digitalWrite(LED_BUILTIN, !certain);
  delay(100);
  digitalWrite(LED_BUILTIN, certain);
  delay(100);
  digitalWrite(LED_BUILTIN, !certain);
  }
