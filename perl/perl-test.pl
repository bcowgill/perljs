#!/usr/bin/env perl
# test plan for perl functions we are simulating with javascript.

use strict;
use warnings;
use English -no_match_vars;
use Data::Dumper;
use Test::More;

my $var;

print "q()\n";
print "" . q() . "\n";

print "qw()\n";
print "@{[qw(one two three)]}\n";

my %Map = qw(one two three four);
print Dumper(\%Map);
print "@{[keys(%Map)]}\n";
print "@{[values(%Map)]}\n";

my %MapOdd = qw(one two three);
print Dumper(\%MapOdd);

print "" . ($var x 12) . "\n";

print "done\n";