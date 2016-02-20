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

    actual = readFile('reports/txt/report.txt');
    expected = readFile('test/expected/txt/report.txt');
    test.equal(actual, expected, 'Should produce a TXT report without DOM element for a test file');

    actual = readFile('reports/json/report.json');
    expected = readFile('test/expected/json/report.json');
    test.equal(actual, expected, 'Should produce a JSON report without DOM element for a test file');

    // This is commented out since travis has some issues with csv or something
    // ----------
    // actual = readFile('reports/csv/report.csv');
    // expected = readFile('test/expected/csv/report.csv');
    // test.equal(actual, expected, 'Should produce a CSV report without DOM element for a test file');

    test.done();
  }
};
