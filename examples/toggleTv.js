var harmony = require('../index');

harmony('192.168.1.26')
.then(function(harmonyClient) {
	harmonyClient.isOff()
	.then(function(off) {
		if(off) {
			console.log('Currently off. Turning TV on.');

			harmonyClient.getActivities()
			.then(function(activities) {
				activities.some(function(activity) {
					if(activity.label === 'Fernsehen') {
						var id = activity.id;
						harmonyClient.startActivity(id);
						harmonyClient.end();
						return true;
					}

					return false;
				});
			});
		} else {
			console.log('Currently on. Turning TV off');

			harmonyClient.turnOff();
			harmonyClient.end();
		}
	});
});
