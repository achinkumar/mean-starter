'use strict';

module.exports = {
	env: 'test',
	url: 'http://localhost:3000/',
	linkUrl: '',
	mongo: {
		uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/'
	},
	TABLE: "",
	// Connect to database
	dbc: require('mongoskin').db(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/', {
		safe: true
	}),

};