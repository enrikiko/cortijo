#!/usr/bin/env bash
while [ 1 ]
do
     date
     { date;echo; } >> /log
     curl https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/here_is_my_ip >> /log
     sleep 5m
done
