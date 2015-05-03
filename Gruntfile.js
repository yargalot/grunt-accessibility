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
        'tasks/*.js',
        'tasks/lib/*.js',
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

    // Grunt debug
    // ------------------------
    debug: {
      options: {
        open: true // do not open node-inspector in Chrome automatically
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
        accessibilityLevel: 'WCAG2A',
        verbose: true,
        force: true
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
        options: {
          accessibilityrc: true
        },
        src: ['example/**/*.html']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  /* Whenever the "test" task is run, first clean the "tmp" dir, then run this
   * plugin's task(s), then test the result.
   */
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('node',  ['nodeunit', 'clean']);
  grunt.registerTask('test',  ['clean', 'jshint', 'accessibility', 'nodeunit']);

  grunt.registerTask('dev',   ['uglify:dev', 'watch']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test', 'build']);
};
