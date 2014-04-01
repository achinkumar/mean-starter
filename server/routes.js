'use strict';

var index = require('./controllers');
var usersController = require('./controllers/usersController');
var session = require('./controllers/session');
var middleware = require('./middleware');
/**
 * Application routes
 */
module.exports = function (app) {
	// Server API Routes

	app.post('/api/users', usersController.create);
	app.post('/api/users/forgotPwd', usersController.forgotPassword);
	app.put('/api/users', usersController.changePassword);
	app.get('/api/users/me', usersController.me);
	app.get('/api/users/:id', usersController.show);
	app.get("/api/useractive", usersController.userActivation);

	app.post('/api/session', session.login);
	app.del('/api/session', session.logout);	
	app.get("/api/getLastAk", usersController.getLastAk);



	// app.get('/*', middleware.setUserCookie, index.index);//TODO :: fix this for integration
	app.get('/', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	app.get('/index', middleware.setUserCookie, index.index); //TODO :: fix this for integrationAngularJS
	app.get('/settings', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	app.get('/logout', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	app.get('/login', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	app.get('/forgotPwd', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	app.get('/signup', middleware.setUserCookie, index.index); //TODO :: fix this for integration
	


	// All other routes to use Angular routing in app/scripts/app.js
	app.get('/partials/*', index.partials);

	
	

};