/**
	Test plan for perljs module

	@file test/perl-test.js
	@author Brent S.A. Cowgill
	@requires chai

	@see {@link http://chaijs.com/api/bdd/ Chai Documentation}
*/
/*jshint maxlen: 145, maxstatements: 25 */
/*global describe, expect, it, should */
'use strict';

console.log(new Date(), 'perljs');
var perl = require('../lib/perl'),
	oLogger = {
		'logged': '',
		'check': function () {
			// checking what was logged clears it.
			var log = oLogger.logged;
			oLogger.logged = '';
			return log;
		},
		'warn': function () {
			oLogger.logged += Array.prototype.slice.call(arguments).join('\n');
		}
	};

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
	describe('._stringify()', function() {
		it('handles undefined as empty string', function() {
			perl._stringify().should.equal('');
		});
		it('handles null as empty string', function() {
			perl._stringify(null).should.equal('');
		});
		it('handles true as true', function() {
			perl._stringify(true).should.equal('true');
		});
		it('handles false as false', function() {
			perl._stringify(true).should.equal('true');
		});
		it('handles numbers', function() {
			perl._stringify(12.345).should.equal('12.345');
		});
		it('handles NaN as empty string', function() {
			perl._stringify(NaN).should.equal('');
		});
		it('handles Infinity as empty string', function() {
			perl._stringify(Infinity).should.equal('');
		});
		it('handles -Infinity as empty string', function() {
			perl._stringify(-Infinity).should.equal('');
		});
		it('handles an array by returning the array', function() {
			var anArray = [1, 2, 3];
			perl._stringify(anArray).should.equal(anArray);
		});
		it('handles an object by returning the object', function() {
			var anObject = { '1': 2, '3': 4 };
			perl._stringify(anObject).should.equal(anObject);
		});
		it('handles a function by calling it and stringifying the result', function() {
			perl._stringify(function () { return null; }).should.equal('');
		});
	});
});

describe('#perl methods', function () {
	describe('.q()', function() {
		it('single quotes a string', function() {
			perl.q('quote me baby').should.equal('\'quote me baby\'');
		});
		it('single quotes a string but doesn\'t enquote single quotes', function() {
			perl.q('quote \'me\' baby').should.equal('\'quote \'me\' baby\'');
		});
		describe('non-perl q// operator behaviour', function () {
			it('quotes a string with any string', function() {
				perl.q('quote me baby', '@').should.equal('@quote me baby@');
			});
			it('quotes a string with any pair of strings', function() {
				perl.q('quote me baby', '<', '>').should.equal('<quote me baby>');
			});
			it('single quotes undefined as empty string', function() {
				perl.q().should.equal('\'\'');
			});
			it('single quotes null as empty string', function() {
				perl.q(null).should.equal('\'\'');
			});
			it('single quotes true as \'true\'', function() {
				perl.q(true).should.equal('\'true\'');
			});
			it('single quotes false as \'false\'', function() {
				perl.q(true).should.equal('\'true\'');
			});
			it('single quotes numbers', function() {
				perl.q(12.345).should.equal('\'12.345\'');
			});
			it('single quotes NaN as empty string', function() {
				perl.q(NaN).should.equal('\'\'');
			});
			it('single quotes Infinity as empty string', function() {
				perl.q(Infinity).should.equal('\'\'');
			});
			it('single quotes -Infinity as empty string', function() {
				perl.q(-Infinity).should.equal('\'\'');
			});
			it('a.k.a qA() single quotes an Array by quoting all the elements of the array', function() {
				var fn = function () { return null; }, aArray = [1, 2, fn];
				perl.q(aArray).should.deep.equal(['\'1\'', '\'2\'', '\'\'']);
				// ensure original array not modified
				aArray.should.deep.equal([1, 2, fn]);
			});
			it('a.k.a qO() single quotes an Object by quoting all the values of the object', function() {
				var oObject = {'1': 2, '3': 4};
				perl.q(oObject).should.deep.equal({'1': '\'2\'', '3': '\'4\''});
				// ensure original object not modified
				oObject.should.deep.equal({'1': 2, '3': 4});
			});
		});
	});

	describe('.qq()', function() {
		it('double quotes a string', function() {
			perl.qq('quote me baby').should.equal('"quote me baby"');
		});
		describe('non-perl q// operator behaviour', function () {
			it('quotes a string with any string', function() {
				perl.qq('quote me baby', '@').should.equal('@quote me baby@');
			});
			it('quotes a string with any pair of strings', function() {
				perl.qq('quote me baby', '<', '>').should.equal('<quote me baby>');
			});
			it('a.k.a qqO() double quotes an Object by quoting all the values of the object', function() {
				var oObject = {'1': 2, '3': 4};
				perl.qq(oObject).should.deep.equal({'1': '"2"', '3': '"4"'});
				// ensure original object not modified
				oObject.should.deep.equal({'1': 2, '3': 4});
			});
		});
	});

	describe('.qw()', function() {
		it('makes array out of string', function() {
			perl.qw('   split   me 	baby\n\nyou know you want to   ').join('/').should.equal('split/me/baby/you/know/you/want/to');
		});
	});

	// Not a direct perl function, but equivalent to
	// my @Quoted = map { qq{"$ARG"} } qw( value1 value2 );
	describe('.qqA()', function() {
		var aList = ['one', 'two'];
		it('double quotes the strings in an array', function() {
			perl.qqA(aList).should.deep.equal(['"one"', '"two"']);
		});
		describe('non-perl qq// operator behaviour', function () {
			it('quotes an array with any string', function() {
				perl.qqA(aList, '@').should.deep.equal(['@one@', '@two@']);
			});
			it('quotes an array with any pair of strings', function() {
				perl.qqA(aList, '<', '>').should.deep.equal(['<one>', '<two>']);
			});
		});
	});

	// Not a direct perl function, but equivalent to
	// my %Quoted = map { ($ARG, qq{"$Map{$ARG}"}) } %Map;
	describe('.qqO()', function() {
		var oObject = {'1': 2, '3': 4};
		it('double quotes the values in an object', function() {
			perl.qqO(oObject).should.deep.equal({'1': '"2"', '3': '"4"'});
		});
		describe('non-perl qq// operator behaviour', function () {
			it('quotes the values of an object with any string', function() {
				perl.qqO(oObject, '@').should.deep.equal({'1': '@2@', '3': '@4@'});
			});
			it('quotes the values of an object with any pair of strings', function() {
				perl.qqO(oObject, '<', '>').should.deep.equal({'1': '<2>', '3': '<4>'});
			});
		});
	});

	// Not a direct perl function, but equivalent to
	// my %Map = qw( key1 value1 key2 value2 );
	describe('.qwm() equivalent perl %Map = qw{key1 value1 key2 value2}', function() {
		it('makes object out of string', function() {
			var oMap = 	perl.qwm('   split   me 	baby\n\nyou know you want to   ');
			Object.keys(oMap).join('/').should.equal('split/baby/know/want');
		});

		it('makes object out of string, warning about odd number of elements', function() {
			var oMap, konsole = perl._console;

			perl._console = oLogger;
			oMap = 	perl.qwm('   split   me 	baby\n\nyou know you want   ');
			Object.keys(oMap).join('/').should.equal('split/baby/know/want');
			expect(oMap.want).to.equal(void 0);
			oLogger.check().should.be.equal('Odd number of elements in hash assignment from \'   split   me \tbaby\n\nyou know you want   \'');
			perl._console = konsole;
		});

		describe('non-perl q// operator behaviour', function () {
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
	});

	// Not a direct perl function, but an idiom of creating a map from an array
	describe('.mapFromArray()', function() {
		it('makes an Object out of an Array', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.mapFromArray(aArray).should.deep.equal({ key1: 'value1', key2: 'value2' });
		});
		it('makes an Object out of an undefined Array', function () {
			perl.mapFromArray().should.deep.equal({});
		});
		it('makes an Object out of an Array, warning about odd elements', function () {
			var aArray, konsole = perl._console;

			perl._console = oLogger;
			aArray = perl.qw('key1 value1 key2 value2 key1');
			perl.mapFromArray(aArray).should.deep.equal({ key1: void 0, key2: 'value2' });
			oLogger.check().should.be.equal('Odd number of elements in hash assignment from [key1, value1, key2, value2, key1]');
			perl._console = konsole;
		});
		it('makes an Object out of an Array of strange things', function () {
			var aArray = ['key1', ['value1'], true, 'value2'];
			perl.mapFromArray(aArray).should.deep.equal({ key1: ['value1'], 'true': 'value2' });
		});
	});

	// Not a direct perl function, but an idiom of creating a map with all keys from an array
	// my %Map = map { ( $ARG, 1 ) } @Array;
	describe('.makeMap()', function() {
		it('makes a map Object out of an Array (default true)', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray)
				.should.deep.equal({ key1: true, value1: true, key2: true, value2: true });
		});
		it('makes a map Object out of an undefined Array', function () {
			perl.makeMap()
				.should.deep.equal({});
		});
		it('makes a map Object out of an Array with a specific value (undefined -> true)', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, void 0)
				.should.deep.equal({ key1: true, value1: true, key2: true, value2: true });
		});
		it('makes a map Object out of an Array with a specific value (false)', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, false)
				.should.deep.equal({ key1: false, value1: false, key2: false, value2: false });
		});
		it('makes a map Object out of an Array with a specific value (0)', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, 0)
				.should.deep.equal({ key1: 0, value1: 0, key2: 0, value2: 0 });
		});
		it('makes a map Object out of an Array with a specific value (null)', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, null)
				.should.deep.equal({ key1: null, value1: null, key2: null, value2: null });
		});
		it('makes a map Object out of an Array with a valuation function', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, function (value) { return String(value).substring(0, 1); })
				.should.deep.equal({ key1: 'k', value1: 'v', key2: 'k', value2: 'v' });
		});
		it('makes a map Object out of an Array with a function to actually set undefined', function () {
			var aArray = perl.qw('key1 value1 key2 value2');
			perl.makeMap(aArray, function () {return void 0;})
				.should.deep.equal({ key1: void 0, value1: void 0, key2: void 0, value2: void 0 });
		});
		it('makes a map Object out of an Array of strange things', function () {
			var aArray = ['key1', ['value1'], true, 'value2'];
			perl.makeMap(aArray)
				.should.deep.equal({ key1: true, 'value1': true, 'true': true, 'value2': true });
		});
	});

	// Not a direct perl function, but an idiom of reversing a key/value map to value/key
	// like perl %ReverseMap = map { ($Map{$ARG}, $ARG) } keys(%Map)
	describe('.reverseMap()', function() {
		it('reverses the key/values of an object so the values look up the keys', function () {
			var oMap = perl.qwm('key1 value1 key2 value2');
			perl.reverseMap(oMap)
				.should.deep.equal({ value1: 'key1', value2: 'key2' });
		});
		it('reverse the key/values but values not unique', function () {
			var oMap = perl.qwm('key1 value1 key2 value2 key3 value1');
			perl.reverseMap(oMap)
				.should.deep.equal({ value1: 'key3', value2: 'key2' });
		});
		it('reverse the key/values with a hashing function', function () {
			/* jshint plusplus: false */
			var idx = 0, oMap = perl.qwm('key1 value1 key2 value2 key3 value1');
			perl.reverseMap(oMap, function (key) { return key + idx++;})
				.should.deep.equal({ value10: 'key1', value21: 'key2', value12: 'key3' });
		});
		it('reverse the key/values with a hashing function which checks existence', function () {
			/* jshint maxcomplexity: 2, plusplus: false */
			var idx = 0, oMap = perl.qwm('key1 value1 key2 value2 key3 value1');
			perl.reverseMap(oMap, function (key, oRevMap) { return (key in oRevMap) ? key + idx++ : key; })
				.should.deep.equal({ value1: 'key1', value2: 'key2', value10: 'key3' });
		});
		it('reverse the key/values where values are not just strings', function () {
			var oMap = {'key1': ['value1'], 'true': 'value2'};
			perl.reverseMap(oMap)
				.should.deep.equal({ value1: 'key1', value2: true });
		});
	});

	describe('.x()', function() {
		it('repeats itself N times', function() {
			perl.x('repeat after me', 4).should.equal('repeat after merepeat after merepeat after merepeat after me');
		});
		it('repeats itself \'N\' times', function() {
			perl.x('repeat after me', '4').should.equal('repeat after merepeat after merepeat after merepeat after me');
		});
		it('repeat isn\'t fully numeric but will repeat partially', function() {
			var konsole = perl._console;

			perl._console = oLogger;
			perl.x('repeat after me', '4.2c').should.equal('repeat after merepeat after merepeat after merepeat after me');
			oLogger.check().should.be.equal('Argument "4.2c" isn\'t numeric in repeat .x()');
			perl._console = konsole;
		});
		describe('non-perl x operator behaviour', function () {
			it('handles undefined as empty string', function() {
				perl.x(undefined, 4).should.equal('');
			});
			it('handles null as empty string', function() {
				perl.x(null, 4).should.equal('');
			});
			it('handles NaN as empty string', function() {
				perl.x(NaN, 4).should.equal('');
			});
			it('handles Infinity as empty string', function() {
				perl.x(Infinity, 4).should.equal('');
			});
			it('handles -Infinity as empty string', function() {
				perl.x(-Infinity, 4).should.equal('');
			});
		});
	});

});
