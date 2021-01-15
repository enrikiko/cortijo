##Build the server:
sh deployment/build.sh

docker-compose build \
--build-arg API_URL=$API_URL \
--build-arg API_KEY=$API_KEY \
--build-arg PASSWORD=$GIT_PASSWORD \
--build-arg ACCESS_KEY=$ACCESS_KEY \
--build-arg SECRET_KEY=$SECRET_KEY \
--build-arg ROUTE53_URL=$ROUTE53_URL \
--build-arg BUCKETS_NAME=$BUCKETS_NAME \
--build-arg ROUTE53_PASSWORD=$ROUTE53_PASSWORD \

docker-compose up -d


docker rm -f $(docker ps -qa) \
docker rmi -f $(docker images -qa)



[website]: https://www.cortijodemazas.com
[github]: https://github.com/enrikiko


wireshark commads:
icmp for ping
http

kubectl config set-context --current --namespace=cortijo
