# Grunt Accessibility

Grade your sites accessibility using different levels of the WCAG guidelines

[![NPM version](https://badge.fury.io/js/grunt-accessibility.png)](http://badge.fury.io/js/grunt-accessibility) [![Build Status](https://travis-ci.org/yargalot/grunt-accessibility.svg?branch=master)](https://travis-ci.org/yargalot/grunt-accessibility) [![Dependency Status](https://gemnasium.com/yargalot/grunt-accessibility.png)](https://gemnasium.com/yargalot/grunt-accessibility) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-accessibility`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-accessibility');
```

[grunt]: http://gruntjs.com/
[getting_started]: http://gruntjs.com/getting-started

## Documentation
Place this in your grunt file.

```javascript
accessibility: {
  options : {
    accessibilityLevel: 'WCAG2A'
  },
  test : {
    files: [{
      expand  : true,
      cwd     : 'example/',
      src     : ['*.html'],
      dest    : 'reports/',
      ext     : '-report.txt'
    }]
  }
}
```

## Report Generation
You can link to the files you wish to lint using the grunt api. The result will be the results file.

## Options
You can pass some options

### Accessibility Level
```accessibilityLevel``` is a string

```javascript
  options: {
    accessibilityLevel: 'WCAG2A'
  }
```

Levels are ```WCAG2A```, ```WCAG2AA```, and ```WCAG2AAA```


### Ignore

```ignore``` is a array

You can ignore rules by placing them in an array outlined below

```javascript
  ignore : [
    'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl'
    'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
  ]
```

### Output Format

```outputFormat``` is a string

```javascript
  options: {
    outputFormat: 'json'
  }
```


Text and JSON format output, default is current text format

- 'txt' will output text files
- 'json' will output .json files


### Verbose output

```verbose``` is a boolean

```javascript
  options: {
    verbose: false
  }
```

Output messages to console, set to true by default


### DomElement

``` domElement ``` is a boolean

```javascript
  options: {
    domElement: false
  }
```

Include reference (tag name, class names & id) to reported  elements. Optional for both output formats.

### Force

```force``` is a boolean

```javascript
  options: {
    force: true
  }
```

Continue running grunt in the event of failures


## Built from
This is built of [HTML Codesniffer](http://github.com/squizlabs/HTML_CodeSniffer)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

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
