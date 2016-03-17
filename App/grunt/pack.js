
module.exports = function(grunt) {
  var manifest = grunt.config.get('manifest')


  grunt.config('browserify', {
    options : {

      browserifyOptions : {
        browserField  : false,
        builtins      : false,
        commondir     : false,
        detectGlobals : false,
      },
    },

    pack : {
      files: {
        'public/js/_webcam.js': ['public/js/webcam.js'],
      }
    }
  });

  grunt.registerTask('pack', ['browserify']);
  grunt.loadNpmTasks('grunt-browserify');

};

