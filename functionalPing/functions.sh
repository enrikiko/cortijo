#!/usr/bin/env bash

VERBOSE=0

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

get () {
     CMD="curl $1 -X GET"
     $CMD > /tmp/out.txt
     VAR= cat /tmp/out.txt
}
result () {
     cat /tmp/out.txt
     echo $VAR
}
