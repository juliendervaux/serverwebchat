/**
 * Dependencies
 */
var Server = require('./lib/server.js');
var Bunyan = require('bunyan');
/*
 * Origin Domain
 */
var origin = "https://localhost";
/*
 * Listening Port
 */
var port = 3000;
/*
 * Secret for signing client side cookie for session
 */
var secret = 'shhhhhhhhhhh this is a secret from julien';
/*
 * Init Log Object
 */
var log = Bunyan.createLogger({name: 'ChatLog'});
log.level(30);

/*
 * SocketIO server options
 */
var options = {
	//Better remove for development
	/*'browser client minification':true,
	'browser client etag':true,
	'browser client gzip':true,*/
	//TOTHINK
	/*"close timeout" : 60,
	"heartbeat timeout" : 60,
	heartbeat interval : 25,*/
	"logger": log,
	"transports":[
		'websocket',
		/*'flashsocket',*/
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	]
};

var server = new Server(log,port,origin,secret,options);

server.start();
