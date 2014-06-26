perljs
======

Perl for Javascript. Just some functions that a perl developer misses in Javascript.

## Installation

```bash
  npm install perljs --save
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

```bash
  npm test
```

## Perl Goodness Presently Supported

```javascript
	q('what') => ''what''

	qq('what') => '"what"'

	qw('this is it') => ['this', 'is', 'it']

	x('=', 76) => 76 equal signs in a row
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release q qq qw x
