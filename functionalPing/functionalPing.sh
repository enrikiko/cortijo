#!/bin/sh
echo -n "Running Functional Ping... "
echo ""
while [ 1 ]
do
    sh ping.sh
    sleep 30
    date
    echo " looping... "
done
