#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";
const char *ssid4 = "Seagull";
const char *password4 = "Dober96Mila";
const char* websockets_server_host = "ws.cortijodemazas.com"; //Enter server adress
const String path = "/";
const uint16_t websockets_server_port = 80; // Enter server port
const String deviceName = "Wemos_ws_001";
bool certain = false;
int RelayPin = 5; //Wemos
const uint32_t connectTimeoutMs = 5000;
//int RelayPin = 0;

using namespace websockets;

void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionOpened) {
        Serial.println("Connnection Opened");
    } else if(event == WebsocketsEvent::ConnectionClosed) {
        Serial.println("Connnection Closed");
    } else if(event == WebsocketsEvent::GotPing) {
        Serial.println("Got a Ping!");
    } else if(event == WebsocketsEvent::GotPong) {
        Serial.println("Got a Pong!");
    }
}

WebsocketsClient client;
ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  delay(500);
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid1, password1);
  WiFiMulti.addAP(ssid2, password2);
  WiFiMulti.addAP(ssid4, password4);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(RelayPin, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop() {
  if (WiFiMulti.run(connectTimeoutMs) == WL_CONNECTED) {  
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    web_reconnect();
    while(client.available()) {
    client.poll();
    }
    delay(500);
    }
  //WiFi.begin();
  while(WiFiMulti.run() != WL_CONNECTED) {
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
    client.send("{\"name\":\""+deviceName+"\",\"tenant\":\"cortijo\"}");
  } else {
    Serial.println("WS not connected!");
  }
    // run callback when messages are received
  client.onMessage([&](WebsocketsMessage message) {

      logic(message.data());

  });
}

void logic(String data){
  if (data.length() > 0) {
    
    //Serial.println(data.length());
    //show(data);
    if ( data=="true" ){led(true);}
    else if ( data=="false" ){led(false);}
    else if ( data=="data" ){client.send("{\"data\":\""+deviceName+"\"}");}
    else {blink();}
    Serial.println(data);
    }
  }

void led(boolean statu){
  certain=statu;
  digitalWrite(RelayPin, statu);
  digitalWrite(LED_BUILTIN, statu);
  }

void blink(){
  digitalWrite(LED_BUILTIN, !certain);
  delay(100);
  digitalWrite(LED_BUILTIN, certain);
  delay(100);
  digitalWrite(LED_BUILTIN, !certain);
  }
