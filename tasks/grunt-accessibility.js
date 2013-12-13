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
      var log = '';

      grunt.log.writeln('Running accessibility tests'.cyan);

      phantom.on('error.onError', function (msg, trace) {
        grunt.log.writeln('error: ' + msg);
      });

      phantom.on('console', function (msg, trace) {

        if (msg === 'done') {
          return;
        }

        var msgSplit = msg.split('|');

        if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE') {

          var heading = msgSplit[0] === 'ERROR' ? msgSplit[0].red  : msgSplit[0].yellow;
          heading += ' '+ msgSplit[1];

          grunt.log.writeln(heading);
          grunt.log.writeln(msgSplit[2]);

          log += msg + '\r\n';

        } else {
          grunt.log.writeln(msg);
        }

      });

      phantom.on('wcaglint.done', function (msg, trace) {
          grunt.log.writeln('Report Finished'.cyan);
          grunt.file.write(options.filedest , log);
          grunt.log.writeln('File "' + options.filedest + '" created.');
          log = '';
          phantom.halt();
          return;
      });

      // Built-in error handlers.
      phantom.on('fail.load', function(url) {
        phantom.halt();
        grunt.warn('PhantomJS unable to load URL.');
      });

      phantom.on('fail.timeout', function() {
        phantom.halt();
        grunt.warn('PhantomJS timed out.');
      });

      grunt.util.async.forEachSeries(this.files, function(file, next) {

        if (!file.src) {
          done();
          return;
        }

        var filename = path.basename(file.src, ['.html']);

        file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).forEach(function(filepath) {

          options.filedest = file.dest;

          phantom.spawn(filepath, {
            // Additional PhantomJS options.
            options: options,
            // Complete the task when done.
            done: function (err) {

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

      });

  });

};
