test:
	mocha --reporter nyan test/

docs:
	rm -rf doc/
	grunt jsdoc

doc: docs

.PHONY: test

.PHONY: docs
