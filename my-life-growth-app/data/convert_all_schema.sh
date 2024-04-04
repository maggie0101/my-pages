#!/bin/bash

rm *.sql

for csv in *.csv; do
  ./csv_to_sql.sh $csv
done

cat *.sql > output
rm *.sql

mv output all.sql