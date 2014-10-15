'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    watch: {
      options: {
        spawn: false
      },
      less: {
        files: ['app/styles/less/**/*.less'],
        tasks: ['less_compile']
      }
    },

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'test')
              mountFolder(connect, '.tmp'),
            ];
          }
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        'test/spec/{,*/}*.js'
      ]
    },

    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },

    less: {
      compile: {
        files: [{
          expand: true,
          cwd: 'app/styles/less/',
          src: ['main.less'],
          dest: 'app/styles/css-less/',
          ext: '.css'
        }],
        options: {
          paths: ['app/styles/less/'],
          dumpLineNumbers: 'comments'
        }
      }
    },

    autoprefixer: {
      less: {
        files: [{
          expand: true,
          cwd: 'app/styles/css-less/',
          src: ['**/*.css'],
          dest: 'app/styles/css-less/'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp,gif}',
            '_locales/{,*/}*.json'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },

    chromeManifest: {
      dist: {
        options: {
          buildnumber: true,
          background: {
            target:'scripts/background.js'
          }
        },
        src: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>'
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'package/sohint.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: ''
        }]
      }
    }
  });

  grunt.registerTask('less_compile', [
    'less:compile',
    'autoprefixer:less'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'chromeManifest:dist',
    'cssmin',
    'concat',
    'uglify',
    'copy',
    'imagemin',
    'compress'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
