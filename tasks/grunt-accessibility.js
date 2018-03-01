//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

  var accessSniff = require('access-sniff');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var done = this.async();
    var options = this.options({
      force: false
    });

    function writeReport(report) {
      if (options.reportLocation) {
        accessSniff.report(report, {
          reportLocation: options.reportLocation,
          reportType: options.reportType
        });
      }
    }

    accessSniff
      .default(options.urls || this.filesSrc, options)
      .then(function(report) {
        writeReport(report);
        grunt.log.ok('Testing Complete');
        done();
      })
      .catch(function(result) {
        var warn = options.force ? grunt.log.warn : grunt.fail.warn;
        writeReport(result.reportLogs);
        warn(result.errorMessage);
      });

  });

};
