#!/bin/bash
echo $0
date
waterTime="19:30"
certain="true"
wateringTime=60000 #1min

function on
{
  if [[ $certain = "true" ]]; then
    realTime="$(date)"
    echo $realTime
    echo "Is time to watter"
    certain="false"
    curl --silent http://192.168.1.50:8000/update/Watering/true/$wateringTime
    echo
  fi
}

function off
{
  if [[ $certain = "false" ]]; then
    #echo "Is not time to watter"
    certain="true"
  fi
}

function check-time {
  if [ $1 == $2 ]
  then
    on
  else
    off
  fi
}

while [[ 1 ]]; do
  time="$(date +"%H:%M")"
  check-time $time $waterTime
  sleep 50
done
