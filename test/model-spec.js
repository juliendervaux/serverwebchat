
var Chat = require("../app_model/Chat.js");
var Room = require("../app_model/Room.js");
var User = require("../app_model/User.js");
var Operator = require("../app_model/Operator.js");
var Manager = require("../app_model/Manager.js");
var Person = require("../app_model/Person.js");

var expect = require("chai").expect;

var chat = new Chat();

describe('Chat Class',function(){


	var chat=new Chat();
	var room=new Room(1);
	var user=new User(1);
	var operator=new Operator(1);
	var manager=new Manager(1);


	it('should be defined',function(){
		expect(chat).to.exist;
	});
	it('should have these attributes',function(){
		expect(chat.getId()).to.exist;
		expect(chat.getTimeStart()).to.exist;
		expect(chat.getTimeEnd()).to.exist;
	});
	it('should have empty attributes',function(){
		expect(chat.getRooms()).to.be.empty;
		expect(chat.getUsers()).to.be.empty;
		expect(chat.getOperators()).to.be.empty;
	});
	it('should add room',function(){
		chat.addRoom(room);
		expect(chat.getRooms()[0]).to.be.equal(room);
	});
	it('should be able to add a user',function(){
		chat.addUser(user);
		expect(chat.getUsers()[0]).to.be.equal(user);
	});
	it('should be able to add an operator',function(){
		chat.addOperator(operator);
		expect(chat.getOperators()[0]).to.be.equal(operator);
	});
	it('should be able to set a manager',function(){
		chat.setManager(manager);
		expect(chat.getManager()).to.be.equal(manager);
	});
	it('should be able to remove a room',function(){
		chat.removeRoom(room);
		expect(chat.getRooms().indexOf(room)).to.be.equal(-1);
	});
});

describe('Room Class',function(){

	var room = new Room();
	var user = new User();
	var operator = new Operator();

	room.setUser(user);
	room.setOperator(operator);

	it('should be defined',function(){
		expect(room).to.exist;
	});
	it('should have user',function(){
		expect(room.getUser()).to.be.equal(user);
	});
	it('should have operator',function(){
		expect(room.getOperator()).to.be.equal(operator);
	});
	it('should have text stream',function(){
		expect(room.getStreamText()).to.be.empty;
		expect(room.getStreamText().length).to.be.equal(0);
	});
});

describe('User/Operator/Manager',function(){

	var user = new User();
	var operator = new Operator();
	var manager = new Manager();

	it('should be typeof Person',function(){
		expect(user instanceof Person).to.be.true;;
		expect(operator instanceof Person).to.be.true;;
		expect(manager instanceof Person).to.be.true;;
	});

	it('should have Person function',function(){
		expect(user.getId).to.exist;
		expect(operator.getId).to.exist;
		expect(manager.getId).to.exist;
	});

});

describe('User Class',function(){
	it('should be defined',function(){
		var user = new User();
		expect(user).to.exist;
	});
});

describe('Operator Class',function(){
	it('should be defined',function(){
		var operator = new Operator();
		expect(operator).to.exist;
	});
});

describe('Manager Class',function(){
	it('should be defined',function(){
		var manager = new Manager();
		expect(manager).to.exist;;
	});
});