#!/usr/bin/env perl
# test plan for perl functions we are simulating with javascript.

use strict;
use warnings;
use English -no_match_vars;
use Data::Dumper;
use Test::More;

my $var;

print "Testing how perl does it\n";
print "q()\n";
print "" . q() . "\n";

print "qw()\n";
print "@{[qw(one two three)]}\n";

print "equivalent qwm()\n";
my %Map = qw(one two three four);
print Dumper(\%Map);
print "@{[keys(%Map)]}\n";
print "@{[values(%Map)]}\n";

print "equivalent qwm() odd elements\n";
my %MapOdd = qw(one two three);
print Dumper(\%MapOdd);

print "undef x repeat\n";
print "undef?\n" . ($var x 12) . "\n";

print "= x 12.6\n";
print "" . ('=' x '12.6') . "\n";

print "# x 2.6c\n";
print "" . ('#' x '2.6c') . "\n";

print "# x 0.26c\n";
print "" . ('#' x '0.26c') . "\n";

print "done\n";