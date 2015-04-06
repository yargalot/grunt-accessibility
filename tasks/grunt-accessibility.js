//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

  var Promise     = require('bluebird');
  var accessSniff = require('access-sniff');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var done = this.async();
    var options = this.options({
      ignore: [],
      verbose: true,
      force: false,
      domElement: true,
      reportType: null,
      reportLocation : 'reports',
      accessibilityrc: false,
      accessibilityLevel: 'WCAG2A',
    });

    accessSniff.start(this.filesSrc, options, done);

  });

};
