// setup-test-framework.js - setup global test framework functions for testing in node and browser
'use strict';
console.log(new Date(), 'start setup-test-framework');

/* jshint -W054 */ // The Function constructor is a form of eval.
var isBrowser = new Function('try { return this === window; } catch (e) { return false; }');
var isKarma = new Function('try { return "__karma__" in this; } catch (e) { return false; }');

function setupTestFramework () {
    var getGlobal = new Function('return this;'),
        chai = require('chai'),
        root = getGlobal();

    root.chai = chai;
    root.should = chai.should();

    root.expect = chai.expect;
}

if (isKarma()) {
    console.log(new Date(), 'isKarma setup-test-framework', typeof mocha);
    require.config({
        paths: {
            'chai': '/base/node_modules/chai/chai'
        }
    });
    require(['require', 'chai'], function (require) {
        setupTestFramework();
        // invokes the test-suite-browser.js
        require(['require', 'test-suite-browser'], function () {
            console.log(new Date(), 'setup-test-framework');
        });
    });
}
else if (isBrowser()) {
    console.log(new Date(), 'isBrowser setup-test-framework');
    require.config({
        paths: {
            'chai': '../node_modules/chai/chai'
        }
    });
    require(['require', 'chai'], function (require) {
        setupTestFramework();
        // invokes the test-suite-browser.js
        require(['require', 'test-suite-browser'], function () {
            console.log(new Date(), 'setup-test-framework');
        });
    });
}
else {
    setupTestFramework();
}
