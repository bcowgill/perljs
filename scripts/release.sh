#!/bin/bash
# do release actions
# TODO update npm commands to pnpm or npm for publishing?
# TODO gruntify this. -- not any more

NPM=npm
PNPM=pnpm
PKG=$NPMPKG

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

if git status ; then
	echo ok git status fine
else
	echo you have uncommitted changes, will not release
	exit 1
fi

if tag-version.sh "$REL_VER"; then
	echo "install module globally"
else
	exit 1
fi

npm ls -g | grep $PKG
npm install . -g
npm ls -g | grep $PKG

# publish it on the npm registry and check it
echo NPM add user
npm adduser # login?
echo NPM publish
npm publish --access=public
sleep 3
echo checking npm site
curl --silent --location https://www.npmjs.org/package/$PKG \
	| grep 'is the latest' --before-context=1 --after-context=1

npm install -g $PKG

npm info $PKG > packageinfo.txt
less packageinfo.txt
