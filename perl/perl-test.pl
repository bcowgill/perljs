#!/usr/bin/env perl
# test plan for perl functions we are simulating with javascript.

use strict;
use warnings;
use English -no_match_vars;
use Data::Dumper;
use Test::More;

my $var;

print "" . ($var x 12) . "\n";