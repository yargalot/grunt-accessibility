//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

  var accessSniff = require('access-sniff');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var done = this.async();
    var options = this.options({
      accessibilityLevel: 'WCAG2A',
      accessibilityrc: false,
      domElement: true,
      force: false,
      ignore: [],
      reportLocation : '',
      reportType: null,
      verbose: true
    });

    accessSniff
      .default(this.filesSrc, options)
      .then(function(report) {
        if (options.reportLocation) {
          accessSniff.report(report, {
            location: options.reportLocation,
            reportType: options.reportType
          });
        }

        grunt.log.ok('Testing Complete');
        done();
      })
      .catch(function(error) {
        grunt.fail.warn(error);
      });

  });

};
