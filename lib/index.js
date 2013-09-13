var request = require('request')
	, xmpp = require('node-xmpp');

function getUserAuthToken(email, password, callback) {
	var url = "https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json/GetUserAuthToken";

	request.post({
		method: 'post'
		, url: url
		, json: true
		, body: {
			email: email
			, password: password
		}}
		, function(error, response, body) {
			if(!error) {
				if(!body.ErrorCode) {
					var authToken = body.GetUserAuthTokenResult.UserAuthToken;
					callback(undefined, authToken);
				} else {
					callback(new Error('Could not login. Check email and password.'));
				}
			} else {
				callback(error);
			}
		}
	);
}

function getSessionToken(userAuthToken, callback) {
	// guest@x.com / guest
	// guest@connect.logitec.com/gatorade
	var client = new xmpp.Client({
		jid: 'guest@connect.logitech.com/gatorade'
		, password: userAuthToken
		, host: '192.168.5.36'
		, disallowTLS: true
	});

	client.on('online', function() {
		var iq = new xmpp.Iq({
			type: 'get'
			, from: 'guest'
			, id: 34759374598374
		});

		iq.c('oa', {
			xmlns: 'connect.logitech.com'
			, mime: 'vnd.logitech.connect/vnd.logitech.pair'
		}).t('token=' + userAuthToken + ':name=manuel#iOS6.0.1#iPhone');

		console.log(iq.toString());
		client.send(iq);


	});

	client.on('error', function(e) {
		console.log(e);
	});

	client.on('stanza', function(stanza) {
		console.log('--------------stanza', stanza.toString());
		callback(undefined, stanza);
	});
}

module.exports = {
	getUserAuthToken: getUserAuthToken
	, getSessionToken: getSessionToken
};