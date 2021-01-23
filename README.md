##Build the server:
sh deployment/build.sh

docker-compose build \
--build-arg API_URL=$API_URL \
--build-arg API_KEY=$API_KEY \
--build-arg PASSWORD=$GIT_PASSWORD \
--build-arg ACCESS_KEY=$ACCESS_KEY \
--build-arg SECRET_KEY=$SECRET_KEY \
--build-arg ROUTE53_URL=$ROUTE53_URL \
--build-arg BUCKETS_NAME=$BUCKETS_NAME \
--build-arg ROUTE53_PASSWORD=$ROUTE53_PASSWORD \

docker-compose up -d


docker rm -f $(docker ps -qa) \
docker rmi -f $(docker images -qa)



[website]: https://www.cortijodemazas.com
[github]: https://github.com/enrikiko


wireshark commads:
icmp for ping
http

kubectl config set-context --current --namespace=cortijo

aarch64 https://www.youtube.com/watch?v=Y-FUvi1z1aU&t=480s

qemu-system-aarch64 \
-M virt \
-m 1024 -smp 4 \
-cpu cortex-a53 \
-kernel vmlinuz \
-initrd initrd.img \
-drive file=2018-01-08-raspberry-pi-3-buster-PREVIEW.img,if=none,id=drive0,cache=writeback -device virtio-blk,drive=drive0,bootindex=0 \
-append 'root=/dev/vda2 noresume rw' \
-no-reboot \
-nographic


nano /etc
auto enp0s2

iface enp0s2 inet dhcp
        pre-up iptables-restore < /etc/iptables/rules.v4
        pre-up ip6tables-restore < /etc/iptables/rules.v6
