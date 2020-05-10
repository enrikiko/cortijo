FROM ubuntu:20.04
RUN apt update
RUN apt -y install vsftpd
ARG USER=ftp_test
ARG PW=ftppass
USER root
RUN echo root:${PW} | chpasswd
#RUN useradd -m ${USER} --uid=${UID} && echo "${USER}:${PW}" | chpasswd
#RUN useradd -ms /bin/bash ${USER}
#RUN adduser --disabled-password ${USER} sudo
#RUN echo ${USER}:${PW} | chpasswd
#RUN mkdir /home/${USER}/data
#RUN chmod 777 /home/${USER}/data
COPY ./vsftpd.conf /etc/vsftpd.conf
COPY ./ftpusers /etc/ftpusers
CMD service vsftpd start && tail -f /var/log/vsftpd.log
#CMD sleep infinity
EXPOSE 21
