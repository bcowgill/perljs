// test-suite.js - in browser test suite runner

'use strict'

// eslint-disable-next-line no-redeclare
/* global mocha, window */

// W054 is warning The Function constructor is a form of eval.
/* jshint -W054 */
var isBrowser = new Function(
	'try { return this === window; } catch (e) { return false; }'
)
/* jshint +W054 */

// modules which need to be pre-loaded for the tests
var prerequisites = ['../lib/perl']

// the tests to be run should be added here
var specs = ['perl-test.js']

if (isBrowser()) {
	require(['require'], function (require) {
		require(prerequisites, function () {
			require(specs, function () {
				/* jshint maxcomplexity: 2 */
				// eslint-disable-next-line no-extra-semi
				;(window.mochaPhantomJS || mocha).run()
				console.log(new Date(), 'test-suite-browser')
			})
		})
	})
}
