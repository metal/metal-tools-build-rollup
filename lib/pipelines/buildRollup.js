'use strict';

var babel = require('rollup-plugin-babel');
var combiner = require('stream-combiner');
var defaultOptions = require('../options');
var merge = require('merge');
var nodeResolve = require('rollup-plugin-node-resolve');
var presetEs2015Rollup = require('babel-preset-es2015-rollup');
var rename = require('gulp-rename');
var rollup = require('gulp-rollup');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(options) {
	options = merge({}, defaultOptions, options);
	return combiner(
		sourcemaps.init(),
		rollup({
			allowRealFiles: true,
			entry: options.src,
			plugins: [
				babel({
					compact: false,
					presets: [presetEs2015Rollup]
				}),
				nodeResolve({
					jsnext: true
				})
			],
			moduleName: options.globalName,
			onwarn: function(message) {
				if (message.indexOf('Use of `eval`') === -1 &&
					  message.indexOf('The `this` keyword') === -1) {
					console.warn(message);
				}
			},
			format: 'umd',
			sourceMap: true
		}),
		rename(options.bundleFileName),
		sourcemaps.write('./')
	);
};
