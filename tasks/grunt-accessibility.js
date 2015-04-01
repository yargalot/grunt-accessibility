//
// Grunt AccessSniff Task
// ------------------------
module.exports = function(grunt) {

  var accessSniff = require('access-sniff');
  var Promise   = require('bluebird');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {

    var options = {};

    console.log(this.filesSrc);

    var run = Promise.promisify(accessSniff.start);

    console.log(run);

    run(this.filesSrc).then(function() {
      console.log('Derp');
    });

  });

};
