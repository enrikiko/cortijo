FROM ubuntu:19.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
RUN mkdir data
RUN chmod 777 data
COPY init.sh init.sh
ENTRYPOINT ["bash","init.sh"]
EXPOSE 21 
