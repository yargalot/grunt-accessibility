'use strict';

var grunt = require('grunt');

function readFile(file) {
  var contents = grunt.file.read(file);

  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }

  return contents;
}

exports.accessibilityTests = {
  matchReports: function(test) {

    var actual;
    var expected;

    test.expect(2);

    actual = readFile('reports/txt/test.txt');
    expected = readFile('test/expected/txt/test.txt');
    test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    actual = readFile('reports/json/test.json');
    expected = readFile('test/expected/json/test.json');
    test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    // actual = readFile('reports/csv/test.csv');
    // expected = readFile('test/expected/csv/test.csv');
    // test.equal(actual, expected, 'Should produce a default report without DOM element for a test file');

    test.done();
  }
};
