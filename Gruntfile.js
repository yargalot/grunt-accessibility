module.exports = function(grunt) {

  // Time Grunt
  require('time-grunt')(grunt);

  // Load Development scripts
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  // Load Grunt Accessibility
  grunt.loadTasks('tasks');


  grunt.initConfig({

    // Js Hint
    // ------------------------
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['reports']
    },

    // Watch Process
    // ------------------------
    watch: {
      scripts: {
        files: ['tasks/**/*.js', '!tasks/lib/HTML_Codesniffer/**/*.js', '<%= nodeunit.tests %>'],
        tasks: ['jshint', 'accessibility:noOutput'],
        options: {
          spawn: false
        }
      },
      grunt: {
        files: ['Gruntfile.js']
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
      }
    },


    // Task testing
    // ------------------------
    accessibility: {
      options: {
        accessibilityLevel: 'WCAG2A'
      },
      txt: {
        options: {
          reportType: 'txt',
          reportLocation: 'reports/txt',
        },
        files: [{
          expand: true,
          cwd: 'example/',
          src: ['**/*.html']
        }]
      },
      json: {
        options: {
          reportType: 'json',
          reportLocation: 'reports/json'
        },
        files: [{
          expand: true,
          cwd: 'example/',
          src: ['**/*.html']
        }]
      },
      csv: {
        options: {
          reportType: 'csv',
          reportLocation: 'reports/csv'
        },
        files: [{
          expand: true,
          cwd: 'example/',
          src: ['**/*.html']
        }]
      },
      noOutput: {
        src: ['example/**/*.html']
      },
      error: {
        options: {
          force: true,
          reportType: 'json',
          reportLocation: 'reports/json-error'
        },
        src: ['errors/**/*.html']
      },
      errorContinue: {
        options: {
          reportType: 'json',
          reportLocation: 'reports/json-error'
        },
        src: ['errors/**/*.html']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });


  /* Whenever the "test" task is run, first clean the "tmp" dir, then run this
   * plugin's task(s), then test the result.
   */
  grunt.registerTask('node',  ['nodeunit', 'clean']);
  grunt.registerTask('self',  ['accessibility:txt', 'accessibility:json',
    'accessibility:csv', 'accessibility:noOutput', 'accessibility:error',
    // Let the task fail without failing this whole build.
    'continue:on', 'accessibility:errorContinue', 'continue:off',
    // Check that there was a failure caused by grunt.fail.warn.
    'continue:check-any-warnings']);
  grunt.registerTask('test',  ['clean', 'jshint', 'self', 'nodeunit']);

  grunt.registerTask('dev',   ['watch']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
