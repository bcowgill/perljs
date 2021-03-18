#!/bin/bash

vers.sh

echo ""
echo GIT CONFIG
git config --list | grep user | perl -pne '$_ = qq{   $_}'
echo ""
echo NPM CONFIG
$NPM config ls -l | grep author | perl -pne '$_ = qq{   $_}'
echo ""
echo NPM PROFILE
$NPM profile get | perl -pne '$_ = qq{   $_}'
$NPM token list | perl -pne '$_ = qq{   $_}'
echo ""

echo "STARRED NPM PACKAGES"
$NPM stars | sort | perl -pne '$_ = qq{   $_}'
echo ""

check-npm.sh --full

echo ""
check-hist.sh
