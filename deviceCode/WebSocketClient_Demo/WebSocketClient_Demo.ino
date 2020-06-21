#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketClient.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 0  // GPIO0
Adafruit_SSD1306 display(OLED_RESET);

const char* ssid     = "Seagull";
const char* password = "Dober96Mila";
char path[] = "/";
char host[] = "88.18.59.58";
int port = 3000;
const String deviceName = "Wemos_001";

boolean enrolled = false;

ESP8266WiFiMulti WiFiMulti;
WebSocketClient webSocketClient;
WiFiClient client;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH); 
  Serial.begin(115200);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.display();
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);

  WiFiMulti.addAP(ssid, password);
  WiFi.hostname(deviceName);
  
}


void loop() {

  while (WiFiMulti.run() == WL_CONNECTED) {
  
    while (client.connected()) {
      String data;
      webSocketClient.getData(data);
      //Serial.println(data);
      logic(data);
    } 
    
    delay(300);
    show("Disconected");
    web_reconnect();

  }

  WiFi.begin();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
  }
  
}

void show(String msn){
  display.clearDisplay();
  display.setCursor(0,0);
  display.println(msn);
  display.display();
  }
    
void led(boolean statu){
  digitalWrite(LED_BUILTIN, !statu);
  }
  
void blink(){
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  delay(100);
  digitalWrite(LED_BUILTIN, HIGH);
  }
  
void web_reconnect() {
  blink();
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (client.connect(host, port)) {
    show("Connected");
  } else {
    show("Connected fails.");
  }
  if (webSocketClient.handshake(client)) {
    show("Handshake successful");
  } else {
    show("Handshake failed.");
  }
  send("{\"name\":\""+deviceName+"\"}");
}
void send(String msg){webSocketClient.sendData(msg);}

void logic(String data){
  if (data.length() > 0) {
        //show(data);
        if ( data=="true" ){led(true);}
        else if ( data=="false" ){led(false);}
        else if ( data=="ping" ){send("pong");}
        blink();
      }
  }
