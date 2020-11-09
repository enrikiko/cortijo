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
const String tenant = "cortijo";
bool certain = false;
int RelayPin = 5; //Wemos
const uint32_t connectTimeoutMs = 5000;

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
  if(client.connect(websockets_server_host)) {
    client.send("{\"name\":\""+deviceName+"\",\"tenant\":\""+tenant+"\"}");
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
      blink();
      Serial.println(data);}
    }
  }

void led(boolean relay_status){
  Serial.print("Change status to ");
  Serial.println(relay_status);
  certain=relay_status;
  digitalWrite(RelayPin, relay_status);
  digitalWrite(LED_BUILTIN, relay_status);
  client.send("OK");
  }

void blink(){
  digitalWrite(LED_BUILTIN, !certain);
  delay(100);
  digitalWrite(LED_BUILTIN, certain);
  delay(100);
  digitalWrite(LED_BUILTIN, !certain);
  }
