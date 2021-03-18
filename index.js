/*  @bcowgi11/perljs v0.3.7 https://github.com/bcowgill/perljs
    Brent S.A. Cowgill <zardozcs@gmail.com> (http://github.com/bcowgill)
    Unlicense http://unlicense.org/
*/
/**
	@file
	File info for perljs to make javascript more perl-like.
	{@link https://coveralls.io/github/bcowgill/perljs?branch=master
	<img src="https://coveralls.io/repos/github/bcowgill/perljs/badge.svg?branch=master"
	alt="Coverage Status" />}

	@author Brent S.A. Cowgill
	@version  0.3.7
	@license {@link http://unlicense.org The Unlicense}

	@example

	var Perl = require(perljs), qq = Perl.qq;
	console.log(qq('what'));

	@see {@link http://usejsdoc.org/index.html jsDoc Documentation}

	@todo Q(void 0) => 'undefined'
	@todo quote with escaping q(isn't) => 'isn\'t'
	@todo vivify(window, 'path.to.key', value) window.path.to.key = value
	@todo vivify('path.to.key', value) global.path.to.key = value
	@todo unless(function () {}) = returns a function which returns negation
	of the return of the function
	@todo unless(condition, fn) - executes the function if !condition
	@todo array(item) like @{} make the thing you have an array.
*/
/* jshint maxstatements: 25 */
/* global define: false */

/**
	Module to make javascript more perl-like.
	{@link https://coveralls.io/github/bcowgill/perljs?branch=master
	<img src="https://coveralls.io/repos/github/bcowgill/perljs/badge.svg?branch=master"
	alt="Coverage Status" />}
	@module perljs
*/

// module boilerplate based on https://github.com/umdjs/umd/blob/master/templates/returnExports.js
// eslint-disable-next-line no-extra-semi
;(function (root, factory) {
	/* jshint maxcomplexity: 5 */
	'use strict'
	// istanbul ignore next
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory)
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory()
	} else {
		// Browser globals (root is window)
		root.perljs = factory()
	}
})(this, function () {
	'use strict'

	/**
		@exports perljs
	*/
	// W110 is warning mixed single and double quotes.
	/* jshint -W110 */
	var singleQuote = "'"
	/* jshint +W110 */
	var perljs = { name: 'perljs' }

	perljs.version = '0.3.7'
	/**
		@property {object} _console Console logging object to use for warnings.
			default to the console.
		@protected
	*/
	perljs._console = console

	/**
		@property {object} _valueMap Map of strings to values for Perlish automatic type detection.
		Used by {@link module:perljs.qw}(), {@link module:perljs._value}()
		exposure means you can customise as you like.
		@protected
		@property {null} _valueMap.null 'null' becomes a null
		@property {undefined} _valueMap.undefined 'undefined' becomes undefined
		@property {undefined} _valueMap.undef 'undef' becomes undefined
		@property {string} _valueMap.empty 'empty' becomes '' empty string
		@property {boolean} _valueMap.true 'true' becomes boolean true
		@property {boolean} _valueMap.false 'false' becomes boolean false
		@property {number} _valueMap.NaN 'NaN' becomes number NaN
		@property {number} _valueMap.Infinity 'Infinity' becomes number Infinity
		@property {number} _valueMap."-Infinity" '-Infinity' becomes number -Infinity
	*/
	perljs._valueMap = {
		null: null,
		undefined: void 0,
		undef: void 0, // perl equivalent of undefined
		empty: '', // because qw() can't define an empty string
		// @todo space, tab, etc possibly
		true: true,
		false: false,
		NaN: NaN,
		Infinity: Infinity,
		'-Infinity': -Infinity,
	}

	/**
		Perlish automatic type detection. Looks at a string and turns it
		into a boolean, number, etc if possible. See {@link module:perljs._valueMap}

		@protected
		@param  {string} string some string to turn into a native type.
		@return {Mixed} a boolean, number, undefined, null, Nan, +/-Infinity, empty string
		see {@link module:perljs._valueMap}
	*/
	perljs._value = function (string) {
		var value = string
		if (!/^function|object|array$/.test(typeof string)) {
			value = Number(string)
			if (isNaN(value)) {
				value =
					string in perljs._valueMap
						? perljs._valueMap[string]
						: string
			}
		}
		return value
	}

	/**
		Stringification of data types. null and undefined as well as the invalid
		number signals are all turned into an empty string. Functions are called
		and the result is stringified. Arrays and Objects are simply returned as is.

		@protected
		@param  {Mixed} mixed a native data type to stringify.
		@return {string} string representation of the native data type.
	*/
	perljs._stringify = function (mixed) {
		/* jshint maxcomplexity: 9 */
		if ('function' === typeof mixed) {
			return perljs._stringify(mixed())
		}
		if (
			mixed === null ||
			mixed === undefined ||
			('number' === typeof mixed &&
				(isNaN(mixed) || mixed === Infinity || mixed === -Infinity))
		) {
			mixed = ''
		}
		// arrays also handled as their typeof is object
		else if ('object' !== typeof mixed) {
			mixed = mixed.toString()
		}
		return mixed
	}

	/**
		Enquote a string with single quotes. Like perl's q// operator.
		@see {@link http://tinyurl.com/qxpg7xg Perl q// operator documentation}

		@param  {Mixed} string some string to enquote. Other native Javascript types
		are stringified by the {@link module:perljs._stringify}() method.
		@param  {string} open (optional) opening quote character. default ' single quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {string} the original string with single quotes around it. null and
		undefined are quoted as the empty string. see {@link module:perljs._stringify}() method.
	*/
	perljs.q = function (string, open, close) {
		// jshint maxcomplexity: 6
		open = open || singleQuote
		close = close || open
		if (Array.isArray(string)) {
			return perljs.qA(string, open, close)
		}
		if ('object' === typeof string && string !== null) {
			return perljs.qO(string, open, close)
		}
		return open + perljs._stringify(string) + close
	}

	/**
		Enquote a string with double quotes. Like perl's qq// operator.
		@see {@link http://tinyurl.com/qxpg7xg Perl qq// operator documentation}

		@param  {Mixed} string some string to enquote. Other native Javascript types
		are stringified by the {@link module:perljs._stringify}() method.
		@param  {string} open (optional) opening quote character. default " double quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {string} the original string with double quotes around it. null and
		undefined are quoted as the empty string. see {@link module:perljs._stringify}() method.

		@todo qx// for nodejs
	*/
	perljs.qq = function (string, open, close) {
		return perljs.q(string, open || '"', close)
	}

	/**
		Create an Array from a space separated list of items. Like perl's qw// operator.
		@see {@link http://tinyurl.com/qxpg7xg Perl qw// operator documentation}

		@param  {string} string some string to turn into an Array.
		@return {array} an array formed by splitting the string on whitespace.
	*/
	perljs.qw = function (string) {
		return string.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/g)
	}

	/**
		Enquote an Array with single quotes. Inspired by perl's q// operator.
		Used automatically by {@link module:perljs.q}() if an Array was passed in.
		Returns a new Array with all the elements single quoted.

		@param  {array} aArray some Array whose elements should be single quoted.
		@param  {string} open (optional) opening quote character. default ' single quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {array} a new Array with single quoted elements.

		@example

		perl.qA( [ 'inch', 'foot', 'yard' ] );

		[ '\'inch\'', '\'foot\'', '\'yard\'' ]

	*/
	perljs.qA = function (aArray, open, close) {
		var aNewArray = []
		aArray.forEach(function (value) {
			aNewArray.push(perljs.q(value, open, close))
		})
		return aNewArray
	}

	/**
		Enquote an Array with double quotes. Inspired by perl's qq// operator.
		Used automatically by {@link module:perljs.qq}() if an Array was passed in.
		Returns a new Array with all the elements double quoted.

		@param  {array} aArray some Array whose elements should be double quoted.
		@param  {string} open (optional) opening quote character. default " double quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {array} a new Array with double quoted elements.

		@example

		perl.qqA( [ 'inch', 'foot', 'yard' ] );

		[ '"inch"', '"foot"', '"yard"' ]

	*/
	perljs.qqA = function (aArray, open, close) {
		return perljs.qA(aArray, open || '"', close)
	}

	/**
		Enquote an Object with single quotes. Inspired by perl's q// operator.
		Used automatically by {@link module:perljs.q}() if an Object was passed in.
		Returns a new Object with all the values single quoted.

		@param  {Object} oObject some Object whose values should be single quoted.
		@param  {string} open (optional) opening quote character. default ' single quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {Object} a new Object with single quoted values.

		@example

		perl.qO( { 'inch': 1, 'foot': 12, 'yard': 36 } );

		{
			'inch': '\'1\'',
			'foot': '\'12\',
			'yard': '\'36\'
		}

	*/
	perljs.qO = function (oObject, open, close) {
		var oNewObject = {}
		Object.keys(oObject).forEach(function (key) {
			oNewObject[key] = perljs.q(oObject[key], open, close)
		})
		return oNewObject
	}

	/**
		Enquote an Object with double quotes. Inspired by perl's qq// operator.
		Used automatically by {@link module:perljs.qq}() if an Object was passed in.
		Returns a new Object with all the values double quoted.

		@param  {Object} oObject some Object whose values should be double quoted.
		@param  {string} open (optional) opening quote character. default " double quote character
		@param  {string} close (optional) closing quote character. default = open
		@return {Object} a new Object with double quoted values.

		@example

		perl.qqO( { 'inch': 1, 'foot': 12, 'yard': 36 } );

		{
			'inch': '"1"',
			'foot': '"12"',
			'yard': '"36"'
		}

	*/
	perljs.qqO = function (oObject, open, close) {
		return perljs.qO(oObject, open || '"', close)
	}

	/**
		Create an Object (key-value map) from a space separated list of items.
		Like perl my %Map = qw(key1 value1 key2 value2);
		Some words have special meaning and will be converted into Javascript values
		as dictated by the {@link module:perljs._valueMap}.

		@example

		perl.qwm('width 42 height 13 title empty radius Infinity');

		{
			width: 42,
			height: 13,
			title: '',
			radius: Infinity
		}

		@param  {string} string some string to turn into an Object (key/value map).
		@return {Object} an object formed by splitting the string on whitespace and
		getting key/value words.
	*/
	perljs.qwm = function (string) {
		var oMap = {},
			key
		perljs.qw(string).forEach(function (keyValue) {
			if ('undefined' === typeof key) {
				key = keyValue
			} else {
				oMap[key] = perljs._value(keyValue)
				key = void 0
			}
		})
		if ('undefined' !== typeof key) {
			oMap[key] = void 0
			perljs._console.warn(
				'Odd number of elements in ' +
					'hash assignment from ' +
					perljs.q(string)
			)
		}
		return oMap
	}
	/**
		An alternate name for the {@link module:perljs.qwm}() method.
		@method
		@param  {string} string some string to turn into an Object (key/value map).
		@return {object} an object formed by splitting the string on whitespace and
		getting key/value words.
	*/
	perljs.mapFromString = perljs.qwm

	/**
		Create a new Object from an Array like perl %Map = @Array would.
		Even element indices (0, 2, ...) are used as keys, odd element indices
		are used as values.

		@param {array} aArray the array to make an Object from.
		@return {object} the object created with keys/values from the array.

		@example

		perl.mapFromArray( [ 'inch', 1, 'foot', 12, 'yard', 36 ] );

		{
			'inch': 1,
			'foot': 12,
			'yard': 36
		}
	*/
	perljs.mapFromArray = function (aArray) {
		var oMap = {},
			key
		aArray = aArray || []
		aArray.forEach(function (keyValue) {
			if ('undefined' === typeof key) {
				key = String(keyValue)
			} else {
				oMap[key] = keyValue
				key = void 0
			}
		})
		if ('undefined' !== typeof key) {
			oMap[key] = void 0
			perljs._console.warn(
				'Odd number of elements in hash assignment from [' +
					aArray.join(', ') +
					']'
			)
		}
		return oMap
	}

	/**
		Create a new Object from an existing Object by reversing the key/values.
		Like perl %ReverseMap = map { ($Map{$ARG}, $ARG) } keys(%Map) would.

		@param {object} oMap the map object to reverse.
		@param {function} fn a function to hash the values so they are unique
		if necessary.
		@return {object} the reverse map object whose keys are values from
		the original object and whose values are the keys. Note, keys in the
		original object which could be native values are converted using
		{@link module:perljs._value}() function.

		@todo duplicate keys turn the value into an array

		@example

		perl.reverseMap( { 'inch': 1, 'foot': 12, 'yard': 36 } );

		{
			'1': 'inch',
			'12': 'foot',
			'36': 'yard'
		}

	*/
	perljs.reverseMap = function (oMap, fn) {
		var oReverseMap = {}
		fn =
			fn ||
			function (value) {
				return value
			}
		Object.keys(oMap).forEach(function (key) {
			oReverseMap[fn(oMap[key], oReverseMap)] = perljs._value(key)
		})
		return oReverseMap
	}

	/**
		Create a new Object from an Array so you can check whether an item is
		in the array. Like perl %Map = map { ($ARG, 1) } @Array;

		@param {array} aArray the array to make a map Object from.
		@param {Mixed} defaultValue the default value to associate with each
		array item. Defaults to true. If a function passed in, it will be
		called on each array value to determine what to use. To associate
		undefined you would actually have to use a function which returns
		undefined.
		@return {object} the object created with keys/values from the array.

		@example

		perl.makeMap(['width', 'height', 'title', 'radius');

		{
			width: true,
			height: true,
			title: true,
			radius: true
		}

	*/
	perljs.makeMap = function (aArray, defaultValue) {
		var fn,
			oMap = {},
			truth = function () {
				return true
			},
			fnDefaultValue = function () {
				return defaultValue
			}
		aArray = aArray || []
		fn =
			'undefined' === typeof defaultValue
				? truth
				: 'function' === typeof defaultValue
				? defaultValue
				: fnDefaultValue
		aArray.forEach(function (key) {
			oMap[String(key)] = fn(key)
		})
		return oMap
	}

	/**
		Create string by repeating a substring N times. Like perl's $string x $number operator.
		@see {@link http://tinyurl.com/65u7r2p Perl x operator documentation}

		@param  {string} token some sub-string to repeat over and over.
		@param  {number} repeat the number of times to repeat the string.
		@return {string} the sub-string repeated N times. undefined, null and
		some other values are repeated as an empty string. see {@link module:perljs._stringify}()
	*/
	perljs.x = function (token, repeat) {
		var idx,
			string = ''
		token = perljs._stringify(token)
		if (isNaN(repeat)) {
			perljs._console.warn(
				'Argument ' +
					perljs.qq(repeat) +
					' isn’t numeric in repeat .x()'
			)
		}
		repeat = parseInt(repeat)
		for (idx = 0; idx < repeat; idx += 1) {
			string += token
		}
		return string
	}

	// @todo string.prototype.x ...

	return perljs
})
