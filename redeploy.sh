docker rm -f mock mock1 mock2 mock3 cortijo
git pull
docker build -t cortijo .
docker build -t mock ./deviceMock
docker run -d -p 443:3000 --name cortijo cortijo
sleep 6
sh createMock.sh
sh mfp.sh
