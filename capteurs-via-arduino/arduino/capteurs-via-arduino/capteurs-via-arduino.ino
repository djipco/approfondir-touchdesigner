#include <SharpIR.h>

// Création d'un objet SharpIR et d'une variable "capteur" pour y faire référence
SharpIR capteur(SharpIR::GP2Y0A21YK0F, A0);

void setup() {

  // Initialisation de la connexion série
  Serial.begin(9600);

}

void loop() {

  // Récupération de la distance en cm
  int distance = capteur.getDistance();

  // Récupération de la force appliquée (entre 0 et 1024)
  int force = analogRead(A1);

  // Envoie des données via la connexion série (séparées par un point-virgule)
  Serial.print(distance);
  Serial.print(';');
  Serial.println(force);

  // Utilisation d'un délai (en ms) pour éviter de surcharger la connexion série
  delay(20);

}
