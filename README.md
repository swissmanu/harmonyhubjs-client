# harmonyhubjs-client
[![Build Status](https://travis-ci.org/swissmanu/harmonyhubjs-client.svg)](https://travis-ci.org/swissmanu/harmonyhubjs-client) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![npm version](https://badge.fury.io/js/harmonyhubjs-client.svg)](http://badge.fury.io/js/harmonyhubjs-client) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Analytics](https://ga-beacon.appspot.com/UA-3159494-8/harmonyhubjs-client)](https://github.com/swissmanu/harmonyhubjs-client)

`harmonyhubjs-client` is a Node.JS library which allows you to interact with your Logitech
Harmony Hub.

It was based upon [@jterraces](https://github.com/jterrace) awesome Harmony
[protocol guide](https://github.com/jterrace/pyharmony/blob/master/PROTOCOL.md). `harmonyhubjs-client` provides an
[extended protocol guide](https://github.com/swissmanu/harmonyhubjs-client/tree/master/docs/protocol) for the interested ones.

## Installation
```bash
npm install harmonyhubjs-client --save
```

## Usage
```javascript
var harmony = require('harmonyhubjs-client');

harmony('192.168.1.200')
.then(function(harmonyClient) {
	harmonyClient.isOff()
	.then(function(off) {
		if(off) {
			console.log('Currently off. Turning TV on.')

			harmonyClient.getActivities()
			.then(function(activities) {
				activities.some(function(activity) {
					if(activity.label === 'Watch TV') {
						var id = activity.id
						harmonyClient.startActivity(id)
						harmonyClient.end()
						return true
					}
					return false
				})
			})
		} else {
			console.log('Currently on. Turning TV off')
			harmonyClient.turnOff()
			harmonyClient.end()
		}
	})
})
```

This example connects to a Harmony hub available on the IP `192.168.1.200`. As soon as the the connection is established, `isOff()` checks if the equipment is turned off. If off, the activity with the name `Watch TV` is started. If on, all devices are turned off.

## Lookup your hub
If you have no idea which IP was assigned to your Harmony hub, have a look at [harmonyhubjs-discover](https://github.com/swissmanu/harmonyhubjs-discover). It has an easy to use interface to find the hubs in your network.


## Debug Traces
`harmonyhubjs-client` uses [debug](https://github.com/visionmedia/debug) for generating traces throughout its execution time. Activate them by setting the `DEBUG` environment variable:

	$ DEBUG=harmonyhubjs:client* node myharmonyjsapp.js


## License

Copyright (c) 2013 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
