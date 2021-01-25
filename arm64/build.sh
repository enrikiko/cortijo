git pull

docker build -t enriqueramosmunoz/route53:rasp2 ../route53/.
docker push enriqueramosmunoz/route53:rasp2

docker build -t enriqueramosmunoz/auth:rasp2 ../auth/.
docker push enriqueramosmunoz/auth:rasp2

docker build -t enriqueramosmunoz/cortijo:rasp2 ../cortijo/.
docker push enriqueramosmunoz/cortijo:rasp2

docker build -t enriqueramosmunoz/front:rasp2 ../frontAngTest/.
docker push enriqueramosmunoz/front:rasp2

echo "Done"
