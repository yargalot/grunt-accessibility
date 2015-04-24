//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

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

    accessSniff.start(this.filesSrc, options, function(messageLog, errors) {

      if (!options.force && errors) {
        grunt.fail.warn('There were ' + errors + ' errors');
      }

      done();
    });

  });

};
