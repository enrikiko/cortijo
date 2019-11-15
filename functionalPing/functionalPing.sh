#!/bin/sh
echo -n "Running Functional Ping... "
echo
# shellcheck disable=SC2161
while [ 1 ]
  do
    date
    sh ping.sh
    sleep 15 m
  done
