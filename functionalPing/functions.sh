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

alert () {
  curl --silent "https://us-central1-afrodita-2e204.cloudfunctions.net/triggerPushNotification?token=dPM2s9vYj4o:APA91bG3LiZsdvj7EPqBlTHKNXCiDbpWDdxKhONAO_qpIf_8uomgVW5QFtxM2AIX0kJPPt3RBzPJVeMNMgkCTtfkUoJFAHYtPBROh6bupxDkxW647z7J4A8Y3690q7OV6_lkYIvt7dlA&title=Alert"
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
        alert
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
        alert
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
        alert
     fi
}

result () {
     # cat /tmp/out.txt
     echo $VAR
}
