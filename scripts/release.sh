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
if grep "$REL_VER" bower.json ; then
	echo ok bower.json version updated
else
	echo bower.json does not contain that release version
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

echo GIT push
git push origin master --tags

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
bower version
# wont show on bower search for an hour
#curl --silent --location http://bower.io/search/?q=perljs

bower ls | grep perljs
bower install perljs
bower ls | grep perljs
find bower_components/perljs -ls

npm info perljs > packageinfo.txt
bower info perljs >> packageinfo.txt
less packageinfo.txt
