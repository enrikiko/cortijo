#!/bin/bash
while :
do
  curl -o /dev/null -s -w "%{http_code}\n" app.cortijodemazas.com > /tmp/curl.out
  if [[ "$(cat /tmp/curl.out)" == "200" ]]; then
    echo "Route53 is set correctly"
  else
    curl $ROUTE53_URL --header "Content-Type: application/json" --data '{"password":"'${ROUTE53_PASSWORD}'"}' 2>/dev/null > /tmp/curl.out
    cat /tmp/curl.out
    echo "Route53 have been set correctly"
  fi
	sleep 300
done
