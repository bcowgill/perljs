#!/bin/bash
echo VERSION NUMBERS:
echo "   npm published: `npm view $NPMPKG version`"
echo "   local: `packagever.sh`"
(egrep 'version.+[0-9]' $VERFILES; \
egrep --with-filename 'version.+[0-9]' npm-shrinkwrap.json | head -2) \
| perl -pne '$_ = qq{   $_}'
