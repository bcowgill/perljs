test:
	mocha --reporter nyan

docs:
	rm -rf doc/
	grunt jsdoc

doc: docs

.PHONY: test

.PHONY: docs
