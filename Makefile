build:
	grunt all

watch:
	grunt watch

develop:
	grunt all watch --force

test-only:
	mocha --reporter nyan test/

# Debugging tests with mocha
# https://glebbahmutov.com/blog/debugging-mocha-using-inspector/
debug:
	mocha --inspect-brk test/

test:
	pnpm run test

cover:
	pnpm run cover

coveralls:
	pnpm run coveralls

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
	pnpm run check

strip:
	pnpm run strip

.PHONY: build

.PHONY: watch

.PHONY: develop

.PHONY: debug

.PHONY: test-only

.PHONY: test

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
