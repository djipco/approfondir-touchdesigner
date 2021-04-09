export class Interface {

  constructor() {

    // Objet contenant le message envoyé au serveur
    this.message = {};

    // Statut de la connexion
    this.connexion = false;

    // Pastille orange
    this.cible = document.getElementById("cible");

    // Bouton de connexion
    this.bouton = document.querySelector("#connexion > button");

    // Ajout d'un écouteur sur le bouton de connexion
    this.bouton.addEventListener("click", this.gererDemarrage.bind(this));

    // Ajout d'écouteurs sur les événements tactiles et de souris
    document.body.addEventListener("touchmove", this.gererMouvement.bind(this));
    document.body.addEventListener("mousemove", this.gererMouvement.bind(this));

  }

  gererDemarrage() {

    // Masquage du champ pendant la tentative de connexion
    document.querySelector("#connexion").style.display = "none";

    // Récupération de l'adresse IP et tentative de connexion
    let url = document.getElementById("url").value;
    this.socket = new WebSocket(url);

    // Ajout d'écouteurs sur la connexion
    this.socket.addEventListener("open", this.gererSucces.bind(this));
    this.socket.addEventListener("close", this.gererEchec.bind(this));

  }

  gererSucces(e) {

    // Assignation du statut de la connexion
    this.connexion = true;

    // Affichage d'une confirmation de connexion
    console.info(`Connexion à TouchDesigner établie (${e.target.url}`);

  }

  gererEchec() {

    // Assignation du statut de la connexion
    this.connexion = false;

    // Affichage d'un message à l'usager
    alert("La connexion au serveur n'a pas pu être établie.")

    // Réaffichage de la zone de connexion
    document.querySelector("#connexion").style.display = "block";

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
    if (this.connexion) {
      this.socket.send(JSON.stringify(this.message));
    }

  }

  deplacerCible(x, y) {
    this.cible.style.left = (x - this.cible.offsetWidth / 2) + "px"
    this.cible.style.top = (y - this.cible.offsetHeight / 2) + "px";
  }

}
