
var Chat = require("../app_model/Chat.js");
var Room = require("../app_model/Room.js");
var User = require("../app_model/User.js");
var Operator = require("../app_model/Operator.js");
var Manager = require("../app_model/Manager.js");
var Person = require("../app_model/Person.js");

var expect = require("chai").expect;

var io = require('socket.io-client');

var chat = new Chat();

var socketURL = 'http://localhost:3000';
var operatorNamespace ='/operator';
var userNamespace ='/user';


