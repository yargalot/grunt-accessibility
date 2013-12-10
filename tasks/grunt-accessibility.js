/*
 * grunt-accessibility
 * https://github.com/yargalot/grunt-accessibility
 *
 * Copyright (c) 2013 Steven John Miller
 * Licensed under the MIT license.
 */

// 'use strict';

module.exports = function(grunt) {

    var path        = require("path"),
        phantom     = require("grunt-lib-phantomjs").init(grunt);

    var asset = path.join.bind(null, __dirname, '..');

  grunt.registerMultiTask('accessibility', 'Use HTML codesniffer to grade accessibility', function() {
        var options = this.options({
          phantomScript: asset('phantomjs/bridge.js'),
          urls: []
        });

        // the channel prefix for this async grunt task
        var taskChannelPrefix = "" + new Date().getTime();

        var sanitizeFilename = options.sanitize;

        var log = '';
        var done = this.async();

        phantom.on('error.onError', function (msg, trace) {
            grunt.log.writeln('error: ' + msg);
            phantom.halt();
        });

        phantom.on('console', function (msg, trace) {
            if (msg === 'done') {
              done();
              grunt.log.writeln('Report Finished'.cyan);
              grunt.file.write('report.txt', log);
              return;
            }

            grunt.log.writeln(msg);
            log += msg + '\r\n';

        });

        grunt.util.async.forEachSeries(this.files, function(url, next) {

            phantom.spawn(url, {
                // Additional PhantomJS options.
                options: options,
                // Complete the task when done.
                done: function (err) {
                    if (err) {
                        // If there was an error, abort the series.
                        done();
                    }
                    else {
                        // Otherwise, process next url.
                        next();
                    }
                }
            });
        });
        grunt.log.writeln('Running accessibility tests'.cyan);
  });

};
