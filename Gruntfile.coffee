'use strict'

module.exports = (grunt) ->

  require 'coffee-errors'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-simple-mocha'
  grunt.loadNpmTasks 'grunt-notify'

  grunt.registerTask 'test', [
   'coffeelint'
   'coffee'
   'simplemocha'
  ]
  grunt.registerTask 'default', [
    'coffeelint:task_app'
    'coffeelint:task_data'
    'coffee:task_app'
    'coffee:task_data'
    'watch:development'
  ]

  grunt.initConfig

    coffeelint:
      task_app:
        options:
          max_line_length:
            value: 79
          indentation:
            value: 2
          newlines_after_classes:
            level: 'error'
          no_empty_param_list:
            level: 'error'
          no_unnecessary_fat_arrows:
            level: 'ignore'
        dist:
          files: [
            { expand: yes, cwd: '/', src: [ '*.coffee' ] }
          ]
      task_data:
        options:
          max_line_length:
            value: 79
          indentation:
            value: 2
          newlines_after_classes:
            level: 'error'
          no_empty_param_list:
            level: 'error'
          no_unnecessary_fat_arrows:
            level: 'ignore'
        dist:
          files: [
            { expand: yes, cwd: 'data/src/', src: [ '*.coffee' ] }
          ]

    coffee:
      task_app:
        files:
          'app.js': ['app.coffee']
      task_data:
        files: [{
          expand: yes
          cwd: 'data/src/'
          src: [ '**/*.coffee' ]
          dest: 'data/lib/'
          ext: '.js'
        }]

    simplemocha:
      options:
        ui: 'bdd'
        reporter: 'spec'
        compilers: 'coffee:coffee-script'
        ignoreLeaks: no
      dist:
        src: [ 'tests/test.coffee' ]

    watch:
      development:
        files: ["data/**/*.coffee", "/*.coffee"]
        options:
          interrupt: yes
        tasks: [
          'coffeelint:task_app'
          'coffeelint:task_data'
          'coffee:task_app'
          'coffee:task_data'
        ]