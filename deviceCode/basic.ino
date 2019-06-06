#include <SPI.h>
#include <Ethernet.h>
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192, 168, 1, 200);
EthernetServer server(80);
boolean certian = true;
int rele1 = 11;
int rele2 = 12;

void setup() {
  pinMode(rele1, OUTPUT);
  pinMode(rele2, OUTPUT);
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer Example");
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
    while (true) {
      delay(1); // do nothing, no point running without Ethernet hardware
    }
  }
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }

  server.on("/status/true", handleRootOn);
  server.on("/status/false", handleRootOff);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());

}

void handleRootOn() {
  certain=true;
  digitalWrite(rele1, LOW);    // turn the LED off by making the voltage LOW
  digitalWrite(rele2, LOW);
  server.send(200, "application/json", "{\"status\": true}");
}

void handleRootOn() {
  certain=false;
  digitalWrite(rele1, HIGH);    // turn the LED off by making the voltage LOW
  digitalWrite(rele2, HIGH);
  server.send(200, "application/json", "{\"status\": false}");
}


void loop() {
  server.handleClient();
}
