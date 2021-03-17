#!/bin/bash
# TODO REMOVE THIS FILE
echo do release actions
exit 97
# TODO update npm commands to pnpm or npm for publishing?
# TODO gruntify this. -- not any more

NPM=npm
PNPM=pnpm
PKG=$NPMPKG

export REL_VER=$1

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
