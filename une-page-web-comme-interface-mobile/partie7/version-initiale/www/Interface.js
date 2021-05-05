export class Interface {

  constructor() {

    // Objet contenant le message envoyé au serveur
    this.message = {};

    // Statut de la connexion
    this.connexion = false;

    // Pastille orange (cible)
    this.cible = document.getElementById("cible");

    // Bouton de connexion
    this.bouton = document.querySelector("#connexion > button");

    // Ajout d'écouteurs sur les événements tactiles et de souris
    document.body.addEventListener("touchmove", this.gererMouvement.bind(this));
    document.body.addEventListener("mousemove", this.gererMouvement.bind(this));
    document.body.addEventListener("mousedown", this.gererClic.bind(this));
    document.body.addEventListener("mouseup", this.gererClic.bind(this));
    document.body.addEventListener("touchstart", this.gererClic.bind(this));
    document.body.addEventListener("touchend", this.gererClic.bind(this));

    // Ajout d'écouteurs sur les événements d'orientation et de mouvement
    window.addEventListener('deviceorientation', this.gererOrientation.bind(this)); // Gyroscope
    window.addEventListener('devicemotion', this.gererAcceleration.bind(this));     // Accéléromètre

    // Ajout d'un écouteur sur le bouton de connexion
    this.bouton.addEventListener("click", this.autoriser.bind(this));

  }

  autoriser(e) {

    // Masquage de la zone de connexion
    document.querySelector("#connexion").style.display = "none";

    // Vérifier si les événements d'orientation sont disponibles sur cette plateforme
    if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {

      // Demande de permission à l'usager pour l'utilisation des événements d'orientation
      DeviceOrientationEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          console.info("L'usager a autorisé l'utilisation des événements d'orientation.");
          window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
          window.addEventListener('devicemotion', this.gererAcceleration.bind(this));
          this.gererDemarrage();
        }
      });

    } else {
      alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
      this.gererDemarrage();
    }

  }

  gererDemarrage() {

    // Récupération de l'adresse IP et tentative de connexion
    let url = document.getElementById("url").value;
    this.socket = new WebSocket(url);

    // Ajout d'écouteurs sur la connexion
    this.socket.addEventListener("open", this.gererOuverture.bind(this));
    this.socket.addEventListener("close", this.gererFermeture.bind(this));
    this.socket.addEventListener("error", this.gererErreur.bind(this));

  }

  gererOuverture(e) {

    // Assignation du statut de la connexion
    this.connexion = true;

    // Affichage d'une confirmation de connexion
    console.info(`Connexion à TouchDesigner établie (${e.target.url}`);

  }

  gererFermeture() {

    // Assignation du statut de la connexion
    this.connexion = false;

    // Affichage d'un message à l'usager
    alert("La connexion au serveur a été fermée.")

    // Réaffichage de la zone de connexion
    document.querySelector("#connexion").style.display = "block";

  }

  gererErreur() {

    // Assignation du statut de la connexion
    this.connexion = false;

    // Affichage d'un message à l'usager
    alert("La connexion au serveur n'a pas pu être établie car une erreur est survenue")

    // Réaffichage de la zone de connexion
    document.querySelector("#connexion").style.display = "block";

  }

  gererOrientation(e) {

    this.message.alpha = e.alpha;
    this.message.beta = e.beta;
    this.message.gamma = e.gamma;

    // Envoi du message au format JSON
    this.envoyer();

  }

  gererAcceleration(e) {
    
    this.message.ax = e.acceleration.x
    this.message.ay = e.acceleration.x
    this.message.az = e.acceleration.x

    // Envoi du message au format JSON
    this.envoyer();

  }

  gererMouvement(e) {

    // Différenciation des événements de souris et de toucher (pour pouvoir tester sur mobile ou
    // sur appareil équipés d'une souris)
    if (e.type === "mousemove") {
      this.message.x = e.clientX / window.innerWidth;
      this.message.y = - (e.clientY / window.innerHeight);
      this.deplacerCible(e.clientX, e.clientY)
    } else if (e.type === "touchmove") {
      this.message.x = e.touches[0].clientX / window.innerWidth;
      this.message.y = - (e.touches[0].clientY / window.innerHeight);
      this.deplacerCible(e.touches[0].clientX, e.touches[0].clientY)
    }

    // Envoi du message au format JSON
    this.envoyer();

  }

  gererClic(e) {

    // Identification du bouton pesé (utilisation du ID, de la classe ou du nom de la balise)
    let cible = e.target.id || e.target.classList[0] || e.target.localName;

    // Assignation du statut: 0 (inactif) et 1 (actif)
    if (e.type === "mousedown" || e.type === "touchstart") {
      this.message[cible] = 1;
    } else if (e.type === "mouseup" || e.type === "touchend") {
      this.message[cible] = 0;
    }

    // Mise à jour de l'opacité de la cible locale
    this.cible.style.opacity = this.message[cible] ? "1" : "0.6";

    // Envoi du message au format JSON
    this.envoyer();

  }

  deplacerCible(x, y) {
    this.cible.style.left = (x - this.cible.offsetWidth / 2) + "px"
    this.cible.style.top = (y - this.cible.offsetHeight / 2) + "px";
  }

  envoyer() {

    if (this.connexion) {
      this.socket.send(JSON.stringify(this.message));
    }

  }

}
