
void setup() {
  Serial.begin(115200);
  Serial.println("ESP8266 is ready");
}

void loop() {
  Serial.println("Hello from ESP8266");
  delay(1000);
}