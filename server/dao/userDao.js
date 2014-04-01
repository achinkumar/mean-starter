'use strict';

var config = require('../config/env/' + process.env.NODE_ENV);
var crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'],
	SALT_WORK_FACTOR = 10;

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */

function makeSalt() {

	return crypto.randomBytes(16).toString('base64');
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */

function encryptPassword(salt, password) {
	if (!password || !salt) {
		return '';
	}
	var salt = new Buffer(salt, 'base64');
	return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

// modify json to encrypt received plain text password to encrypted hashed password before saving

function preSaveUser(userData) {
	setPassword(userData);
	validateEmail(userData);
	validatePassword(userData);

	// set status as inactive
	// establish mechanism to keep this user as inactive unless activated

	userData['status'] = "inactive";
	userData['ak'] = "" + Math.random();
}

// modify json to return additional needed information before returning
function postQueryUser(userDataArr) {
	// iterate and modify each item

	for (var i = 0; i < userDataArr.length; i++) {
		// console.log('>>>>>>>'+JSON.stringify(userDataArr));
		userDataArr[i]['userInfo'] = {
			'name': userDataArr[i].name,
			'role': userDataArr[i].role,
			'provider': userDataArr[i].provider

		};

		userDataArr[i]['profile'] = {
			'name': userDataArr[i].name,
			'role': userDataArr[i].role,
			'provider': userDataArr[i].provider
		};


	}
}

/**
 * Create User logic
 */
exports.createUser = function (userData, callback) {
	preSaveUser(userData);
	config.dbc.collection('User').insert(userData, callback)
};

/**
 * Update User logic
 */
exports.updateUser = function (findUserData, userData, callback) {
	var setOptions = {
		"$set": userData		
	};
	var newOptions = {
		"new": true
	};
	config.dbc.collection('User').update(findUserData, setOptions, newOptions, callback);
};

/**
 * Update User By Id logic
 */
exports.updateUserById = function (findUserId, userData, callback) {
	preSaveUser(userData);
	config.dbc.collection('User').updateById(findUserId, userData, callback);
};


/**
 * Get User logic by query
 */
exports.findUser = function (queryData, callback) {
	config.dbc.collection('User').find(queryData).toArray(function (err, res) {
		postQueryUser(res);
		callback(err, res);
	})

};

exports.findAndModifyUser = function (queryData, sortClause, updateData, callback) {

	config.dbc.collection('User').findAndModify(queryData, sortClause, updateData, {
		"new": true
	}, function (err, res) {
		var userArr = [];
		userArr.push(res);
		postQueryUser(userArr);
		callback(err, userArr[0]);
	})
};
exports.findUserById = function (userId, callback) {
	config.dbc.collection('User').findById(userId, function (err, res) {
		var userArr = [];
		userArr.push(res);
		postQueryUser(userArr);
		callback(err, userArr[0]);
	})
};

//encrypts password and sets it to userData's hashed password    

function setPassword(userData) {
	var salt = makeSalt();
	userData['salt'] = salt;
	//    userData['hashedPassword'] = encryptPassword(salt, userData.password);//TODO uncomment this and remove below line
	userData['hashedPassword'] = userData.password;
	delete userData['password'];

};


// Validate empty email

function validateEmail(userData) {
	if (authTypes.indexOf(userData.provider) !== -1) {
		return true;
	} else {
		return false;
	}
};

// Validate empty password

function validatePassword(userData) {
	if (authTypes.indexOf(userData.provider) !== -1) {
		return true;
	} else {
		return false;

	}
};
//funtion for authenticating email
exports.authenticateEmail = function (query, callback) {
	config.dbc.collection('User').find(query, function (err, res) {

		callback(err, res);
	})
};

exports.resetUsers = function (delData, callback) {
	config.dbc.collection("User").remove(delData, callback);
}


//function for authenticating password
exports.authenticatePassword = function authenticatePassword(password, hashedPassword, salt) {
	//    return encryptPassword(password, salt) === hashedPassword;//TODO uncomment this and remove below line
	return password === hashedPassword;
};