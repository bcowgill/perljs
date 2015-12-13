perljs
======

Perl for Javascript. Just some functions that a perl developer misses in Javascript.

## Installation

```bash
	npm install perljs --save
```

or

```bash
	bower install perljs --save
```

or get it all

```bash
	git clone https://github.com/bcowgill/perljs.git
```

## Usage

```javascript

	var perl = require('perljs')
	   q = perl.q,
	   qq = perl.qq,
	   qw = perl.qw,
	   x = perl.x,
	   name = 'perl rocks the javascript world';

	console.log('q', q(name), 'qq', qq(name), 'qw', qw(name), 'x', x(name + '\n', 3));
```

## Tests

For perlish test output:

```bash
	npm test
```

Or more javascripty test output:

```bash

	grunt
```

## Full Documentation

```bash

	npm run doc
	npm run doc-view
```

## Perl Goodness Presently Supported

```javascript

	q('what') => ''what''

	qq('what') => '"what"'

	qw('this is it') => ['this', 'is', 'it']

	x('=', 76) => 76 equal signs in a row

	// my %Map = qw( key1 value1 key2 value2 );
	qwm('key1 value1 key2 value2') => { 'key1': 'value1', 'key2': 'value2' }

	mapFromArray() - does the same for an array instead of a string.

	// my %Map = map { ( $ARG, 1 ) } @Array;
	makeMap(['key1', 'key2']); => { 'key1': true, 'key2': true }

	// my %ReverseMap = map { ($Map{$ARG}, $ARG) } keys(%Map)
	reverseMap({ 'inch': 1, 'foot': 12 }) => { '1': 'inch', '12': 'foot' }
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release q qq qw x - go forth and perlize
* 0.2.1 Release some (hash) mapping functions mapFromArray(), makeMap() and reverseMap()
* 0.2.2 Create some release management scripts
* 0.3.0 Made browser compatible as AMD or global and bower.json for bower packaging