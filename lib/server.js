
/**
 * Module dependencies.
 */

var Chat     = require("../app_model/Chat.js");
var User     = require("../app_model/User.js");
var Operator = require("../app_model/Operator.js");
var Room     = require("../app_model/Room.js");

var express      = require('express');
var http         = require('http');
var socketio     = require('socket.io');
var crypto       = require('crypto');
/**
 * Export the constructor.
 */

exports = module.exports = Server;

/**
 * Constructor
 */
function Server (logger,port,origin,secret,options) {

	this.chat = new Chat();

	////////////////////////
	//Bootstrap Operators //
	////////////////////////
	this.chat.addOperator(new Operator(1,"operator1",crypto.createHash('sha256').update('mdp1'+'%#{[|]}@&%').digest('hex')));
	this.chat.addOperator(new Operator(2,"operator2",crypto.createHash('sha256').update('mdp2'+'%#{[|]}@&%').digest('hex')));
	this.chat.addOperator(new Operator(3,"operator3",crypto.createHash('sha256').update('mdp3'+'%#{[|]}@&%').digest('hex')));
	this.chat.addOperator(new Operator(4,"operator4",crypto.createHash('sha256').update('mdp4'+'%#{[|]}@&%').digest('hex')));
	this.chat.addOperator(new Operator(5,"operator5",crypto.createHash('sha256').update('mdp5'+'%#{[|]}@&%').digest('hex')));


	this.log=logger;
	this.port=port;
	this.origin=origin;
	this.secret=secret;

	this.sessionStore = new express.session.MemoryStore();

	//////////
	//Init ///
	//////////
	this.app=express();
	this.app.use(express.cookieParser());
    this.app.use(express.session({
		secret: this.secret,
		store:  this.sessionStore
    }));

	this.serv = require('http').createServer(this.app);
	this.io= socketio.listen(this.serv,options);



	var Route = require('./routes').init(this);
	var Namespace = require('./namespaces').init(this);

}

Server.prototype.start = function () {

	this.serv.listen(this.port, this.log.info('SERVER START : Listening on port %d', this.port));

};