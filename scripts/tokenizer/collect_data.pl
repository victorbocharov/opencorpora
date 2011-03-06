#!/usr/bin/perl
use strict;
use utf8;
use DBI;
use Encode;

#reading config
my %mysql;
open F, $ARGV[0] or die "Failed to open $ARGV[0]";
while(<F>) {
    if (/\$config\['mysql_(\w+)'\]\s*=\s*'([^']+)'/) {
        $mysql{$1} = $2;
    }
}
close F;

my $dbh = DBI->connect('DBI:mysql:'.$mysql{'dbname'}.':'.$mysql{'host'}, $mysql{'user'}, $mysql{'passwd'}) or die $DBI::errstr;
$dbh->do("SET NAMES utf8");
my $sent = $dbh->prepare("SELECT `sent_id`, `source` FROM sentences");
my $tok = $dbh->prepare("SELECT tf_text FROM text_forms WHERE sent_id=? ORDER BY `pos`");
my $drop = $dbh->prepare("DELETE FROM `tokenizer_coeff`");
my $insert = $dbh->prepare("INSERT INTO `tokenizer_coeff` VALUES(?,?)");

my $str;
my @tokens;
my %border;
my %total;
my %good;
my $vector;
my $pos;

$sent->execute();
$drop->execute();
while(my $ref = $sent->fetchrow_hashref()) {
    $str = decode('utf8', $ref->{'source'});
    @tokens = ();
    $tok->execute($ref->{'sent_id'});
    while(my $r = $tok->fetchrow_hashref()) {
        push @tokens, decode('utf8', $r->{'tf_text'});
    }

    $pos = 0;
    %border = ();
    for my $token(@tokens) {
        while(substr($str, $pos, length($token)) ne $token) {
            $pos++;
            if ($pos > length($str)) {
                die "Too long";
            }
        }
        my $t = $pos + length($token) - 1;
        $border{$t} = 1;
        $pos += length($token);
    }

    for my $i(0..length($str)-2) {
        $vector = oct('0b'.join('', @{calc($str, $i)}));
        $total{$vector}++;
        $good{$vector}++ if exists $border{$i} ? 1 : 0;
    }
}

for my $k(sort {$a <=> $b} keys %total) {
    printf("%d\t%.2f\t%d\n", $k, $good{$k}/$total{$k}, $total{$k});
    $insert->execute($k, $good{$k}/$total{$k});
}

# subroutines

sub calc {
    my $str = shift;
    my $i = shift;

    my $current = substr($str, $i, 1);
    my $next = substr($str, $i+1, 1);

    my @out = ();
    push @out, is_space($current);
    push @out, is_space($next);
    push @out, is_pmark($current);
    push @out, is_pmark($next);
    push @out, is_latin($current);
    push @out, is_latin($next);
    push @out, is_cyr($current);
    push @out, is_cyr($next);

    return \@out;
}
sub is_pmark {
    my $char = shift;
    if ($char =~ /^[\.,\?!"\(\)\:;\[\]\/\xAB\xBB]$/) {
        return 1;
    }
    return 0;
}
sub is_space {
    my $char = shift;
    if ($char =~ /^\s$/) {
        return 1;
    }
    return 0;
}
sub is_latin {
    my $char = shift;
    if ($char =~ /^[A-Za-z]$/) {
        return 1;
    }
    return 0;
}
sub is_cyr {
    my $char = shift;
    if ($char =~ /^[А-Яа-яЁё]$/) {
        return 1;
    }
    return 0;
}
