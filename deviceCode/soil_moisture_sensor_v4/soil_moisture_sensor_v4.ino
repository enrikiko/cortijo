#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#define USE_SERIAL Serial
#define uS_TO_S_FACTOR 1000000ULL  /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  3600        /* Time ESP32 will go to sleep (in seconds) */

const char *ssid1 = "cortijo_south_1";
const char *ssid2 = "cortijo_north_1";
const char *ssid3 = "cortijo_east_1";
const char *ssid4 = "cortijo_west_1";
const char *password = "xxxx";
const String tenant = "cortijo";
const String deviceName = "Soil_frontyard";
const char *deviceNameHost = "Soil_frontyard";

WiFiMulti wifiMulti;

#include "DHT.h"
#define DHTPIN 22
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
//const int led = LED_BUILTIN;

void setup() {

  Serial.begin(115200);
  delay(1000);
  dht.begin();
  wifiMulti.addAP(ssid1, password);
  wifiMulti.addAP(ssid2, password);
  wifiMulti.addAP(ssid3, password);
  wifiMulti.addAP(ssid4, password);
  send_data();
  delay(1000);
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("Setup ESP32 to sleep for every " + String(TIME_TO_SLEEP) + " Seconds");
  Serial.println("Going to sleep now");
  Serial.flush();
  esp_deep_sleep_start();

}

void loop() {

}


void send_data() {
  bool sent=false;
    if((wifiMulti.run() == WL_CONNECTED)) {
      while (sent==false) {
        //digitalWrite(led, 1);
        //String webtext ;
        float hum = dht.readHumidity();
        float temp = dht.readTemperature();
        float asoilmoist = map(analogRead(32),1350, 3200, 100, 0);
        if(asoilmoist >= 100){asoilmoist=100;}
        if(asoilmoist <= 0){asoilmoist=0;}
        sent=true;
        if (isnan(hum) || isnan(temp)) {
          Serial.println(F("Failed to read from DHT sensor!"));
          sent=false;
        }else{
        HTTPClient http;
        USE_SERIAL.print("[HTTP] begin...\n");
        http.begin("http://back.app.cortijodemazas.com/sensor/soil/"+tenant+"/"+deviceName+"/"+(String) temp+"/"+(String) hum+"/"+(String) asoilmoist);
        USE_SERIAL.print("[HTTP] GET...\n");
        int httpCode = http.GET();
        if(httpCode > 0) {
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
        http.end();
        }
      }
    }
}
