#!/bin/bash
# on my winpc with cygwin grunt-jsdoc not working so do by hand
grunt windows
echo Run tests
mocha --reporter nyan test/
#mocha --reporter spec test/
echo Create jsdoc documentation
rm -rf doc
jsdoc --destination doc --recurse test/ lib/perl.js
