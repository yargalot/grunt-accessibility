/*
 * grunt-accessibility
 * https://github.com/yargalot/grunt-accessibility
 *
 * Copyright (c) 2013 Steven John Miller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path      = require('path');
  var fs        = require('fs');
  var _         = require('underscore');
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

      var ignore = false;
      var msgSplit = msg.split('|');

      _.each(options.ignore, function(value, key) {
        if (value === msgSplit[1]) {
          ignore = true;
        }
      });

      if (ignore) {
        return;
      }

      if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE') {

        var heading = msgSplit[0] === 'ERROR' ? msgSplit[0].red : msgSplit[0].yellow;
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

    // Start the running thing
    var totalFiles  = this.files.length;
    var currentFile = 0;

    grunt.util.async.forEachSeries(this.files, function(file, next) {

      if (!file.src) {
        done();
      }

      var filename = path.basename(file.src, ['.html']);

      options.filedest = file.dest;

      phantom.spawn(file.src, {
        // Additional PhantomJS options.
        options: options,
        // Complete the task when done.
        done: function (err) {

          currentFile ++;

          if (currentFile === totalFiles || err) {
            done();
          }

          next();

        }
      });

    });

  });

};
