'use strict';

var cache = require('./cache');
var emitter = require('./emitter');
var interceptor = require('./interceptor');
var defaults = 10;
var baseline;

function e (value) {
  return value || '';
}

function setup (value) {
  baseline = parseDuration(value);
  if (baseline) {
    interceptor.add(intercept);
    emitter.on('fetch.done', persist);
  }
}

function intercept (e) {
  cache.get(e.url, result);

  function result (err, result) {
    if (!err && result) {
      e.preventDefault(result);
    }
  }
}

function parseDuration (value) {
  if (value === true) {
    return baseline || defaults;
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}

function persist (route, data) {
  var key = route.parts.pathname + e(route.parts.query);
  var d = route.cache !== void 0 ? route.cache : baseline;
  cache.set(key, data, parseDuration(d) * 1000);
}

module.exports = {
  setup: setup
};