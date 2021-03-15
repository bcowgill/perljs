#!/bin/bash
PKG=$NPMPKG

echo REL_VER=$REL_VER
echo GIT TAGS:
git tag
echo VERSION NUMBERS:
egrep 'version.+[0-9]' package.json lib/perl.js README.md
