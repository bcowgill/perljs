build:
	pnpm run build

watch:
	pnpm run watch

develop:
	pnpm run develop

test-only:
	mocha --reporter nyan test/

# Debugging tests with mocha
# https://glebbahmutov.com/blog/debugging-mocha-using-inspector/
debug:
	mocha --inspect-brk test/

test:
	pnpm run test

test-browser:
	grunt serve:test

cover:
	pnpm run cover

coveralls:
	pnpm run coveralls

# must symlink the htmllint config file, ignore error if already exists.
travis:
	-ln -s .htmllintrc.json .htmllintrc
	TESTS=test npm run htmllint
	npm run stylelint
	SRC=lib TESTS=test npm run eslint
	npm run travis

docs:
	grunt docs

doc: docs

prettier:
	pnpm run prettier

lint:
	pnpm run lint

context:
	pnpm run eslint:context

fix:
	pnpm run lint:fix

perl-test:
	./perl/perl-test.pl

node-test:
	./perl/js-test.js
	node --version

view-doc:
	pnpm run doc-view

view-cover:
	pnpm run cover-view

depends:
	pnpm ls
	pnpm run check

strip:
	pnpm run strip

.PHONY: build

.PHONY: watch

.PHONY: develop

.PHONY: debug

.PHONY: test-only

.PHONY: travis

.PHONY: test

.PHONY: test-browser

.PHONY: cover

.PHONY: coveralls

.PHONY: docs

.PHONY: prettier

.PHONY: lint

.PHONY: context

.PHONY: fix

.PHONY: perl-test

.PHONY: node-test

.PHONY: view-doc

.PHONY: view-cover

.PHONY: depends

.PHONY: strip
