module.exports = (grunt) ->
  grunt.initConfig
    #clean:
    #  cached: ['cached/*.css', 'cached/*.js']
    #  post: ['cached/app.js', 'cached/plotting.js', 'cached/style.css']
    coffee:
      compile:
        files:
          'js/plotting.js': 'coffee/*.coffee'
          'js/testing.js': 'tests/*.coffee'
    uglify:
      options: null
      app:
        files:
          'js/plotting.min.js': ['js/plotting.js']
    watch:
      coffee:
        files: ['coffee/**']
        tasks: ['coffee']
      testers:
        files: ['tests/**']
        tasks: ['coffee']
      js:
        files: ['js/**']
        tasks: ['uglify']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['watch']
