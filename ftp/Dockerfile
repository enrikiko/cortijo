FROM ubuntu:20.04
RUN apt update
RUN apt -y install vsftpd
USER root
RUN mkdir data
RUN chmod 777 data
ARG USER=ftp
ARG UID=1000
ARG GID=1000
ARG PW=ftppass
RUN useradd -m ${USER} --uid=${UID} && echo "${USER}:${PW}" | chpasswd
# RUN useradd --password ftppass --home-dir /home/ftp ftp
# RUN echo 'ftp:ftppass' | chpasswd

# COPY ./vsftpd.conf /etc/vsftpd.conf
#CMD service vsftpd start
CMD sleep infinity
#EXPOSE 20
