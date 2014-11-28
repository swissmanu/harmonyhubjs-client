var login = require('./login')
	, HarmonyClient = require('./harmonyclient');

function createHarmonyClient(xmppClient) {
	return new HarmonyClient(xmppClient);
}

function getHarmonyClient(hubhost, hubport) {
	return login(hubhost, hubport)
	.then(createHarmonyClient);
}

module.exports = getHarmonyClient;