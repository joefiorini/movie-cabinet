/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt) {

  grunt.initConfig({
    // uglify: {
    //   'dist/built.min.js': 'dist/built.js'
    // },

    /*
       A simple ordered concatenation strategy.
       This will start at app/app.js and begin
       adding dependencies in the correct order
       writing their string contents into
       'build/application.js'

       Additionally it will wrap them in evals
       with @ sourceURL statements so errors, log
       statements and debugging will reference
       the source files by line number.

       You would set this option to false for
       production.
    */
    neuter: {
      options: {
        includeSourceURL: true
      },
      'build/application.js': 'app/app.js'
    },

    /*
      Watch files for changes.

      Changes in vendor/ember.js or application javascript
      will trigger the neuter task.

      Changes to any templates will trigger the ember_templates
      task (which writes a new compiled file into dependencies/)
      and then neuter all the files again.
    */
    watch: {
      application_code: {
        files: ['vendor/ember.js', 'app/**/*.js'],
        tasks: ['neuter']
      },
      handlebars_templates: {
        files: ['app/**/*.handlebars'],
        tasks: ['ember_templates', 'neuter']
      }
    },

    /*
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    */
    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js', '!vendor/*.*', '!test/support/*.*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /*
      Compiles sass files to css
    */
    sass: {
      options: {
        compass: true,
        require: ["compass", "zurb-foundation"],
        trace: true
      },
      files: {
        'build/main.css': 'scss/main.scss'
      }
    },

    /*
      Finds Handlebars templates and precompiles them into functions.
      The provides two benefits:

      1. Templates render much faster
      2. We only need to include the handlebars-runtime microlib
         and not the entire Handlebars parser.

      Files will be written out to dependencies/compiled/templates.js
      which is required within the project files so will end up
      as part of our application.

      The compiled result will be stored in
      Ember.TEMPLATES keyed on their file path (with the 'app/templates' stripped)
    */
    ember_templates: {
      options: {
        templateName: function(sourceFile) {
          return sourceFile.replace(/app\/templates\//, '');
        }
      },
      'build/templates.js': ["app/templates/*.handlebars"]
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'build'
        }
      }
    },

    /*
      Find all the <whatever>_test.js files in the test folder.
      These will get loaded via script tags when the task is run.
      This gets run as part of the larger 'test' task registered
      below.
    */
    build_test_runner_file: {
      all: ['test/**/*_test.js']
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /*
    Default task. Compiles templates, neuters application code, and begins
    watching for changes.
  */
  grunt.registerTask('default', ['ember_templates', 'neuter', 'jshint', 'sass', 'connect', 'watch']);
};
