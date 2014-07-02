/**
 * Modélisation d'un salon de chat
 *
 * @class Room
 */
var Room = (function () {

    /**
     * Constructeur
     * @constructor
     */
    function Room(io,sessionStore,id) {
        /*
        * Io - Objet de gestion de socketio
        * @property IO
        * @type socketio
        */
        this.io=io;
        /**
        * Id 
        * @property id
        * @type int
        */
        this.id=id;
        /**
        * Utilisateur 
        * @property user
        * @type User
        */
        this.user=null;
        /**
        * Operateur
        * @property operator
        * @type Operator
        */
        this.operator=null;
        /**
        * Socket Operateur
        * @property socket
        * @type Socket
        */
        this.socketOperator=null;
        /**
        * Flux des messages échangés entre les deux acteurs 
        * @property streamText
        * @type Array<Message>
        * Format Message : {type (usr|opr,text (String),time (Number));
        */
        this.streamText=[];
        /**
        * Temps début de connexion
        * @property timeStart
        * @type int
        */
        this.timeStart= (new Date()).getTime();
        /**
        * Nombre de messages non envoyés à l'opérateur
        * @property nbMessagesUnread
        * @type int
        */
        this.nbUnreadMessages= 0;
        /**
        * Session Store
        * @property sessionStore
        * @type SessionStore
        */
        this.sessionStore= sessionStore;
    }

    Room.prototype = {
        /**
        * @method getTimeStart
        * @return {int} Timestamp de la première connexion
        */
        getTimeStart: function () {
            return this.timeStart;
        },
        /**
        * @method getId
        * @return {int} id du Chat
        */
        getId: function () {
            return this.id;
        },
        /**
        * @method getUser
        * @return {User} Utilisateur du chat
        */
        getUser:function () {
            if(this.user===null){
                throw "No User Set";
            }
            return this.user;
        },
        /**
        * @method getOperator
        * @return {Operator} Opérateur du chat
        */
        getOperator:function () {
            if(this.operator===null){
                throw "No Operator Set";
            }
            return this.operator;
        },
        /**
        * @method getOperator
        * @return {Operator} Opérateur du chat
        */
        getSocketOperator:function () {
            if(this.socketOperator===null){
                throw "Not connected";
            }
            return this.socketOperator;
        },
        /**
        * @method getOperator
        * @return {Operator} Opérateur du chat
        */
        isOperatorConnected:function () {
            if(this.socketOperator!==null){
                return true;
            }else{
                return false;
            }
        },
        /**
        * @method getStreamText
        * @return {Array<Message>} Tableau des messages échangés
        */
        getStreamText:function () {
            return this.streamText;
        },
        /**
        * @method getLastStreamText
        * @param {int} nb Nombre de messages a recupéré
        * @return {Array<Message>} Tableau des derniers messages échangés
        */
        getLastStreamText:function (nb) {
            if(nb>this.streamText.length){nb=this.streamText.length;}
            return this.streamText.slice(-1*nb);
        },
        /**
        * @method setUser
        * @param {User} Utilisateur à ajouter
        */
        setUser:function(user){
            this.user=user;
        },
        /**
        * @method setOperator
        * @param {Operator} Opérateur à ajouter
        */
        setOperator:function(operator){
            this.operator=operator;
        },
        /**
        * @method setSocketOperator
        * @param {Socket} Socket Opérateur à ajouter
        */
        setSocketOperator:function(socketOperator){
            socketOperator.join(this.id);
            this.socketOperator=socketOperator;
        },
        /**
        * @method addTextToStream
        * @param {socket} Socket de l'émetteru du message
        * @param {String} text Contenu du message
        * @param {String} person Auteur du message (opérateur ou user) Type usr|ope
        * @param {boolean} isRobot To know if it's from the server or from the socket origin
        */
        addTextToStream:function(socket,text,person,isRobot){

            if (typeof isRobot == "undefined") {isRobot = false;}

            this.streamText.push({
                type:person,
                text:text,
                time:(new Date()).getTime()
            });

            //Count messages if the operator is not connected
            if(person == 'usr' && !this.hasSocketOperator()){
                this.nbUnreadMessages++;
            }

            if(isRobot){
                //Send to all if the server is the emitter
                socket.emit('msg', { text: text,type:person});
            }


            //Send to all except the current socket
            this.io.of('/operator').in(this.id).except(socket.id).emit('msg', { text: text,type:person});
            this.io.of('/user').in(this.id).except(socket.id).emit('msg', { text: text,type:person});
            
        },
        /**
        * @method isUserConnected
        * Check si l'utilisateur est connecté
        */
        isUserConnected:function(operator){
            if(this.getUser() !== null){
                if(this.getUser().getSocket() !== null){
                    return true;
                }
            }

            return false;
        },
        /**
        * @method removeUser
        * Retire l'utilisateur de la room
        */
        removeUser:function(){
            this.destroyUserSession();
            this.removeUserSockets();
        },
        /**
        * @method destoyUserSession
        * Détruit la session utilisateur
        */
        destroyUserSession:function(){
            var sessionID = this.user.getSessionID();
            this.sessionStore.load(sessionID, function (err, session) {
                if (!err && session) {
                    session.destroy();
                }
            });
        },
        /**
        * @method removeUserSockets
        * Retire les sockets utilisateurs
        */
        removeUserSockets:function(){

            var userSockets = this.io.of('/user').clients(this.id);

            for(var i = 0 ; i<userSockets.length;i++){

                userSockets[i].leave(this.id);
                userSockets[i].disconnect();

            }
        },
        /**
        * @method removeOperator
        * Retire l'opérateur de la room
        */
        removeOperator:function(){
            this.operator=null;
        },
        /**
        * @method removeOperator
        * Retire l'opérateur de la room
        */
        removeSocketOperator:function(){

            //Supprimer en force car il essaie encore de se reconnecter cet abruti de socket putainnnnnn
            if(this.socketOperator!==null){
                this.socketOperator.leave(this.id);
                this.socketOperator=null;
            }
        },
        /**
        * @method beforeEnd
        * Traitement pré-suppresion du chat
        */
        beforeEnd:function(){

            this.io.of('/operator').in(this.id).emit('exit');
            this.io.of('/user').in(this.id).emit('exit');

            this.removeUser();
            this.removeSocketOperator();
            this.removeOperator();

        },
        /**
        * @method hasOperator
        * Verifie si la room a été pris en charge par un opérateur
        * @return {boolean}
        */
        hasOperator:function(){
            if(this.operator===null){
                return false;
            }
            return true;
        },
        /**
        * @method hasThisOperator
        * Verifie si la room a été pris en charge par l'operateur en parametre
        * @return {boolean}
        */
        hasThisOperator:function(idOperator){
            try{
                if(this.operator.getId()==idOperator){
                    return true;
                }
                return false;
            }catch(err){
                return false;
            }
        },
        /**
        * @method hasSocketOperator
        * Verifie si l'operateur a une socket en cours
        * @return {boolean}
        */
        hasSocketOperator:function(){
            if(this.socketOperator!==null){
                return true;
            }
            return false;
        }

    };
    return Room;
}());

module.exports = Room;
