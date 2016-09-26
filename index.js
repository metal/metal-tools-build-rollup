'use strict';

var babel = require('rollup-plugin-babel');
var defaultOptions = require('./lib/options');
var merge = require('merge');
var nodeResolve = require('rollup-plugin-node-resolve');
var path = require('path');
var presetEs2015Rollup = require('babel-preset-es2015-rollup');
var rollup = require('rollup');

module.exports = function(options, opt_callback) {
	options = merge({}, defaultOptions, options);
	rollup.rollup({
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
		onwarn: function(message) {
			if (message.indexOf('Use of `eval`') === -1 &&
				  message.indexOf('The `this` keyword') === -1) {
				console.warn(message);
			}
		}
	}).then(function(bundle) {
		bundle.write({
			dest: path.join(options.dest, options.bundleFileName),
			moduleName: options.globalName,
			format: 'umd',
			sourceMap: true
		}).then(function() {
			if (opt_callback) {
				opt_callback(bundle);
			}
		});
	});
};
