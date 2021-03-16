#!/bin/bash
CMD=version.sh
NPM=pnpm
# After package version updated, copy it to other files, update release note, build everything, add to git, commit and tag.
# https://docs.npmjs.com/cli/v7/commands/npm-version

# terminate on first error
set -e

# turn on trace of currently running command if you need it
#set -x

#echo $CMD handler after npm updates version number: $* | tee --append local-git.log
#check-ver-lite.sh | tee --append local-git.log

if [ -z "$VMETHOD" ]; then
	echo NOT OK VMETHOD is not defined, please use bump.sh to begin a version release.
	exit 60
fi

if [ -z "$VMESSAGE" ]; then
	echo NOT OK VMESSAGE is not defined, please use bump.sh to begin a version release.
	exit 61
fi

export REL_VER=`packagever.sh`
if [ -z "$REL_VER" ]; then
	echo NOT OK getting version number
	exit 62
fi
echo ok version $REL_VER

echo Step 1: adding release note to README.md.
echo "* $REL_VER $VMETHOD $VMESSAGE" >> README.md
$EDITOR README.md

if grep "\* $REL_VER" README.md ; then
	echo ok README.md
else
	echo NOT OK - README.md does not contain a release note
	exit 63
fi

echo Step 2: update source files with new version number.
update-version.sh "$REL_VER" || exit 64

echo ""
echo Step 3: Build documentation and minified distribution for web.
make build

echo ""
echo Step 4: Pack the npm module and show it to check there are no extra files included.
$NPM pack && tar tvzf bcowgill-perljs-*.tgz
rm bcowgill-perljs-*.tgz

echo If there are files in the package which should not be you need to add them to the .npmignore file, press Ctrl-C
read prompt

# What npm would normally do after running version script:
git add $VERFILES npm-shrinkwrap.json index.js perljs.min.* doc/*.html
git commit -m "release Version $VMETHOD $REL_VER $VMESSAGE"
tag-version.sh $REL_VER "release Version $VMETHOD $REL_VER $VMESSAGE"

repo-check.sh --untracked
exit 99

