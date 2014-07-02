/**
 * Modélisation d'un manager
 *
 * @class Manager
 * @extends Person
 */
var inherit = require("./model_utils.js");
var Person = require("./Person.js");

var Manager = (function () {

    Manager.prototype=inherit(Person.prototype);

    Manager.build = function () {
        return new Manager();
    };
    /**
     * Constructeur
     * @constructor
     */
    function Manager() {
        Person.apply(this, arguments);
    };


    return Manager;
}());

module.exports = Manager;