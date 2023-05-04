#include <Ethernet.h>
#include <math.h>

byte mac[] = {0xA8, 0x61, 0x0A, 0xAE, 0x94, 0x82}; // @Arduino Ethernet
byte ip[] = {192, 168, 1, 98}; // @Arduino Ethernet

char server[] = "192.168.1.99"; // @server IP
int port = 80; // @server Port

String readString;

int ledPin1 = 2;
int ledPin2 = 3;
int ledPin3 = 5;
int ledPin4 = 6;
int ledPin5 = 7;
int ledStatus = false;

EthernetClient client;

void setup()
{

  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
  pinMode(ledPin4, OUTPUT);
  pinMode(ledPin5, OUTPUT);
  
  /*
  Serial.begin(9600); // mise en marche liaison série
  //Ethernet.begin(mac, ip);
  if (Ethernet.begin(mac) == 0)
  {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    for (;;)
      ;
  }
  delay(2000);
  Serial.println("connecting...");
  */
}

void loop()
{
  //capture();
  //traitement();
  chargement();
}

void capture()
{
  if (client.connect(server, port))
    {
      Serial.println("connected");
      Serial.println("toto");
      Serial.println(client.print("GET /api/place?="));
      client.println(" HTTP/1.1");
      client.print("Host: ");
      client.println(server);
      Serial.println("Connection: close");
      client.println();
      client.stop();
      client.println();
    }
    else
    {
        Serial.println("connection failed");
    }
}

void traitement()
{
  digitalWrite(ledPin1, HIGH);
  Serial.println("Lumiere allumée");
  delay(1000);
  digitalWrite(ledPin1, LOW);
  Serial.println("Lumiere éteinte");
  delay(1000);
  /*
  if (ledStatus)
  {
    digitalWrite(led, HIGH);
  } //Allumer les lumieres exterieurs
  else
  {
    digitalWrite(led, LOW);
  } //Eteindre les lumieres exterieurs
  */
}

void chargement() {
  // fait défiler la barre de LED de droite à gauche
  for (int i = 5; i >= 0; i--) {
    digitalWrite(ledPin1, i == 1 ? HIGH : LOW);
    digitalWrite(ledPin2, i == 2 ? HIGH : LOW);
    digitalWrite(ledPin3, i == 3 ? HIGH : LOW);
    digitalWrite(ledPin4, i == 4 ? HIGH : LOW);
    digitalWrite(ledPin5, i == 5 ? HIGH : LOW);
    delay(100); // attente de 100 ms entre chaque LED
  }
  delay(500);
}
