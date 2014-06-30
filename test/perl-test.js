/**
	Test plan for perljs module

	@file test/perl-test.js
	@author Brent S.A. Cowgill
	@requires chai

	@see {@link http://chaijs.com/api/bdd/ Chai Documentation}
*/
/*jshint maxlen: 145 */
/*global describe, it */
'use strict';

require('chai').should();
var perl = require('../lib/perl');
/*	q = perl.q,
	qq = perl.qq,
	qw = perl.qw,
	x = perl.x,
	name = 'perl rocks the javascript world';

	console.log('q', q(name), 'qq', qq(name), 'qw', qw(name), 'x', x(name + '\n', 3));
*/

describe('#perl', function () {

	describe('.q()', function() {
		it('single quotes a string', function() {
			perl.q('quote me baby').should.equal('\'quote me baby\'');
		});
	});

	describe('.qq()', function() {
		it('double quotes a string', function() {
			perl.qq('quote me baby').should.equal('"quote me baby"');
		});
	});

	describe('.qw()', function() {
		it('makes array out of string', function() {
			perl.qw('   split   me 	baby\n\nyou know you want to   ').join('/').should.equal('split/me/baby/you/know/you/want/to');
		});
	});

	describe('.x()', function() {
		it('repeats itself N times', function() {
			perl.x('repeat after me', 4).should.equal('repeat after merepeat after merepeat after merepeat after me');
		});
	});

});
