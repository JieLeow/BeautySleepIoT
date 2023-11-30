#include <Firebase_ESP_Client.h>
#include <ESP8266WiFi.h>

#include <time.h>

// Provide the token generation process info
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions
#include <addons/RTDBHelper.h>

// Wifi network credentials
#define WIFI_SSID "iPhone (9)"
#define WIFI_PASSWORD "12345678"

// #define WIFI_SSID "Whaley"
// #define WIFI_PASSWORD "10whaley1587"

// Insert Firebase project API Key
#define API_KEY "AIzaSyCvQ8IXZ5MC3RKuLN8bt03OGg39zrWxEnY"

// Firebase Email/PW combination Auth method
#define USER_EMAIL "lijie.leow@sjsu.edu"
#define USER_PASSWORD "aeiou123"

// Insert RTDB URL e.g. https://your-project-id.firebaseio.com/
#define DATABASE_URL "https://beautysleep-f8936-default-rtdb.firebaseio.com"

#define USER_NAME "LJ"
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// Global variable to store sensor data
int sensorValue = 0;

unsigned long lastSendTime = 0;
const long interval = 60000; // Interval to send data (60 seconds)

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  Serial.print(String(WIFI_SSID));
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());


  // Set up NTP

  // UTC
  // configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  //PST 
  configTime(-8 * 3600, 0, "pool.ntp.org", "time.nist.gov");

  // Wait for time to be fetched
  Serial.print("Fetching time from NTP server");
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("Time received");

  // Assign the project host and api key (required)
  config.database_url = DATABASE_URL;
  config.api_key = API_KEY;

  // Assign the user sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Initialize the Firebase library
  Firebase.begin(&config, &auth);
}

void loop() {
  if (Firebase.ready()) {
      // Read data from Arduino when available
    if (Serial.available()) {
      sensorValue = Serial.parseInt();
      Serial.println(sensorValue);
      Generate a random value between 400 and 700
      int randomData = random(400, 701); // 701 is exclusive

      time_t now = time(nullptr);
      struct tm *ptm = localtime(&now);

      // Format time YYYY:MMDD:HHMM:<seconds>
      char timeString[20];
      sprintf(timeString, "%04d:%02d%02d:%02d%02d:%02d", ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday, ptm->tm_hour, ptm->tm_min, ptm->tm_sec);

      String path = String(USER_NAME) + "/data/" + String(timeString);

      // Push sensor value to Firebase
      if (Firebase.RTDB.setInt(&fbdo, path, sensorValue)) {
        Serial.println("Data sent successfully");
      } else {
        Serial.println("Failed to send data");
        Serial.println(fbdo.errorReason());
      }
      
    }
  }
    // Short delay to yield to background tasks
  delay(10);
}

// void setup() {
//   Serial.begin(115200);
//   Serial.println("ESP8266 is ready");
// }

// void loop() {
//   Serial.println("Hello from ESP8266");
//   delay(1000);
// }