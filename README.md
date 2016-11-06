# Grunt Accessibility

[![NPM version](https://img.shields.io/npm/v/grunt-accessibility.svg)](https://www.npmjs.com/package/grunt-accessibility)
[![Build Status](https://travis-ci.org/yargalot/grunt-accessibility.svg?branch=master)](https://travis-ci.org/yargalot/grunt-accessibility)
[![Build status](https://ci.appveyor.com/api/projects/status/d22xg9fog68bift2?svg=true)](https://ci.appveyor.com/project/yargalot/grunt-accessibility)
[![Dependency Status](https://img.shields.io/david/yargalot/grunt-accessibility.svg)](https://david-dm.org/yargalot/grunt-accessibility)
[![devDependency Status](https://img.shields.io/david/dev/yargalot/grunt-accessibility.svg)](https://david-dm.org/yargalot/grunt-accessibility#info=devDependencies)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](http://gruntjs.com/)

Uses [AccessSniff](https://github.com/yargalot/AccessSniff) and [HTML Codesniffer](http://github.com/squizlabs/HTML_CodeSniffer) to grade your site's accessibility using different levels of the WCAG guidelines

![Grunt Accessibility example](https://raw.githubusercontent.com/yargalot/AccessSniff/master/img/example.png)


## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-accessibility`

Then add this line to your project's `grunt.js` gruntfile:

```js
grunt.loadNpmTasks('grunt-accessibility');
```

[grunt]: http://gruntjs.com/
[getting_started]: http://gruntjs.com/getting-started


## Documentation

Place this in your grunt file.

```js
accessibility: {
  options: {
    accessibilityLevel: 'WCAG2A'
  },
  test: {
    options: {
      urls: ['http://localhost']
    },
    src: ['example/test.html']
  }
}
```

## Report Generation

You can link to the files you wish to lint using the grunt api. The result will be the results file.

## Options

View [AccessSniff](https://github.com/yargalot/AccessSniff) options for all available options.


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].


## Release History

### 4.0.0
- New version of AccessSniff
- Lots of cleanup

### 3.0.0
- Move to using AccessSniff

### 2.2.0
- Fix `SRC` globbing pattern
- Fix partial support
- Columns and line numbers now exist in the library

### [2.0.0](https://github.com/yargalot/grunt-accessibility/issues?q=milestone%3A2.0+is%3Aclosed)
- Add output format to generate reports
- Add accessibiltyrc option
- Add line and column number to issues
- Lots of other tweaks and fixes

### [1.1.0](https://github.com/yargalot/grunt-accessibility/issues?milestone=3&page=1&state=closed)
- Add JSON report option
- Add Dom Element option
- Add Force option
- Add Verbose option

### [1.0.0](https://github.com/yargalot/grunt-accessibility/issues?milestone=2&state=closed)

- Exit phantom process when processing is done
- Update Dependencies
- Update to grunt 0.4.4

### Previous Releases

- 0.4 Added in ignore rule, refactored some scripts for better injection via phantom
- 0.3 Fix so you can run another grunt process after running
- 0.2 Fix so people can actually run this thing now
- 0.1.1 Update Documentation for install
- 0.1 Initial release


## License
Copyright (c) 2014 Steven Miller
Licensed under the MIT license.
