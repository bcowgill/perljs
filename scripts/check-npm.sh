#!/bin/bash
PKG=$NPMPKG
NPM=pnpm

if [ "$1" == "--full" ]; then

	echo NPM OWNER/SEARCH/VIEW $PKG
	echo "   version published on npm: `$NPM view $PKG version`"
	($NPM owner ls $PKG; \
	$NPM search $PKG --no-description; \
	$NPM view $PKG ) \
		| perl -pne '$_ = qq{   $_}'

	echo ""
	echo $PKG dependencies
	$NPM ls | perl -pne '$_ = qq{   $_}'
	echo ""

else

	echo NPM OWNER/SEARCH/VIEW SUBSET $PKG
	echo "   version published on npm: `$NPM view $PKG version`"
	($NPM owner ls $PKG; \
	$NPM search $PKG --no-description | egrep "$PKG|VERSION" ;
	$NPM view $PKG | egrep "$PKG|latest:|published" ) \
		| perl -pne '$_ = qq{   $_}'
fi
