var assert = require("assert");
var needle = require("needle");
var config = require('../../server/config/env/' + process.env.NODE_ENV);
var userDao = require('../../server/dao/userDao');
var inputCheckUser;
var inputForgotPwd;

beforeEach(function (done) {
	var checkData = {
		"name": "achinsharma",
		"email": "achin@roof.com",
		"password": "achinsharma"

	};
	var forgotData = {
		"name": "achinkumar",
		"email": "achin@root.com",
		"password": "achinkumar"
	};
	// resets the db
	config.dbc.collection("User").remove({}, function () {
		//creates data for checking user existing already in the db
		userDao.createUser(checkData, function (err, createUserJsonArr) {
			inputCheckUser = createUserJsonArr[0];

			//creates dataor testing forgot password functionality
			userDao.createUser(forgotData, function (err, createUserJsonArr) {
				inputForgotPwd = createUserJsonArr[0];
				// console.log(inputForgotPwd);

				done();
			});
		});


	})
});

afterEach(function (done) {
	config.dbc.collection("User").remove({}, function () {
		done();
	})
});

describe('Test', function () {

	it('createUserTest', function (done) {
		var createData = {
			"name": "achin",
			"email": "achin@gm.com",
			"password": "achin"
		};

		needle.post(config.url + "api/users", createData, function (err, response, body) {
			assert.equal(err == null || "{}", true);
			assert.equal(typeof (body), "object");
			assert.equal(body.message, "User activation mail is being sent to you.Click on the mail and activate your account.");
			done();

		})
	});
	it('userActivation', function (done) {
		var akvalue = inputForgotPwd.ak;
		console.log("++++" + akvalue);
		var updateValue = {
			"status": "active"
		};

		needle.get(config.url + "api/useractive?ak=" + akvalue, function (err, response, body) {
			console.log("actve" + JSON.stringify(body));
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			assert.equal(body.message, "Account activated. Please login.");
			done();

		})
	});

	it('checkUserTest', function (done) {
		inputCheckUserInDb = {
			"name": "achinsharma",
			"email": "achin@roof.com",
			"password": "achinsharma"

		};

		needle.post(config.url + "api/users", inputCheckUserInDb, function (err, response, body) {

			console.log(' >>>>  ' + JSON.stringify(body));
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			assert.equal(body.message, "This email is already registered.");
			done();
		});
	});

	it('forgotPwd', function (done) {
		var changeStatus = {
			"status": "inactive",
			"hashedPassword": "" + Math.random()
		};

		needle.post(config.url + "api/users/forgotPwd", inputForgotPwd, function (err, response, body) {
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			assert.equal(body.message, "Password is being sent to you.Click on the mail and activate your account.");
			done();
		})
	});

	//TODO:: FIXME
	it('changePwd', function (done) {
		needle.put(config.url + "api/users", {
			"user": {
				"id": inputForgotPwd._id
			}
		}, function (err, response, body) {
			console.log(' >>>>  ' + JSON.stringify(body));
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			assert.equal(body.message, "Password is being sent to you.Click on the mail and activate your account.");
			done();
		})
	});

	//TODO::Complete this test.
	it('me', function (done) {

		needle.get(config.url + "api/users/me", function (err, response, body) {
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			done();
		})
	});

	//TODO:: FIXME
	it('show', function (done) {

		// needle.post(config.url + "api/session", {"user":{"email":inputCheckUser.email,"password":inputCheckUser.hashedPassword}}, function (err, response, body) {

		needle.get(config.url + "api/users/" + inputForgotPwd._id, function (err, response, body) {
			assert.equal(err, null);
			assert.equal(typeof (body), "object");
			assert.equal(typeof (body.profile), "object");
			assert.equal(body.profile.name, body.name);
			assert.equal(body.profile.role, body.role);
			assert.equal(body.profile.provider, body.provider);
			done();
		});
		// });
	});
})