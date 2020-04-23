curl  $ROUTE53_URL --header "Content-Type: application/json" --request POST --data '{"password":'${ROUTE53_PASSWORD}'}'  > /tmp/curl.out
cat /tmp/curl.out
echo "Done!"
