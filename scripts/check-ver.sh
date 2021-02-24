#!/bin/bash
echo git config
git config --list | grep user
echo npm config
npm config ls -l | grep author

egrep 'version.+[0-9]' package.json lib/perl.js README.md
if which after.sh > /dev/null; then
	after.sh History < README.md
else
	tail README.md
fi
