FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
# RUN useradd -ms /bin/bash guest && echo 'guest:guest' | chpasswd
# RUN useradd -ms /bin/bash -g root -G sudo pi && echo 'pi:pi' | chpasswd
USER root
WORKDIR /root/
# COPY init.sh init.sh
RUN mkdir data
RUN chmod 777 data
COPY vsftpd.conf /etc/vsftpd.conf
COPY vsftpd.chroot_list /etc/vsftpd.chroot_list
RUN adduser --disabled-password --gecos '' miso
CMD service vsftpd start
EXPOSE 20
