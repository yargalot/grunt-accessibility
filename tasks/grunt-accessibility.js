/*
 * grunt-accessibility
 * https://github.com/yargalot/grunt-accessibility
 *
 * Copyright (c) 2013 Steven John Miller
 * Licensed under the MIT license.
 */

// 'use strict';

module.exports = function(grunt) {

    var path      = require('path');
    var fs        = require('fs');
    var phantom   = require('grunt-lib-phantomjs').init(grunt);
    var asset     = path.join.bind(null, __dirname, '..');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {
        var options = this.options({
          phantomScript: asset('phantomjs/bridge.js'),
          urls: []
        });

        var done = this.async();

        this.files.forEach(function(file) {

          grunt.util.async.forEachSeries(file.src, function(source, next) {

            console.log(source);
            var log = '';
            var filename = path.basename(source, ['.html'])

            phantom.spawn(source, {
              // Additional PhantomJS options.
              options: options,
              // Complete the task when done.
              done: function (err) {
                if (err) {
                  // If there was an error, abort the series.
                  done();
                }
              }
            });

            phantom.on('error.onError', function (msg, trace) {
              grunt.log.writeln('error: ' + msg);
              phantom.halt();
            });

            phantom.on('console', function (msg, trace) {
              if (msg === 'done') {
                grunt.log.writeln('Report Finished'.cyan);
                grunt.file.write(file.dest + '/' + filename + '_report.txt', log);
                log = '';
                phantom.halt();

                next();
                return;
              }

              grunt.log.writeln(msg);
              log += msg + '\r\n';

            });

          }, function(err){
              done();
          });
          grunt.log.writeln('Running accessibility tests'.cyan);

        });

  });

};
