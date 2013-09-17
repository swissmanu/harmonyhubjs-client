var debug = require('debug')('harmonyjs:harmonyclient')
	, Q = require('q')
	, util = require('./util');


function HarmonyClient(xmppClient) {
	debug('create new harmony client');

	this._xmppClient = xmppClient;
	this._queuedDeferreds = {};


	function handleStanza(stanza) {
		var id = stanza.attr('id')
			, queuedDeferred = this._queuedDeferreds[id];

		if(queuedDeferred) {
			debug('received response stanza for queued deferred');

			var response = stanza.getChildText('oa')
				, decodedResponse = util.decodeXmppResponse(response);

			delete this._queuedDeferreds[id];
			queuedDeferred.resolve(decodedResponse);
		}
	}
	xmppClient.on('stanza', handleStanza.bind(this));
}

function getCurrentActivity() {
	debug('retrieve current activity');

	return this.sendCommand('getCurrentActivity')
	.then(function(response) {
		var result = response.result;
		return result;
	});
}

function startActivity(activityId) {
	debug('start activity ' + activityId);

	var deferred = Q.defer();

	return deferred.promise;
}

function getAvailableCommands() {
	debug('retrieve available commands');

	var deferred = Q.defer();

	return deferred.promise;
}

function sendCommand(command, body) {
	debug('send command ' + command);

	var deferred = Q.defer()
		, iq = util.buildIqStanza(
			'get'
			, 'connect.logitech.com'
			, 'vnd.logitech.harmony/vnd.logitech.harmony.engine?' + command
			, body
		)
		, id = iq.attr('id');

	this._queuedDeferreds[id] = deferred;
	this._xmppClient.send(iq);

	return deferred.promise;
}

function end() {
	this._xmppClient.end();
}


HarmonyClient.prototype.getCurrentActivity = getCurrentActivity;
HarmonyClient.prototype.startActivity = startActivity;
HarmonyClient.prototype.getAvailableCommands = getAvailableCommands;
HarmonyClient.prototype.sendCommand = sendCommand;
HarmonyClient.prototype.end = end;

module.exports = HarmonyClient;