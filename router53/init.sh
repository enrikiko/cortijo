curl $ROUTE53_URL --header \"Content-Type: application/json\" --request POST --data \'{\"password\":\"${ROUTE53_PASSWORD}\"}\' 2>/dev/null > /tmp/curl.out
echo $ROUTE53_URL --header \"Content-Type: application/json\" --request POST --data \'{\"password\":\"${ROUTE53_PASSWORD}\"}\' 
cat /tmp/curl.out
