'use strict';

var buildRollup = require('./lib/pipelines/buildRollup');
var defaultOptions = require('./lib/options');
var consume = require('stream-consume');
var merge = require('merge');
var vfs = require('vinyl-fs');

module.exports = function (options) {
	options = merge({}, defaultOptions, options);
	var stream = vfs.src(options.src)
		.pipe(buildRollup(options))
		.pipe(vfs.dest(options.dest));
	if (!options.skipConsume) {
		consume(stream);
	}
	return stream;
};
