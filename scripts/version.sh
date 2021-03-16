#!/bin/bash
CMD=version.sh
# After package version updated, copy it to other files, update release note, build everything, add to git, commit and tag.
# https://docs.npmjs.com/cli/v7/commands/npm-version

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler after npm updates version number: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

export REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
    exit 1
fi
echo ok version $REL_VER

set | grep xyzzy
exit 1

# TODO update npm commands to pnpm or npm for publishing?

# npm version patch -m "release %s featuring ..."

NPM=npm
PNPM=pnpm

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

git add README.md index.js perljs.min.* lib/perl.js package.json npm-shrinkwrap.json doc/*.html
