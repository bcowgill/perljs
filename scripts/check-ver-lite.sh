#!/bin/bash
echo REL_VER=$REL_VER
echo GIT TAGS:
git tag | tail | perl -pne '$_ = qq{   $_}'
vers.sh
