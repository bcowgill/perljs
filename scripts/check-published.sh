#!/bin/bash

export REL_VER=$1
FILE="$2"
PKG=$NPMPKG

function usage {
	echo Please supply a release version number to check for published versions. i.e. 0.2.1 [Major.Minor.Patch]
	egrep 'version.+[0-9]' package.json bower.json lib/perl.js README.md
	exit 1
}

if [ "${REL_VER:-}" == "" ]; then
	usage
fi

CODE=0
if npm search $PKG --no-description --parseable | head -2 | grep "$REL_VER" ; then
	echo OK $PKG version "$REL_VER"
else
	echo npm registry does not show version "$REL_VER" of $PKG
	npm search $PKG
	CODE=1
fi

# TODO bower check...

exit $CODE
