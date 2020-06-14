#! bin/bash
if [ -z "$2" ]
  then
    version=$(python ~/Document/cortijo/deployment/ramdonWord.py)
  else
    version=$2
fi
pushd ~/cortijo
#sudo git checkout -- .
sudo git pull
cd ~/cortijo/deployment
docker-compose build --ulimit core=-1 --build-arg MONGO_USER=user_name --build-arg MONGO_PASSWORD=user_password --build-arg PASSWORD=GordoCabron#Darwinex
docker-compose up -d --remove-orphans
if [ "$1" == "push" ]
      then
      	bash push.sh $version
fi
popd
