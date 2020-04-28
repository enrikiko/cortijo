FROM ubuntu:18.04
RUN apt update
RUN apt -y install vsftpd
USER root
RUN mkdir data
RUN chmod 777 data
RUN adduser --disabled-password --gecos '' miso
#EXPOSE 20
