'use strict';
var userDao = require('../dao/userDao');
var passport = require('passport');
var mailer = require('./notificationsController');
var config = require('../config/env/' + process.env.NODE_ENV);

/**
 * Create user
 */
exports.create = function (req, res, next) {
	console.log(req.body);
	var newUser = req.body;
	var userMail = req.body.email;
	userDao.findUser({
		"email": userMail
	}, function (err, foundUserArr) {
		if (err)
			res.send(404, 'internal error');

		else if (foundUserArr && !foundUserArr.length == 0) {
			res.json({
				"message": 'This email is already registered.'
			});
		} else {

			userDao.createUser(newUser, function (err, userCreated) {
				if (err) {
					return res.json(400, err);
				}
				console.log(userCreated);
				//send activation email
				var options = {
					"senderName": "Webmaster",
					"senderEmail": "hra@prokriya.com",
					"receiverName": userCreated[0].name,
					"receiverEmail": userCreated[0].email,
					"subject": "Welcome to PayKart",
					"textBody": "Hello,you can activate your paycart account by clicking on this link : " + config.url + "api/useractive?ak=" + userCreated[0].ak, // text body 
					"htmlBody": "Hello,you can activate your paycart account by clicking on this link : " + config.url + "api/useractive?ak=" + userCreated[0].ak // html body
				}
				exports.lastAk = userCreated[0].ak;
				mailer.sendNotification(options, null);
				res.send({
					"message": "User activation mail is being sent to you.Click on the mail and activate your account."
				});
				//                    res.redirect('/logout');
			});
		};

	});
};
//TODO::just a hack for e2e testing
//TODO:: changed this to update user from findandmodify
exports.getLastAk = function (req, res) {

	userDao.updateUser({
			"ak": config.lastAk
		}, {
			"status": "active"
		},
		function (err, result) {
			if (err) {
				// err received --- error
				res.send({
					'err': err,
					'detailed message': 'user could not be activated'
				});
			} else if (result === 0) {
				// nothing updated
				res.send({
					'err': 'error',
					"message": "user does not exist"
				});
			} else {
				// success case                
				res.json({
					'message': 'Account activated. Please login.'
				});
			}
		});
};



/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
	var userId = req.params.id;

	userDao.findUserById(userId, function (err, user) {
		console.log('<<>' + JSON.stringify(user))

		if (err) {
			// res.send({
			//                 'err': err,
			//                 'detailed message': 'Failed to load User'
			//             });
			res.send(404, 'USER_NOT_FOUND');
		} else {
			res.json({
				"profile": user.profile
			});
		}
	});
};
//Use};r activation
exports.userActivation = function (req, res) {
	var akValue = (req.query.ak);

	userDao.updateUser({
			"ak": akValue
		}, {
			"status": "active"
		},
		function (err, result) {
			if (err) {
				// err received --- error
				res.send({
					'err': err,
					'detailed message': 'user could not be activated'
				});
			} else if (result === 0) {
				// nothing updated
				res.send({
					'err': 'error',
					"message": "user does not exist"
				});
			} else {
				// success case                
				res.json({
					'message': 'Account activated. Please login.'
				});
			}
		});
}

//Forgot Password

exports.forgotPassword = function (req, res) {
	var reqData = req.body.email;
	var updateFgt = {
		"status": "inactive",
		"hashedPassword": "" + Math.random()
	};
	userDao.updateUser({
		"email": reqData
	}, updateFgt, function (err, result) {
		if (err) {
			res.send({
				'err': err,
				'detailed message': 'This email does not exist in our records'
			});

		} else if (!result) {
			res.send("user does not exist");
		} else {
			//send email carrying the generated password.
			var options = {
				"senderName": "Webmaster",
				"senderEmail": "achin@prokriya.com",
				"receiverName": req.body.name,
				"receiverEmail": req.body.email,
				"subject": "Welcome to PayKart",
				"textBody": "Hello,you can activate your paycart account by logging in with this password : " + updateFgt.hashedPassword, // text body,
				"htmlBody": "Hello,you can activate your paycart account by logging in with this password : " + updateFgt.hashedPassword // html body
			}
			mailer.sendNotification(options, null);
			res.send({
				"message": "Password is being sent to you.Click on the mail and activate your account."
			});
		}
	})
}
/**
 * Change password
 */
exports.changePassword = function (req, res) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	userDao.findUserById(userId, function (err, foundUser) {
		console.log(JSON.stringify(foundUser));

		if (userDao.authenticatePassword(oldPass, foundUser.hashedPassword, foundUser.salt)) {
			foundUser.password = newPass;

			// update after changed password
			userDao.updateUserById(foundUser._id, foundUser, function (err, noOfUserUpdated) {
				if (err) {
					res.send(500, err);
				} else {
					// TODO :: send an email to user to confirm password
					// TODO :: log out user and accept new password to login
					res.send(200);
				}
			});
		} else {
			res.send(400);
		}
	});
};

/**
 * Get current user
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};