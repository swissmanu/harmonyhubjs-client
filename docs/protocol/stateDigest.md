# State Digest

| Direction | Stanza Type             | Type-Attribute               | Content Encoding   |
| :-------- | :---------------------- | :--------------------------- | :----------------- |
| Incoming  | [Event](stanzaTypes.md) | `connect.stateDigest?notify` | [JSON](formats.md) |

The state digest is emitted by a hub during starting and stopping activities. It allows to update its clients, even if
they did not initiate the change of the activity.

## Content Description

| Property         | Description                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------ |
| `activityId`     | ID of the current activity.                                                                       |
| `activityStatus` | `0` = Hub is off, `1` = Activity is starting, `2` = Activity is started, `3` = Hub is turning off |

## Example Stanza
```xml
<message from="HarmonyOne_Pop@qa1.com" to="ab903454-7bee-4410-9eea-bb5355bb667e">
	<event xmlns="connect.logitech.com" type="connect.stateDigest?notify"><!CDATA[
		{
			"sleepTimerId": -1,
			"configVersion": 118,
			"contentVersion": 99,
			"activityId": "7597005",
			"mode": 3,
			"discoveryServer": "https://svcs.myharmony.com/Discovery/Discovery.svc",
			"wifiStatus": 1,
			"activityStatus": 1,
			"syncStatus": 0,
			"updates": {
				"97": "3.12.9",
				"100": "3.12.6"
			},
			"stateVersion": 124,
			"hubSwVersion": "3.12.9",
			"hubUpdate": false,
			"sequence": false,
			"accountId": "42424242"
		}
	]]></event>
</message>
```
