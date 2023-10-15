#include "Adafruit_Sensor.h"

const int GSR = A0;
int sensorValue = 0;
int gsr_average = 0;

#define DHTPIN 2
#define DHTTYPE DHT11   
void setup() {
  Serial.begin(115200); // Baud rate for the GSR sensor data}
}
void loop() {
  // GSR Sensor Data Collection - take average of 10 values at 0.1 sec interval
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sensorValue = analogRead(GSR) + 87;
    sum += sensorValue;
    delay(100); //0.1 seconds * 10 = 1 second
  }
  gsr_average = sum / 10;

  Serial.print(gsr_average);
}

}