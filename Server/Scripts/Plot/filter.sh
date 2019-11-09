#!/bin/bash

cut -d' ' -f1 pref_general.data | sed -e :a -e '$!N; s/\n/, /; ta' > y.txt


awk '$3 > 0.0005 && $3 <0.02' pref_general.data | cut -d' ' -f1 | sed 's/.0$//' | sed -e :a -e '$!N; s/\n/, /; ta' > xLight.txt
awk '$3 > 0.0005 && $3 <0.02' pref_general.data | cut -d' ' -f2 | sed 's/.0$//' | sed -e :a -e '$!N; s/\n/, /; ta' > yLight.txt


awk '$3 > 0.02 && $3 <1.1' pref_general.data | cut -d' ' -f1 | sed 's/.0$//'| sed -e :a -e '$!N; s/\n/, /; ta' > xDark.txt
awk '$3 > 0.02 && $3 <1.1' pref_general.data | cut -d' ' -f2 | sed 's/.0$//'| sed -e :a -e '$!N; s/\n/, /; ta' > yDark.txt

