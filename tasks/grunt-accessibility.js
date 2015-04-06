//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

  var Promise     = require('bluebird');
  var accessSniff = require('access-sniff');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var done = this.async();
    var options = this.options();

    accessSniff.start(this.filesSrc, options, done);

  });

};
