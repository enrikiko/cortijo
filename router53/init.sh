#!/bin/bash
while :
do
  curl -o /dev/null -s -w "%{http_code}\n" app.cortijodemazas.com > /tmp/curl.out
  if [[ "$(cat /tmp/curl.out)" == "200" ]]; then
    date
    echo "Route53 is set correctly"
  else
    #curl $ROUTE53_URL --header "Content-Type: application/json" --data '{"password":"'${ROUTE53_PASSWORD}'"}' 2>/dev/null > /tmp/curl.out
    curl -X POST -H "x-api-key: ${ROUTE53_KEY}" ${ROUTE53_URL} 2>/dev/null > /tmp/curl.out
    date
    cat /tmp/curl.out
    echo "Route53 have been set"
  fi
	sleep 3600
done
