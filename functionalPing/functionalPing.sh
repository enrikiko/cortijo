#!/bin/sh
echo -n "Running Functional Ping... "
echo
# shellcheck disable=SC2161
while [ 1 ]
  do
    date
    sleep 120
    sh ping.sh
    python checkAvailability.py
    sleep 1200
  done
