#!/bin/bash
#  check that a specific version is published on the npm registry.

export REL_VER=$1
PKG=$NPMPKG
NPM=pnpm

function usage {
	echo Please supply a release version number to check for published versions. i.e. 0.2.1 [Major.Minor.Patch]
	vers.sh
	exit 1
}

if [ "${REL_VER:-}" == "" ]; then
	usage
fi

CODE=0
PUB_VER=`$NPM view $PKG version`
if [ "$PUB_VER" == "$REL_VER" ]; then
	echo OK $PKG version "$REL_VER"
else
	echo npm registry does not show version "$REL_VER" of $PKG latest is "$PUB_VER"
	$NPM search $PKG
	CODE=10
fi

exit $CODE # 0 or 10
