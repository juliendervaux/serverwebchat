/**
 * Modélisation d'un utilisateur
 *
 * @class User
 * @extends Person
 */
var inherit = require("./model_utils.js");
var Person = require("./Person.js");

var User = (function () {

    User.prototype=inherit(Person.prototype);

    /**
     * Constructeur
     * @constructor
     */
    function User(idUser,sessionID) {
        Person.apply(this, arguments);

        /**
        * SessionID Personne 
        * @property sessionID
        * @type String
        */
        this.sessionID=sessionID;
    }

    User.prototype.getSessionID=function(){
        if(this.sessionID===null){
            throw "No session set";
        }
        return this.sessionID;
    };

    return User;
}());

module.exports = User;