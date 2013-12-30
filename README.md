# grunt-accessibility [![Build Status](https://travis-ci.org/yargalot/grunt-accessibility.png?branch=master)](https://travis-ci.org/yargalot/grunt-accessibility)

Use HTML codesniffer to grade accessibility

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-email-builder`

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

You can link to the files you wish to lint using the grunt api. The result will be the results file.

This is built of [HTML Codesniffer](http://github.com/squizlabs/HTML_CodeSniffer)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
- 0.1 Initial release

## License
Copyright (c) 2013 Steven Miller
Licensed under the MIT license.