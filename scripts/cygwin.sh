#!/bin/bash
# on my winpc with cygwin grunt-jsdoc not working so do by hand
grunt windows

echo " "
echo Run tests
#mocha --reporter nyan test/
mocha --reporter spec test/

echo " "
echo Run perl test
perl perl/perl-test.pl

echo " "
echo Check Versions
./scripts/check-ver.sh

echo " "
echo Create jsdoc documentation
rm -rf doc
jsdoc --configure 'jsdoc.conf.json' --destination doc --recurse test/ lib/perl.js Gruntfile.js README.md

echo Done
