module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          ui: 'tdd',
          timeout: 5000
        },
        src: ['test/*']
      }
    },
    nodemon: {
      debug: {
        options: {
          file: 'app.js',
          debug: true
        }
      }
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    watch: {
      src: {
        files: ['app.js', 'test/*', 'config/*', 'bin/*'],
        tasks: ['mochaTest']
      }
    }
  });

  grunt.registerTask('default', ['mochaTest']);
  grunt.registerTask('server', ['concurrent']);
}
