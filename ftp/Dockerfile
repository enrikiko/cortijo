FROM ubuntu:19.04
RUN useradd -ms /bin/bash -p 1234 pi
USER pi
WORKDIR /home/pi
COPY init.sh init.sh
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
RUN mkdir data
RUN chmod 777 data
ENTRYPOINT ["bash","init.sh"]
#EXPOSE 20
