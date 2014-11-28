var xmpp = require('node-xmpp-core');


function getUniqueId() {
	return Math.floor(Math.random()*1000000);
}

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
function decodeXmppResponse(response) {
	var pairs = response.split(':') || response
		, result = {};

	pairs.forEach(function(pair) {
		var keyValue = pair.split('=');

		if(keyValue.length === 2) {
			result[keyValue[0]] = keyValue[1];
		}
	});

	return result;
}

function buildIqStanza(type, xmlns, mime, body, from) {
	var iq = new xmpp.Stanza.Iq({
		type: type
		, id: getUniqueId()
		, from: from
	});

	iq.c('oa', {
		xmlns: xmlns
		, mime: mime
	}).t(body);

	return iq;
}

module.exports = {
	getUniqueId: getUniqueId
	, decodeXmppResponse: decodeXmppResponse
	, buildIqStanza: buildIqStanza
};