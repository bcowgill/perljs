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
	bash
	source env.local
	pnpm test:tap
```

Or more javascripty test output:

```bash

	pnpm test
```

## Full Documentation

```bash

	pnpm run doc
	pnpm run doc-view
```

## Development

```bash

	bash
	source env.local
	pnpm run usage
```

To see additional pnpm and grunt targets like watch or develop

### Note on Git and Husky for developers:

This project has husky installed which does pre-commit checks with git > 2.9.

If your git is older you can manually configure git to invoke the husky pre-commit:

```bash
	echo '[ -x .husky/pre-commit ] && .husky/pre-commit' > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
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

## Version and Release

First you update the version number in package.json then run npm version command.

i.e.

might not be used...
npm version patch -m "release %s featuring ..."

pre-version.sh command does the lint and coverage check.
version.sh takes the version number from package.json and injects it into source files and adds a note to README.md then builds everything and adds to git
post-version.sh pushes everything, installs module globally, and publishes it to npm and bower

this might be what's used now...
pre-release.sh asks for version and updates files, runs build and docs and makes npm package
release.sh takes a version number, pushes, publishes to npm and bower installs npm and bower modules locally

## TODO

Install husky and prettier with build targets.
note about husky requiring git > 2.9 or manual intervention needed.
Change to eslint from jshint.
Change istanbul to nyc
Check the releasing scripts for pnpm/npm.
Document the version/release targets/procedure.
Get rid of grunt, just use build targets, Makefile.
Look at how lodash builds its library everything combined into one library yet also functions can be imported singly.

## Release History

* 0.1.0 Initial release q qq qw x - go forth and perlize
* 0.2.1 Release some (hash) mapping functions mapFromArray(), makeMap() and reverseMap()
* 0.2.2 Create some release management scripts
* 0.3.0 Made browser compatible as AMD or global and bower.json for bower packaging
* 0.3.1 Made browser compatible as CommonJS/AMD or global and bower.json for bower packaging (private: false)
* 0.3.2 slight bower.json ignore change
* 0.3.3 test of npm version command tooling
* 2020-10-24 not released - updated all modules and switched to pnpm
