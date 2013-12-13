'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.init_gruntplugin_sample = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);

    var actual = grunt.file.read('reports/carsales-report.txt');
    var expected = grunt.file.read('test/expected/carsales-report.txt');
    test.equal(actual, expected, 'Should produce a default report for carsales');

    actual = grunt.file.read('reports/test-report.txt');
    expected = grunt.file.read('test/expected/test-report.txt');
    test.equal(actual, expected, 'Should produce a default report for a test file');

    test.done();
  }
};
