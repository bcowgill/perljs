Contributing to perljs [![Build Status](https://travis-ci.org/bcowgill/perljs.svg?branch=master)](https://travis-ci.org/bcowgill/perljs) [![Coverage Status](https://coveralls.io/repos/github/bcowgill/perljs/badge.svg?branch=master)](https://coveralls.io/github/bcowgill/perljs?branch=master)
======================

Contributions are always welcome, no matter how large or small!

The existing coding style is maintained by the use of [prettier](https://www.npmjs.com/package/prettier) as part of the check in process using [husky](https://www.npmjs.com/package/husky).
Add unit tests for any new or changed functionality. Lint and test your code using the supplied npm targets.
Review the test coverage output to ensure you've tested whatever has been added.

## Releasing

Due to current use of an old Git version 1.9.1 and [npm 7+ bug](https://github.com/npm/cli/issues/2871) we run the npm version command with --no-git-version-tag and leave the git operations to pre-version.sh, version.sh and post-version.sh scripts.

You can begin a version release via:

```sh
npm version patch --no-git-tag-version -m "release Version patch %s RELEASE DESCRIPTION"
```

Change patch to minor, major, etc based on what kind of version release it is. see [NPM version help](https://docs.npmjs.com/cli/v7/commands/npm-version)

TODO more docs here...

## Developing

*Node*: Check that Node is [installed](https://nodejs.org/en/download/) with version 12 and up. You can check this with `node -v`.

*nvm*: You can use [Node Version Manager](https://github.com/nvm-sh/nvm) to switch between versions of node and the project contains a *.nvmrc* configuration file to select the version to use.

*pnpm*: Make sure that pnpm is [installed](https://pnpm.js.org/installation/) with version >= `3`.

### Setup

Fork the `perljs` repository to your GitHub Account.

Then, run:

```sh
$ git clone https://github.com/<your-github-username>/perljs
$ cd perljs
$ bash
$ source env.local1
```

By sourcing `env.local` you will get *npm* aliased to *pnpm* and will have the correct *node* version via *nvm* as well as get your *PATH* and some other environment variables set for you.

Then you can either run:

```sh
$ make build
```

to build perljs and the documentation **once** or:

```sh
$ make watch
```

to have perljs build itself and incrementally build files on change without updating documentation.

```sh
$ make develop
```

to have perljs build everything on every change.

> You can access the test coverage from `doc/coverage/index.html`.

> You can access the built documentation from `doc/index.html`.

The targets that are built are as follows:

* index.js
* perljs.min.js
* perljs.min.js.map
* perljs.no-comments.js

If you wish to build a copy of perljs for distribution, then run:

```sh
$ make TODO build-dist
```

You can check if any package dependencies require update via:

```sh
$ make depend
```

### Note on Git and Husky for developers:

This project has husky installed which does pre-commit checks with git > `2.9`.

So every commit should be formatted to the code style and have the lint and tests run before you can commit.

If your git is older you can manually configure git to invoke the husky pre-commit:

```bash
	echo '[ -x .husky/pre-commit ] && .husky/pre-commit' > .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
```

Or you can copy the relevant parts of any `.husky/` files into `.git/hooks` (after the exit statement)

### Running linting/tests

You can run prettier via:

```sh
$ make prettier
```

You can run lint via:

```sh
$ make lint
```

You can get more context from lint errors via:

```sh
$ make context
```

You can run stylelint/eslint's autofix via:

```sh
$ make fix
```

You can run tests/coverage + prettier/lint via:

```sh
$ make test
```

If you want to run the tests in a browser and re-run when changes are made:

```sh
$ make test-browser
```

There are also three other test pages accessible which uses perljs as a global variable, or included using DefineJS or Require1k.

You can change to a dark color scheme in the browser from the Javascript console via:

```javascript
mocha.setColorScheme('mocha-dark') // or 'mocha-light'
```

or clicking on the circular (100%) test progress indicator.

If you just want to run all tests in node:

```sh
$ make test-only
```

If you just want to run tests with coverage:

```sh
$ make cover
or
$ make coveralls
```

A postcover action is included to copy a dark theme stylesheet into the `doc/coverage` directory for easier viewing.

You can view the test coverage results in a browser via:

```sh
$ make view-cover
```

You can run the perl test which the Javascript implementation is meant to emulate via:

```sh
$ make perl-test
```

You can run the standalone Javascript test for determining minimum node version support via:

```sh
$ nvm use vN.x.x
$ make node-test
```

### Other build targets

You can build the documentation by itself via:

```sh
$ make doc
```

You can view the documentation in a browser via:

```sh
$ make view-doc
```

You can strip comments from the perljs library via:

```sh
$ make strip
```

### Writing tests

The test plan is `test/perl-test.js` and tests for new functions beling there.  This test plan can run in node or the browser with a suitable `require` function..

The file `test/setup-test-framework.js` sets the mocha test runner up correctly when running in node or a browser.

The file `test/test-suite-browser.js` is final loader for the browser suite which pulls in the perljs library and the `test/perl-test.js` test suite for execution.

In addition there is a `perl/js-test.js` test program with no dependencies on test runners for checking if the module works in very old versions of node. (0.10.0+)

Finally, there is a `perl/perl=test.pl` perl program which was used to see how perl behaves and the specific error messages given when functions are used incorrectly.

#### Browser based package tests

To test that the packaging method works (global, AMD, CommonJS) there are three html test pages which include the perljs library in different ways.

* `test/test-global.html` - uses perljs as a global variable and invokes a few functions.

* `test/test-require.html` - uses Require1k loader to pull in perljs and invokes a few functions.

* `test/test-define.html` - uses DefineJS loader to pull in perljs and invokes a few functions.

### Debugging code in tests

You can debug the browser tests directly in your browser, just put a `debugger;` statement at the place you want to break to begin debugging.

You can also cause a single test to run by changing `it()` to `it.only()` within the test plan.

To debug [mocha in node](https://glebbahmutov.com/blog/debugging-mocha-using-inspector/), once you have set your `debugger;` line you can debug via:

```sh
$ make debug

Debugger listening on ws://127.0.0.1:9229/e096e801-82b4-40f6-a2da-fa7f905606bd
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
2021-03-11T16:15:57.446Z perljs

```

You can open chrome to `chrome://inspect` to attach to the debugging session.
