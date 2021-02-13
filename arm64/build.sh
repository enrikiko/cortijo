sudo git pull

# docker build -t enriqueramosmunoz/route53:rasp2 ../route53/.
# docker push enriqueramosmunoz/route53:rasp2
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
sudo docker build -t enriqueramosmunoz/front:rasp2 ../frontAngTest/.
sudo docker push enriqueramosmunoz/front:rasp2

echo "Done"
