
var http = require('http');
var expect = require("chai").expect;

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';
var userNamespace ='/user';

describe('UsersWaiting API',function(){

	var options = {
		hostname:'localhost',
		port:'3000',
		path:'/usersWaiting',
		method:'GET'
	};

	var req;

	var client;

	before(function(){
		client = io.connect(socketURL+userNamespace);
	});

	it('should work and have a valid json ressource', function(done){

		setTimeout(function(){

			req = http.request(options, function(res) {

				res.on("data", function(chunk) {
					json=JSON.parse(""+chunk);
					expect(json).to.be.a('array');

					var lastClient = json[json.length-1];

					expect(lastClient).to.have.property('id');
					expect(lastClient).to.have.property('timeStart');
					expect(lastClient).to.have.property('streamText');

					var streamText = lastClient.streamText;
					expect(streamText).to.be.a('array');

					var msg = streamText[0];
					expect(msg).to.have.property('type');
					expect(msg.type).to.have.equal('opr');
					expect(msg).to.have.property('text');
					expect(msg).to.have.property('time');

				});

				done();
			});

			req.end();

		},1000);
	});

	after(function(){
		client.disconnect();
	});

});

