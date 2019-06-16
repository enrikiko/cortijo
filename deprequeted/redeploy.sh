docker pull enriqueramosmunoz/rolling:mongo
docker run -d -p 27017:27017 --name mongo enriqueramosmunoz/rolling:mongo mongod
docker rm -f mock1 mock2 mock3 mock4 cortijo
git pull
docker build -t cortijo .
docker build -t mock ./deviceMock
docker run -d -p 8000:3000 --name cortijo cortijo
sleep 6
sh createMock.sh
sh mfp.sh
