var resources = require('./resources.json');
var Observable = require('object-observer');

module.exports = Observable.from(resources);