/**
	Test plan for perljs module

	@file test/perl-test.js
	@author Brent S.A. Cowgill
	@requires chai

	@see {@link http://chaijs.com/api/bdd/ Chai Documentation}
*/
/*jshint maxlen: 145, maxstatements: 25 */
/*global describe, it */
'use strict';

var chai = require('chai'),
	should = chai.should(),
	expect = chai.expect,
	perl = require('../lib/perl');
/*	q = perl.q,
	qq = perl.qq,
	qw = perl.qw,
	x = perl.x,
	name = 'perl rocks the javascript world';

	console.log('q', q(name), 'qq', qq(name), 'qw', qw(name), 'x', x(name + '\n', 3));
*/

describe('#perl helpers', function () {
	describe('._value()', function() {
		it('handles undef', function() {
			expect(perl._value('undef')).to.equal(void should);
		});
		it('handles undefined', function() {
			expect(perl._value('undefined')).to.equal(void 0);
		});
		it('handles null', function() {
			expect(perl._value('null')).to.equal(null);
		});
		it('handles string empty', function() {
			perl._value('empty').should.equal('');
		});
		it('handles boolean true', function() {
			perl._value('true').should.equal(true);
		});
		it('handles boolean false', function() {
			perl._value('false').should.equal(false);
		});
		it('handles number NaN', function() {
			perl._value('NaN').should.deep.equal(NaN);
		});
		it('handles number Infinity', function() {
			perl._value('Infinity').should.equal(1/0);
		});
		it('handles number -Infinity', function() {
			perl._value('-Infinity').should.equal(1/-0);
		});
		it('handles number zero', function() {
			perl._value('0').should.equal(0);
		});
		it('handles numbers', function() {
			perl._value('1002.345').should.equal(1002.345);
		});
		it('handles scientific notation numbers', function() {
			perl._value('-1.23e-02').should.equal(-0.0123);
		});
		it('handles almost numbers like 34c', function() {
			perl._value('34c').should.equal('34c');
		});
		it('handles strings', function() {
			perl._value('some_other_word_string').should.equal('some_other_word_string');
		});
		it('handles an array', function() {
			perl._value([1, 2, 3]).should.be.deep.equal([1, 2, 3]);
		});
		it('handles an object', function() {
			perl._value({ '1': 2, '3': 4 }).should.be.deep.equal({ '1': 2, '3': 4 });
		});
		it('handles a function', function() {
			var fnEmpty = function () {};
			perl._value(fnEmpty).should.equal(fnEmpty);
		});
		it('handles a regular expression', function() {
			var regex = /^regex$/;
			perl._value(regex).should.equal(regex);
		});
	});
});

describe('#perl', function () {
	describe('.q()', function() {
		it('single quotes a string', function() {
			perl.q('quote me baby').should.equal('\'quote me baby\'');
		});
		it('single quotes a string but doesn\'t enquote single quotes', function() {
			perl.q('quote \'me\' baby').should.equal('\'quote \'me\' baby\'');
		});
		// Not perl q// behaviour
		it('quotes a string with any string', function() {
			perl.q('quote me baby', '@').should.equal('@quote me baby@');
		});
		it('quotes a string with any pair of strings', function() {
			perl.q('quote me baby', '<', '>').should.equal('<quote me baby>');
		});
	});

	describe('.qq()', function() {
		it('double quotes a string', function() {
			perl.qq('quote me baby').should.equal('"quote me baby"');
		});
		// Not perl qq// behaviour
		it('quotes a string with any string', function() {
			perl.qq('quote me baby', '@').should.equal('@quote me baby@');
		});
		it('quotes a string with any pair of strings', function() {
			perl.qq('quote me baby', '<', '>').should.equal('<quote me baby>');
		});
	});

	describe('.qw()', function() {
		it('makes array out of string', function() {
			perl.qw('   split   me 	baby\n\nyou know you want to   ').join('/').should.equal('split/me/baby/you/know/you/want/to');
		});
	});

	// Not a direct perl function, but equivalent to
	// my %Map = qw( key1 value1 key2 value2 );
	describe('.qwm()', function() {
		it('makes object out of string', function() {
			var oMap = 	perl.qwm('   split   me 	baby\n\nyou know you want to   ');
			Object.keys(oMap).join('/').should.equal('split/baby/know/want');
		});

		it('makes object out of string, warning about odd number of elements', function() {
			var konsole = perl._console,
				logged = '', oMap;

			perl._console = {
				'warn': function () { logged += Array.prototype.slice.call(arguments).join('\n'); }
			};
			oMap = 	perl.qwm('   split   me 	baby\n\nyou know you want   ');
			Object.keys(oMap).join('/').should.equal('split/baby/know/want');
			expect(oMap.want).to.equal(void 0);
			logged.should.be.equal('Odd number of elements in hash assignment from \'   split   me \tbaby\n\nyou know you want   \'');
			perl._console = konsole;
		});

		it('makes object out of string, handling base types boolean, number', function() {
			var oMap = 	perl.qwm(
					'   split 42  me 	true baby false\n\n'
					+ 'you null know undefined you NaN want  -12.3 it null to Infinity be -Infinity empty empty');

			Object.keys(oMap).join('/').should.equal('split/me/baby/you/know/want/it/to/be/empty');
			oMap.split.should.be.equal(42);
			oMap.me.should.be.equal(true);
			oMap.baby.should.be.equal(false);
			oMap.you.should.deep.equal(NaN);
			expect(oMap.know).to.equal(undefined);
			oMap.want.should.be.equal(-12.3);
			expect(oMap.it).to.equal(null);
			oMap.to.should.be.equal(Infinity);
			oMap.be.should.be.equal(-Infinity);
			oMap.empty.should.be.equal('');
		});
	});

	describe('.x()', function() {
		it('repeats itself N times', function() {
			perl.x('repeat after me', 4).should.equal('repeat after merepeat after merepeat after merepeat after me');
		});
	});

});
