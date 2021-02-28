#!/bin/bash
# do pre-release actions
# change version number, check that readme has release info.
# TODO update npm commands to pnpm or npm for publishing?
# TODO gruntify this. -- not any more...

NPM=npm
PNPM=pnpm

export REL_VER=$1

update-version.sh "$REL_VER" package.json || exit 1

if grep "\* $REL_VER" README.md ; then
	echo ok
else
	echo README.md does not contain a release note
fi

# build index.js and minified version for browser
grunt build

# generate updated documentation
npm run docs

# pack the npm module and show it to check there are no extra files included
npm pack && tar tvzf perljs-*.tgz
rm perljs-*.tgz
