sudo git pull
#
sudo docker build -t enriqueramosmunoz/auth:rasp ../auth/.
sudo docker push enriqueramosmunoz/auth:rasp
#
sudo docker build -t enriqueramosmunoz/orchestrator:rasp ../orchestrator/.
sudo docker push enriqueramosmunoz/orchestrator:rasp
#
sudo docker build -t enriqueramosmunoz/socket:rasp ../socket/.
sudo docker push enriqueramosmunoz/socket:rasp
#
sudo docker build -t enriqueramosmunoz/front2:rasp ../frontAng/.
sudo docker push enriqueramosmunoz/front2:rasp
#
sudo docker build -t enriqueramosmunoz/setip:rasp ../setip/.
sudo docker push enriqueramosmunoz/setip:rasp

echo "Done"
