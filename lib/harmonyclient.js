var debug = require('debug')('harmonyhubjs:harmonyclient')
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
				, decodedResponse;

			if(queuedDeferred.responseType === 'json') {
				decodedResponse = JSON.parse(response);
			} else {
				decodedResponse = util.decodeXmppResponse(response);
			}

			delete this._queuedDeferreds[id];
			queuedDeferred.deferred.resolve(decodedResponse);
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

function getActivities() {
	debug('retrieve activities');

	return this.getAvailableCommands()
	.then(function(availableCommands) {
		return availableCommands.activity;
	});
}

function startActivity(activityId) {
	debug('start activity ' + activityId);

	var timestamp = new Date().getTime()
		, body = 'activityId=' + activityId + ':timestamp=' + timestamp;

	return this.sendCommand('startactivity', body);
}

function turnOff() {
	debug('turn off');
	return this.startActivity(-1);
}

function isOff() {
	debug('check if turned off');

	return this.getCurrentActivity()
	.then(function(activityId) {
		var off = (activityId === '-1');
		debug(off ? 'system is currently off' : 'system is currently on with activity ' + activityId);

		return off;
	});
}

function getAvailableCommands() {
	debug('retrieve available commands');

	return this.sendCommand('config', undefined, 'json')
	.then(function(response) {
		return response;
	});
}

function sendCommand(command, body, expectedResponseType) {
	debug('send command ' + command);

	expectedResponseType = expectedResponseType || 'encoded';

	var deferred = Q.defer()
		, iq = util.buildIqStanza(
			'get'
			, 'connect.logitech.com'
			, 'vnd.logitech.harmony/vnd.logitech.harmony.engine?' + command
			, body
		)
		, id = iq.attr('id');

	this._queuedDeferreds[id] = {
		responseType: expectedResponseType
		, deferred: deferred
	};
	this._xmppClient.send(iq);

	return deferred.promise;
}

function end() {
	debug('close harmony client');
	this._xmppClient.end();
}


HarmonyClient.prototype.isOff = isOff;
HarmonyClient.prototype.turnOff = turnOff;
HarmonyClient.prototype.getActivities = getActivities;
HarmonyClient.prototype.getCurrentActivity = getCurrentActivity;
HarmonyClient.prototype.startActivity = startActivity;

HarmonyClient.prototype.getAvailableCommands = getAvailableCommands;
HarmonyClient.prototype.sendCommand = sendCommand;

HarmonyClient.prototype.end = end;

module.exports = HarmonyClient;