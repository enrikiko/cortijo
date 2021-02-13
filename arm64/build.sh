sudo git pull
#
sudo docker build -t enriqueramosmunoz/auth:rasp2 ../auth/.
sudo docker push enriqueramosmunoz/auth:rasp2
#
sudo docker build -t enriqueramosmunoz/orchestrator:rasp2 ../orchestrator/.
sudo docker push enriqueramosmunoz/orchestrator:rasp2
#
sudo docker build -t enriqueramosmunoz/socket:rasp2 ../socket/.
sudo docker push enriqueramosmunoz/socket:rasp2
#
sudo docker build -t enriqueramosmunoz/front2:rasp2 ../frontAng/.
sudo docker push enriqueramosmunoz/front2:rasp2

echo "Done"
