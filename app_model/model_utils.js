/**
 * Fonctions utilitaires
 *
 * @class Fonctions utilitaires
 */

 /**
     * Cette méthode réalise du polyfill sur la méthode permettant un héritage entre des objets javascript
     * Ecmascript 5 introduit une méthode pour réaliser un héritage facilement mais les anciens navigateurs ne reconnaisent pas cette méthode
     *
     * @method inherit
     * @param {Object} p objet dont on veut hériter
     * @return {Object} Objet clone contenant uniquement le prototype et pas le constructeur permettant de simuler un comportement d'héritage classique
     */
function inherit(p) {
    'use strict';

    // p doit être un objet non nul
    if (p == null) throw new TypeError();

    // --- Cas normal ---
    // Si Object.create() est défini (cas des navigateurs récents 
    // implémentant les fonctions ECMAScript5)...
    if (Object.create) return Object.create(p);

    // --- Fallback (pour les vilains navigateurs) ---
    // Type de l'objet passé en paramètre de la fonction
    var t = typeof p;
    // Otherwise do some more type checking
    if (t !== "object" && t !== "function") throw new TypeError();

    // On défini un prototype vide
    function F() {}

    // On applique p à ce prototype (héritage)
    F.prototype = p;

    // On crée un nouvel héritier de p, et on le retourne
    return new F();
}

module.exports = inherit;