#!/bin/bash
echo post npm version handler: $* | tee --append local-git.log
check-ver-lite.sh | tee --append local-git.log
exit
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
npm install . -g # must use npm not pnpm
npm ls -g | grep $PKG
# test the global module ./perl/js-test.js `\npm -g root`/@bcowgill/perljs | grep version

# publish it on the npm registry and check it
echo NPM add user (npm credentials)
npm login # adduser?
echo NPM publish (npm credentials)
npm publish --access=public

sleep 3
echo checking npm site
curl --silent --location https://www.npmjs.org/package/$PKG \
	| grep 'is the latest' --before-context=1 --after-context=1

npm install -g $PKG

npm info $PKG > packageinfo.txt
less packageinfo.txt

