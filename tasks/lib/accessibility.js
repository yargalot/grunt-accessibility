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

var _that;

function Accessibility(task) {

  this.task     = task;
  this.options  = task.options(Accessibility.Defaults);
  this.basepath = process.cwd();
  this.grunt    = this.task.grunt;
  this.phantom  = require('grunt-lib-phantomjs').init(this.grunt);

  this.log      = '';
  this.logJSON  = {};

  _that = this;

}

Accessibility.taskName         = 'accessibility';
Accessibility.taskDescription  = 'Use HTML codesniffer to grade accessibility';
Accessibility.Defaults         = {
  phantomScript: asset('../phantomjs/bridge.js'),
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
  var ignore   = false;
  var msgSplit = msg.split('|');

  var grunt   = _that.grunt;
  var options = _that.options;

  // If ignore get the hell out
  _.each(options.ignore, function (value, key) {
    if (value === msgSplit[1]) {
      ignore = true;
    }
  });

  if (ignore) {
    return;
  }

  // Start messaging, If options force is false then fail the build
  if (msgSplit[0] === 'ERROR' && !options.force) {
    grunt.fail.warn(msgSplit[1] + ': ' + msgSplit[2]);
  }


  // Start the Logging
  if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE' || msgSplit[0] === 'WARNING') {

    if (options.outputFormat === 'json') {

      var jsonLog = _that.logJSON[options.file];

      jsonLog = jsonLog || [];
      jsonLog = jsonLog.concat(_that.outputJson(msgSplit));

      _that.logJSON[options.file] = jsonLog;

    } else {

      if (!options.domElement) {
        msg = msgSplit.slice(0, 3).join('|');
      }

      _that.log += msg + '\r\n';

    }

    _that.logger(msgSplit);

  } else {

    _that.logger(msg);

  }
};

/**
* Console logger
*
*
*/


Accessibility.prototype.logger = function(msgSplit) {

  var options       = _that.options;
  var errorMessage  = _.isArray(msgSplit);

  // If options verbose if false gtfo
  if (!options.verbose) {
    return;
  }

  // If its not an error message, log and return
  if (!errorMessage) {
    _that.grunt.log.writeln(msgSplit);

    return;
  }

  // Start logger
  var heading;

  switch (msgSplit[0]) {
    case 'ERROR':
        heading = msgSplit[0].red.bold;
    break;
    case 'NOTICE':
        heading = msgSplit[0].blue.bold;
    break;
    default:
        heading = msgSplit[0].yellow.bold;
    break;
  }

  heading += ' ' + msgSplit[1];

  _that.grunt.log.subhead(heading);
  _that.grunt.log.oklns(msgSplit[2].grey);

};



/**
* Json file format
*
*
*/


Accessibility.prototype.outputJson = function(msgSplit) {

  var options     = _that.options;
  var currentLog  = [];

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

  return currentLog;

};


/**
* Write the file
*
*
*/

Accessibility.prototype.writeFile = function(msg, trace) {

  var grunt   = _that.grunt;
  var options = _that.options;

  // Write the files
  if (options.outputFormat === 'json') {
    grunt.file.write(options.filedest + '.json', JSON.stringify(_that.logJSON[options.file]));
  } else {
    grunt.file.write(options.filedest , _that.log);
  }

  // Write messages to console
  grunt.log.subhead('Report Finished'.cyan);
  grunt.log.writeln('File "' + options.filedest +
    (options.outputFormat ? '.' + options.outputFormat : '') + '" created.');


  // Reset the values for next run
  _that.log = '';
  _that.logJSON = {};

  _that.phantom.halt();

};



/**
* Phantom General Errors
*
*
*/

Accessibility.prototype.failLoad = function(url) {
  _that.grunt.fail.fatal('PhantomJS unable to load URL:' + url);
  _that.phantom.halt();
};

Accessibility.prototype.failTime = function() {
  _that.grunt.warn('PhantomJS timed out.');
  _that.phantom.halt();
};

Accessibility.prototype.failError = function(message, trace) {
  _that.grunt.log.writeln('error: ' + message);
};



/**
* Run task
*
* @param {Object} grunt - grunt object
*
* @returns {Object} a promise that resolves with final html
*
*/

Accessibility.prototype.run = function(done) {

  var files   = Promise.resolve(this.task.files);
  var phantom = this.phantom;

  this.grunt.log.writeln('Running accessibility tests'.cyan);

  // Built-in error handlers.
  phantom.on('fail.load',     this.failLoad);
  phantom.on('fail.timeout',  this.failTime);
  phantom.on('error.onError', this.failError);

  // The main events
  phantom.on('console',       this.terminalLog);
  phantom.on('wcaglint.done', this.writeFile);

  return files
    .bind(this)
    .map(function(fileMap) {

      var srcFile  = fileMap.src[0];
      var destFile = fileMap.dest;

      this.options.filedest = destFile;

      return phantom.spawn(srcFile, {
        // Additional PhantomJS options.
        options: this.options,
        // Complete the task when done.
        done: function (err) {
          done();
          return (err || true);
        }
      });

    })
    .catch(function(err){ this.grunt.log.error(err); });

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

    task.run(done);

  });

};


module.exports = Accessibility;