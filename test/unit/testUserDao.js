var assert = require("assert");
var userDao = require("../../server/dao/userDao");
var config = require('../../server/config/env/' + process.env.NODE_ENV);

var findObject;
var findAndModifyObject;
var findData;
var password;

beforeEach(function (done) {
	var modifyData = {
		"name": "achinkumar",
		"email": "achin@gm.com",
		"password": "achinkumar"
	};
	findData = {
		"name": "achinkumar",
		"email": "achin@root.com",
		"password": "achinkumar"
	};

	// resets the db
	config.dbc.collection("User").remove({}, function () {

		userDao.createUser(modifyData, function (err, createUserJsonArr) {
			// console.log(JSON.stringify(createUserJsonArr));
			findAndModifyObject = createUserJsonArr[0];
			password = findData.password;
			userDao.createUser(findData, function (err, createUserJsonArr) {
				findObject = createUserJsonArr[0];
				done();
			});
		});
	});
});

afterEach(function (done) {
	config.dbc.collection("User").remove({}, function () {
		done();
	})
});
describe('testForUsers', function () {

	it('createUser', function (done) {
		var createData = {
			"name": "achin",
			"email": "achin@toor.in",
			"password": "achin"
		};
		userDao.createUser(
			createData,
			function (err, result) {
				assert.equal(err, null);
				assert.equal(typeof (result), "object");
				console.log('>> result ' + JSON.stringify(result));
				assert.equal(typeof (result[0].ak), "string");
				assert.equal(result !== undefined, true);
				assert.equal(result[0].email !== undefined, true);
				assert.equal(result[0].name !== undefined, true);
				console.log(createData);
				assert.equal(result[0].name, createData.name);
				assert.equal(result[0].email, createData.email);
				assert.equal(result[0].hashedPassword !== undefined, true);
				assert.equal(result[0].hashedPassword, "achin");
				assert.equal(result[0].status, 'inactive');
				assert.equal(result[0].salt !== undefined, true);
				assert.equal(result[0].ak !== undefined, true);
				assert.equal(typeof (result[0].salt), "string");
				assert.equal(typeof (result[0].ak), "string");
				done();
			})


	});

	it('findUser', function (done) {

		userDao.findUser({
				"email": "achin@root.com"
			},
			function (err, result) {
				// console.log(JSON.stringify(result));
				assert.equal(err, null);
				assert.equal(typeof (result), "object");
				assert.equal(typeof (result[0].ak), "string");
				assert.equal(result !== undefined, true);
				assert.equal(result[0].email !== undefined, true);
				assert.equal(result[0].name !== undefined, true);
				assert.equal(result[0].email, findObject.email);
				assert.equal(result[0].hashedPassword !== undefined, true);
				assert.equal(result[0].status, 'inactive' || 'active');
				assert.equal(result[0].salt !== undefined, true);
				assert.equal(result[0].ak !== undefined, true);
				assert.equal(typeof (result[0].salt), "string");
				assert.equal(typeof (result[0].ak), "string");
				done();
			})
	});
	it('findAllUser', function (done) {

		userDao.findUser({
				"name": "achinkumar"
			},
			function (err, result) {
				// console.log(JSON.stringify(result));
				for (var i = 0; i < 2; i++) {
					assert.equal(err, null);
					assert.equal(typeof (result), "object");
					assert.equal(typeof (result[i].ak), "string");
					assert.equal(result !== undefined, true);
					assert.equal(result[i].email !== undefined, true);
					assert.equal(result[i].name !== undefined, true);
					//assert.equal(result[i].email, findObject.email);
					assert.equal(result[i].hashedPassword !== undefined, true);
					assert.equal(result[i].status, 'inactive' || 'active');
					assert.equal(result[i].salt !== undefined, true);
					assert.equal(result[i].ak !== undefined, true);
					assert.equal(typeof (result[i].salt), "string");
					assert.equal(typeof (result[i].ak), "string");
				}
				done();
			})
	});


	it('updateUser', function (done) {
		var updateData = {
			'status': 'pending'
		};

		userDao.updateUser({
			"email": "achin@root.com",
			"hashedPassword":"achinkumar"
		}, updateData, function (err, result) {
			assert.equal(err, null);
			assert.equal(result !== undefined, true);
			assert.equal(result, 1);
			assert.equal(typeof (result), "number");


			done();
		});
	});

	it('findAndModifyUser', function (done) {
		var updateData = {
			"status": "pending"
		};


		userDao.findAndModifyUser({
			"email": "achin.vashisht@gmail.com"
		}, [], updateData, function (err, foundUser) {
			console.log(foundUser);
			assert.equal(err, null);
			assert.equal(typeof (foundUser), "object");
			assert.equal(foundUser !== undefined, true);
			assert.equal(foundUser.name !== undefined, true);
			assert.equal(foundUser.name, findAndModifyObject.name);
			assert.equal(foundUser.email !== undefined, true);
			assert.equal(foundUser.email, findAndModifyObject.email);
			assert.equal(foundUser.hashedPassword !== undefined, true);
			assert.equal(foundUser.hashedPassword, findAndModifyObject.hashedPassword);
			assert.equal(foundUser.status !== undefined, true);
			assert.equal(foundUser.status, 'inactive');
			assert.equal(foundUser.salt !== undefined, true);
			assert.equal(foundUser.ak !== undefined, true);
			assert.equal(typeof (foundUser.salt), "string");
			assert.equal(typeof (foundUser.ak), "string");

			done();

		})
	});

	it('authenticatePwd', function (done) {
		console.log(JSON.stringify(findData));
		var result = userDao.authenticatePassword(password, findObject.hashedPassword, findObject.salt);
		assert.equal(result, true);


		done();

	});
});