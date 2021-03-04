#!/bin/bash
PKG=$NPMPKG

echo VERSION NUMBERS:
egrep 'version.+[0-9]' package.json lib/perl.js README.md

echo ""
echo NPM OWNER/SEARCH/VIEW SUBSET $PKG
npm owner ls $PKG
npm search $PKG --no-description | egrep "$PKG|VERSION"
npm view $PKG | egrep "$PKG|latest:|published"

echo ""
if which after.sh > /dev/null; then
	after.sh History < README.md
else
	tail README.md
fi
