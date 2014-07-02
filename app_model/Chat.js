/**
 * Modélisation d'un chat (celui avec des gens qui discutent, pas le truc qui dort toute la journée à rien foutre)
 *
 * @class Chat
 */

var Chat = (function () {

    Chat.build = function () {
        return new Chat();
    };

    /**
     * Constructeur
     * @constructor
     */
    function Chat() {
        /**
         * Id 
         * @property id
         * @type int
         */
        this.id=0;
        /**
         * Date de début du chat (timestamp)
         * @property timeStart
         * @type int
         */
        this.timeStart = new Date().getTime();
        /**
         * Date de fin du chat (timstamp)
         * @property timeEnd
         * @type int
         */
        this.timeEnd = 0;
        /**
         * Liste des salons de chat en cours
         * @property rooms
         * @type Array<Room>
         */
        this.rooms=[];
        /**
         * Liste des utilisateurs du chat
         * @property rooms
         * @type Array<User>
         */
        this.users=[];
        /**
         * Liste des utilisateurs du chat en attente
         * @property rooms
         * @type Array<User>
         */
        this.usersWaiting=[];
        /**
         * Liste des opérateurs
         * @property operators
         * @type Array<Operator>
         */
        this.operators=[];
        /**
         * Manager du chat
         * @property manager
         * @type Manager
         */
        this.manager=null;
    }

    Chat.prototype = {
        /**
        * @method getId
        * @return {int} id du Chat
        */
        getId: function () {
            return this.id;
        },
        /**
        * @method getTimeStart
        * @return {int} Timestamp du début de la session de chat
        */
        getTimeStart:function () {
            return this.timeStart;
        },
        /**
        * @method getTimeEnd
        * @return {int} Timestamp de la fin de session de chat
        */
        getTimeEnd:function () {
            return this.timeEnd;
        },
        /**
        * @method getRoom récupère une room selon un id
        * @param {Number} idRoom id de la room recherché
        * @return {Room} Renvoie la room recherché sinon undefined
        */
        getRoom:function (idRoom) {
            var rooms = this.getRooms();
            for (var i = 0; i < rooms.length; i++) {
                if (rooms[i].id == idRoom) {
                   return rooms[i];
                }
            }
            throw "No Room For This Id : "+idRoom;
        },
        /**
        * @method getRooms
        * @return {Array<Room>} Liste des salons de chat en cours
        */
        getRooms:function () {
            return this.rooms;
        },
        /**
        * @method getRoomsWithoutOperators
        * @return {Array<Room>} Liste des salons de chat en cours sans operateur
        */
        getRoomsWithoutOperator:function () {
            var newArray=[];
            function functionFilter(room){

                if(!room.hasOperator()){
                    newArray.push({
                        "id":room.getId(),
                        "timeStart":room.getTimeStart(),
                        "streamText":room.getLastStreamText(3)
                    });
                }
            }
            this.getRooms().forEach(functionFilter);

            return newArray;
        },
        /**
        * @method getRoomsWithThisOperator
        * @param {Number} idOperator id de l'opérateur dont on veut les rooms
        * @return {Array<Room>} Liste des salons de chat de l'operateur en parametre
        */
        getRoomsWithThisOperator:function (idOperator) {
            var newArray=[];
            function functionFilter(room){

                if(room.hasThisOperator(idOperator)){
                    newArray.push({
                        "id":room.getId(),
                        "nbUnreadMessages":room.nbUnreadMessages,
                    });
                }
            }
            this.getRooms().forEach(functionFilter);

            return newArray;
        },
        /**
        * @method getUser
        * @param {Number} idRoom id du user qu'on cherche
        * @return {Array<User>} Liste des utilisateurs connecté au chat
        */
        getUser:function (idUser) {
            var users = this.getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == idUser) {
                   return users[i];
                }
            }
            throw "No User For This Id : "+idUser;
        },
        /**
        * @method getUsers
        * @return {Array<User>} Liste des utilisateurs connecté au chat
        */
        getUsers:function () {
            return this.users;
        },
        /**
        * @method getUsersWaiting
        * @return {Array<User>} Liste des utilisateurs connecté au chat mais en attente de prise en charge
        */
        getUsersWaiting:function () {
            return this.usersWaiting;
        },
        /**
        * @method getOperator récupère une room selon un id
        * @param {Number} idOperator id de l'opérateur recherché
        * @return {Operateur} Renvoie l'opérateur recherché sinon undefined
        */
        getOperator:function (idOperator) {
            var operators = this.getOperators();
            for (var i = 0; i < operators.length; i++) {
                if (operators[i].id == idOperator) {
                   return operators[i];
                }
            }
            return undefined;
        },
        /**
        * @method getOperatorByLoginMdp récupère une room selon login/mdp
        * @param {login} login
        * @param {mdp} mdp
        * @return {Operateur} Renvoie l'opérateur recherché sinon undefined
        */
        getOperatorByLoginMdp:function (login,pwd) {
            var operators = this.getOperators();
            for(var i=0;i<operators.length;i++){
                if(operators[i].getLogin()===login && operators[i].getPassword()===pwd){
                    return operators[i];
                }
            }
            return undefined;
        },
        /**
        * @method getOperators
        * @return {Array<Operator>} Liste des opérateurs présents
        */
        getOperators:function () {
            return this.operators;
        },
        /**
        * @method getManager
        * @return {Manager} Manager du chat
        */
        getManager:function () {
            return this.manager;
        },
        /**
        * @method addUser
        * @param {User} user Utilisateur ajouté
        */
        addUser:function(user){
            this.users.push(user);
        },
        /**
        * @method addUserWaiting
        * @param {User} user Utilisateur ajouté
        */
        addUserWaiting:function(user){
            this.usersWaiting.push(user);
        },
        /**
        * @method addRoom
        * @param {Room} room Salon de chat ajouté
        */
        addRoom:function(room){
            this.rooms.push(room);
        },
        /**
        * @method addOperator
        * @param {Operator} operator Opérateur ajouté
        */
        addOperator:function(operator){
            this.operators.push(operator);
        },
        /**
        * @method setManager
        * @param {Manager} manager Manager du chat
        */
        setManager:function(manager){
            this.manager=manager;
        },
        /**
        * @method removeRoom
        * @param {Room} room Room a supprimer
        */
        removeRoom:function(room){
            //Traitement avant destruction, ensuite destruction
            room.beforeEnd();
            //On supprime la room du chat
            this.getRooms().splice(this.getRooms().indexOf(room),1);
        },
        /**
        * @method hasThisOperator
        * @param {String} login Login
        * @param {String} pwd Password
        * @return {boolean}
        */
        hasThisOperator:function(login,pwd){

            var operators = this.getOperators();
            for(var i=0;i<operators.length;i++){
                if(operators[i].getLogin()===login && operators[i].getPassword()===pwd){
                    return true;
                }
            }
            return false;
        }
    };
    return Chat;
}());

module.exports = Chat;