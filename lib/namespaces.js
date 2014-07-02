var Chat     = require("../app_model/Chat.js");
var User     = require("../app_model/User.js");
var Operator = require("../app_model/Operator.js");
var Room     = require("../app_model/Room.js");
var cookie   = require('express/node_modules/cookie');
var connect  = require('express/node_modules/connect');

exports.init = function(srv){

	////////////////
	//Temp Values //
	////////////////
	var idRoomTemp=1;
	var idUserTemp=1;

	
	/////////////////////////////////////
	//Prise en charge des utilisateurs //
	/////////////////////////////////////

	srv.io.of('/user').on('connection', function (socket) {

		
		var idUser;
		var idRoom;
		var user;
		var room;

		var requestExit=false;

		srv.log.info("User connection income");

		///////////////////////////
		//Récupération session //
		///////////////////////////
		var cookies = cookie.parse(socket.handshake.headers.cookie);
		var sessionID;

		if (cookies['connect.sid']) {
			sessionID = connect.utils.parseSignedCookie(cookies['connect.sid'], srv.secret);
			if(sessionID){
				srv.sessionStore.load(sessionID, function (err, sess) {
					if (!err && sess) {
						handleSession(sess);
					}
				});
			}
		}


		/////////////////////////////////////////////////////////
		//Fonction de callback quand la session est récupéré //
		/////////////////////////////////////////////////////////
		function handleSession(session){

			/////////////////////////////////////////////
			//Gestion selon si déjà une session ou pas //
			/////////////////////////////////////////////
			if(!session.idUser){

				srv.log.info("New user");

				//Création nouvel utilisateur
				idUser=idUserTemp;
				idUserTemp++;
				srv.log.info("Create User : "+idUser);
				session.idUser=idUser;
				user = new User(idUser,sessionID);
				srv.chat.addUser(user);

				//Création nouvelle room
				idRoom=idRoomTemp;
				idRoomTemp++;
				srv.log.info("Create Room : "+idRoom);
				session.idRoom=idRoom;
				room=new Room(srv.io,srv.sessionStore,idRoom);
				room.setUser(user);
				srv.chat.addRoom(room);

				//Message de bienvenue
				srv.log.info("Emit Welcome User Message");
				room.addTextToStream(socket,'Bonjour, je suis Emma, conseillère MMA, en quoi puis-je vous aider ?',"opr",true);

			}else{

				srv.log.info("User already connected");

				//Récupération user et room
				idUser=session.idUser;
				idRoom=session.idRoom;

				user=srv.chat.getUser(idUser);
				room=srv.chat.getRoom(idRoom);

				//envoie des archives
				srv.log.info("Envoie archives conversation");
				socket.emit('currentStreamText', {streamText: room.getStreamText()});
			}

			socket.join(room.getId());

			socket.on('msg', function (msg) {
				srv.log.info("Message Incoming From User : "+user.id);
				srv.log.info("Message Content : "+msg.text);
				room.addTextToStream(socket,msg.text,"usr");
			});
			
			socket.on('disconnect', function () {

				if(!requestExit){
					//Quitte sans avoir fait la demande comment gerer TOTHINK  start timeout
					srv.log.info("Unexpected quit");
				}

				srv.log.info("Socket User "+user.id+" Terminated");
				
				//Gerer time out heartbeat pour reconnect
			});

			socket.on('exit', function () {

				requestExit=true;

				srv.log.info("User "+user.id+" request end of chat");
				srv.chat.removeRoom(room);
				session.destroy();

			});


			session.save();

		}

	});

	/////////////////////////////////////
	//Prise en charge des opérateurs //
	/////////////////////////////////////

	srv.io.of('/operator').authorization(function (handshakeData, callback) {
		if(handshakeData.query.id_operator !== null){
			callback(null,true);
		}else{
			callback(null,false);
		}

	}).on('connection', function (socket) {

		srv.log.info("New operator connection income : "+socket.handshake.query.id_operator);
		srv.log.info("Socket operator start");

		var operator,room,requestExit;

		try{

			operator = srv.chat.getOperator(socket.handshake.query.id_operator);
			room = srv.chat.getRoom(socket.handshake.query.id_room);
			requestExit=false;

			//////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//Trois cas lors d'une connexion opérateur (évenement qui arrive quand un opérateur rentre dans une room) ////
			//
			//1er cas : Il se connecte pour la première fois à la room, on l'attache à la room
			//2ème cas : Il se reconnecte à la room, on indique la nouvelle socket de communication
			//3ème cas : Il se connecte à la room mais est déjà en connexion dans un autre onglet du navigateur
			//4ème cas : La room est déjà prise en charge par un autre opérateur
			//
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if(room.hasOperator()){
				if(room.getOperator().getId()===operator.getId()){
					/////////////////
					//3ème cas //
					/////////////////
					if(room.hasSocketOperator()){
						srv.log.warn("Room already taken care in another tab of the same operator");
						socket.emit('redirecthome',{ txt: "Vous êtes déjà dans cette room dans un autre onglet" });
					}else{
						/////////////////
						//2ème cas //
						/////////////////
						room.setSocketOperator(socket);
						srv.log.info("Reconnection Operator "+operator.getId()+" for room "+room.getId());
						socket.emit('currentStreamText', { streamText: room.getStreamText(),timeStart:room.getTimeStart() });
						room.nbUnreadMessages=0;
					}
				}else{
					/////////////////
					//4ème cas //
					/////////////////
					srv.log.warn("Room already taken care");
					socket.emit('redirecthome',{ txt: "Room déjà pris en charge" });
				}
			}else{
				///////////////
				//1er cas //
				///////////////
				room.setOperator(operator);
				room.setSocketOperator(socket);
				srv.log.info("Operator "+operator.getId()+" attach room "+room.getId());
				socket.emit('currentStreamText', { streamText: room.getStreamText(),timeStart:room.getTimeStart() });
				room.nbUnreadMessages=0;
			}


			///////////////////////////////////////
			//Gestion evenements sur la socket //
			///////////////////////////////////////

			socket.on('msg', function (msg) {

				srv.log.info("Message Incoming From Operator : "+operator.getId() || 'osef');
				srv.log.info("Message Content : "+msg.text);
				room.addTextToStream(socket,msg.text,"opr");
			});

			socket.on('disconnect', function () {
				srv.log.info("Socket Operator "+operator.getId()+" Terminated");

				if(!requestExit){
					srv.log.info("Unexpected quit");
					room.removeSocketOperator();
				}
				
			});

			socket.on('exit', function () {

				requestExit=true;

				srv.log.info("Operator "+operator.getId()+" request end of chat");
				srv.chat.removeRoom(room);

			});

		}catch(err){
			srv.log.warn("No room for this id (wrong url or room destroyed in the interval)");
			socket.emit('redirecthome',{ txt: "Room qui n'existe pas" });
		}
	});

};