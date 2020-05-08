FROM ubuntu:20.04
RUN apt update
RUN apt -y install vsftpd
USER root
ARG USER=ftp_test
ARG UID=1000
ARG GID=1000
ARG PW=ftppass
RUN useradd -m ${USER} --uid=${UID} && echo "${USER}:${PW}" | chpasswd
RUN mkdir /home/${USER}/data
RUN chmod 777 /home/${USER}/data
COPY ./vsftpd.conf /etc/vsftpd.conf
#CMD service vsftpd start
CMD sleep infinity
EXPOSE 21
