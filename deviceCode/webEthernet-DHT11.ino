

#include <SPI.h>
#include <Ethernet.h>
#include "DHT.h"
#define DHTPIN 2  
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
char server[] = "192.168.1.50"; 
IPAddress ip(192, 168, 0, 101);
IPAddress myDns(192, 168, 0, 1);
EthernetClient client;
boolean certain = true;
String url;

// Variables to measure the speed
unsigned long beginMicros, endMicros;
unsigned long byteCount = 0;
bool printWebData = true;  // set to false for better speed measurement
float h;
float t;

void setup() {
  Serial.begin(9600);
  dht.begin();
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    if (Ethernet.hardwareStatus() == EthernetNoHardware) {
      Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
      while (true) {
        delay(1); 
      }
    }
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
    Ethernet.begin(mac, ip, myDns);
  } else {
    Serial.println(Ethernet.localIP());
  }
  delay(1000);
}

void loop() {
  getWeatherInfo();
  sendInfo();
  delay(3000);
  certain=true;
}

void getWeatherInfo(){
  h = dht.readHumidity();
  t = dht.readTemperature();
}

void sendInfo(){
//  Serial.print(F("Humidity: "));
//  Serial.print(h);
//  Serial.print(F("%  Temperature: "));
//  Serial.print(t);
  if (client.connect(server, 8000)) {
    Serial.print("connected to ");
    Serial.println(client.remoteIP());
    // Make a HTTP request:
    url = "/set/" + String(t) + "/" + String(h);
    client.println("GET "+url+" HTTP/1.1");
    //client.println("temperature="+String(t));
    //client.println("humidity="+String(h));
    client.println();
  } else {
    Serial.println("connection failed");
  }
  Serial.print("response");
  while(certain){
    if(client.available()){
      char response = client.read();
      Serial.print(response);
      }
    if (!client.connected()) { certain = false; }
  }
  Serial.println();
 }
