/*
 * grunt-accessibility
 * https://github.com/yargalot/grunt-accessibility
 *
 * Copyright (c) 2013 Steven John Miller
 * Licensed under the MIT license.
 */

var path      = require('path');
var fs        = require('fs');
var _         = require('underscore');
var Promise   = require('bluebird'),
var phantom   = require('grunt-lib-phantomjs').init(grunt);
var asset     = path.join.bind(null, __dirname, '..');


function Accessibility(task) {

  this.task     = task;
  this.options  = task.options(Accessibility.Defaults);
  this.basepath = process.cwd();
  this.grunt    = this.task.grunt;

  this.done     = this.async();
  this.log      = '';
  this.logJSON  = {};
}

Accessibility.taskName         = 'accessibility';
Accessibility.taskDescription  = 'Use HTML codesniffer to grade accessibility';
Accessibility.Defaults         = {
  phantomScript: asset('phantomjs/bridge.js'),
  urls: [],
  domElement: true,
  verbose: true
};



/**
* The Message Terminal, choo choo
*
*
*/

Accessibility.prototype.terminalLog = function(msg, trace) {
  var ignore = false;
  var msgSplit = msg.split('|');

  // If ignore get the hell out
  _.each(options.ignore, function (value, key) {
    if (value === msgSplit[1]) {
      ignore = true;
    }
  });

  if (ignore) {
    return;
  }

  // Start messaging
  if (msgSplit[0] === 'ERROR' && !options.force) {
    grunt.fail.warn(msgSplit[1] + ': ' + msgSplit[2]);
  }

  if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE' || msgSplit[0] === 'WARNING') {

    if (options.outputFormat === 'json') {

      logJSON[options.file] = logJSON[options.file] || [];

      var currentLog = logJSON[options.file];

      currentLog.push({
        type: msgSplit[0],
        msg: msgSplit[2],
        sc: msgSplit[1].split('.')[3],
        technique: msgSplit[1].split('.')[4]
      });

      if (options.domElement) {
        currentLog[currentLog.length - 1].element = {
          nodeName: msgSplit[3],
          className: msgSplit[4],
          id: msgSplit[5]
        };
      }

    } else {

      if (!options.domElement) {
        msg = msgSplit.slice(0, 3).join('|');
      }

      log += msg + '\r\n';

    }

    if (options.verbose) {
      var heading = null;

      if (msgSplit[0] === 'ERROR') {
        heading = msgSplit[0].red;
      } else if (msgSplit[0] === 'NOTICE') {
        heading = msgSplit[0].blue;
      } else if (msgSplit[0] === 'WARNING') {
        heading = msgSplit[0].yellow;
      }

      heading += ' ' + msgSplit[1];

      grunt.log.writeln(heading);
      grunt.log.writeln(msgSplit[2]);
    }

  } else {
    if (options.verbose) {
      grunt.log.writeln(msg);
    }
  }
}



/**
* Write the file
*
*
*/

Accessibility.prototype.writeFile = function(msg, trace) {
  grunt.log.writeln('Report Finished'.cyan);

  if (options.outputFormat === 'json') {
    grunt.file.write(options.filedest + '.json', JSON.stringify(logJSON[options.file]));
  } else {
    grunt.file.write(options.filedest , log);
  }

  grunt.log.writeln('File "' + options.filedest +
    (options.outputFormat ? '.' + options.outputFormat : '') +
    '" created.');

  log = '';
  logJSON = {};

  phantom.halt();

};



/**
* Phantom General Errors
*
*
*/

Accessibility.prototype.failLoad = function(url) = {
  phantom.halt();
  grunt.warn('PhantomJS unable to load URL:' + url);
}

Accessibility.prototype.failTime = function() = {
  phantom.halt();
  grunt.warn('PhantomJS timed out.');
}

Accessibility.prototype.failError = function(message, trace) = {
  grunt.log.writeln('error: ' + message);
}



/**
* Run task
*
* @param {Object} grunt - grunt object
*
* @returns {Object} a promise that resolves with final html
*
*/

Accessibility.prototype.run = function() {

  var files = Promise.resolve(this.task.files);


  grunt.log.writeln('Running accessibility tests'.cyan);

  // Built-in error handlers.
  phantom.on('fail.load',     Accessibility.failLoad);
  phantom.on('fail.timeout',  Accessibility.failTime);
  phantom.on('error.onError', Accessibility.failError);

  // The main events
  phantom.on('console',       Accessibility.terminalLog);
  phantom.on('wcaglint.done', Accessibility.writeFile);

  return files
    .bind(this)
    .map(function(fileMap){

      var srcFile  = fileMap.src[0];
      var destFile = fileMap.dest;

      return this.inlineCss(srcFile, destFile)
        .then(this.writeFile)
    })
    .catch(function(err){ this.grunt.log.error(err); });



  // Start the running thing
  var totalFiles  = this.files.length;
  var currentFile = 0;

  console.log(this.files);

  _.each(this.files, function(file) {

    var filename = path.basename(file.src, ['.html']);

    options.filedest = file.dest;
    options.file = filename;

    console.log(file.src);

    phantom.spawn(file.src[0], {
      // Additional PhantomJS options.
      options: options,
      // Complete the task when done.
      done: function (err) {

        currentFile ++;

        if (currentFile === totalFiles || err) {
        }

      }
    });
  });

  // grunt.util.async.forEachSeries(this.files, function (file, next) {

  //   if (!file.src) {
  //     done();
  //   }

  //   var filename = path.basename(file.src, ['.html']);

  //   options.filedest = file.dest;
  //   options.file = filename;

  //   console.log(file.src);


  // });
};

Accessibility.prototype.registerWithGrunt = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask(Accessibility.taskName, Accessibility.taskDescription, function() {

    this.grunt = grunt;
    var done = this.async();
    var task = new Accessibility(this);

    task.run().done(done);

  });

};


module.exports = Accessibility;