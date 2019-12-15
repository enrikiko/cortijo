#! bin/bash
#path=/root 
cd ~/cortijo
git pull
docker-compose build --build-arg MONGO_USER=user_name --build-arg MONGO_PASSWORD=user_password --build-arg PASSWORD=xxxxxx
docker-compose up -d --remove-orphans
cd 