var debug = require('debug')('harmonyjs:login:hub')
	, xmpp = require('node-xmpp')
	, Q = require('q');

/**
 * Splits a response from the hub (usualy seperated by ':' and '=') into a
 * proper javascript object.
 *
 * Parameters:
 *     (String) response
 *
 * Returns:
 *     (Object)
 */
function splitResponseIntoObject(response) {
	var pairs = response.split(':')
		, result = {};

	pairs.forEach(function(pair) {
		var keyValue = pair.split('=');

		if(keyValue.length === 2) {
			result[keyValue[0]] = keyValue[1];
		}
	});

	return result;
}

/** PrivateFunction: getIdentity
 * Logs in to a Harmony hub as a guest and uses the userAuthToken from logitechs
 * web service to retrieve an identity token.
 *
 * Parameters:
 *     (String) userAuthToken - A authentication token, retrieved from logitechs
 *                              web service.
 *     (String) hubhost - Hostname/IP of the Harmony hub to connect.
 *     (int) hubport - Optional. Port of the Harmony hub to connect. By default,
 *                     this is set to 5222.
 *
 * Returns:
 *     (Q.promise) - The resolved promise passes the retrieved identity token.
 */
function getIdentity(userAuthToken, hubhost, hubport) {
	debug('retrieve identiy by logging in as guest');

	// guest@x.com / guest
	// guest@connect.logitec.com/gatorade
	var deferred = Q.defer()
		, iqId = Math.floor(Math.random()*1000000);

	var xmppClient = new xmpp.Client({
			jid: 'guest@connect.logitech.com/gatorade'
			, password: userAuthToken
			, host: hubhost
			, port: hubport
			, disallowTLS: true
		});

	xmppClient.on('online', function() {
		debug('XMPP client connected');

		var iq = new xmpp.Iq({
			type: 'get'
			, from: 'guest'
			, id: iqId
		});

		iq.c('oa', {
			xmlns: 'connect.logitech.com'
			, mime: 'vnd.logitech.connect/vnd.logitech.pair'
		}).t('token=' + userAuthToken + ':name=harmonyjs#iOS6.0.1#iPhone');

		xmppClient.send(iq);
	});

	xmppClient.on('error', function(e) {
		debug('XMPP client error');
		console.log('errorhub', e);
	});

	xmppClient.on('stanza', function(stanza) {
		debug('recieved XMPP stanza');

		if(stanza.attrs.id === iqId.toString()) {
			var body = stanza.getChildText('oa')
				, response = splitResponseIntoObject(body);

			if(response.identity && response.identity !== undefined) {
				debug('recieved identity token');
				xmppClient.end();
				deferred.resolve(response.identity);
			} else {
				debug('could not find identity token');
				deferred.reject(new Error('Did not retrieve identity.'));
			}
		}
	});

	return deferred.promise;
}

/** PrivateFunction: loginWithIdentity
 * After fetching an identity from the Harmony hub, this function creates an
 * XMPP client using that identity. It returns a promise which, when resolved,
 * passes that XMPP client.
 *
 * Parameters:
 *     (String) identity - Identity token to login to the Harmony hub.
 *     (String) hubhost - Hostname/IP of the Harmony hub to connect.
 *     (int) hubport - Optional. Port of the Harmony hub to connect. By default,
 *                     this is set to 5222.
 *
 * Returns:
 *     (Q.promise) - When resolved, passes the logged in XMPP client, ready to
 *                   communicate with the Harmony hub.
 */
function loginWithIdentity(identity, hubhost, hubport) {
	debug('create xmpp client using retrieved identity token');

	var deferred = Q.defer()
		, jid = identity + '@connect.logitec.com/gatorade'
		, password = identity
		, xmppClient = new xmpp.Client({
			jid: jid
			, password: password
			, host: hubhost
			, port: hubport
			, disallowTLS: true
		});

	xmppClient.once('online', function() {
		debug('XMPP client connected using identity token');
		deferred.resolve(xmppClient);
	});

	return deferred.promise;
}

/** Function: loginToHub
 * Uses a userAuthToken to login to a Harmony hub.
 *
 * Parameters:
 *     (String) userAuthToken - A authentication token, retrieved from logitechs
 *                              web service.
 *     (String) hubhost - Hostname/IP of the Harmony hub to connect.
 *     (int) hubport - Optional. Port of the Harmony hub to connect. By default,
 *                     this is set to 5222.
 *
 * Returns:
 *     (Q.promise) - The final resolved promise will pass a fully authenticated
 *                   XMPP client which can be used to communicate with the
 *                   Harmony hub.
 */
function loginToHub(userAuthToken, hubhost, hubport) {
	debug('perfrom hub login');

	hubport = hubport || 5222;

	return getIdentity(userAuthToken, hubhost, hubport)
	.then(function(identity) {
		return loginWithIdentity(identity, hubhost, hubport);
	});
}

module.exports = loginToHub;