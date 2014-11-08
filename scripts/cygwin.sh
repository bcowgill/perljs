#!/bin/bash
# on my winpc with cygwin grunt-jsdoc not working so do by hand
grunt windows
echo Run tests
#mocha --reporter nyan test/
mocha --reporter spec test/
perl perl/perl-test.pl
./scripts/check-ver.sh

echo " "
echo Create jsdoc documentation
rm -rf doc
jsdoc --configure 'jsdoc.conf.json' --destination doc --recurse test/ lib/perl.js lib/jsdoc-templates/ Gruntfile.js README.md

echo Done
