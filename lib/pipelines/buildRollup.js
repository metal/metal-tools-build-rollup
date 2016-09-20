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
	combiner(
		sourcemaps.init(),
		rollup({
			allowRealFiles: true,
			entry: options.src,
			plugins: [
				babel({
					presets: [presetEs2015Rollup]
				}),
				nodeResolve({
					jsnext: true
				})
			],
			moduleName: options.globalName,
			format: 'umd',
			sourceMap: true
		}),
		rename(options.bundleFileName),
		sourcemaps.write('./')
	);
};
