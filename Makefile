test:
    ./node_modules/.bin/mocha --reporter nyan

docs:
    jsdoc --destination doc --recurse test/ lib/perl.js

.PHONY: test

.PHONY: docs
