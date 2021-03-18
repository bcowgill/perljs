perljs ![perljs's Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/bcowgill/perljs) [![Build Status](https://travis-ci.org/bcowgill/perljs.svg?branch=master)](https://travis-ci.org/bcowgill/perljs) [![Coverage Status](https://coveralls.io/repos/github/bcowgill/perljs/badge.svg?branch=master)](https://coveralls.io/github/bcowgill/perljs?branch=master)
======

Perl for Javascript. Just some functions that a perl developer misses in Javascript.

Works with browsers and node v0.10.0+

## Quick Usage

```javascript

	var perl = require('perljs')
	   q = perl.q, // single quote a string/array/object
	   qq = perl.qq, // double quote a string/array/object
	   qw = perl.qw, // quote words -- convert string to array on word boundaries
	   x = perl.x, // string multiply -- repeat string N times
	   name = 'perl rocks the javascript world';

	console.log('q', q(name), 'qq', qq(name), 'qw', qw(name), 'x', x(name + '\n', 3));
```

`q` and `qq` behave differently from perl, they single or double quote strings.

`qw` is similar to perl's quote words, it splits strings into arrays based on word boundaries.

`x` behaves like perl's `x` operater to repeat strings a number of times.

Full usage documentation is available in `doc/`

## Motivation

In addition to providing some useful functions which are available in perl but not Javascript, this project exists to learn about publishing modules, tools for linting and testing code as well as integration with Travis and other open source tools.

## Installation

```bash
	npm install perljs --save # or use yarn or pnpm
```

or get it all

```bash
	git clone https://github.com/bcowgill/perljs.git
```

## Perl Goodness Presently Supported

```javascript

	q('what') => "'what'"

	qq('what') => '"what"'
	qq('what', '@') => '@what@'
	qq('what', '<', '>') => '<what>'

	qw('this is it') => ['this', 'is', 'it']

	x('=', 76) => 76 equal signs in a row

	qqA(['this', 'is', 'it']) => ['"this"', '"is"', '"it"']
	qqA(['this', 'is', 'it'], '@') => ['@this@', '@is@', '@it@']
	qqO({ 'key1': 'value1', 'key2': 'value2' }) => { 'key1': '"value1"', 'key2': '"value2"' }
	qqO({ 'key1': 'value1', 'key2': 'value2' }, '<', '>') => { 'key1': '<value1>', 'key2': '<value2>' }

	// my %Map = qw( key1 value1 key2 value2 );
	qwm('key1 value1 key2 value2') => { 'key1': 'value1', 'key2': 'value2' }

	mapFromArray() - does the same for an array instead of a string.

	// my %Map = map { ( $ARG, 1 ) } @Array;
	makeMap(['key1', 'key2']); => { 'key1': true, 'key2': true }

	// my %ReverseMap = map { ($Map{$ARG}, $ARG) } keys(%Map)
	reverseMap({ 'inch': 1, 'foot': 12 }) => { '1': 'inch', '12': 'foot' }
```

## Full Documentation

Is available in the `doc` dir and can be generated:

```bash

	pnpm run doc
	pnpm run doc-view
```

## Tests

For perlish test output:

```bash
	bash
	source env.local
	pnpm test:tap
	# or
	prove scripts/tap-test.sh
```

Which shows output as TAP -- [Test Anywhere Protocol](http://testanything.org/)

Or more javascripty test output:

```bash

	pnpm test
```

Which will prettify and lint the source as well as run the tests.

Coverage output will be shown and is available in `doc/coverage/index.html`

## Development

```bash

	bash
	source env.local
	pnpm run usage
```

To see additional pnpm and grunt targets like watch or develop

## Contributing ![perljs's Contributors Image](https://contrib.rocks/image?repo=bcowgill/perljs)

The existing coding style is maintained by the use of [prettier](https://www.npmjs.com/package/prettier) as part of the check in process using [husky](https://www.npmjs.com/package/husky).
Add unit tests for any new or changed functionality. Lint and test your code using the supplied npm targets.
Review the test coverage output to ensure you've tested whatever has been added.

See CONTRIBUTING.md for further details.

## License

The Unlicense

A license with no conditions whatsoever which dedicates works to the public domain. Unlicensed works, modifications, and larger works may be distributed under different terms and without source code.

## Stats

![perljs's Stats](https://github-readme-stats.vercel.app/api?username=bcowgill&show_icons=true) ![perljs's Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=bcowgill&theme=blue-green)

## Release History

* 0.1.0 Initial release q qq qw x - go forth and perlize.
* 0.2.1 Release some (hash) mapping functions mapFromArray(), makeMap() and reverseMap().
* 0.2.2 Create some release management scripts.
* 0.3.0 Made browser compatible as AMD or global and bower.json for bower packaging.
* 0.3.1 Made browser compatible as CommonJS/AMD or global and bower.json for bower packaging (private: false).
* 0.3.2 slight bower.json ignore change.
* 0.3.3 test of npm version command tooling.
* 2020-10-24 not released - updated all modules and switched to pnpm.
* internal - 0.3.4 patch after toolchain updated 2021: test of npm version but had an issue.
* internal - 0.3.5 patch after toolchain updated 2021: husky, nyc, prettier, eslint, stylelint, htmllint, mocha-dark internally, nyc-dark internally.
* internal - 0.3.6 patch documentation rebuild for release failed release due to username.
* 0.3.7 patch corrected npm user name for release.
* 0.3.8 patch prepublishOnly script fixed for TravisCI
