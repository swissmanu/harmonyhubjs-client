# Start Activity

| Direction | Stanza Type          | IQ Type | Content Root     | Mime-Attribute               | Content Encoding |
| :-------- | :------------------- | :------ | :--------------- | :--------------------------- | :--------------- |
| Outgoing  | [IQ](stanzaTypes.md) | `get`   | `<oa>`           | `vnd.logitech.harmony/vnd.logitech.harmony.engine?startactivity` | [Colon Separated](formats.md) |

Use a `startactivity` stanza to let a hub start an activity.

## Content Description

| Property         | Description                                                                                |
| :--------------- | :----------------------------------------------------------------------------------------- |
| `activityId`     | ID of the activity to start |
| `timestamp`      | A unix timestamp so the hub can identify the order of incoming activity triggering request |

## Example Request Stanza
```xml
<iq type="get" id="285756">
	<oa xmlns="connect.logitech.com" mime="vnd.logitech.harmony/vnd.logitech.harmony.engine?startactivity">
		activityId=-1:timestamp=1420973847101
	</oa>
</iq>
```

## Example Response Stanza
After the hub did finish start the activity, it will emit a [Start Activity Finished](startActivityFinished.md) stanza.
This response will not be related to the IQ you sent with the `startActivity` stanza.
