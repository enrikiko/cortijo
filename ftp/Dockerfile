FROM ubuntu:19.04
RUN apt-get update
RUN apt update
RUN apt-get -y install vsftpd
RUN useradd -ms /bin/bash guest && echo 'guest:guest' | chpasswd
RUN useradd -ms /bin/bash -g root -G sudo pi && echo 'pi:pi' | chpasswd
# USER pi
# WORKDIR /home/pi
COPY init.sh init.sh
RUN mkdir data
RUN chmod 777 data
ENTRYPOINT ["bash","init.sh"]
#EXPOSE 20
