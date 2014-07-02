
exports.init = function(srv){


	//////////////////////////////////////////////
	//Service REST exposant la session en cours //
	//////////////////////////////////////////////
	srv.app.get('/isThereASession', function (req, res) {

		srv.log.debug("Appel REST check is already a session");

		res.header('Access-Control-Allow-Origin', srv.origin);
		res.header('Access-Control-Allow-Credentials', 'true');

		if(req.session.idUser && req.session.idRoom){
			res.writeHead(200);
			res.write(srv.chat.getOperators().length+'');
		}else{
			res.writeHead(404);
		}

		if(!req.session.view){
			req.session.view=0;
		}

		req.session.view++;

		res.end();

	});

	//////////////////////////////////////////////////////////////
	//Service REST exposant le nombre d'opérateurs dans le chat //
	//////////////////////////////////////////////////////////////
	srv.app.get('/nbOperators', function (req, res) {
		res.header('Access-Control-Allow-Origin', srv.origin);
		
		srv.log.debug("Appel REST count operators");
		res.end(srv.chat.getOperators().length+'');
	});


	////////////////////////////////////////////////////////////////////
	//Service REST exposant en JSON les rooms en cours de l'opérateur //
	////////////////////////////////////////////////////////////////////
	srv.app.get('/currentRooms', function (req, res) {
		srv.log.debug("Appel REST currentRooms from operator "+req.query.id);
		res.json(srv.chat.getRoomsWithThisOperator(req.query.id));
	});

	////////////////////////////////////////////////////////////////////
	//Service REST exposant en JSON le nombre d'utilisateurs en attente //
	////////////////////////////////////////////////////////////////////
	srv.app.get('/nbUsersWaiting', function (req, res) {
		srv.log.debug("Appel REST nbUsersWaiting ");
		res.type('text/html');
		res.end(srv.chat.getRoomsWithoutOperator().length+'');
	});

	//////////////////////////////////////////////////////////////
	//Service REST exposant en JSON les utilisateurs en attente //
	//////////////////////////////////////////////////////////////
	srv.app.get('/usersWaiting', function (req, res) {
		srv.log.debug("Appel REST UsersWaiting");
		res.json(srv.chat.getRoomsWithoutOperator());
	});

	//////////////////////////////////////////////////////////////
	//Service REST exposant en JSON les utilisateurs en attente //
	//////////////////////////////////////////////////////////////

	srv.app.get('/connection', function (req, res) {
		srv.log.info("Appel REST Connection");

		if(srv.chat.hasThisOperator(req.query.login,req.query.password)){
			var operator = srv.chat.getOperatorByLoginMdp(req.query.login,req.query.password);
			srv.log.info("Identification success");
			res.json({valid:true,id:operator.id});
		}else{
			srv.log.info("Identification fail");
			res.json({valid:false});
		}
	});

	////////////////
	//Gestion 404 //
	////////////////

	srv.app.use(function(req, res, next){
		srv.log.error("Erreur 404");
		res.setHeader('Content-Type', 'text/plain');
		res.send(404, 'Page introuvable !');
	});
};