#!/bin/bash
# post npm version handler
# https://docs.npmjs.com/cli/version

# TODO update npm commands to pnpm or npm for publishing?

NPM=npm
PNPM=pnpm
PKG=$NPMPKG

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
    exit 1
fi

echo GIT push
git push origin master --tags

rm *.bak lib/*.bak

# install module globally
echo checking npm package install
npm ls -g | grep $PKG
npm install . -g
npm ls -g | grep $PKG

# publish it on the npm registry and check it
echo NPM add user (git credentials)
npm adduser
echo NPM publish (git credentials)
npm publish

sleep 3
echo checking npm site
curl --silent --location https://www.npmjs.org/package/$PKG \
	| grep 'is the latest' --before-context=1 --after-context=1

npm install -g $PKG

# publish it on the bower registry and check it
#bower register perljs https://github.com/bcowgill/perljs.git
# wont show on bower search for an hour
#curl --silent --location http://bower.io/search/?q=perljs

echo checking bower package install
bower ls | grep $PKG
bower install $PKG
bower ls | grep $PKG

npm info $PKG > packageinfo.txt
bower info $PKG >> packageinfo.txt
less packageinfo.txt

find bower_components/$PKG -ls
echo check there are no extra files in then boser install.

