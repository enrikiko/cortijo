#!/usr/bin/env bash

VERBOSE=0

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

GETIPURL="https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/get_ip_clear"

get () {
     CMD="curl --silent -o /dev/null -s -w "%{http_code}\n" $IP:8000/liveness -X GET"
     # $CMD > /tmp/out.txt
     VAR= $CMD
}
result () {
     # cat /tmp/out.txt
     echo $VAR
}

getIp () {
     CMD="curl --silent $GETIPURL -X GET"
     IP= $CMD
}
