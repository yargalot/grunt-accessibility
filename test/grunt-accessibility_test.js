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

exports.accessibilityTests = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  matchReports: function(test) {

    var actual;
    var expected;

    test.expect(2);

    actual = grunt.file.read('reports/txt/test.txt');
    expected = grunt.file.read('test/expected/txt/test.txt');
    test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    actual = grunt.file.read('reports/json/test.json');
    expected = grunt.file.read('test/expected/json/test.json');
    test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    // actual = grunt.file.read('reports/csv/test.csv');
    // expected = grunt.file.read('test/expected/csv/test.csv');
    // test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    test.done();
  }
};
