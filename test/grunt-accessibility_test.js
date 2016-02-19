'use strict';

var grunt = require('grunt');

exports.accessibilityTests = {
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
