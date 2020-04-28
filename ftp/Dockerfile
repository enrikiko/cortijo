FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
USER root
COPY vsftpd.conf /etc/vsftpd.conf
COPY vsftpd.chroot_list /etc/vsftpd.chroot_list
RUN adduser --disabled-password --gecos '' miso
WORKDIR /home/miso
RUN mkdir data
RUN chmod 777 data
CMD service vsftpd start
EXPOSE 20
