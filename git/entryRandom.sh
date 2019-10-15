#! /bin/bash
echo "Starting $0"
echo "cd ./Java"
cd ./Java
pwd
echo "Pull changes from repository"
git pull
echo ""
while [ 1 ]
do
  date
  repetition=$((1 + RANDOM % 5))
  delay=$((1 + RANDOM % 5))
  echo "Repetitions: $repetition"
  echo "Delay: $delay"
  echo {1..5}
  echo {1..$repetition}
  for i in {1..$repetition}
    do
      pwd
      ls -la
      sh commit.sh
    done
  sleep "$delay"h
done
