var login = require('./login')
	, HarmonyClient = require('./harmonyclient');

function createHarmonyClient(xmppClient) {
	return new HarmonyClient(xmppClient);
}

function getHarmonyClient(email, password, hubhost, hubport) {
	return login(email, password, hubhost, hubport)
	.then(createHarmonyClient);
}

module.exports = getHarmonyClient;