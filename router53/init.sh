curl curl $route53_url --header "Content-Type: application/json" --request POST --data '{"password":'${route53_password}'}'  > /tmp/curl.out
cat /tmp/curl.out
echo "Done!"
