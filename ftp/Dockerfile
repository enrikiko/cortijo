FROM ubuntu:19.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
RUN useradd -m -p 1234 -s /bin/bash -g root -G sudo -u 1000 pi
USER pi
WORKDIR /home/pi
COPY init.sh init.sh
RUN mkdir data
RUN chmod 777 data
ENTRYPOINT ["bash","init.sh"]
#EXPOSE 20
