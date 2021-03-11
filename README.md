perljs
======

Perl for Javascript. Just some functions that a perl developer misses in Javascript.

Works with browsers and node v0.10.0+

## Installation

```bash
	npm install perljs --save # or use yarn or pnpm
```

or get it all

```bash
	git clone https://github.com/bcowgill/perljs.git
```

## Usage

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

## Tests

For perlish test output:

```bash
	bash
	source env.local
	pnpm test:tap
	# or
	prove scripts/tap-test.sh
```

Which shows output in TAP -- [Test Anywhere Protocol](http://testanything.org/)

Or more javascripty test output:

```bash

	pnpm test
```

Which will prettify and lint the source as well as run the tests.

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

Or you can copy the relevant parts of any .husky/ files into .git/hooks (after the exit statement)

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
post-version.sh pushes everything, installs module globally, and publishes it to npm

this might be what's used now...
pre-release.sh asks for version and updates files, runs build and docs and makes npm package
release.sh takes a version number, pushes, publishes to npm and installs npm module locally

## TODO

Add fix up mocha dark CSS for latest mocha release 8.x in ~/bin/mocha-dark
Change the test/index.html files to use my mocha dark.
Document using grunt serve:test for the browser based tests and to view docs or coverage
Check test/index.html, etc for browser use without bower.
Add Badges for Travis, Coverage, Stylelint etc
Publish to Github packages.
Document the version/release targets/procedure.
Check the releasing scripts for pnpm/npm.
Change to jest for test runner (which uses nyc already)
Look at how lodash builds its library everything combined into one library yet also functions can be imported singly.
Remove istanbul package
Get rid of grunt, just use build targets, Makefile.
wip Submit CSS dark changes to nyc/istanbul project

## Internal Notes

Branches for converting nyc coverage html/css to a dark theme:
nyc-15.1.0-coverage-css
nyc-15.1.0-coverage-css-dark

This was before installing stylelint and so there are a number or style lint violations.
Consider submitting the changes/pull request to nyc/istanbul

## Release History

* 0.1.0 Initial release q qq qw x - go forth and perlize
* 0.2.1 Release some (hash) mapping functions mapFromArray(), makeMap() and reverseMap()
* 0.2.2 Create some release management scripts
* 0.3.0 Made browser compatible as AMD or global and bower.json for bower packaging
* 0.3.1 Made browser compatible as CommonJS/AMD or global and bower.json for bower packaging (private: false)
* 0.3.2 slight bower.json ignore change
* 0.3.3 test of npm version command tooling
* 2020-10-24 not released - updated all modules and switched to pnpm
