# Start Activity Finished

| Direction | Stanza Type             | Type-Attribute               | Content Encoding   |
| :-------- | :---------------------- | :--------------------------- | :----------------- |
| Incoming  | [Event](stanzaTypes.md) | `harmony.engine?startActivityFinished` | [Colon Separated](formats.md) |

As soon as an activity was started properly, the hub emits a `startActivityFinished` stanza to inform all interested
clients.

## Content Description

| Property         | Description                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------ |
| `activityId`     | ID of the started activity.                                                                       |

## Example Stanza
```xml
<message from="HarmonyOne_Pop@qa1.com" to="ab903454-7bee-4410-9eea-bb5355bb667e">
	<event xmlns="connect.logitech.com" type="harmony.engine?startActivityFinished"><![CDATA[
		activityId=7596992:errorCode=200:errorString=OK
	]]></event>
</message>
```
