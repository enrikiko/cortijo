sudo git pull

docker-compose build --remove-orphans \
--build-arg API_URL=$API_URL \
--build-arg API_KEY=$API_KEY \
--build-arg PASSWORD=$GIT_PASSWORD \
--build-arg ACCESS_KEY=$ACCESS_KEY \
--build-arg SECRET_KEY=$SECRET_KEY \
--build-arg ROUTE53_URL=$ROUTE53_URL \
--build-arg BUCKETS_NAME=$BUCKETS_NAME \
--build-arg ROUTE53_PASSWORD=$ROUTE53_PASSWORD

docker-compose up -d
