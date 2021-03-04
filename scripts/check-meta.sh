#!/bin/bash
PKG=$NPMPKG

echo VERSION NUMBERS:
egrep 'version.+[0-9]' package.json lib/perl.js README.md

echo ""
echo GIT CONFIG
git config --list | grep user
echo ""
echo NPM CONFIG
npm config ls -l | grep author
echo ""
echo NPM PROFILE
npm profile get
npm token list

#echo "STARRED NPM PACKAGES"
#npm stars | sort

echo ""
echo NPM OWNER/SEARCH/VIEW $PKG
npm owner ls $PKG
npm search $PKG --no-description
npm view $PKG

echo ""
if which after.sh > /dev/null; then
	after.sh History < README.md
else
	tail README.md
fi
