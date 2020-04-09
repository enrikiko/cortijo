#! bin/bash
if [ -z "$2" ]
  then
    version=$(python ~/cortijo/deployment/ramdonWord.py)
  else
    version=$2
fi
pushd ~/cortijo
git checkout -- .
git pull
cd ~/cortijo/deployment
docker-compose build --build-arg MONGO_USER=user_name --build-arg MONGO_PASSWORD=user_password --build-arg PASSWORD=GordoCabron#Darwinex
docker-compose up -d --remove-orphans
if [ "$1" == "push" ]
      then
      	bash push.sh
fi
popd
