#!/bin/bash
# do release actions
# TODO gruntify this.

export REL_VER=$1

if [ "${REL_VER:-}" == "" ]; then
	echo Please supply a release version number i.e. 0.2.1
	exit 1
fi

if grep "* $REL_VER" README.md ; then
	echo ok README.md release note present
else
	echo README.md does not contain a release note
	exit 1
fi
if grep "$REL_VER" package.json ; then
	echo ok package.json version updated
else
	echo package.json does not contain that release version
	exit 1
fi
if grep "$REL_VER" lib/perl.js ; then
	echo ok lib/perl.js version updated
else
	echo lib/perl.js does not contain that release version
	exit 1
fi

if git status ; then
	echo ok git status fine
else
	echo you have uncommitted changes, will not release
	exit 1
fi

if git tag "$REL_VER" ; then
	echo ok tagged for release as $REL_VER
else
	echo already tagged for release -- has it been?
	exit 1
fi

git push origin master --tags

# install module globally
npm ls -g | grep perljs
npm install . -g
npm ls -g | grep perljs

npm publish
sleep 3
echo checking npm site
curl.exe https://www.npmjs.org/package/perljs | grep Version --after-context=5

npm install -g perljs
