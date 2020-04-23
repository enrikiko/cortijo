curl  $ROUTE53_URL --header "Content-Type: application/json" --request POST --data '{"password":'${ROUTE53_PASSWORD}'}' --silent > /tmp/curl.out
echo $ROUTE53_URL --header "Content-Type: application/json" --request POST --data '{"password":'${ROUTE53_PASSWORD}'}' --silent
cat /tmp/curl.out
echo "Done!"
