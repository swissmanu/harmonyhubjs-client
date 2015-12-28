var IQ = require('node-xmpp-stanza').IQ

function getUniqueId () {
  return Math.floor(Math.random() * 1000000)
}

/**
 * Splits a response from the hub (usualy seperated by ':' and '=') into a
 * proper javascript object.
 *
 * Parameters:
 *     (String) response
 *
 * Returns:
 *     (Object)
 */
function decodeColonSeparatedResponse (response) {
  var result

  if (response && typeof response === 'string') {
    var pairs = response.split(':') || response
    result = {}

    pairs.forEach(function (pair) {
      var keyValue = pair.split('=')

      if (keyValue.length === 2) {
        result[keyValue[0]] = keyValue[1]
      }
    })
  }

  return result
}

function buildIqStanza (type, xmlns, mime, body, from) {
  var iq = new IQ({
    type: type,
    id: getUniqueId(),
    from: from
  })

  iq.c('oa', {
    xmlns: xmlns,
    mime: mime
  }).t(body)

  return iq
}

module.exports = {
  getUniqueId: getUniqueId,
  decodeColonSeparatedResponse: decodeColonSeparatedResponse,
  buildIqStanza: buildIqStanza
}
