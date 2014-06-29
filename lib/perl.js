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


module.exports = {

	/**
		Enquote a string with single quotes. Like perl's q// operator

		@param  {String} string some string to enquote
		@return {String} the original string with single quotes around it.

		@todo what to do for undefined, null, etc.
		@todo option to quote an array?
	*/
	'q': function (string)
	{
		return '\'' + string + '\'';
	},

	/**
		Enquote a string with double quotes. Like perl's qq// operator

		@param  {String} string some string to enquote
		@return {String} the original string with double quotes around it.

		@todo what to do for undefined, null, etc.
	*/
	'qq': function (string)
	{
		return '"' + string + '"';
	},

	/**
		Create an Array from a space separated list of items. Like perl's qw// operator

		@param  {String} string some string to turn into an Array.
		@return {Array} an array formed by splitting the string on whitespace.
	*/
	'qw': function (string)
	{
		return string.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/g);
	},

	/**
		Create string by repeating a substring N times. Like perl's $string x $number operator

		@param  {String} token some sub-string to repeat over and over.
		@param  {Number} repeat the number of times to repeat the string.
		@return {String} the sub-string repeated N times.

		@todo what to do for undefined, null, etc?
		@todo auto parseInt the repeat value?
	*/
	'x': function (token, repeat)
	{
		var idx, string = '';
		for (idx = 0; idx < repeat; idx++)
		{
			string += token;
		}
		return string;
	},

// string.prototype.x ...

	'-': '-'
};
