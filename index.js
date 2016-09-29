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

function buildRollup(options) {
	options = merge({}, defaultOptions, options);
	gulp = options.gulp || gulp;
	return rollup({
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
				if (message.indexOf('Use of `eval`') === -1 &&
					  message.indexOf('The `this` keyword') === -1) {
					console.warn(message);
				}
			}
		})
		.pipe(source(options.bundleFileName))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(options.dest));
}

module.exports = buildRollup;
module.exports.TASKS = [
	{name: 'build', fullName: 'build:rollup', handler: buildRollup}
];
