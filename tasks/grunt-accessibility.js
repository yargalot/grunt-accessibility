//
// Grunt AccessSniff Task
// ------------------------

module.exports = function(grunt) {

  var accessSniff = require('access-sniff');
  var Promise   = require('bluebird');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var options = {};
    var done = this.async();

    // console.log(this.filesSrc);
    // console.log(run);

    accessSniff.start(this.filesSrc, this.options, done);

  });

};
