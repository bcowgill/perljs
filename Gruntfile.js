/*jshint indent: 4, smarttabs: true, maxstatements: 100, maxlen: 140 */
/*global module:false */
/**
	@file Gruntfile.js
	@author Brent S.A. Cowgill
	@see {@link module:Gruntfile}
	@description
	Grunt build configuration.

	@see {@link http://usejsdoc.org/ JSDoc Documentation}
*/

/**
	Grunt build configuration.
	@module Gruntfile
*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		// Task configuration.
		/**
			clean up files on disk before build.
			@see {@link https://github.com/gruntjs/grunt-contrib-clean About clean grunt plugin}
		*/
		clean: {
			jsdoc: {
				src: ['doc/']
			}
		},
		/**
			jshint validation of javascript code.
			@see {@link https://github.com/gruntjs/grunt-contrib-jshint About jshint grunt plugin}
			@see {@link http://jshint.com/docs/options/ jshint options}
			@see {@link https://github.com/jshint/jshint/blob/master/src/messages.js Warning codes for jshint}
		*/
		jshint: {
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
				// grunt jshint:single --check-file filename
				src: [grunt.option('check-file') || 'package.json']
			},
			lib: {
				src: ['lib/**/*.js', 'lib/jsdoc-templates/*.jsdoc']
			},
			test: {
				src: ['test/**/*.js']
			}
		},
		nodeunit: {
			files: ['test/**/*-test.js'],
		},
		/**
			Running tests in the console using mocha/chai.
			@see {@link https://github.com/thepeg/grunt-mocha-chai-sinon Grunt plugin for mocha, chai, and sinon}
			@see {@link http://visionmedia.github.io/mocha/ mocha documentation}
			@see {@link http://chaijs.com/api/ chai documentation}
		*/
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
		/**
			Generate application documentation with jsdoc
			@see {@link https://github.com/krampstudio/grunt-jsdoc Grunt jsdoc plugin}
			@see {@link http://usejsdoc.org/ jsdoc documentation tags}
			@see {@link http://usejsdoc.org/about-commandline.html jsdoc command line options}
		*/
		jsdoc : {
			docs : {
				dest: 'doc',
				src: [
					'test/**/*.js',
					'lib/**/*.js',
					'Gruntfile.js',
					'README.md'
				],
				options: {
					configure: 'jsdoc.conf.json'
				}
			}
		},
		/**
			Watch files and run build targets on change
			@see {@link https://github.com/gruntjs/grunt-contrib-watch Grunt watch plugin}
		*/
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
