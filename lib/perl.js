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
	into a boolean, number, etc if possible.

	@protected
	@param  {String} string some string to turn into a native type.
	@return {Mixed} a boolean, number, undefined, null, Nan, +/-Infinity, empty string
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
	Enquote a string with single quotes. Like perl's q// operator
	@see {@link http://tinyurl.com/qxpg7xg Perl q// operator documentation}

	@param  {String} string some string to enquote
	@param  {String} open (optional) opening quote character. default ' single quote character
	@param  {String} close (optional) closing quote character. default = open
	@return {String} the original string with single quotes around it.

	@todo what to do for undefined, null, etc.
	@todo option to quote an array?
*/
module.exports.q = function (string, open, close)
{
	open = open || '\'';
	close = close || open;
	return open + string + close;
};

/**
	Enquote a string with double quotes. Like perl's qq// operator
	@see {@link http://tinyurl.com/qxpg7xg Perl qq// operator documentation}

	@param  {String} string some string to enquote
	@return {String} the original string with double quotes around it.

	@todo what to do for undefined, null, etc.
	@todo qx// for node
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
	@todo replace true/false and numbers with boolean/number values.
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

	@todo what to do for undefined, null, etc?
	@todo auto parseInt the repeat value?
*/
module.exports.x = function (token, repeat)
{
	var idx, string = '';
	for (idx = 0; idx < repeat; idx += 1)
	{
		string += token;
	}
	return string;
};

// string.prototype.x ...

