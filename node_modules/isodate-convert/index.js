var traverse = require('traverse')
var type = require('type-component')
var isostring = require('is-isodate')

exports.encode = function encode (obj) {
  traverse(obj).forEach(function (d) {
    if (type(d) === 'date') this.update(d.toISOString())
  })
  return obj
}

exports.decode = function decode (obj) {
  traverse(obj).forEach(function (d) {
    if (type(d) === 'string' && isostring(d)) this.update(new Date(d))
  })
  return obj
}
