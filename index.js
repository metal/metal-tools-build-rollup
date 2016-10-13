'use strict';

var babel = require('rollup-plugin-babel');
var buffer = require('vinyl-buffer');
var defaultOptions = require('./lib/options');
var gulp = require('gulp');
var merge = require('merge');
var nodeResolve = require('rollup-plugin-node-resolve');
var presetEs2015Rollup = require('babel-preset-es2015-rollup');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(options) {
	options = merge({}, defaultOptions, options);
	gulp = options.gulp || gulp;
	var warned = {};
	return rollup(merge({
			context: 'window',
			entry: options.src,
			format: 'umd',
			moduleName: options.globalName,
			plugins: [
				babel({
					compact: false,
					presets: [presetEs2015Rollup]
				}),
				nodeResolve({
					jsnext: true
				})
			],
			sourceMap: true,
			onwarn: function(message) {
				if (!warned[message] && !shouldSkipMsg(message, options.skipWarnings)) {
					console.warn(message);
					warned[message] = true;
				}
			}
		}, options.rollupConfig))
		.pipe(source(options.bundleFileName))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(options.dest));
};

function shouldSkipMsg(message, skipWarnings) {
	for (var i = 0; i < skipWarnings.length; i++) {
		if (skipWarnings[i].test(message)) {
			return true;
		}
	}
}
