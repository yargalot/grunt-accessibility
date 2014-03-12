module.exports = (grunt) ->
  grunt.initConfig
    jshint:
      all: [
        'Gruntfile.js'
        'tasks/*.js'
        '<%= nodeunit.tests %>'
      ]
      options:
        jshintrc: '.jshintrc'

    # Before generating any new files, remove any previously-created files.
    clean:
      tests: ['reports']

    # Combine js into a dist directory
    uglify:
      dist:
        files:
          'tasks/HTML_CodeSniffer/dist/HTMLCS.min.js': [
            'tasks/HTML_CodeSniffer/Standards/**/*.js'
            'tasks/HTML_CodeSniffer/HTMLCS.js'
            'tasks/HTML_CodeSniffer/PhantomJS/runner.js'
          ]

    # Configuration to be run (and then tested).
    accessibility:
      options :
        # Levels are 'WCAG2A', 'WCAG2AA', 'WCAG2AAA', 'Section508'
        accessibilityLevel: 'WCAG2A'
        # ignore : [
        #   'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl'
        #   'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
        # ]

      test :
        files: [{
          expand  : true
          cwd     : 'example/'
          src     : ['*.html']
          dest    : 'reports/'
          ext     : '-report.txt'
        }]

    # Unit tests.
    nodeunit:
      tests: ['test/*_test.js']


  # Actually load this plugin's task(s).
  grunt.loadTasks 'tasks'

  # These plugins provide necessary tasks.
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-nodeunit'

  # Whenever the "test" task is run, first clean the "tmp" dir, then run this
  # plugin's task(s), then test the result.
  grunt.registerTask 'build', ['uglify']
  grunt.registerTask 'test',  ['jshint', 'accessibility:test', 'nodeunit', 'clean']
  grunt.registerTask 'node',  ['nodeunit']

  # By default, lint and run all tests.
  grunt.registerTask 'default', ['accessibility:test']
