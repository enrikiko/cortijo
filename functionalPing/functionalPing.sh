#!/bin/sh
echo -n "Running Functional Ping... "
echo ""
while [ 1 ]
do
    date >> /log
    sh ping.sh
    sleep 5
    date $(date)
    echo " looping... "
done
