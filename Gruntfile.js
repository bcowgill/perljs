/*jshint indent: 4, smarttabs: true, maxstatements: 100 */
/*global module:false */
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
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
				options: {}
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
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');

	// Default task.
	grunt.registerTask('default', ['all']);
	grunt.registerTask('all', [
		'jshint:gruntfile',
		'jshint:lib',
		'jshint:test',
		//'nodeunit',
		'jsdoc'
	]);
	grunt.registerTask('single', ['jshint:single']);
};
