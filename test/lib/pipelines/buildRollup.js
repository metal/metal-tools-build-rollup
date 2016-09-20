'use strict';

var assert = require('assert');
var buildRollup = require('../../../lib/pipelines/buildRollup');
var consume = require('stream-consume');
var vfs = require('vinyl-fs');

describe('Pipeline - Build with rollup', function() {
	it('should build js files to a bundle and its source map', function(done) {
		var src = 'test/fixtures/js/foo.js';
		var stream = vfs.src(src)
      .pipe(buildRollup({
				src: src
			}));

		var files = [];
    stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(2, files.length);
			assert.deepEqual(['metal.js', 'metal.js.map'], files.sort());
			done();
		});
		consume(stream);
	});

	it('should build js files to a bundle that uses "globalName" as the global variable name', function(done) {
		var src = 'test/fixtures/js/foo.js';
		var stream = vfs.src(src)
      .pipe(buildRollup({
				globalName: 'myGlobal',
				src: src
			}));

    stream.on('data', function(file) {
			if (file.relative === 'metal.js') {
				var contents = file.contents.toString();
				assert.notStrictEqual(-1, contents.indexOf('global.myGlobal ='));
				done();
			}
		});
		consume(stream);
	});

	it('should build js files to a bundle with the name specified by "bundleFileName"', function(done) {
		var src = 'test/fixtures/js/foo.js';
		var stream = vfs.src(src)
      .pipe(buildRollup({
				bundleFileName: 'myBundle.js',
				src: src
			}));

		var files = [];
    stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(2, files.length);
			assert.deepEqual(['myBundle.js', 'myBundle.js.map'], files.sort());
			done();
		});
		consume(stream);
	});
});
