#!/bin/bash
# pre npm version handler

PREVER=`packagever.sh`
if [ -z "$PREVER" ]; then
    exit 1
fi