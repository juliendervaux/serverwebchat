/**
 * Modélisation d'une personne
 *
 * @class Person
 */
var Person = (function () {
 
    /**
     * Constructeur
     * @constructor
     */
    function Person(id) {
        /**
        * ID Personne 
        * @property id
        * @type String
        */

        this.id=id;
        /**
        * Temps début de connexion
        * @property timeStart
        * @type int
        */
        this.timeStart= (new Date()).getTime();
    };

    Person.prototype = {
        /**
        * @method getName
        * @return {String} id du Chat
        */
        getId: function () {
            return this.id;
        },
        /**
        * @method getTimeStart
        * @return {int} Timestamp de la première connexion
        */
        getTimeStart: function () {
            return this.timeStart;
        }

    };
    return Person;
}());

module.exports = Person;