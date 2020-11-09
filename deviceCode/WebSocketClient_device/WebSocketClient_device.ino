#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

const char *ssid1 = "Cuarto2.4G";
const char *password1 = "Lunohas13steps";
const char *ssid2 = "WifiSalon";
const char *password2 = "lunohas13steps";
const char *ssid4 = "Seagull";
const char *password4 = "Dober96Mila";
const char* websockets_server_host = "wss://ws.cortijodemazas.com"; //Enter server adress
const String path = "/";
const uint16_t websockets_server_port = 433; // Enter server port
const String deviceName = "Wemos_ws_001";
bool certain = false;
int RelayPin = 5; //Wemos
const uint32_t connectTimeoutMs = 5000;
String socket_id;
//int RelayPin = 0;

using namespace websockets;
WebsocketsClient client;
ESP8266WiFiMulti WiFiMulti;

void onMessageCallback(WebsocketsMessage message) {
    Serial.print("Got Message: ");
    Serial.println(message.data());
    logic(message.data());
}
void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionOpened) {
        Serial.println("Connnection Opened");
    } else if(event == WebsocketsEvent::ConnectionClosed) {
        Serial.println("Connnection Closed");
    } else if(event == WebsocketsEvent::GotPing) {
        //Serial.println("Got a Ping!");
    } else if(event == WebsocketsEvent::GotPong) {
        //Serial.println("Got a Pong!");
    }
}



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

  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);
  web_reconnect();
  client.send("Hi Server!");
  client.ping();
}

void loop() {
  if (WiFiMulti.run(connectTimeoutMs) == WL_CONNECTED) {  
    Serial.println("Connected to wifi");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    web_reconnect();
    while(client.available()) {
    client.poll();
    }
    delay(500);
    }
  //WiFi.begin();
 Serial.print("Connecting to Wifi...");
  while(WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
}

void web_reconnect() {
  socket_id = "false";
  if(client.connect(websockets_server_host)) {
    Serial.println("Waiting for Socket ID");
    while(socket_id!="false"){
      Serial.println(".");
      delay(333);
      }
    client.send("{\"name\":\""+deviceName+"\",\"tenant\":\"cortijo\"}");
  } else {
    Serial.println("WS not connected!");
  }
}

void logic(String data){
  if (data.length() > 0) {
    if ( data=="true" ){led(true);}
    else if ( data=="false" ){led(false);}
    else if ( data=="data" ){client.send("{\"data\":\""+deviceName+"\", \"device\":\""+deviceName+"\"}");}
    else {
      socket_id = data;
      blink();
      Serial.println(data);}
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
