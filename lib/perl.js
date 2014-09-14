/**
	Module to make javascript more perl-like.
	@file lib/perl.js
	@module perljs
	@author Brent S.A. Cowgill
	@version 0.1.0
	@license {@link http://unlicense.org The Unlicense}

	@example

	var Perl = require(perljs), qq = Perl.qq;
	console.log(qq('what'));

	@see {@link http://usejsdoc.org/index.html jsDoc Documentation}

	@todo Q(void 0) => 'undefined'
	@todo quote with escaping q(isn't) => 'isn\'t'
	@todo build replaces version number from package.json
	@todo build copies lib/perl.js to index.js with copyright banner
*/

'use strict';

module.exports = {};

/**
	@property {object} _console Console logging object to use for warnings. default to the console.
	@protected
*/
module.exports._console = console;

/**
	@property {object} _valueMap Map of strings to values for Perlish automatic type detection.
	Used by qw(), _value() exposure means you can customise as you like.
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
module.exports._valueMap = {
	'null' : null,
	'undefined' : void 0,
	'undef' : void 0, // perl version of undefined
	'empty' : '',     // because qw() can't define an empty string
	// @todo space, tab, etc possibly
	'true' : true,
	'false' : false,
	'NaN' : NaN,
	'Infinity' : Infinity,
	'-Infinity' : -Infinity
};

/**
	Perlish automatic type detection. Looks at a string and turns it
	into a boolean, number, etc if possible. See {@link module:perljs._valueMap}

	@protected
	@param  {String} string some string to turn into a native type.
	@return {Mixed} a boolean, number, undefined, null, Nan, +/-Infinity, empty string
	see {@link module:perljs._valueMap}
*/
module.exports._value = function (string)
{
	var value = string;
	if (! /^function|object|array$/.test(typeof string))
	{
		value = Number(string);
		if (isNaN(value))
		{
			value = (string in module.exports._valueMap) ?
				module.exports._valueMap[string] : string;
		}
	}
	return value;
};

/**
	Stringification of data types. null and undefined as well as the invalid
	number signals are all turned into an empty string. Functions are called
	and the result is stringified. Arrays and Objects are simply returned as is.

	@protected
	@param  {Mixed} mixed a native data type to stringify.
	@return {string} string representation of the native data type.
*/
module.exports._stringify = function (mixed)
{
	/* jshint maxcomplexity: 8 */
	if ('function' === typeof mixed)
	{
		return module.exports._stringify(mixed());
	}
	if (mixed === null || mixed === undefined ||
		'number' === typeof mixed && (isNaN(mixed) || mixed === Infinity || mixed === -Infinity))
	{
		mixed = '';
	}
	// arrays also handled as their typeof is object
	else if ('object' !== typeof mixed)
	{
		mixed = mixed.toString();
	}
	return mixed;
};

/**
	Enquote a string with single quotes. Like perl's q// operator
	@see {@link http://tinyurl.com/qxpg7xg Perl q// operator documentation}

	@param  {Mixed} string some string to enquote. Other native Javascript types
	are stringified by the {@link module:perljs._stringify}() method.
	@param  {String} open (optional) opening quote character. default ' single quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {String} the original string with single quotes around it. null and
	undefined are quoted as the empty string. see {@link module:perljs._stringify}() method.
*/
module.exports.q = function (string, open, close)
{
	open = open || '\'';
	close = close || open;
	if (Array.isArray(string))
	{
		return module.exports.qA(string, open, close);
	}
	if ('object' === typeof string && string !== null)
	{
		return module.exports.qO(string, open, close);
	}
	return open + module.exports._stringify(string) + close;
};

/**
	Enquote a string with double quotes. Like perl's qq// operator
	@see {@link http://tinyurl.com/qxpg7xg Perl qq// operator documentation}

	@param  {String} string some string to enquote
	@return {String} the original string with double quotes around it.

	@todo qx// for nodejs
*/
module.exports.qq = function (string, open, close)
{
	return module.exports.q(string, open || '"', close);
};

/**
	Create an Array from a space separated list of items. Like perl's qw// operator
	@see {@link http://tinyurl.com/qxpg7xg Perl qw// operator documentation}

	@param  {String} string some string to turn into an Array.
	@return {Array} an array formed by splitting the string on whitespace.
*/
module.exports.qw = function (string)
{
	return string.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/g);
};

/**
	Enquote an Array with single quotes. Inspired by perl's q// operator
	Returns an Array with all the elements single quoted.

	@param  {Array} aArray some Array whose elements should be single quoted.
	@param  {String} open (optional) opening quote character. default ' single quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {Array} a new Array with single quoted elements.
*/
module.exports.qA = function (aArray, open, close)
{
	var aNewArray = [];
	aArray.forEach(function (value) {
		aNewArray.push(module.exports.q(value, open, close));
	});
	return aNewArray;
};

/**
	Enquote an Array with double quotes. Inspired by perl's qq// operator
	Returns an Array with all the elements double quoted.

	@param  {Array} aArray some Array whose elements should be double quoted.
	@param  {String} open (optional) opening quote character. default " double quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {Array} a new Array with double quoted elements.
*/
module.exports.qqA = function (aArray, open, close)
{
	return module.exports.qA(aArray, open || '"', close);
};

/**
	Enquote an Object with single quotes. Inspired by perl's q// operator
	Returns an Object with all the values single quoted.

	@param  {Object} oObject some Object whose values should be single quoted.
	@param  {String} open (optional) opening quote character. default ' single quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {Object} a new Object with single quoted values.
*/
module.exports.qO = function (oObject, open, close)
{
	var oNewObject = {};
	Object.keys(oObject).forEach(function (key) {
		oNewObject[key] = module.exports.q(oObject[key], open, close);
	});
	return oNewObject;
};

/**
	Enquote an Object with double quotes. Inspired by perl's qq// operator
	Returns an Object with all the values double quoted.

	@param  {Object} oObject some Object whose values should be double quoted.
	@param  {String} open (optional) opening quote character. default " double quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {Object} a new Object with double quoted values.
*/
module.exports.qqO = function (oObject, open, close)
{
	return module.exports.qO(oObject, open || '"', close);
};

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

	@param  {String} string some string to turn into an Object (key/value map).
	@return {Object} an object formed by splitting the string on whitespace and
	getting key/value words.
	@todo refactor into mapFromArray to just convert an array into a map
*/
module.exports.qwm = function (string)
{
	var oMap = {}, key;
	module.exports.qw(string).forEach(function (keyValue) {
		if ('undefined' === typeof key)
		{
			key = keyValue;
		}
		else
		{
			oMap[key] = module.exports._value(keyValue);
			key = void 0;
		}
	});
	if ('undefined' !== typeof key)
	{
		oMap[key] = void 0;
		module.exports._console.warn('Odd number of elements in hash assignment from '
		 + module.exports.q(string));
	}
	return oMap;
};

/**
	Create string by repeating a substring N times. Like perl's $string x $number operator
	@see {@link http://tinyurl.com/65u7r2p Perl x operator documentation}

	@param  {String} token some sub-string to repeat over and over.
	@param  {Number} repeat the number of times to repeat the string.
	@return {String} the sub-string repeated N times.
*/
module.exports.x = function (token, repeat)
{
	var idx, string = '';
	token = module.exports._stringify(token);
	if (isNaN(repeat))
	{
		module.exports._console.warn('Argument '
			+ module.exports.qq(repeat) +
			' isn\'t numeric in repeat .x()');
	}
	repeat = parseInt(repeat);
	for (idx = 0; idx < repeat; idx += 1)
	{
		string += token;
	}
	return string;
};

// string.prototype.x ...

