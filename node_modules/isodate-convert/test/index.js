/* global describe, it */
var convert = require('../')
var expect = require('chai').expect

describe('isodate-convert', function () {
  var encode = convert.encode
  var decode = convert.decode

  describe('encode', function () {
    it('should convert dates', function () {
      var obj = { date: new Date('2013-09-04T00:57:26.434Z') }
      obj = encode(obj)
      expect(obj.date).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should not affect irrelevant object properties', function () {
      var obj = { a: new Date('2013-12-13T23:35:50.000Z'), b: 'foo', c: null }
      obj = encode(obj)
      expect(obj).to.have.property('b', 'foo')
      expect(obj).to.have.property('c', null)
    })

    it('should not affect irrelevant array indexes', function () {
      var obj = [ new Date('2013-12-13T23:35:50.000Z'), 'foo', null ]
      encode(obj)
      expect(obj[1]).to.equal('foo')
      expect(obj[2]).to.equal(null)
    })

    it('should not convert numbers', function () {
      var obj = { number: '4000' }
      encode(obj)
      expect(obj).to.have.property('number', '4000')
    })

    it('should iterate through arrays', function () {
      var arr = [{ date: new Date('2013-09-04T00:57:26.434Z') }]
      encode(arr)
      expect(arr[0].date).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should iterate through nested arrays', function () {
      var arr = [{
        date: new Date('2013-09-04T00:57:26.434Z'),
        array: [{ date: new Date('2013-09-04T00:57:26.434Z') }]
      }]
      encode(arr)
      expect(arr[0].date).to.equal('2013-09-04T00:57:26.434Z')
      expect(arr[0].array[0].date).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should do nothing for non-objects or non-arrays', function () {
      var date = new Date()
      var ret = encode(date, false)
      expect(date).to.equal(ret)
    })
  })

  describe('decode', function () {
    // compatible with [segmentio/isodate-decode](http://bit.ly/1iw6Har)
    it('should convert isostrings', function () {
      var obj = { date: '2013-09-04T00:57:26.434Z' }
      obj = decode(obj)
      expect(obj.date.toISOString()).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should not affect irrelevant object properties', function () {
      var obj = { a: '2013-12-13T23:35:50.000Z', b: 'foo', c: null }
      obj = decode(obj)
      expect(obj).to.have.property('b', 'foo')
      expect(obj).to.have.property('c', null)
    })

    it('should not affect irrelevant array indexes', function () {
      var obj = [ '2013-12-13T23:35:50.000Z', 'foo', null ]
      decode(obj)
      expect(obj[1]).to.equal('foo')
      expect(obj[2]).to.equal(null)
    })

    it('should not convert numbers', function () {
      var obj = { number: '4000' }
      decode(obj)
      expect(obj).to.have.property('number', '4000')
    })

    it('should iterate through arrays', function () {
      var arr = [{ date: '2013-09-04T00:57:26.434Z' }]
      decode(arr)
      expect(arr[0].date.toISOString()).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should iterate through nested arrays', function () {
      var arr = [{
        date: '2013-09-04T00:57:26.434Z',
        array: [{ date: '2013-09-04T00:57:26.434Z' }]
      }]
      decode(arr)
      expect(arr[0].date.toISOString()).to.equal('2013-09-04T00:57:26.434Z')
      expect(arr[0].array[0].date.toISOString()).to.equal('2013-09-04T00:57:26.434Z')
    })

    it('should do nothing for non-objects or non-arrays', function () {
      var date = new Date()
      var ret = decode(date, false)
      expect(date).to.equal(ret)
    })
  })
})
