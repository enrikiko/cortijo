FROM ubuntu:20.04
RUN apt update
RUN apt -y install vsftpd
USER root
RUN mkdir data
RUN chmod 777 data
# RUN adduser --disabled-password --gecos '' miso
# COPY ./vsftpd.conf /etc/vsftpd.conf
#CMD service vsftpd start
CMD sleep infinity
#EXPOSE 20
