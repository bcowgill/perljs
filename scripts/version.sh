#!/bin/bash
echo npm version handler after version number has been bumped: $*
exit
# https://docs.npmjs.com/cli/version

# TODO update npm commands to pnpm or npm for publishing?

# npm version patch -m "release %s featuring ..."

NPM=npm
PNPM=pnpm

# terminate on first error
set -e
# turn on trace of currently running command if you need it
#set -x

export REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
    exit 1
fi
echo ok version $REL_VER

echo adding release note to README.md
echo "* $REL_VER " >> README.md
$EDITOR README.md

if grep "\* $REL_VER" README.md ; then
	echo ok README.md
else
	echo NOT OK - README.md does not contain a release note
	exit 1
fi

update-version.sh "$REL_VER" || exit 1

# Build documentation and minified distribution for web
grunt all

# pack the npm module and show it to check there are no extra files included
npm pack && tar tvzf perljs-*.tgz
rm perljs-*.tgz

echo If there are files in the package which should not be, press Ctrl-C
read prompt

git add README.md index.js perljs.min.* lib/perl.js package.json doc/*.html
