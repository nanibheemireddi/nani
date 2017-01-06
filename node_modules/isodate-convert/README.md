# isodate-convert [![Circle CI](https://circleci.com/gh/hden/isodate-convert.svg?style=svg)](https://circleci.com/gh/hden/isodate-convert)
Traverse an object, converting all ISO strings to JavaScript Dates and vice versa.

## Installation

    npm install --save isodate-convert

## Example

```js
var decode = require('isodate-convert').decode
var obj = { date: '2013-09-04T00:57:26.434Z' }
var decoded = decode(obj)
// { date: [object Date] }

var encode = require('isodate-convert').encode
var encoded = encode(decoded)
// { date: '2013-09-04T00:57:26.434Z' }
```

## API

### encode(obj)

Traverse an obj, converting all ISO strings to real Dates.

### decode(obj)

Traverse an obj, converting all Dates to ISO strings.

## Badges

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
