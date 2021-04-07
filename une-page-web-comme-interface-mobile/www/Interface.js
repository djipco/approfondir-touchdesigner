export class Interface {

  constructor() {

    // Pastille orange
    this.cible = document.getElementById("cible");

    // Bouton de connexion
    this.bouton = document.querySelector("#connexion > button");

    // Ajout d'un écouteur sur le bouton de connexion
    this.bouton.addEventListener("click", this.gererDemarrage.bind(this));

    // Ajout d'écouteurs sur les mouvements tactiles et ceux de la souris
    document.body.addEventListener("touchmove", this.gererMouvement.bind(this));
    document.body.addEventListener("mousemove", this.gererMouvement.bind(this));

  }

  gererDemarrage() {

    // Masquage de la section pendant la tentative de connexion
    document.querySelector("#connexion").style.display = "none";

  }

  gererMouvement(e) {

    // Différenciation des événements de souris et de toucher (pour pouvoir tester sur mobile ou
    // sur appareil équipés d'une souris)
    if (e.type === "mousemove") {
      this.deplacerCible(e.clientX, e.clientY)
    } else if (e.type === "touchmove") {
      this.deplacerCible(e.touches[0].clientX, e.touches[0].clientY)
    }

  }

  deplacerCible(x, y) {
    this.cible.style.left = (x - this.cible.offsetWidth / 2) + "px"
    this.cible.style.top = (y - this.cible.offsetHeight / 2) + "px";
  }

}
