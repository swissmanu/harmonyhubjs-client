# Stanza Types
At the current state of reverse engineering, there are two different types of stanzas Logitech is using for its Harmony
hubs:

## IQ
This stanza follows [XEP-0090](http://xmpp.org/extensions/xep-0090.html) and enables a request/response based
communication between a client and the hub.

The following snippet shows a "request" stanza, identified by a session unique `id`:

```xml
<iq type="get" id="285756">
	<oa xmlns="connect.logitech.com" mime="vnd.logitech.harmony/vnd.logitech.harmony.engine?getCurrentActivity"></oa>
</iq>
```

The hub will process the request and responds with the following stanza.
Notice that the response can be identified distinctly by the same `id` as the request had before.

```xml
<iq id="285756" to="guest" type="get" xmlns:stream="http://etherx.jabber.org/streams">
	<oa xmlns="connect.logitech.com" mime="vnd.logitech.connect/vnd.logitech.pair" errorcode="200" errorstring="OK">
		serverIdentity=6377455b-f8b5-416a-0df6-defe2b788652:hubId=97:identity=6377455b-f8b5-416a-0df6-defe2b788652:status=succeeded:protocolVersion={XMPP="1.0", HTTP="1.0", RF="1.0"}:hubProfiles={Harmony="2.0"}:productId=Pimento:friendlyName=Nerd Room
	</oa>
</iq>
```


## Message
The `message` stanza is emitted by a hub discretely and contains always, as know of today, an `event` element. It informs clients about changes on the hub. A good example is the
[Start Activity Finished](startActivityFinished.md) stanza which informs clients about a started activity:

```xml
<message from="HarmonyOne_Pop@qa1.com" to="ab903454-7bee-4410-9eea-bb5355bb667e">
	<event xmlns="connect.logitech.com" type="harmony.engine?startActivityFinished"><![CDATA[
		activityId=7596992:errorCode=200:errorString=OK
	]]></event>
</message>
```

The `event` element uses the `type` attribute to distinguish between different event types.
