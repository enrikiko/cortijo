FROM ubuntu:18.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
USER root
RUN mkdir data
RUN chmod 777 data
RUN adduser --disabled-password --gecos '' miso
#EXPOSE 20
