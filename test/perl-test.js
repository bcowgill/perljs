/**
	Test plan for perljs module

	@file test/perl-test.js
	@author Brent S.A. Cowgill
	@requires chai

	@see {@link http://chaijs.com/api/bdd/ Chai Documentation}
*/
/* eslint-disable unicorn/string-content */
// W110 is warning about mixed single an d double quotes
/*jshint maxlen: 145, maxstatements: 25, -W110 */
/*global should */
'use strict'

console.log(new Date(), 'perljs')
var perl = require('../lib/perl'),
	// eslint-disable-next-line unicorn/no-null
	NULL = null,
	oLogger = {
		logged: '',
		check: function () {
			// checking what was logged clears it.
			var log = oLogger.logged
			oLogger.logged = ''
			return log
		},
		warn: function () {
			oLogger.logged += Array.prototype.slice.call(arguments).join('\n')
		},
	},
	function_ = function () {
		return NULL
	},
	functionEmpty = function () {}

/*	q = perl.q,
	qq = perl.qq,
	qw = perl.qw,
	x = perl.x,
	name = 'perl rocks the javascript world';

	console.log('q', q(name), 'qq', qq(name), 'qw', qw(name), 'x', x(name + '\n', 3));
*/

describe('#perl helpers', function () {
	describe('._value()', function () {
		it('handles undef', function () {
			// debugger;
			expect(perl._value('undef')).to.equal(void should)
		})
		it('handles undefined', function () {
			expect(perl._value('undefined')).to.equal(void 0)
		})
		it('handles null', function () {
			expect(perl._value('null')).to.equal(NULL)
		})
		it('handles string empty', function () {
			perl._value('empty').should.equal('')
		})
		it('handles boolean true', function () {
			perl._value('true').should.equal(true)
		})
		it('handles boolean false', function () {
			perl._value('false').should.equal(false)
		})
		it('handles number NaN', function () {
			perl._value('NaN').should.deep.equal(Number.NaN)
		})
		it('handles number Infinity', function () {
			perl._value('Infinity').should.equal(1 / 0)
		})
		it('handles number -Infinity', function () {
			perl._value('-Infinity').should.equal(1 / -0)
		})
		it('handles number zero', function () {
			perl._value('0').should.equal(0)
		})
		it('handles numbers', function () {
			perl._value('1002.345').should.equal(1002.345)
		})
		it('handles scientific notation numbers', function () {
			perl._value('-1.23e-02').should.equal(-0.0123)
		})
		it('handles almost numbers like 34c', function () {
			perl._value('34c').should.equal('34c')
		})
		it('handles strings', function () {
			perl._value('some_other_word_string').should.equal(
				'some_other_word_string'
			)
		})
		it('handles an array', function () {
			perl._value([1, 2, 3]).should.be.deep.equal([1, 2, 3])
		})
		it('handles an object', function () {
			perl._value({ 1: 2, 3: 4 }).should.be.deep.equal({ 1: 2, 3: 4 })
		})
		it('handles a function', function () {
			perl._value(functionEmpty).should.equal(functionEmpty)
		})
		it('handles a regular expression', function () {
			var regex = /^regex$/
			perl._value(regex).should.equal(regex)
		})
	})
	describe('._stringify()', function () {
		it('handles undefined as empty string', function () {
			perl._stringify().should.equal('')
		})
		it('handles null as empty string', function () {
			perl._stringify(NULL).should.equal('')
		})
		it('handles true as true', function () {
			perl._stringify(true).should.equal('true')
		})
		it('handles false as false', function () {
			perl._stringify(true).should.equal('true')
		})
		it('handles numbers', function () {
			perl._stringify(12.345).should.equal('12.345')
		})
		it('handles NaN as empty string', function () {
			perl._stringify(Number.NaN).should.equal('')
		})
		it('handles Infinity as empty string', function () {
			perl._stringify(Number.POSITIVE_INFINITY).should.equal('')
		})
		it('handles -Infinity as empty string', function () {
			perl._stringify(Number.NEGATIVE_INFINITY).should.equal('')
		})
		it('handles an array by returning the array', function () {
			var anArray = [1, 2, 3]
			perl._stringify(anArray).should.equal(anArray)
		})
		it('handles an object by returning the object', function () {
			var anObject = { 1: 2, 3: 4 }
			perl._stringify(anObject).should.equal(anObject)
		})
		it('handles a function by calling it and stringifying the result', function () {
			perl._stringify(function () {
				return NULL
			}).should.equal('')
		})
	})
})

describe('#perl methods', function () {
	describe('.q()', function () {
		it('single quotes a string', function () {
			perl.q('quote me baby').should.equal("'quote me baby'")
		})
		it('single quotes a string but doesn’t enquote single quotes', function () {
			perl.q("quote 'me' baby").should.equal("'quote 'me' baby'")
		})
		describe('non-perl q// operator behaviour', function () {
			it('quotes a string with any string', function () {
				perl.q('quote me baby', '@').should.equal('@quote me baby@')
			})
			it('quotes a string with any pair of strings', function () {
				perl.q('quote me baby', '<', '>').should.equal(
					'<quote me baby>'
				)
			})
			it('single quotes undefined as empty string', function () {
				perl.q().should.equal("''")
			})
			it('single quotes null as empty string', function () {
				perl.q(NULL).should.equal("''")
			})
			it("single quotes true as 'true'", function () {
				perl.q(true).should.equal("'true'")
			})
			it("single quotes false as 'false'", function () {
				perl.q(false).should.equal("'false'")
			})
			it('single quotes numbers', function () {
				perl.q(12.345).should.equal("'12.345'")
			})
			it('single quotes NaN as empty string', function () {
				perl.q(Number.NaN).should.equal("''")
			})
			it('single quotes Infinity as empty string', function () {
				perl.q(Number.POSITIVE_INFINITY).should.equal("''")
			})
			it('single quotes -Infinity as empty string', function () {
				perl.q(Number.NEGATIVE_INFINITY).should.equal("''")
			})
			it('a.k.a qA() single quotes an Array by quoting all the elements of the array', function () {
				var aArray = [1, 2, function_]
				perl.q(aArray).should.deep.equal(["'1'", "'2'", "''"])
				// ensure original array not modified
				aArray.should.deep.equal([1, 2, function_])
			})
			it('a.k.a qO() single quotes an Object by quoting all the values of the object', function () {
				var oObject = { 1: 2, 3: 4 }
				perl.q(oObject).should.deep.equal({ 1: "'2'", 3: "'4'" })
				// ensure original object not modified
				oObject.should.deep.equal({ 1: 2, 3: 4 })
			})
		})
	}) // .q()

	describe('.qq()', function () {
		it('double quotes a string', function () {
			perl.qq('quote me baby').should.equal('"quote me baby"')
		})
		describe('non-perl q// operator behaviour', function () {
			it('quotes a string with any string', function () {
				perl.qq('quote me baby', '@').should.equal('@quote me baby@')
			})
			it('quotes a string with any pair of strings', function () {
				perl.qq('quote me baby', '<', '>').should.equal(
					'<quote me baby>'
				)
			})
			it('a.k.a qqO() double quotes an Object by quoting all the values of the object', function () {
				var oObject = { 1: 2, 3: 4 }
				perl.qq(oObject).should.deep.equal({ 1: '"2"', 3: '"4"' })
				// ensure original object not modified
				oObject.should.deep.equal({ 1: 2, 3: 4 })
			})
		})
	}) // .qq()

	describe('.qw()', function () {
		it('makes array out of string', function () {
			perl.qw('   split   me 	baby\n\nyou know you want to   ')
				.join('/')
				.should.equal('split/me/baby/you/know/you/want/to')
		})
	}) // .qw()

	// Not a direct perl function, but equivalent to
	// my @Quoted = map { qq{"$ARG"} } qw( value1 value2 );
	describe('.qqA()', function () {
		var aList = ['one', 'two']
		it('double quotes the strings in an array', function () {
			perl.qqA(aList).should.deep.equal(['"one"', '"two"'])
		})
		describe('non-perl qq// operator behaviour', function () {
			it('quotes an array with any string', function () {
				perl.qqA(aList, '@').should.deep.equal(['@one@', '@two@'])
			})
			it('quotes an array with any pair of strings', function () {
				perl.qqA(aList, '<', '>').should.deep.equal(['<one>', '<two>'])
			})
		})
	}) // .qqA()

	// Not a direct perl function, but equivalent to
	// my %Quoted = map { ($ARG, qq{"$Map{$ARG}"}) } %Map;
	describe('.qqO()', function () {
		var oObject = { 1: 2, 3: 4 }
		it('double quotes the values in an object', function () {
			perl.qqO(oObject).should.deep.equal({ 1: '"2"', 3: '"4"' })
		})
		describe('non-perl qq// operator behaviour', function () {
			it('quotes the values of an object with any string', function () {
				perl.qqO(oObject, '@').should.deep.equal({ 1: '@2@', 3: '@4@' })
			})
			it('quotes the values of an object with any pair of strings', function () {
				perl.qqO(oObject, '<', '>').should.deep.equal({
					1: '<2>',
					3: '<4>',
				})
			})
		})
	}) // .qqO()

	// Not a direct perl function, but equivalent to
	// my %Map = qw( key1 value1 key2 value2 );
	describe('.qwm() equivalent perl %Map = qw{key1 value1 key2 value2}', function () {
		it('makes object out of string', function () {
			var oMap = perl.qwm('   split   me 	baby\n\nyou know you want to   ')
			Object.keys(oMap).join('/').should.equal('split/baby/know/want')
		})

		it('makes object out of string, warning about odd number of elements', function () {
			var oMap,
				konsole = perl._console

			perl._console = oLogger
			oMap = perl.qwm('   split   me 	baby\n\nyou know you want   ')
			Object.keys(oMap).join('/').should.equal('split/baby/know/want')
			expect(oMap.want).to.equal(void 0)
			oLogger
				.check()
				.should.be.equal(
					"Odd number of elements in hash assignment from '   split   me \tbaby\n\nyou know you want   '"
				)
			perl._console = konsole
		})

		describe('non-perl q// operator behaviour', function () {
			it('makes object out of string, handling base types boolean, number', function () {
				var oMap = perl.qwm(
					'   split 42  me 	true baby false\n\n' +
						'you null know undefined you NaN want  -12.3 it null to Infinity be -Infinity empty empty'
				)

				Object.keys(oMap)
					.join('/')
					.should.equal('split/me/baby/you/know/want/it/to/be/empty')
				oMap.split.should.be.equal(42)
				oMap.me.should.be.equal(true)
				oMap.baby.should.be.equal(false)
				oMap.you.should.deep.equal(Number.NaN)
				expect(oMap.know).to.equal(undefined)
				oMap.want.should.be.equal(-12.3)
				expect(oMap.it).to.equal(NULL)
				oMap.to.should.be.equal(Number.POSITIVE_INFINITY)
				oMap.be.should.be.equal(Number.NEGATIVE_INFINITY)
				oMap.empty.should.be.equal('')
			})
		})
	}) // .qwm()

	// Not a direct perl function, but an idiom of creating a map from an array
	describe('.mapFromArray()', function () {
		it('makes an Object out of an Array', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.mapFromArray(aArray).should.deep.equal({
				key1: 'value1',
				key2: 'value2',
			})
		})
		it('makes an Object out of an undefined Array', function () {
			perl.mapFromArray().should.deep.equal({})
		})
		it('makes an Object out of an Array, warning about odd elements', function () {
			var aArray,
				konsole = perl._console

			perl._console = oLogger
			aArray = perl.qw('key1 value1 key2 value2 key1')
			perl.mapFromArray(aArray).should.deep.equal({
				key1: void 0,
				key2: 'value2',
			})
			oLogger
				.check()
				.should.be.equal(
					'Odd number of elements in hash assignment from [key1, value1, key2, value2, key1]'
				)
			perl._console = konsole
		})
		it('makes an Object out of an Array of strange things', function () {
			var aArray = ['key1', ['value1'], true, 'value2']
			perl.mapFromArray(aArray).should.deep.equal({
				key1: ['value1'],
				true: 'value2',
			})
		})
	}) // .mapFromArray()

	// Not a direct perl function, but an idiom of creating a map with all keys from an array
	// my %Map = map { ( $ARG, 1 ) } @Array;
	describe('.makeMap()', function () {
		it('makes a map Object out of an Array (default true)', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray).should.deep.equal({
				key1: true,
				value1: true,
				key2: true,
				value2: true,
			})
		})
		it('makes a map Object out of an undefined Array', function () {
			perl.makeMap().should.deep.equal({})
		})
		it('makes a map Object out of an Array with a specific value (undefined -> true)', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, void 0).should.deep.equal({
				key1: true,
				value1: true,
				key2: true,
				value2: true,
			})
		})
		it('makes a map Object out of an Array with a specific value (false)', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, false).should.deep.equal({
				key1: false,
				value1: false,
				key2: false,
				value2: false,
			})
		})
		it('makes a map Object out of an Array with a specific value (0)', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, 0).should.deep.equal({
				key1: 0,
				value1: 0,
				key2: 0,
				value2: 0,
			})
		})
		it('makes a map Object out of an Array with a specific value (null)', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, NULL).should.deep.equal({
				key1: NULL,
				value1: NULL,
				key2: NULL,
				value2: NULL,
			})
		})
		it('makes a map Object out of an Array with a valuation function', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, function (value) {
				return String(value).slice(0, 1)
			}).should.deep.equal({
				key1: 'k',
				value1: 'v',
				key2: 'k',
				value2: 'v',
			})
		})
		it('makes a map Object out of an Array with a function to actually set undefined', function () {
			var aArray = perl.qw('key1 value1 key2 value2')
			perl.makeMap(aArray, function () {
				return void 0
			}).should.deep.equal({
				key1: void 0,
				value1: void 0,
				key2: void 0,
				value2: void 0,
			})
		})
		it('makes a map Object out of an Array of strange things', function () {
			var aArray = ['key1', ['value1'], true, 'value2']
			perl.makeMap(aArray).should.deep.equal({
				key1: true,
				value1: true,
				true: true,
				value2: true,
			})
		})
	}) // .makeMap()

	// Not a direct perl function, but an idiom of reversing a key/value map to value/key
	// like perl %ReverseMap = map { ($Map{$ARG}, $ARG) } keys(%Map)
	describe('.reverseMap()', function () {
		it('reverses the key/values of an object so the values look up the keys', function () {
			var oMap = perl.qwm('key1 value1 key2 value2')
			perl.reverseMap(oMap).should.deep.equal({
				value1: 'key1',
				value2: 'key2',
			})
		})
		it('reverse the key/values but values not unique', function () {
			var oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
			perl.reverseMap(oMap).should.deep.equal({
				value1: 'key3',
				value2: 'key2',
			})
		})
		it('reverse the key/values with a hashing function', function () {
			/* jshint plusplus: false */
			var index = 0,
				oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
			perl.reverseMap(oMap, function (key) {
				return key + index++
			}).should.deep.equal({
				value10: 'key1',
				value21: 'key2',
				value12: 'key3',
			})
		})
		it('reverse the key/values with a hashing function which checks existence', function () {
			/* jshint maxcomplexity: 2, plusplus: false */
			var index = 0,
				oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
			perl.reverseMap(oMap, function (key, oRevMap) {
				return key in oRevMap ? key + index++ : key
			}).should.deep.equal({
				value1: 'key1',
				value2: 'key2',
				value10: 'key3',
			})
		})
		it('reverse the key/values where values are not just strings', function () {
			var oMap = { key1: ['value1'], true: 'value2' }
			perl.reverseMap(oMap).should.deep.equal({
				value1: 'key1',
				value2: true,
			})
		})
	}) // reverseMap()

	describe('.x()', function () {
		it('repeats itself N times', function () {
			perl.x('repeat after me', 4).should.equal(
				'repeat after merepeat after merepeat after merepeat after me'
			)
		})
		it('repeats itself ’N’ times', function () {
			perl.x('repeat after me', '4').should.equal(
				'repeat after merepeat after merepeat after merepeat after me'
			)
		})
		it('repeat isn’t fully numeric but will repeat partially', function () {
			var konsole = perl._console

			perl._console = oLogger
			perl.x('repeat after me', '4.2c').should.equal(
				'repeat after merepeat after merepeat after merepeat after me'
			)
			oLogger
				.check()
				.should.be.equal('Argument "4.2c" isn’t numeric in repeat .x()')
			perl._console = konsole
		})
		describe('non-perl x operator behaviour', function () {
			it('handles undefined as empty string', function () {
				perl.x(undefined, 4).should.equal('')
			})
			it('handles null as empty string', function () {
				perl.x(NULL, 4).should.equal('')
			})
			it('handles NaN as empty string', function () {
				perl.x(Number.NaN, 4).should.equal('')
			})
			it('handles Infinity as empty string', function () {
				perl.x(Number.POSITIVE_INFINITY, 4).should.equal('')
			})
			it('handles -Infinity as empty string', function () {
				perl.x(Number.NEGATIVE_INFINITY, 4).should.equal('')
			})
		})
	}) // .x()
})
