'use strict';

var config = require('../config/env/development');
var userDao = require('../dao/userDao');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user._id.toString());
    });
    passport.deserializeUser(function (id, done) {
        userDao.findUserById(
            id, function (err, res) { // don't ever give out the password or salt
                done(err, res);
            });
    });

    // add other strategies for more authentication flexibility
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function (email, password,done) {
            userDao.findUser({
                email: email
            }, function (err, foundUserArr) {
                if (err) return done(err);

                if (!foundUserArr || foundUserArr.length === 0) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!userDao.authenticatePassword(password, foundUserArr[0].hashedPassword, foundUserArr[0].salt)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
				
	            // check status for user, return if status is 'inactive'
				
            	if(foundUserArr[0].status !== 'active'){
                    return done(null, false, {"message": "User status found to be inactive."});
					
            	}
        
                return done(null, foundUserArr[0]);
            });
        }
    ));
};