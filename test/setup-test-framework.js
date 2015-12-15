// setup.js - setup global test framework functions for testing in node and browser
'use strict';

/* jshint -W054 */ // The Function constructor is a form of eval.
var isBrowser = new Function('try { return this === window; } catch (e) { return false; }');

function setupTestFramework () {
    var getGlobal = new Function('return this;'),
        chai = require('chai'),
        root = getGlobal();

    root.chai = chai;
    root.should = chai.should();
    root.expect = chai.expect;
}

if (isBrowser()) {
    require.config({
        paths: {
            'chai': '../node_modules/chai/chai'
        }
    });
    require(['require', 'chai'], function (require) {
        setupTestFramework();
        // invokes the test-suite.js
        require(['require', 'test-suite'], function () {
            // nothing to do
            console.log(new Date());
        });
    });
}
else {
    setupTestFramework();
}
