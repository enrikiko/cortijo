curl $ROUTE53_URL --header "Content-Type: application/json" --data '{"password":"'${ROUTE53_PASSWORD}'"}' 2>/dev/null > /tmp/curl.out
cat /tmp/curl.out
