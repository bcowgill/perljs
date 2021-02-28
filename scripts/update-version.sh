#!/bin/bash

export REL_VER=$1
FILE="$2"

function usage {
	echo Please supply a release version number i.e. 0.2.1 [Major.Minor.Patch]
	echo "   MAJOR version when you make incompatible API changes,"
	echo "   MINOR version when you add functionality in a backwards-compatible manner, and"
	echo "   PATCH version when you make backwards-compatible bug fixes."
	egrep 'version.+[0-9]' package.json bower.json lib/perl.js README.md
	exit 1
}

if [ "${REL_VER:-}" == "" ]; then
	usage
fi
if [ -e "$REL_VER" ]; then
	usage
fi

# Update the version numbers in some files
perl -i.bak -pne 's{(\@version \s+)([\.0-9]+)}{$1$ENV{REL_VER}}xmsg; \
   s{(version \s* = \s*.)([\.0-9]+)(.;)}{$1$ENV{REL_VER}$3}xmsg;' \
   lib/perl.js

function check_version {
	local file
	file="$1"
	if grep "$REL_VER" "$file" ; then
		echo ok "$file" version updated
	else
		echo NOT OK - "$file" does not contain $REL_VER release version
		exit 1
	fi
}

#npm version $REL_VER
#bower version $REL_VER
perl -i.bak -pne 's{("version": \s+ ")([\.0-9]+)(",)}{$1$ENV{REL_VER}$3}xmsg' \
	bower.json "$FILE"

if [ ! -z "$FILE" ]; then
	check_version "$FILE"
fi
check_version bower.json
check_version lib/perl.js
