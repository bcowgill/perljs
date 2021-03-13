#!/bin/bash

export REL_VER=$1

function usage {
	echo $0 version-number
	echo Please supply a release version number i.e. 0.2.1 [Major.Minor.Patch]
	echo "   MAJOR version when you make incompatible API changes,"
	echo "   MINOR version when you add functionality in a backwards-compatible manner, and"
	echo "   PATCH version when you make backwards-compatible bug fixes."
	echo project versions:
	egrep 'version.+[0-9]' package.json lib/perl.js README.md
	echo git tags:
	git tag
	exit 1
}

if [ "${REL_VER:-}" == "" ]; then
	usage
fi
if [ -e "$REL_VER" ]; then
	usage
fi

NOW=`date '+%Y-%m-%d'`
TAG=v$REL_VER
TAG_DATE=version-$REL_VER-$NOW

echo TAG=$TAG
echo TAG_DATE=$TAG_DATE

git tag $TAG
git tag $TAG_DATE
# to push the tags:
# git push origin master --tags

if git tag "$TAG" ; then
	echo ok tagged for release as $TAG
	if git tag "$TAG_DATE" ; then
		echo ok date tagged for release as $TAG_DATE
	else
		echo already date tagged for release -- has it been?
		exit 1
	fi
else
	echo already tagged for release -- has it been?
	exit 1
fi

echo GIT push
git push origin master --tags

