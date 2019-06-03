docker rm -f mock mock1 mock3 cortijo-api-2
git pull
docker build -t cortijo-api-2 .
docker build -t mock ./deviceMock
docker run -d -p 3371:3000 --name cortijo-api-2 cortijo-api-2
sleep 6
sh createMock.sh
