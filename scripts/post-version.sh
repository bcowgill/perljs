#!/bin/bash
# post npm version handler
# https://docs.npmjs.com/cli/version

REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
    exit 1
fi

echo GIT push
git push origin master --tags

rm *.bak

# install module globally
npm ls -g | grep perljs
npm install . -g
npm ls -g | grep perljs

# publish it on the npm registry and check it
echo NPM add user
npm adduser
echo NPM publish
npm publish
sleep 3
echo checking npm site
curl --silent --location https://www.npmjs.org/package/perljs \
	| grep 'is the latest' --before-context=1 --after-context=1

npm install -g perljs

# publish it on the bower registry and check it
#bower register perljs https://github.com/bcowgill/perljs.git
# wont show on bower search for an hour
#curl --silent --location http://bower.io/search/?q=perljs

bower ls | grep perljs
bower install perljs
bower ls | grep perljs

npm info perljs > packageinfo.txt
bower info perljs >> packageinfo.txt
less packageinfo.txt

find bower_components/perljs -ls
echo check there are no extra files in then boser install.
