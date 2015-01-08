var debug = require('debug')('harmonyhubjs:client:harmonyclient')
	, Q = require('q')
	, util = require('./util');





function HarmonyClient(xmppClient) {
	debug('create new harmony client');

	this._xmppClient = xmppClient;
	this._responseHandlerQueue = [];

	function handleStanza(stanza) {
		this._responseHandlerQueue.forEach(function(responseHandler, index, array) {
			if(responseHandler.canHandleStanza(stanza)) {
				debug('received response stanza for queued response handler');

				var response = stanza.getChildText('oa')
					, decodedResponse;

				if(responseHandler.responseType === 'json') {
					decodedResponse = JSON.parse(response);
				} else {
					decodedResponse = util.decodeXmppResponse(response);
				}

				responseHandler.deferred.resolve(decodedResponse);
				array.splice(index, 1);
			}
		});
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

	return this.sendCommand('startactivity', body, 'encoded', function(stanza) {
		var event = stanza.getChild('event')
			, canHandleStanza = false;

		if(event) {
			var type = event.attr('type')
				, response = event.getText();

			if(type === 'harmony.engine?startActivityFinished') {
				var decodedResponse = util.decodeXmppResponse(response);
				if(decodedResponse.activityId === activityId) {
					debug('got notification about successfully starting activity ' + activityId);
					canHandleStanza = true;
				}
			}
		}

		return canHandleStanza;
	});
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





function defaultCanHandleStanzaFn(awaitedId, stanza) {
	var stanzaId = stanza.attr('id');
	return (stanzaId && stanzaId == awaitedId);
}

function sendCommand(command, body, expectedResponseType, canHandleStanzaFn) {
	debug('send command ' + command);

	var deferred = Q.defer()
		, iq = util.buildIqStanza(
			'get'
			, 'connect.logitech.com'
			, 'vnd.logitech.harmony/vnd.logitech.harmony.engine?' + command
			, body
		)
		, id = iq.attr('id');

	expectedResponseType = expectedResponseType || 'encoded';
	canHandleStanzaFn = canHandleStanzaFn || defaultCanHandleStanzaFn.bind(null, id);

	this._responseHandlerQueue.push({
		canHandleStanza: canHandleStanzaFn
		, deferred: deferred
		, responseType: expectedResponseType
	});

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
