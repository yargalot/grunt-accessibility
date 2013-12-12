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

      grunt.log.writeln('Running accessibility tests'.cyan);

      grunt.util.async.forEachSeries(this.files, function(file, next) {

        if (!file.src) {
          done();
          return;
        }

        var log = '';
        var filename = path.basename(file.src, ['.html'])

        file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).forEach(function(filepath) {

          phantom.spawn(filepath, {
            // Additional PhantomJS options.
            options: options,
            // Complete the task when done.
            done: function (err) {

              grunt.log.writeln('TEST'.cyan);

              if (err) {
                  // If there was an error, abort the series.
                  done();
              } else {
                  // Otherwise, process next url.
                  next();
              }
            }
          });

        });

        phantom.on('error.onError', function (msg, trace) {
          grunt.log.writeln('error: ' + msg);
        });

        phantom.on('console', function (msg, trace) {
          if (msg === 'done') {
            grunt.log.writeln('Report Finished'.cyan);
            grunt.file.write(file.dest , log);
            grunt.log.writeln('File "' + file.dest + '" created.');
            log = '';
            return;
          }

          grunt.log.writeln(msg);
          log += msg + '\r\n';

        });

      }, function(err){
          done();
      });

  });

};
