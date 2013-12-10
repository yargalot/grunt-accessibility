
"use strict";

var fs = require("fs");

// The temporary file used for communications.
var tmpfile = phantom.args[0];
// The page .html file to load.
var url = phantom.args[1];
// Extra, optionally overridable stuff.
var options = JSON.parse(phantom.args[2] || {});

// Messages are sent to the parent by appending them to the tempfile.
// NOTE, the tempfile appears to be shared between asynchronously running grunt tasks
var sendMessage = function (arg) {
    var args = Array.isArray(arg) ? arg : [].slice.call(arguments);
    var channel = args[0];
    args[0] = channel;
    fs.write(tmpfile, JSON.stringify(args) + "\n", "a");
};

// This allows grunt to abort if the PhantomJS version isn"t adequate.
sendMessage("private", "version", phantom.version);

// Create a new page.
var page = require("webpage").create();

// Relay console logging messages.
page.onConsoleMessage = function (message) {
    sendMessage("console", message);
};

page.onError = function (msg, trace) {
    sendMessage("error", msg, trace);
};

page.onInitialized = function() {
    //sendMessage("console", 'Page Loading...');
}

page.onLoadFinished = function(status) {
  sendMessage("console", 'Page Loaded. Starting Tests');
  // Do other things here...

};

page.open(url, function (status) {

    if (status == 'success') {
        sendMessage("console", 'HERP DERP');
    }

    // Include all sniff files.
    var fs = require('fs');
    var injectAllStandards = function(dir) {
        var files = fs.list(dir),
            filesLen = files.length,
            absPath = '';

            //sendMessage("console", files)
        for (var i = 0; i < filesLen; i++) {
            if (files[i] === '.' || files[i] === '..') continue;

            absPath = fs.absolute(dir + '/' + files[i]);
            if (fs.isDirectory(absPath) === true) {
                injectAllStandards(absPath);
                //sendMessage("console", absPath)
            } else if (fs.isFile(absPath) === true) {
                page.injectJs(absPath);
                //sendMessage("console", absPath)
            }
        }
    };

    injectAllStandards('tasks/HTML_CodeSniffer/Standards');
    page.injectJs('../tasks/HTML_CodeSniffer/HTMLCS.js');
    page.injectJs('../tasks/HTML_CodeSniffer/PhantomJS/runner.js');

    // Now Run. Note that page.evaluate() function is sanboxed to
    // the loaded page's context. We can't pass any variable to it.
    switch (options.accessibilityLevel) {
        case 'WCAG2A':
            page.evaluate(function() {HTMLCS_RUNNER.run('WCAG2A');});
            phantom.exit();
        break;
        case 'WCAG2AA':
            page.evaluate(function() {HTMLCS_RUNNER.run('WCAG2AA');});
            phantom.exit();
        break;
        case 'WCAG2AAA':
            page.evaluate(function() {HTMLCS_RUNNER.run('WCAG2AAA');});
            phantom.exit();
        break;
        default:
            sendMessage("console", 'Unknown standard.');
            phantom.exit();
        break;
    }

});

