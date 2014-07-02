/**
 * Modélisation d'un opérateur
 *
 * @class Operator
 * @extends Person
 */
var inherit = require("./model_utils.js");
var Person = require("./Person.js");

var Operator = (function () {

	Operator.prototype=inherit(Person.prototype);

    /**
     * Constructeur
     * @constructor
     */
    function Operator(idOperator,login,password) {
        Person.apply(this, arguments);

        /**
        * Login de l'opérateur
        * @property login
        * @type String
        */
        this.login=login;
        /**
        * Mot de passe de l'opérateur en SHA256
        * @property password
        * @type String
        */
        this.password=password;
        /**
        * Timestamp derniere activite
        * @property lastActivity
        * @type int
        */
        this.lastActivity=(new Date()).getTime();
    }

    Operator.prototype.getLogin=function(){
        return this.login;
    };

    Operator.prototype.getPassword=function(){
        return this.password;
    };

    return Operator;
}());

module.exports = Operator;