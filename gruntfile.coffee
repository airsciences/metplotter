module.exports = (grunt) ->
  grunt.initConfig
    #clean:
    #  cached: ['cached/*.css', 'cached/*.js']
    #  post: ['cached/app.js', 'cached/plotting.js', 'cached/style.css']
    coffee:
      compile:
        files:
          'js/plotting.js': 'coffee/*.coffee'
    uglify:
      options: null
      app:
        files:
          'cached/app.js': ['js/jquery.min.js', '!js/app*.js',
            '!js/plotting*.js']
          'cached/plotting.js': ['js/d3.min.js', '!js/app*.js',
            'js/plotting.js']
    watch:
      coffee:
        files: ['coffee/**']
        tasks: ['coffee']
      js:
        files: ['js/**']
        tasks: ['uglify']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
 
  grunt.registerTask 'default', ['watch:coffee', 'watch:js']
