/*jshint indent: 4, smarttabs: true, maxstatements: 100, maxlen: 140 */
/*global module:false */
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: {
      jsdoc: {
        src: ['doc/']
      }
    },
		jshint: {
			// warning codes for jshint are in:
			// node_modules/grunt-contrib-jshint/node_modules/jshint/src/messages.js
			options: {
				jshintrc: '.jshintrc-node',
				globals: {},
			},
			gruntfile: {
				options: {
					jshintrc: '.jshintrc-gruntfile',
					globals: {},
				},
				src: ['package.json', 'Gruntfile.js']
			},
			single: {
				src: ['package.json'] // set to just check a single file
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			}
		},
		nodeunit: {
			files: ['test/**/*-test.js'],
		},
		// run mocha/chai tests in console https://github.com/thepeg/grunt-mocha-chai-sinon
		'mocha-chai-sinon': {
			test: {
				src: ['./test/**/*-test.js'],
				options: {
					ui: 'bdd',
					// spec, list, tap, nyan, progress, dot, min, landing, doc, markdown, html-cov, json-cov, json, json-stream, xunit
					reporter: 'tap',
					bail: false, // true to bail after first test failure
					//grep: '.*', // invert: true, // filter to run subset of tests
					sort: true, // sort order of test files
					trace: true, // trace function calls
					'check-leaks': true, // check for global variable leaks
					'expose-gc': true,
					//timeout: 10, slow: 10, // async ms timeout and slow test threshold
					'inline-diffs': false// show actual/expected diffs inline
				}
			}
		},
		// about jsdoc documentation tags: http://usejsdoc.org/
		jsdoc : {
			docs : {
				dest: 'doc',
				src: [
					'test/**/*.js',
					'lib/**/*.js',
					'README.md'
				],
				// jsdoc options: http://usejsdoc.org/about-commandline.html
				options: {
					configure: 'jsdoc.conf.json'
				}
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	[
		//'grunt-contrib-nodeunit');
		'grunt-contrib-clean',
		'grunt-contrib-jshint',
		'grunt-jsdoc',
		'grunt-mocha-chai-sinon',
		'grunt-contrib-watch'
	].forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	// Default task.
	grunt.registerTask('default', ['all']);
	grunt.registerTask('all', ['windows', 'docs', 'test']);
	grunt.registerTask('docs', ['clean:jsdoc', 'jsdoc']);
	grunt.registerTask('test', [
		//'nodeunit'
		'mocha-chai-sinon'
	]);
	grunt.registerTask('windows', [
		'jshint:gruntfile',
		'jshint:lib',
		'jshint:test'
	]);
	grunt.registerTask('single', ['jshint:single']);
};
