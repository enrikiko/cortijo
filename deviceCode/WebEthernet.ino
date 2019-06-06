/*
  Web Server

 A simple web server that shows the value of the analog input pins.
 using an Arduino Wiznet Ethernet shield.

 Circuit:
 * Ethernet shield attached to pins 10, 11, 12, 13
 * Analog inputs attached to pins A0 through A5 (optional)

 created 18 Dec 2009
 by David A. Mellis
 modified 9 Apr 2012
 by Tom Igoe
 modified 02 Sept 2015
 by Arturo Guadalupi
 
 */

#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192, 168, 1, 177);

// Initialize the Ethernet server library
// with the IP address and port you want to use
// (port 80 is default for HTTP):
EthernetServer server(80);

boolean certain = true;
int rele1 = 5;
int rele2 = 4;

void setup() {
  pinMode(rele1, OUTPUT);
  pinMode(rele2, OUTPUT);
  // You can use Ethernet.init(pin) to configure the CS pin
  //Ethernet.init(10);  // Most Arduino shields
  //Ethernet.init(5);   // MKR ETH shield
  //Ethernet.init(0);   // Teensy 2.0
  //Ethernet.init(20);  // Teensy++ 2.0
  //Ethernet.init(15);  // ESP8266 with Adafruit Featherwing Ethernet
  //Ethernet.init(33);  // ESP32 with Adafruit Featherwing Ethernet

  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer Example");

  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip);

  // Check for Ethernet hardware present
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
    while (true) {
      delay(1); // do nothing, no point running without Ethernet hardware
    }
  }
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }

  // start the server
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}


void loop() {
  // listen for incoming clients
  String stringC;
  EthernetClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        
        char c = client.read();
        Serial.write(c);
        stringC=stringC+c;
      }
      else{
        //client.print(stringC.substring(4,15));
        if(stringC.substring(4,15)=="/rele1/true"){digitalWrite(rele1, LOW);}
        if(stringC.substring(4,16)=="/rele1/false"){digitalWrite(rele1, HIGH);}
        if(stringC.substring(4,15)=="/rele2/true"){digitalWrite(rele2, LOW);}
        if(stringC.substring(4,16)=="/rele2/false"){digitalWrite(rele2, HIGH);}
        client.print(stringC);
        client.stop();
        stringC="";
        }
    }
    delay(1);
    Serial.println("client disconnected");
  }
}
