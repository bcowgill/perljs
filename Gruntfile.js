/*jshint indent: 4, smarttabs: true, maxstatements: 100, maxlen: 140 */
/* eslint-disable unicorn/filename-case */
/*global module:false */
/**
	@file Gruntfile.js
	@author Brent S.A. Cowgill
	@see {@link module:Gruntfile}
	@description
	Grunt build configuration.

 	@example

 	# build all, then watch for changes use the airplane test reporter
 	grunt all watch --reporter landing --force

 	# jshint check a single file
 	grunt jshint:single --check-file filename.js

 	# run tests with a chosen reporter style
 	grunt test --reporter spec

	@see {@link http://usejsdoc.org/ JSDoc Documentation}
*/

'use strict'

/**
	Grunt build configuration.
	@module Gruntfile
*/
module.exports = function (grunt) {
	var PORT_SERVER = 58008,
		PORT_LIVERELOAD = 35729

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
				src: ['doc/'],
			},
		},
		/**
			prettier format the code and configuration files in a standard style.
			grunt-prettier runs more slowly than from the command line.
			@see {@link https://www.npmjs.com/package/grunt-prettier About prettier grunt plugin}
			@see {@link https://prettier.io/docs/en/options.html Configuring Prettier}
		*/
		prettier: {
			options: {
				progress: true,
				trailingComma: 'es5',
				tabWidth: 4,
				useTabs: true,
				semi: false,
				singleQuote: true,
			},
			files: {
				src: [
					'lib/**/*.js',
					'test/**/*.js',
					'test/**/*.html',
					'*.json',
					'.*.json',
					'Gruntfile.js',
				],
			},
		},
		/**
			htmllint validation of html documents.
			@see {@link https://github.com/htmllint/grunt-htmllint About htmllint grunt plugin}
			@see {@link https://github.com/htmllint/htmllint/wiki/Options htmllint options}
			@see {@link https://github.com/htmllint/htmllint/wiki/Option-by-Error-Code htmllint error codes}
		*/
		htmllint: {
			options: {
				htmllintrc: '.htmllintrc.json',
			},
			src: ['test/**/*.html'],
		},
		/**
			sttylelint validation of css stylesheets.
			@see {@link https://www.npmjs.com/package/grunt-stylelint About stylelint grunt plugin}
			@see {@link https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules/list.md stylelint rules}
		*/
		stylelint: {
			options: {
				configFile: '.stylelintrc.json',
				formatter: 'verbose',
				ignoreDisables: false,
				failOnError: true,
				outputFile: '',
				reportNeedlessDisables: true,
				reporInvalidScopeDisables: true,
				reporDescriptionlessDisables: true,
				// fix: false, omitting allows grunt stylelint --fix
				syntax: '',
			},
			src: ['scripts/**/*.css'],
		},
		/**
			eslint validation of javascript code.
			@see {@link https://www.npmjs.com/package/grunt-eslint About eslint grunt plugin}
			@see {@link https://eslint.org/docs/developer-guide/nodejs-api#cliengine eslint options}
		*/
		eslint: {
			options: {
				configFile: '.eslintrc.json',
				//outputFile: 'eslint.log', // diverts output to a log file
				maxWarnings: 0, // Fail on number of warnings as well as errors
				reportUnusedDisableDirectives: true,
			},
			target: ['lib/**/*.js', 'test/**/*.js', 'Gruntfile.js'],
		},
		/**
			jshint validation of javascript code.
			@see {@link https://github.com/gruntjs/grunt-contrib-jshint About jshint grunt plugin}
			@see {@link http://jshint.com/docs/options/ jshint options}
			@see {@link https://github.com/jshint/jshint/blob/master/src/messages.js Warning codes for jshint}
		*/
		jshint: {
			options: {
				jshintrc: '.jshintrc-node.json',
				globals: {},
			},
			gruntfile: {
				options: {
					jshintrc: '.jshintrc-gruntfile.json',
					globals: {},
				},
				src: ['*.json', 'Gruntfile.js'],
			},
			single: {
				// grunt jshint:single --check-file filename
				src: [grunt.option('check-file') || 'lib/perl.js'],
			},
			lib: {
				src: ['lib/**/*.js'],
			},
			test: {
				options: {
					jshintrc: '.jshintrc-mocha-chai-sinon.json',
					globals: {},
				},
				spec: ['test/**/*-test.js'], // for coverage
				src: ['test/**/*.js'],
			},
			experiment: {
				options: {
					jshintrc: '.jshintrc-best-parts.json',
					globals: {},
				},
				src: ['*.json', 'Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
			},
		},
		/**
			Running tests in the console using mocha/chai/sinon.
			@see {@link https://github.com/thepeg/grunt-mocha-chai-sinon Grunt plugin for mocha, chai, and sinon}
			@see {@link http://visionmedia.github.io/mocha/ mocha documentation}
			@see {@link http://chaijs.com/api/ chai documentation}
		 	@see {@link http://sinonjs.org/docs/ sinon documentation}
		*/
		'mocha-chai-sinon': {
			test: {
				src: '<%= mocha_istanbul.coverage.src %>',
				options: {
					ui: '<%= mocha_istanbul.coverage.options.ui %>',
					// spec, list, tap, nyan, progress, dot, min, landing, doc, markdown, html-cov, json-cov, json, json-stream, xunit
					reporter: '<%= mocha_istanbul.coverage.options.reporter %>',
					bail: false, // true to bail after first test failure
					//grep: '.*', // invert: true, // filter to run subset of tests
					sort: true, // sort order of test files
					trace: true, // trace function calls
					'check-leaks': true, // check for global variable leaks
					'expose-gc': true,
					//timeout: 10, slow: 10, // async ms timeout and slow test threshold
					'inline-diffs': false, // show actual/expected diffs inline
				},
			},
		},
		/**
			Generate code coverage reports using istanbul.
			@see {@link https://www.npmjs.com/package/grunt-mocha-istanbul Grunt plugin for mocha istanbul coverage}
			@see {@link http://gotwarlost.github.io/istanbul/ istanbul documentation}
		 	@see {@link https://github.com/nickmerwin/node-coveralls coveralls documentation}
			@see {@link http://tbusser.net/articles/js-unit-testing-part-02/#disqus_thread coverage under the hood}
		 */
		mocha_istanbul: {
			// use your browser to view this url for coverage report
			coverageUrl:
				'<%= mocha_istanbul.coverage.options.coverageFolder %>/index.html',
			coverage: {
				src: ['<%= jshint.test.src %>', '<%= jshint.test.spec %>'],
				options: {
					dryRun: false, // to debug the istanbul command line
					coverageFolder: 'doc/coverage',
					excludes: [], // use istanbul help cover to see how excludes work
					reportFormats: [
						// html, lcovonly, lcov, cobertura, text-summary, text, teamcity
						'html',
						'text',
					],

					// Mocha options
					reporter: grunt.option('reporter') || 'spec',
					ui: 'bdd',

					// check percentage coverage to be a good build
					check: {
						functions: 99,
						branches: 95,
						lines: 98,
						statements: 98,
					},
				},
			},
			coveralls: {
				src: '<%= mocha_istanbul.coverage.src %>',
				options: {
					coverage: true, // this will make the grunt.event.on('coverage') event listener to be triggered
					check: {
						functions: 99,
						branches: 95,
						lines: 98,
						statements: 98,
					},
					root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
					reportFormats: ['cobertura', 'lcovonly'],
				},
			},
		},

		/**
			Generate application documentation with jsdoc
			@see {@link https://github.com/krampstudio/grunt-jsdoc Grunt jsdoc plugin}
			@see {@link http://usejsdoc.org/ jsdoc documentation tags}
			@see {@link http://usejsdoc.org/about-commandline.html jsdoc command line options}
		*/
		jsdoc: {
			docs: {
				dest: 'doc',
				src: [
					'test/**/*.js',
					'lib/**/*.js',
					'Gruntfile.js',
					'README.md',
				],
				options: {
					configure: 'jsdoc.conf.json',
				},
			},
		},
		/**
			Watch files and run build targets on change
			@see {@link https://github.com/gruntjs/grunt-contrib-watch Grunt watch plugin}
		*/
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile', 'watchlint', 'coverage'],
				options: {
					livereload: PORT_LIVERELOAD,
				},
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'watchlint', 'coverage'],
				options: {
					livereload: PORT_LIVERELOAD,
				},
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'watchlint', 'coverage'],
				options: {
					livereload: PORT_LIVERELOAD,
				},
			},
			livereload: {
				files: 'test/index.html',
				tasks: [],
				options: {
					livereload: PORT_LIVERELOAD,
				},
			},
		},
		/**
			Start a webserver to view documentation or browser based tests.
			@see {@link https://github.com/gruntjs/grunt-contrib-connect Grunt connect plugin}
		*/
		connect: {
			test: {
				// connect:test
				options: {
					port: PORT_SERVER,
					livereload: PORT_LIVERELOAD,
					hostname: '*',
					base: '.',
					keepalive: false,
					open: {
						target:
							'http://localhost:<%= connect.test.options.port %>/test/',
					},
				},
			},
		},
		/**
			Create the distribution index.js removing debugging code
			/ *dbg:* / -> //dbg:
			@see {@link https://github.com/gruntjs/grunt-contrib-concat Grunt concat plugin}
		 */
		concat: {
			options: {
				banner:
					'/*  <%= pkg.name %> v<%= pkg.version %> ' +
					'<%= pkg.homepage %>\n    <%= pkg.author %>\n' +
					'    <%= pkg.license.type %> <%= pkg.license.url %>\n*/\n',
				process: function (source) {
					source = source.replace(
						/\/\*\s*dbg:\s*\*\/(\s*)/g,
						'//dbg: '
					)
					return source
				},
			},
			dist: {
				src: ['lib/perl.js'],
				dest: 'index.js',
			},
		},
		/**
			Minify the size of the built library for browser use.
			@see {@link https://github.com/gruntjs/grunt-contrib-uglify Grunt uglify plugin}
		 */
		uglify: {
			dist: {
				options: {
					sourceMap: true,
					compress: {
						drop_console: true,
						drop_debugger: true,
					},
					beautify: {
						preamble: '<%= concat.options.banner %>',
					},
				},
				files: {
					'perljs.min.js': ['index.js'],
				},
			},
		},
	})

	// These plugins provide necessary tasks.
	for (var task of [
		'grunt-eslint',
		'grunt-htmllint',
		'grunt-stylelint',
		'grunt-prettier',
		'grunt-contrib-clean',
		'grunt-contrib-jshint',
		'grunt-jsdoc',
		'grunt-mocha-chai-sinon',
		'grunt-mocha-istanbul',
		'grunt-contrib-watch',
		'grunt-contrib-connect',
		'grunt-contrib-concat',
		'grunt-contrib-uglify',
	]) {
		grunt.loadNpmTasks(task)
	}

	// Important not to remove this if coveralls.options.coverage:true or grunt will hang
	grunt.event.on('coverage', function (lcovFileContents, done) {
		void lcovFileContents
		done()
	})

	// Default task.
	grunt.registerTask('all', ['windows', 'docs', 'build', 'coverage'])
	grunt.registerTask('default', ['windows', 'coverage'])
	grunt.registerTask('docs', ['clean:jsdoc', 'jsdoc'])
	grunt.registerTask('build', ['concat:dist', 'uglify:dist'])
	grunt.registerTask('test', [
		// hyphens in name make the config section annoying
		// as template lookup with <%= mocha-chai-sinon %> won't work
		'mocha-chai-sinon',
	])
	grunt.registerTask('serve:test', ['connect:test', 'watch'])
	grunt.registerTask('coverage', ['mocha_istanbul:coverage'])
	grunt.registerTask('coveralls', ['mocha_istanbul:coveralls'])
	grunt.registerTask('watchlint', [
		'prettier',
		'htmllint',
		'stylelint',
		'eslint',
	])
	grunt.registerTask('lint', ['watchlint', 'jshint:all'])
	grunt.registerTask('jshint:all', [
		'jshint:gruntfile',
		'jshint:lib',
		'jshint:test',
	])
	// grunt.registerTask('windows', ['jshint:all'])
	grunt.registerTask('windows', ['lint']) // prettier,eslint not tested on windows
	grunt.registerTask('single', ['jshint:single'])
}
