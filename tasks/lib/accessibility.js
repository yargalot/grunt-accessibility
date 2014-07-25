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
var Promise   = require('bluebird');
var asset     = path.join.bind(null, __dirname, '..');


function Accessibility(task) {

  this.task     = task;
  this.options  = task.options(Accessibility.Defaults);
  this.basepath = process.cwd();
  this.grunt    = this.task.grunt;
  this.phantom   = require('grunt-lib-phantomjs').init(this.grunt);

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
  _.each(this.options.ignore, function (value, key) {
    if (value === msgSplit[1]) {
      ignore = true;
    }
  });

  if (ignore) {
    return;
  }

  // Start messaging
  if (msgSplit[0] === 'ERROR' && !this.options.force) {
    this.grunt.fail.warn(msgSplit[1] + ': ' + msgSplit[2]);
  }

  if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE' || msgSplit[0] === 'WARNING') {

    if (this.options.outputFormat === 'json') {

      this.logJSON[this.options.file] = this.logJSON[this.options.file] || [];

      var currentLog = this.logJSON[this.options.file];

      currentLog.push({
        type: msgSplit[0],
        msg: msgSplit[2],
        sc: msgSplit[1].split('.')[3],
        technique: msgSplit[1].split('.')[4]
      });

      if (this.options.domElement) {
        currentLog[currentLog.length - 1].element = {
          nodeName: msgSplit[3],
          className: msgSplit[4],
          id: msgSplit[5]
        };
      }

    } else {

      if (!this.options.domElement) {
        msg = msgSplit.slice(0, 3).join('|');
      }

      this.log += msg + '\r\n';

    }

    if (this.options.verbose) {
      var heading = null;

      if (msgSplit[0] === 'ERROR') {
        heading = msgSplit[0].red;
      } else if (msgSplit[0] === 'NOTICE') {
        heading = msgSplit[0].blue;
      } else if (msgSplit[0] === 'WARNING') {
        heading = msgSplit[0].yellow;
      }

      heading += ' ' + msgSplit[1];

      this.grunt.log.writeln(heading);
      this.grunt.log.writeln(msgSplit[2]);
    }

  } else {
    if (this.options.verbose) {
      this.grunt.log.writeln(msg);
    }
  }
};



/**
* Write the file
*
*
*/

Accessibility.prototype.writeFile = function(msg, trace) {
  this.grunt.log.writeln('Report Finished'.cyan);

  if (this.options.outputFormat === 'json') {
    this.grunt.file.write(this.options.filedest + '.json', JSON.stringify(this.logJSON[this.options.file]));
  } else {
    this.grunt.file.write(this.options.filedest , this.log);
  }

  this.grunt.log.writeln('File "' + this.options.filedest +
    (this.options.outputFormat ? '.' + this.options.outputFormat : '') +
    '" created.');

  this.log = '';
  this.logJSON = {};

  this.phantom.halt();

};



/**
* Phantom General Errors
*
*
*/

Accessibility.prototype.failLoad = function(url) {
  this.phantom.halt();
  this.grunt.warn('PhantomJS unable to load URL:' + url);
};

Accessibility.prototype.failTime = function() {
  this.phantom.halt();
  this.grunt.warn('PhantomJS timed out.');
};

Accessibility.prototype.failError = function(message, trace) {
  this.grunt.log.writeln('error: ' + message);
};



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


  this.grunt.log.writeln('Running accessibility tests'.cyan);

  // Built-in error handlers.
  // phantom.on('fail.load',     Accessibility.failLoad);
  // phantom.on('fail.timeout',  Accessibility.failTime);
  // phantom.on('error.onError', Accessibility.failError);

  // // The main events
  // phantom.on('console',       Accessibility.terminalLog);
  // phantom.on('wcaglint.done', Accessibility.writeFile);

  // // Start the running thing
  // var totalFiles  = this.files.length;
  // var currentFile = 0;

  // console.log(this.files);

  // _.each(this.files, function(file) {

  //   var filename = path.basename(file.src, ['.html']);

  //   this.options.filedest = file.dest;
  //   this.options.file = filename;

  //   console.log(file.src);

  //   phantom.spawn(file.src[0], {
  //     // Additional PhantomJS options.
  //     options: this.options,
  //     // Complete the task when done.
  //     done: function (err) {

  //       currentFile ++;

  //       if (currentFile === totalFiles || err) {
  //       }

  //     }
  //   });
  // });

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

Accessibility.registerWithGrunt = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask(Accessibility.taskName, Accessibility.taskDescription, function() {

    this.grunt = grunt;
    var done = this.async();
    var task = new Accessibility(this);

    task.run();

  });

};


module.exports = Accessibility;