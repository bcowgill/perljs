// setup-test-framework.js - setup global test framework functions for testing in node and browser
'use strict'

// W054 is warning The Function constructor is a form of eval.
/* jshint -W054 */
var isBrowser = new Function(
	'try { return this === window; } catch (e) { return false; }'
)

function setupTestFramework() {
	var getGlobal = new Function('return this;'),
		chai = require('chai'),
		root = getGlobal()
	/* jshint +W054 */

	root.chai = chai
	root.should = chai.should()
	root.expect = chai.expect
}

if (isBrowser()) {
	require.config({
		paths: {
			chai: '../node_modules/chai/chai',
		},
	})
	require(['require', 'chai'], function (require) {
		setupTestFramework()
		// invokes the test-suite-browser.js
		require(['require', 'test-suite-browser'], function () {
			console.log(new Date(), 'setup-test-framework')
		})
	})
} else {
	setupTestFramework()
}
