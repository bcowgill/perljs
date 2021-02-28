#!/usr/bin/env node
// based on simple js test framework ~/bin/template/javascript/unit-test-simple.js
// a cheap watch command...
// perl -e '$src = "./js-test.js"; $log = "./js-test.log"; while (1) { system("$src | tee $log") if (-M "$src" < -M "$log"); sleep(5) }'

const RUN_TESTS = true
const TAP_OUT = process && process.env && process.env.HARNESS_ACTIVE === '1'

var perl = require('../'),
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
	}

console.error('standalone test of perljs module for checking backward compatability with nodejs.\n')
console.error('version', perl.version)

//=== utilities ============================================================

var error = console.error
var warn = TAP_OUT ? console.log : console.warn
var log = console.log

//=== unit test library ====================================================

if (!console.group) {
	console.group = console.log
}
if (!console.groupEnd) {
	console.groupEnd = function () {}
}

const BULLET = '○ ' // <- from jest skipped tests '◌ ' <- alternative

const TESTS = {
	depth: 0,
	fail: 0,
	DASH: TAP_OUT ? '- ' : '',
	NOT_OK: TAP_OUT ? 'not ok ' : '✘ ',
	OK: TAP_OUT ? 'ok ' : '✔ ',
	SKIP: TAP_OUT ? 'not ok ' : BULLET,
	SKIPH: TAP_OUT ? '' : BULLET, // a skipped heading
	SKIPD: TAP_OUT ? '- skipped ' : '', // a dash in the skip message
	pass: 0,
	skip: 0,
	QUIET: TAP_OUT ? false : true,
	total: 0,
}

function plan(number) {
	if (TAP_OUT) {
		warn('1..' + number)
	}
} // plan()

function heading(message) {
	console.log(' - ' + message)
}

var group
var groupEnd

if (TAP_OUT) {
	group = heading
	groupEnd = function () {}
} else {
	group = console.group
	groupEnd = console.groupEnd
}

function tap(glyph, message, dash) {
	dash = dash || TESTS.DASH
	return [glyph, TESTS.total, ' ', dash, message].join('').trim()
}

function ok(message) {
	TESTS.pass += 1
	TESTS.total += 1
	if (TESTS.OK && !TESTS.QUIET) {
		warn(tap(TESTS.OK, message))
	}
} // ok()

function fail(message) {
	TESTS.fail += 1
	TESTS.total += 1
	warn(tap(TESTS.NOT_OK, message))
} // fail()

function skip(message) {
	TESTS.skip += 1
	TESTS.total += 1
	if (TESTS.SKIP && !TESTS.QUIET) {
		warn(tap(TESTS.SKIP, message, TESTS.SKIPD))
	}
} // skip()

function failDump(message, actual, expected, description) {
	description = description || ''
	TESTS.fail += 1
	TESTS.total += 1
	const prefix = tap(TESTS.NOT_OK, message)
	warn(
		[prefix, '\n', TESTS.DASH, 'got'].join(''),
		actual,
		['\n', TESTS.DASH, 'expected', description, ':'].join(''),
		expected
	)
} // failDump()

function testSummary() {
	if (!TESTS.total) {
		warn('no unit tests performed')
	} else if (TESTS.pass === TESTS.total) {
		log('all ' + TESTS.pass + ' tests passed.')
	} else {
		warn(
			[
				TESTS.fail,
				' tests failed, ',
				TESTS.skip,
				' tests skipped, ',
				TESTS.pass,
				' tests passed, ',
				TESTS.total,
				' total.',
			].join('')
		)
	}
} // testSummary()

function describe(title, fnSuite) {
	group(title)
	TESTS.depth += 1
	try {
		fnSuite()
	} catch (exception) {
		fail('describe "' + title + '" caught ' + exception)
		error(exception)
	} finally {
		TESTS.depth -= 1
		if (!TESTS.depth) {
			testSummary()
		}
		groupEnd(title)
	}
} // describe()

function xdescribe(title, fnSkip) {
	const header = TESTS.SKIPH + 'skipped - ' + title
	group(header)
	// set a skip marker to skip all tests...
	if (!TESTS.depth) {
		testSummary()
	}
	groupEnd(header)
}
describe.skip = xdescribe

function it(title, fnTest) {
	group(title)
	try {
		var result = fnTest()
		if (result) {
			fail('it expected falsy, got ' + result)
		}
	} catch (exception) {
		fail('it "' + title + '" caught ' + exception)
		error(exception)
	} finally {
		groupEnd(title)
	}
} // it()

function xit(title, fnSkip) {
	const header = TESTS.SKIPH + 'skipped - ' + title
	group(header)
	skip(title)
	groupEnd(header)
}
it.skip = xit

function assert(actual, expected, title) {
	title = title || ''
	// console.warn('assert', actual, expected, title)
	if (actual === expected) {
		ok(title)
	} else if (expected instanceof RegExp && expected.test(actual)) {
		ok(title)
	} else if (
		typeof actual === 'number' &&
		typeof expected === 'number' &&
		isNaN(actual) &&
		isNaN(expected)
	) {
		ok(title)
	} else {
		failDump(title, actual, expected)
	}
} // assert()

function assertArray(actual, expected, title) {
	title = title || ''
	var jsonActual, jsonExpected
	// console.warn('assertArray', actual, expected, title)
	if (actual === expected) {
		ok(title)
	} else if (
		(jsonActual = JSON.stringify(actual)) ===
		(jsonExpected = JSON.stringify(expected))
	) {
		ok(title)
	} else {
		failDump(title, jsonActual, jsonExpected)
	}
} // assertArray()

function assertObject(actual, expected, title) {
	title = title || ''
	var jsonActual, jsonExpected
	// console.warn('assertObject', actual, expected, title)
	if (actual === expected) {
		ok(title)
	} else if (
		(jsonActual = JSON.stringify(actual)) ===
		(jsonExpected = JSON.stringify(expected))
	) {
		ok(title)
	} else {
		failDump(title, jsonActual, jsonExpected)
	}
} // assertObject()

function assertThrows(actualFn, expected, title) {
	title = title || ''
	// console.warn('assertThrows', actualFn, expected, title)
	try {
		var result = actualFn()
		failDump(title, result, 'to throw but did not. [' + expected)
	} catch (exception) {
		if (typeof expected === 'function') {
			assertInstanceOf(exception, expected, title)
		} else {
			assert(exception, expected, title)
		}
	}
}

function assertNotThrows(actualFn, expected, title) {
	title = title || ''
	// console.warn('assertNotThrows', actualFn, expected, title)
	try {
		var actual = actualFn()
		assert(actual, expected, title)
	} catch (exception) {
		failDump(title, exception, 'not to throw but did.')
	}
}

function assertInstanceOf(actual, expected, title) {
	title = title || ''
	if (actual instanceof expected) {
		ok(title)
	} else {
		failDump(title, actual, expected, ' instance of')
	}
} // assertInstanceOf()

//=== unit tests ===========================================================

function test() {
	plan(71)
	describe('perljs - legacy', function testSuite() {
		describe('.q()', function testQSuite() {
			it('should single quote a string', function testQ1() {
				assert(perl.q('quote me baby'), "'quote me baby'", 'default')
				assert(
					perl.q("quote 'me' baby"),
					"'quote 'me' baby'",
					'with single quoted internal'
				)
				assert(
					perl.q('quote me baby', '@'),
					'@quote me baby@',
					'use @ to quote'
				)
				assert(
					perl.q('quote me baby', '<', '>'),
					'<quote me baby>',
					'use < > to quote'
				)
				assert(perl.q(), "''", 'undefined')
				assert(perl.q(null), "''", 'null')
				assert(perl.q(NaN), "''", 'NaN')
				assert(perl.q(Infinity), "''", 'Infinity')
				assert(perl.q(-Infinity), "''", '-Infinity')
				assert(perl.q(true), "'true'", 'true')
				assert(perl.q(false), "'false'", 'false')
				assert(perl.q(12.345), "'12.345'", 'number')
			})

			it('should single quote array elements', function testQ2() {
				var fn = function () {
						return null
					},
					aArray = [1, 2, fn]
				assertArray(perl.q(aArray), ["'1'", "'2'", "''"], 'array')
				// ensure original array not modified
				assertArray(aArray, [1, 2, fn], 'array unchanged')
			})

			it('should single quote object values', function testQ3() {
				var oObject = { 1: 2, 3: 4 }
				assertObject(perl.q(oObject), { 1: "'2'", 3: "'4'" }, 'object')
				// ensure original object not modified
				assertObject(oObject, { 1: 2, 3: 4 }, 'object unchanged')
			})
		}) // q()

		describe('.qq()', function testQQSuite() {
			it('should double quote a string', function testQQ1() {
				assert(perl.qq('quote me baby'), '"quote me baby"', 'default')
				assert(
					perl.qq('quote me baby', '@'),
					'@quote me baby@',
					'use @ to quote'
				)
				assert(
					perl.qq('quote me baby', '<', '>'),
					'<quote me baby>',
					'use < > to quote'
				)
			})
			it('should double quote object values', function testQQ2() {
				var oObject = { 1: 2, 3: 4 }
				assertObject(perl.qq(oObject), { 1: '"2"', 3: '"4"' }, 'object')
				// ensure original object not modified
				assertObject(oObject, { 1: 2, 3: 4 }, 'object unchanged')
			})
		}) // qq()

		describe('.qw()', function testQWSuite() {
			it('should make array out of string', function testQW1() {
				assert(
					perl
						.qw('   split   me 	baby\n\nyou know you want to   ')
						.join('/'),
					'split/me/baby/you/know/you/want/to'
				)
			})
		}) // qw()

		describe('.qqA()', function testQQASuite1() {
			var aList = ['one', 'two']
			it('double quotes the strings in an array', function testQQA1() {
				assertArray(perl.qqA(aList), ['"one"', '"two"'])
			})

			describe('non-perl qq// operator behaviour', function testQQASuite2() {
				it('quotes an array with any string', function testQQA2() {
					assertArray(perl.qqA(aList, '@'), ['@one@', '@two@'])
				})
				it('quotes an array with any pair of strings', function testQQA3() {
					assertArray(perl.qqA(aList, '<', '>'), ['<one>', '<two>'])
				})
			})
		}) // .qqA()

		describe('.qqO()', function testQQOSuite1() {
			var oObject = { 1: 2, 3: 4 }
			it('double quotes the values in an object', function testQQO1() {
				assertObject(perl.qqO(oObject), { 1: '"2"', 3: '"4"' })
			})
			describe('non-perl qq// operator behaviour', function testQQOSuite2() {
				it('quotes the values of an object with any string', function testQQO2() {
					assertObject(perl.qqO(oObject, '@'), { 1: '@2@', 3: '@4@' })
				})
				it('quotes the values of an object with any pair of strings', function testQQO3() {
					assertObject(perl.qqO(oObject, '<', '>'), {
						1: '<2>',
						3: '<4>',
					})
				})
			})
		}) // .qqO()

		describe('.qwm() equivalent perl %Map = qw{key1 value1 key2 value2}', function testQWMSuite1() {
			it('makes object out of string', function testQWM1() {
				var oMap = perl.qwm(
					'   split   me 	baby\n\nyou know you want to   '
				)
				assert(Object.keys(oMap).join('/'), 'split/baby/know/want')
			})

			it('makes object out of string, warning about odd number of elements', function testQWM2() {
				var oMap,
					konsole = perl._console

				perl._console = oLogger
				oMap = perl.qwm('   split   me 	baby\n\nyou know you want   ')
				assert(Object.keys(oMap).join('/'), 'split/baby/know/want')
				assert(oMap.want, void 0)
				assert(
					oLogger.check(),
					"Odd number of elements in hash assignment from '   split   me \tbaby\n\nyou know you want   '"
				)
				perl._console = konsole
			})

			describe('non-perl q// operator behaviour', function testQWMSuite2() {
				it('makes object out of string, handling base types boolean, number', function testQWM3() {
					var oMap = perl.qwm(
						'   split 42  me 	true baby false\n\n' +
							'you null know undefined you NaN want  -12.3 it null to Infinity be -Infinity empty empty'
					)

					assert(
						Object.keys(oMap).join('/'),
						'split/me/baby/you/know/want/it/to/be/empty'
					)
					assert(oMap.split, 42)
					assert(oMap.me, true)
					assert(oMap.baby, false)
					assert(oMap.you, NaN)
					assert(oMap.know, undefined)
					assert(oMap.want, -12.3)
					assert(oMap.it, null)
					assert(oMap.to, Infinity)
					assert(oMap.be, -Infinity)
					assert(oMap.empty, '')
				})
			})
		}) // .qwm()

		describe('.mapFromArray()', function testMapFromArraySuite1() {
			it('makes an Object out of an Array', function testMapFromArray1() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.mapFromArray(aArray), {
					key1: 'value1',
					key2: 'value2',
				})
			})
			it('makes an Object out of an undefined Array', function testMapFromArray2() {
				assertObject(perl.mapFromArray(), {})
			})
			it('makes an Object out of an Array, warning about odd elements', function testMapFromArray3() {
				var aArray,
					konsole = perl._console

				perl._console = oLogger
				aArray = perl.qw('key1 value1 key2 value2 key1')
				assertObject(perl.mapFromArray(aArray), {
					key1: void 0,
					key2: 'value2',
				})
				assert(
					oLogger.check(),
					'Odd number of elements in hash assignment from [key1, value1, key2, value2, key1]'
				)
				perl._console = konsole
			})
			it('makes an Object out of an Array of strange things', function testMapFromArray4() {
				var aArray = ['key1', ['value1'], true, 'value2']
				assertObject(perl.mapFromArray(aArray), {
					key1: ['value1'],
					true: 'value2',
				})
			})
		}) // .mapFromArray()

		describe('.makeMap()', function testMakeMapSuite() {
			it('makes a map Object out of an Array (default true)', function testMakeMap1() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.makeMap(aArray), {
					key1: true,
					value1: true,
					key2: true,
					value2: true,
				})
			})
			it('makes a map Object out of an undefined Array', function testMakeMap2() {
				assertObject(perl.makeMap(), {})
			})
			it('makes a map Object out of an Array with a specific value (undefined -> true)', function testMakeMap3() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.makeMap(aArray, void 0), {
					key1: true,
					value1: true,
					key2: true,
					value2: true,
				})
			})
			it('makes a map Object out of an Array with a specific value (false)', function testMakeMap4() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.makeMap(aArray, false), {
					key1: false,
					value1: false,
					key2: false,
					value2: false,
				})
			})
			it('makes a map Object out of an Array with a specific value (0)', function testMakeMap5() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.makeMap(aArray, 0), {
					key1: 0,
					value1: 0,
					key2: 0,
					value2: 0,
				})
			})
			it('makes a map Object out of an Array with a specific value (null)', function testMakeMap6() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(perl.makeMap(aArray, null), {
					key1: null,
					value1: null,
					key2: null,
					value2: null,
				})
			})
			it('makes a map Object out of an Array with a valuation function', function testMakeMap7() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(
					perl.makeMap(aArray, function (value) {
						return String(value).substring(0, 1)
					}),
					{
						key1: 'k',
						value1: 'v',
						key2: 'k',
						value2: 'v',
					}
				)
			})
			it('makes a map Object out of an Array with a function to actually set undefined', function testMakeMap8() {
				var aArray = perl.qw('key1 value1 key2 value2')
				assertObject(
					perl.makeMap(aArray, function () {
						return void 0
					}),
					{
						key1: void 0,
						value1: void 0,
						key2: void 0,
						value2: void 0,
					}
				)
			})
			it('makes a map Object out of an Array of strange things', function testMakeMap9() {
				var aArray = ['key1', ['value1'], true, 'value2']
				assertObject(perl.makeMap(aArray), {
					key1: true,
					value1: true,
					true: true,
					value2: true,
				})
			})
		}) // .makeMap()

		describe('.reverseMap()', function testReverseMapSuite() {
			it('reverses the key/values of an object so the values look up the keys', function testReverseMap1() {
				var oMap = perl.qwm('key1 value1 key2 value2')
				assertObject(perl.reverseMap(oMap), {
					value1: 'key1',
					value2: 'key2',
				})
			})
			it('reverse the key/values but values not unique', function testReverseMap2() {
				var oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
				assertObject(perl.reverseMap(oMap), {
					value1: 'key3',
					value2: 'key2',
				})
			})
			it('reverse the key/values with a hashing function', function testReverseMap3() {
				/* jshint plusplus: false */
				var idx = 0,
					oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
				assertObject(
					perl.reverseMap(oMap, function (key) {
						return key + idx++
					}),
					{
						value10: 'key1',
						value21: 'key2',
						value12: 'key3',
					}
				)
			})
			it('reverse the key/values with a hashing function which checks existence', function testReverseMap4() {
				/* jshint maxcomplexity: 2, plusplus: false */
				var idx = 0,
					oMap = perl.qwm('key1 value1 key2 value2 key3 value1')
				assertObject(
					perl.reverseMap(oMap, function (key, oRevMap) {
						return key in oRevMap ? key + idx++ : key
					}),
					{
						value1: 'key1',
						value2: 'key2',
						value10: 'key3',
					}
				)
			})
			it('reverse the key/values where values are not just strings', function testReverseMap5() {
				var oMap = { key1: ['value1'], true: 'value2' }
				assertObject(perl.reverseMap(oMap), {
					value1: 'key1',
					value2: true,
				})
			})
		}) // reverseMap()

		describe('.x()', function testXSuite1() {
			it('repeats itself N times', function testX1() {
				assert(
					perl.x('repeat after me', 4),
					'repeat after merepeat after merepeat after merepeat after me'
				)
			})
			it('repeats itself ’N’ times', function testX2() {
				assert(
					perl.x('repeat after me', '4'),
					'repeat after merepeat after merepeat after merepeat after me'
				)
			})
			it('repeat isn’t fully numeric but will repeat partially', function testX3() {
				var konsole = perl._console

				perl._console = oLogger
				assert(
					perl.x('repeat after me', '4.2c'),
					'repeat after merepeat after merepeat after merepeat after me'
				)
				assert(
					oLogger.check(),
					'Argument "4.2c" isn’t numeric in repeat .x()'
				)
				perl._console = konsole
			})
			describe('non-perl x operator behaviour', function testXSuite2() {
				it('handles undefined as empty string', function testX4() {
					assert(perl.x(undefined, 4), '')
				})
				it('handles null as empty string', function testX5() {
					assert(perl.x(null, 4), '')
				})
				it('handles NaN as empty string', function testX6() {
					assert(perl.x(NaN, 4), '')
				})
				it('handles Infinity as empty string', function testX7() {
					assert(perl.x(Infinity, 4), '')
				})
				it('handles -Infinity as empty string', function testX8() {
					assert(perl.x(-Infinity, 4), '')
				})
			})
		}) // .x()
	}) // unit tests
} // test()

if (TAP_OUT || RUN_TESTS) {
	test()
}
