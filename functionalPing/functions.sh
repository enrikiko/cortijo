#!/usr/bin/env bash

VERBOSE=0

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

GETIPURL="https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/get_ip_clear"
IP="localhost"

getIp () {
     CMD="curl --silent $GETIPURL -X GET"
     IP=$($CMD)
}

liveness () {
     CMD="curl --silent -o /dev/null -s -w "%{http_code}" $IP:8000/liveness -X GET"
     VAR=$($CMD)
     if [ "$VAR" = "200n" ]
      then
        echo "Liveness works"
      else
        echo "Liveness doesn't works"
        echo "$VAR"
     fi
}

newDevice () {
     CMD="curl --silent $IP:8000/new/test/true/1.2.3.4 -X GET"
     VAR=$($CMD)
     echo $VAR
}
result () {
     # cat /tmp/out.txt
     echo $VAR
}
