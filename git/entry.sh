#! /bin/bash
echo "Starting $0"
echo "Pull changes from repository"
pushd ./Java
git pull
popd
while true
do
     date
     day=$(date > file | cut -f1 -d " " file)
     echo $day

     if [ "$day" == "Mon" ]
     then
          for i in {1..3}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Tue" ]
     then
          for i in {1..6}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Wed" ]
     then
          for i in {1..9}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Thu" ]
     then
          for i in {1..12}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Fri" ]
     then
          for i in {1..15}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Sat" ]
     then
          for i in {1..18}
          do
            ./commit.sh
          done
     fi

     if [ "$day" == "Sun" ]
     then
          for i in {1..21}
          do
            ./commit.sh
          done
     fi

     sleep 23h
done
