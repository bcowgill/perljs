'use strict';
/* global mocha */

/* jshint -W054 */ // The Function constructor is a form of eval.
var isBrowser = new Function('try { return this === window; } catch (e) { return false; }');

if (isBrowser()) {
    mocha.run();
}
