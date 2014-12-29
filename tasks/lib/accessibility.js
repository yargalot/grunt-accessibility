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
  this.failTask = false;

  this.log      = '';
  this.logJSON  = {};

  if (this.options.accessibilityrc) {
    this.options.ignore = this.grunt.file.readJSON('.accessibilityrc').ignore;
  }

  _that = this;


}

Accessibility.taskName         = 'accessibility';
Accessibility.taskDescription  = 'Use HTML codesniffer to grade accessibility';
Accessibility.Defaults         = {
  phantomScript: asset('../phantomjs/bridge.js'),
  urls: [],
  domElement: true,
  verbose: true,
  outputFormat: false,
  force: false,
  ignore: [],
  accessibilityrc: false
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

  // Start the Logging
  if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE' || msgSplit[0] === 'WARNING') {

    switch (options.outputFormat) {

      case 'json':
        var jsonLog = _that.logJSON[options.file];

        jsonLog = jsonLog || [];
        jsonLog = jsonLog.concat(_that.outputJson(msgSplit));

        _that.logJSON[options.file] = jsonLog;

      break;

      case 'txt':
        if (!options.domElement) {
          msg = msgSplit.slice(0, 3).join('|');
        }

        _that.log += msg + '\r\n';

      break;
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

  // console.log(msgSplit);

  // If its not an error message, return out of it
  if (!errorMessage) {
    return;
  }

  // Start logger
  var heading;

  switch (msgSplit[0]) {
    case 'ERROR':
        heading = msgSplit[0].red.bold;
        _that.failTask = true;
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
  _that.grunt.log.oklns('Line '.cyan + msgSplit[6].cyan + ' col '.cyan  + msgSplit[7].cyan);
  _that.grunt.log.oklns(msgSplit[2].grey);
  _that.grunt.log.oklns('--------------------'.grey);
  _that.grunt.log.oklns(msgSplit[3].grey);

  return;

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


  // Write messages to console
  function logFinishedMesage() {

    grunt.log.subhead('Report Finished'.cyan);
    grunt.log.writeln('File "' + options.filedest +
      (options.outputFormat ? '.' + options.outputFormat : '') + '" created.');
  }

  // Write the files
  switch (options.outputFormat) {
    case 'json':
      grunt.file.write(options.filedest + '.json', JSON.stringify(_that.logJSON[options.file]));
      logFinishedMesage();
    break;

    case 'txt':
      grunt.file.write(options.filedest , _that.log);
      logFinishedMesage();
    break;
  }

  // Reset the values for next run
  _that.log = '';
  _that.logJSON = {};

  if (_that.failTask && !options.force) {
    _that.grunt.fail.warn('Task ' + _that.grunt.task.current.nameArgs +  ' failed');
  }

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
    .catch(function(err) {

      this.grunt.log.error(err);

    });

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
