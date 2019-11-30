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
token="eOnaAChhkNY:APA91bH-SUKPuCPWJGvTeGEQNGnlUZCSBFs9Cxa_K3lNsfcuH0SxO13QeCBM0fozUQ4EA57Mra3IKtZ34lXeFbeHAONRFkxD8YHz3ro3WDsjP8mXn-omrpFZQLJQGsc5ffYwDbEIs-Nj"

alert () {
  curl --silent "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=" + token + "&title=" + $1
}

getIp () {
     CMD="curl --silent $GETIPURL -X GET"
     IP=$($CMD)
}

liveness () {
     CMD="curl --silent -o /dev/null -s -w "%{http_code}" $IP:8000/liveness -X GET"
     VAR=$($CMD)
     if [ $VAR -eq 200 ]
      then
        echo "Liveness works"
      else
        echo "Liveness doesn't works"
        echo "$VAR"
        alert $0
     fi
}

newDevice () {
     CMD="curl --silent -o /dev/null -s -w "%{http_code}" $IP:8000/new/test/true/1.2.3.4 -X GET"
     VAR=$($CMD)
     if [ $VAR -eq 200 ]
      then
        echo "NewDevice works"
      else
        echo "NewDevice doesn't works"
        echo "$VAR"
        alert $0
     fi
}

removeDevice () {
     CMD="curl --silent -o /dev/null -s -w "%{http_code}" $IP:8000/remove/test -X GET"
     VAR=$($CMD)
     if [ $VAR -eq 200 ]
      then
        echo "removeDevice works"
      else
        echo "removeDevice doesn't works"
        echo "$VAR"
        alert $0
     fi
}

result () {
     # cat /tmp/out.txt
     echo $VAR
}
