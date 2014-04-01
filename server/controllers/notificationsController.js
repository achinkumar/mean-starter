var nodemailer = require("nodemailer");
var config = require('../config/env/' + process.env.NODE_ENV);

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "xxxxxxx",
		pass: "xxxxxxx"
	}
});

exports.sendNotification = function (options, callback) {


	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: options.senderName + "<" + options.senderEmail + ">", // sender address
		to: options.receiverName + "<" + options.receiverEmail + ">", // list of receivers
		subject: options.subject, // Subject line
		text: options.textBody, // plaintext body
		html: options.htmlBody // html body

	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});

}