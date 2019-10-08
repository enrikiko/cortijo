#! /bin/bash
echo "Starting entry.sh"
git config --global user.email "enrikiko_91@hotmail.com"
git config --global user.name "enrikiko_91"
cd ./Java
git pull
cd ../
date
date
while [ 1 ]
do
  date
  repetition=$((1 + RANDOM % 10))
  delay=$((1 + RANDOM % 23))
  echo $repetition
  echo $delay
  for i in {1..$repetition}
  do
    sh commit.sh
  done
  sleep "$delay"h
done
