wget https://people.debian.org/~stapelberg/raspberrypi3/2018-01-08/2018-01-08-raspberry-pi-3-buster-PREVIEW.img.xz
xz --decompress 2018-01-08-raspberry-pi-3-buster-PREVIEW.img.xz
sudo mount -o offset=314572800 2018-01-08-raspberry-pi-3-buster-PREVIEW.img /mnt/rasparm64/
cp /mnt/rasparm64/vmlinuz .
cp /mnt/rasparm64/initrd.img .

sudo vim  /mnt/rasparm64/etc/fstab

# The root file system has fs_passno=1 as per fstab(5) for automatic fsck.
/dev/vda2 / ext4 rw 0 1
# All other file systems have fs_passno=2 as per fstab(5) for automatic fsck.
/dev/vda1 /boot/firmware vfat rw 0 2
proc /proc proc defaults 0 0

vim lunch1.sh

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

./lunch.sh

cat > /etc/network/interfaces.d/enp0s2

auto enp0s1

iface enp0s1 inet dhcp
        pre-up iptables-restore < /etc/iptables/rules.v4
        pre-up ip6tables-restore < /etc/iptables/rules.v6

cp 2018-01-08-raspberry-pi-3-buster-PREVIEW.img 2018-01-08-raspberry-pi-3-buster-PREVIEW-10G.img
qemu-img resize 2018-01-08-raspberry-pi-3-buster-PREVIEW-10G.img +10G

vim lunch2.sh
qemu-system-aarch64 \
-M virt \
-m 1024 -smp 4 \
-cpu cortex-a53 \
-kernel vmlinuz \
-initrd initrd.img \
-drive file=2018-01-08-raspberry-pi-3-buster-PREVIEW.img,if=none,id=drive0,cache=writeback -device virtio-blk,drive=drive0,bootindex=0 \
-drive file=2018-01-08-raspberry-pi-3-buster-PREVIEW-10G.img,if=none,id=drive1,cache=writeback -device virtio-blk,drive=drive1,bootindex=1 \
-append 'root=/dev/vda2 noresume rw' \
-no-reboot \
-nographic

./lunch2.sh

cfdisk /dev/vdb
e2fsck -f /dev/vdb2
resize2fs dev/vdb2

poweroff

vim lunch3.sh

qemu-system-aarch64 \
-M virt \
-m 1024 -smp 4 \
-cpu cortex-a53 \
-kernel vmlinuz \
-initrd initrd.img \
-drive file=2018-01-08-raspberry-pi-3-buster-PREVIEW-10G.img,if=none,id=drive0,cache=writeback -device virtio-blk,drive=drive0,bootindex=0 \
-device virtio-net-pci,netdev=mynet -netdev user,id=mynet,hostfwd=tcp::2222-:22
-append 'root=/dev/vda2 noresume rw' \
-no-reboot \
-nographic

./lunch3.sh
