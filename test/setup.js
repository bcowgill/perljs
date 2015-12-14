// setup.js - setup global functions for testing
'use strict';

/* jshint -W054 */ // The Function constructor is a form of eval.
var getGlobal = new Function('return this;'),
    chai = require('chai'),
    root = getGlobal();

root.chai = chai;
root.should = chai.should();
root.expect = chai.expect;
