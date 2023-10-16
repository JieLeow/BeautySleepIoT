#include "Adafruit_Sensor.h"
#include "DHT.h"

const int GSR = A0;
int sensorValue = 0;
int gsr_average = 0;

#define DHTPIN 2
#define DHTTYPE DHT11   

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200); // Baud rate for the GSR sensor data
  dht.begin();          // Initialize the DHT sensor
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

  // DHT Sensor Data Collection
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();
  float tempF = dht.readTemperature(true);
  float hIndexF = dht.computeHeatIndex(tempF, hum);
  float hIndexC = dht.computeHeatIndex(temp, hum, false);

  if (isnan(hum) || isnan(temp) || isnan(temp) || isnan(hIndexC)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Comma-seperated serial output
  Serial.print(gsr_average);
  Serial.print(", ");
  Serial.print(hum);
  Serial.print(", ");
  Serial.print(temp);
  Serial.print(", ");
  Serial.print(hIndexC);
  Serial.print(", ");
  Serial.print(tempF);
  Serial.print(", ");
  Serial.println(hIndexF);
}