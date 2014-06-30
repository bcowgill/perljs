test:
	./node_modules/.bin/mocha --reporter nyan

docs:
	grunt jsdoc

.PHONY: test

.PHONY: docs
