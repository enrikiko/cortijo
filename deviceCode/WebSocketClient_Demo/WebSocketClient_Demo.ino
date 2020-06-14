#include <ESP8266WiFi.h>
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
char host[] = "192.168.1.148";
  
WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(10);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3C (for the 64x48)
  display.display();
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  // We start by connecting to a WiFi network
  
  display.print("ssid:");
  display.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }


  display.println("IP: ");
  display.println(WiFi.localIP());

  display.display();
  delay(5000);
  display.clearDisplay();
  display.setCursor(0,0);

  // Connect to the websocket server
  if (client.connect("192.168.1.148", 3000)) {
    display.println("Connected");
    display.display();
  } else {
    display.println("Connection failed.");
    display.display();
    while(1) {
      // Hang on failure
    }
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    display.println("Handshake successful");
    display.display();
  } else {
    display.println("Handshake failed.");
    display.display();
    while(1) {
      // Hang on failure
    }  
  }
display.display();
}


void loop() {
  String data;
  Serial.println("loop()");
  while (client.connected()) {
    // Serial.println("client.connected()");
    webSocketClient.getData(data);
    Serial.println(data);
    if (data.length() > 0) {
      Serial.println("(data.length() > 0)");
      display.clearDisplay();
      display.setCursor(0,0);
      display.print("Received data: ");
      display.println(data);
      display.display();
    }
    
    // capture the value of analog 1, send it along
    // data = "Hello Miso";
    // 
    // webSocketClient.sendData(data);
    
  } 
    Serial.println("else");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Client disconnected.");
    display.display();
    while (1) {
      // Hang on disconnect.
    
  }
  
  // wait to fully let the client disconnect
  delay(3000);
  
}
