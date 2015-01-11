# Content Formats

Logitech uses two different encodings when exchange messages between the hub and its clients:

## JSON

JSON encoded content is wrapped inside a CDATA when transmitted as content of an XML element.

```json
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
```

## Colon Separated

In addition to JSON, there is also a proprietary encoding format used from time to time:

```
activityId=-1:timestamp=1420973847101
```

See [`decodeColonSeparatedResponse` provided by util.js](https://github.com/swissmanu/harmonyhubjs-client/blob/master/lib/util.js#L18)
for an example how such a response can be easily transformed in something usable.
