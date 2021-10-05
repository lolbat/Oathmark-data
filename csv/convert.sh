#!/bin/sh

csvfiles=`ls *.csv`

for eachfile in $csvfiles
do
   noext=${eachfile%%.*}
   node /usr/local/lib/node_modules/csvtojson/bin/csvtojson ./$eachfile > ../json/raw/$noext.json
done