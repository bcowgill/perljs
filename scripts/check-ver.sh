#!/bin/bash
PKG=$NPMPKG

echo version numbers:
egrep 'version.+[0-9]' package.json bower.json lib/perl.js README.md
echo ""
echo git config
git config --list | grep user
echo ""
echo npm config
npm config ls -l | grep author
echo ""
echo npm profile
npm profile get
npm token list

echo "starred npm packages"
npm stars | sort

echo ""
echo npm owner/search/view $PKG
npm owner ls $PKG
npm search $PKG --no-description
npm view $PKG

echo ""
if which after.sh > /dev/null; then
	after.sh History < README.md
else
	tail README.md
fi
